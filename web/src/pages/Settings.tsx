import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { uploadContract } from '../lib/api'

export default function Settings() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<any>({})
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) getDoc(doc(db, 'users', user.uid)).then((s) => setProfile(s.data() ?? {}))
  }, [user])

  if (loading) return <div className="flex min-h-screen items-center justify-center">লোড হচ্ছে…</div>
  if (!user) return <Navigate to="/login" replace />

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    // Crop to square + resize 256px + compress JPEG via canvas
    const img = await createImageBitmap(f)
    const side = Math.min(img.width, img.height)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 256, 256)
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/jpeg', 0.85))
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    const { key } = await uploadContract(file)
    const photoURL = `${(import.meta.env.VITE_API_URL as string)}/api/file/${encodeURIComponent(key)}`
    await setDoc(doc(db, 'users', user!.uid), { photoURL, updatedAt: serverTimestamp() }, { merge: true })
    setProfile({ ...profile, photoURL })
    setMsg('প্রোফাইল ছবি আপডেট হয়েছে ✓')
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-bold text-brand">প্রোফাইল সেটিংস</h1>
        <section className="mt-6 rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">প্রোফাইল ছবি</h2>
          <div className="mt-4 flex items-center gap-5">
            {profile.photoURL || user.photoURL
              ? <img src={profile.photoURL || user.photoURL || ''} alt="" className="h-20 w-20 rounded-full object-cover" />
              : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand">{(profile.name || user.email || '?')[0].toUpperCase()}</div>}
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              <button onClick={() => fileRef.current?.click()} className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-dark">ছবি আপলোড</button>
              <p className="mt-2 text-xs text-ink/50">স.creat… বর্গাকার crop + compress (256px JPEG) স্বয়ংক্রিয়।</p>
            </div>
          </div>
          {msg && <p className="mt-3 font-medium text-safe">{msg}</p>}
        </section>
        <section className="mt-6 rounded-2xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold">অ্যাকাউন্ট</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">ইমেইল</dt><dd className="font-medium">{user.email}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">নাম</dt><dd className="font-medium">{profile.name || user.displayName || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">UID</dt><dd className="font-latin font-medium">{user.uid}</dd></div>
          </dl>
        </section>
      </main>
    </div>
  )
}
