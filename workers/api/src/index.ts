// ProbashiShield API, Cloudflare Worker
// Routes:
//   POST /api/upload       , upload contract image to R2 (Firebase ID token required)
//   GET  /api/file/:key    , stream object (owner or admin only)
//   GET  /api/admin/stats  , R2 usage + platform stats (admin only)

interface Env {
  CONTRACTS: R2Bucket
  FIREBASE_PROJECT_ID: string
  ADMIN_EMAILS: string
  AI: any
}

interface FirebaseUser {
  uid: string
  email?: string
  admin?: boolean
}

const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

let certCache: { certs: Record<string, string>; exp: number } | null = null

async function getCerts(env: Env): Promise<Record<string, string>> {
  if (certCache && certCache.exp > Date.now() + 60_000) return certCache.certs
  const res = await fetch(CERTS_URL)
  const certs = (await res.json()) as Record<string, string>
  certCache = { certs, exp: Date.now() + 3600_000 }
  return certs
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf
}

async function verifyFirebaseToken(token: string, env: Env): Promise<FirebaseUser | null> {
  try {
    const [h, p, s] = token.split('.')
    if (!h || !p || !s) return null
    const header = JSON.parse(new TextDecoder().decode(b64urlDecode(h)))
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(p)))

    const now = Math.floor(Date.now() / 1000)
    const expectedIss = `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`
    if (payload.iss !== expectedIss) return null
    if (payload.aud !== env.FIREBASE_PROJECT_ID) return null
    if (payload.exp < now) return null
    if (header.alg !== 'RS256') return null

    const certs = await getCerts(env)
    const pem = certs[header.kid]
    if (!pem) return null

    const key = await crypto.subtle.importKey(
      'spki',
      pemToDer(pem),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const ok = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64urlDecode(s),
      new TextEncoder().encode(`${h}.${p}`),
    )
    if (!ok) return null

    return {
      uid: payload.user_id || payload.sub,
      email: payload.email,
      admin: payload.admin === true,
    }
  } catch {
    return null
  }
}

function isAdmin(user: FirebaseUser, env: Env): boolean {
  if (user.admin) return true
  const list = env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  return !!user.email && list.includes(user.email.toLowerCase())
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
  })
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'file'
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    const auth = req.headers.get('authorization')?.replace('Bearer ', '') ?? ''

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,POST,OPTIONS',
          'access-control-allow-headers': 'authorization,content-type,x-file-name',
        },
      })
    }

    // POST /api/upload, body = raw file bytes, headers: x-file-name, content-type
    if (req.method === 'POST' && url.pathname === '/api/upload') {
      const user = auth ? await verifyFirebaseToken(auth, env) : null
      if (!user) return json({ error: 'unauthorized' }, 401)

      const name = sanitizeName(req.headers.get('x-file-name') ?? 'contract')
      const ctype = req.headers.get('content-type') ?? 'application/octet-stream'
      if (!ctype.startsWith('image/') && ctype !== 'application/pdf') {
        return json({ error: 'unsupported file type' }, 415)
      }
      const buf = await req.arrayBuffer()
      if (buf.byteLength > 10 * 1024 * 1024) return json({ error: 'file too large (max 10MB)' }, 413)
      if (buf.byteLength === 0) return json({ error: 'empty file' }, 400)

      const key = `contracts/${user.uid}/${Date.now()}-${name}`
      await env.CONTRACTS.put(key, buf, { httpMetadata: { contentType: ctype } })
      return json({ key, size: buf.byteLength })
    }

    // GET /api/file/:key, owner (contracts/{uid}/...) or admin
    if (req.method === 'GET' && url.pathname.startsWith('/api/file/')) {
      const user = auth ? await verifyFirebaseToken(auth, env) : null
      if (!user) return json({ error: 'unauthorized' }, 401)
      const key = decodeURIComponent(url.pathname.slice('/api/file/'.length))
      const isOwner = key.startsWith(`contracts/${user.uid}/`)
      if (!isOwner && !isAdmin(user, env)) return json({ error: 'forbidden' }, 403)
      const obj = await env.CONTRACTS.get(key)
      if (!obj) return json({ error: 'not found' }, 404)
      return new Response(obj.body, {
        headers: {
          'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
          'cache-control': 'private, max-age=3600',
          'access-control-allow-origin': '*',
        },
      })
    }

    // POST /api/analyze, run Workers AI vision on an owned contract image
    if (req.method === 'POST' && url.pathname === '/api/analyze') {
      const user = auth ? await verifyFirebaseToken(auth, env) : null
      if (!user) return json({ error: 'unauthorized' }, 401)
      const { key } = (await req.json()) as { key?: string }
      if (!key || !key.startsWith(`contracts/${user.uid}/`)) return json({ error: 'forbidden' }, 403)
      const obj = await env.CONTRACTS.get(key)
      if (!obj) return json({ error: 'not found' }, 404)
      const buf = await obj.arrayBuffer()
      const prompt = 'This is an employment contract or visa document, possibly in Arabic. Extract and report in Bengali (Bangla): 1) job title/profession, 2) monthly salary and currency, 3) contract duration, 4) employer/kafil name if visible, 5) any suspicious or unusual clauses, 6) overall risk assessment (LOW/MEDIUM/HIGH) with one-line reason. Be concise.'
      const out = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
        image: [...new Uint8Array(buf)],
        prompt,
        max_tokens: 700,
      })
      return json({ analysis: (out as any)?.description ?? JSON.stringify(out) })
    }

    // GET /api/admin/stats, admin only
    if (req.method === 'GET' && url.pathname === '/api/admin/stats') {
      const user = auth ? await verifyFirebaseToken(auth, env) : null
      if (!user) return json({ error: 'unauthorized' }, 401)
      if (!isAdmin(user, env)) return json({ error: 'forbidden' }, 403)

      // R2 usage
      let objects = 0
      let totalBytes = 0
      let cursor: string | undefined
      do {
        const listed = await env.CONTRACTS.list({ cursor, limit: 1000 })
        objects += listed.objects.length
        for (const o of listed.objects) totalBytes += o.size
        cursor = listed.truncated ? listed.cursor : undefined
      } while (cursor)

      return json({
        r2: { bucket: 'probashi-contracts', objects, totalBytes, totalGB: +(totalBytes / 1e9).toFixed(3) },
        freeTier: { storageGB: 10, usedPct: +((totalBytes / 1e9 / 10) * 100).toFixed(1) },
        timestamp: new Date().toISOString(),
      })
    }

    return json({ error: 'not found' }, 404)
  },
} satisfies ExportedHandler<Env>
