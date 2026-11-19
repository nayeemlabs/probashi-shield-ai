import { auth } from './firebase'

const API_URL = import.meta.env.VITE_API_URL as string

/** Long edge for uploaded images: keeps the stored object inside every vision engine's request cap. */
const MAX_IMAGE_EDGE = 2000
/** Phone photos are 3-8 MB, which overflows Groq's 4 MB base64 body cap; shrink before upload. */
const DOWNSCALE_ABOVE_BYTES = 1.5 * 1024 * 1024

/** Downscale large photos so /api/analyze can feed them to Groq (4 MB base64 limit) as well as Gemini. */
async function prepareImageUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file

  const edge = Math.max(bitmap.width, bitmap.height)
  const scale = Math.min(1, MAX_IMAGE_EDGE / edge)
  if (scale === 1 && file.size <= DOWNSCALE_ABOVE_BYTES) {
    bitmap.close()
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
  if (!blob || blob.size >= file.size) return file
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' })
}

/** Upload a file to R2 via the probashi-api Worker. Returns the object key. */
export async function uploadContract(file: File): Promise<{ key: string; size: number }> {
  const user = auth.currentUser
  if (!user) throw new Error('not-authenticated')
  const token = await user.getIdToken(true) // force refresh
  const body = await prepareImageUpload(file)
  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': body.type || 'application/octet-stream',
      'x-file-name': body.name,
    },
    body,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `upload failed (${res.status})`)
  }
  return res.json()
}

/** Get a viewable URL for a stored object (owner or admin only). */
export function fileUrl(key: string): string {
  return `${API_URL}/api/file/${encodeURIComponent(key)}`
}

export interface AdminStats {
  r2: { bucket: string; objects: number; totalBytes: number; totalGB: number }
  freeTier: { storageGB: number; usedPct: number }
  timestamp: string
}

export async function getAdminStats(): Promise<AdminStats> {
  const user = auth.currentUser
  if (!user) throw new Error('not-authenticated')
  const token = await user.getIdToken(true) // force refresh
  const res = await fetch(`${API_URL}/api/admin/stats`, {
    headers: { authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`forbidden (${res.status})`)
  return res.json()
}

/** One entry per engine the Worker tried, in order, so the UI can show what actually ran. */
export interface EngineAttempt {
  engine: string
  ok: boolean
  status?: number
  reason?: string
  ms?: number
}

export interface AnalyzeResult {
  analysis: string
  engine: string
  engineAttempts: EngineAttempt[]
}

export async function analyzeContract(key: string, ocrText?: string, brokerPromise?: string): Promise<AnalyzeResult> {
  const user = auth.currentUser
  if (!user) throw new Error('not-authenticated')
  const token = await user.getIdToken(true) // force refresh
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ key, ocrText, brokerPromise }),
  })
  if (!res.ok) throw new Error(`analysis failed (${res.status})`)
  const data = (await res.json()) as Partial<AnalyzeResult>
  return {
    analysis: data.analysis ?? '',
    engine: data.engine ?? 'unknown',
    engineAttempts: data.engineAttempts ?? [],
  }
}
