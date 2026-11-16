import { auth } from './firebase'

const API_URL = import.meta.env.VITE_API_URL as string

/** Upload a file to R2 via the probashi-api Worker. Returns the object key. */
export async function uploadContract(file: File): Promise<{ key: string; size: number }> {
  const user = auth.currentUser
  if (!user) throw new Error('not-authenticated')
  const token = await user.getIdToken()
  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': file.type || 'application/octet-stream',
      'x-file-name': file.name,
    },
    body: file,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error ?? `upload failed (${res.status})`)
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
  const token = await user.getIdToken()
  const res = await fetch(`${API_URL}/api/admin/stats`, {
    headers: { authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`forbidden (${res.status})`)
  return res.json()
}

export async function analyzeContract(key: string, ocrText?: string, brokerPromise?: string): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('not-authenticated')
  const token = await user.getIdToken()
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ key, ocrText, brokerPromise }),
  })
  if (!res.ok) throw new Error(`analysis failed (${res.status})`)
  const data = await res.json()
  return data.analysis as string
}
