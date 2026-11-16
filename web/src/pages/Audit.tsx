import { useState, type ChangeEvent } from 'react'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { uploadContract, fileUrl, analyzeContract } from '../lib/api'

export default function Audit() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [promise, setPromise] = useState('')
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const [report, setReport] = useState('')

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setState('idle')
  }

  async function submit() {
    if (!user || !file) return
    setState('uploading')
    setMsg('')
    try {
      const { key } = await uploadContract(file)
      const ref = await addDoc(collection(db, 'audits'), {
        ownerId: user.uid,
        imageKey: key,
        imageUrl: fileUrl(key),
        brokerPromise: promise,
        status: 'analyzing',
        createdAt: serverTimestamp(),
      })
      try {
        const analysis = await analyzeContract(key)
        setReport(analysis)
        await updateDoc(doc(db, 'audits', ref.id), { aiReport: analysis, status: 'done', analyzedAt: serverTimestamp() })
        setState('done')
        setMsg('অডিট সম্পন্ন! নিচে AI রিপোর্ট দেখুন।')
      } catch {
        await updateDoc(doc(db, 'audits', ref.id), { status: 'queued', note: 'AI analysis pending' })
        setState('done')
        setMsg('চুক্তি আপলোড হয়েছে। AI বিশ্লেষণ একটু পরে চলবে, result শীঘ্রই পাবেন।')
      }
    } catch {
      setState('error')
      setMsg('আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।')
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-brand">চুক্তি ও ভিসা অডিট</h1>
        <p className="mt-2 text-ink/70">
          আরবি বা ইংরেজি চুক্তি/ভিসার ছবি তুলুন। AI পড়ে বাংলায় বলে দেবে, আসল পেশা, বেতন, আর লুকানো ঝুঁকি।
        </p>

        {!user ? (
          <div className="mt-8 rounded-2xl border border-warn/30 bg-warn/5 p-6 text-center">
            <p className="font-medium text-warn">চালিয়ে যেতে লগইন করুন</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border-2 border-dashed border-line bg-white p-8 text-center">
              {preview ? (
                <img src={preview} alt="contract" className="mx-auto max-h-64 rounded-lg object-contain" />
              ) : (
                <p className="text-ink/50">কন্ট্রাক্ট বা ভিসার ছবি এখানে দিন</p>
              )}
              <input type="file" accept="image/*,application/pdf" onChange={onPick} className="mt-4 block w-full text-sm" />
            </div>

            <div className="rounded-2xl border border-line bg-white p-6">
              <label className="mb-1 block font-medium text-ink/80">দালাল যা বলেছিল (ঐচ্ছিক)</label>
              <textarea
                value={promise} onChange={(e) => setPromise(e.target.value)} rows={3}
                placeholder="যেমন: ড্রাইভারের কাজ, বেতন ২৫০০ রিয়াল"
                className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-brand"
              />
              <p className="mt-1 text-xs text-ink/50">এটা দিলে AI প্রতিশ্রুতি আর চুক্তির পার্থক্য দেখাবে।</p>
            </div>

            <button
              onClick={submit} disabled={!file || state === 'uploading'}
              className="w-full rounded-xl bg-brand py-4 text-lg font-bold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {state === 'uploading' ? 'আপলোড হচ্ছে…' : 'ফ্রি অডিট চালান'}
            </button>

            {msg && (
              <div className={`rounded-xl p-4 text-center font-medium ${state === 'done' ? 'bg-safe/10 text-safe' : 'bg-danger/10 text-danger'}`}>
                {msg}
              </div>
            )}

            {report && (
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
                <h3 className="mb-2 font-bold text-brand">AI অডিট রিপোর্ট</h3>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{report}</div>
              </div>
            )}

            <p className="text-center text-xs text-ink/50">
              এই রিপোর্ট ফ্যাক্ট-বেসড অডিট, আইনি পরামর্শ নয়। ভুয়া চুক্তি শনাক্তে সাহায্য করে, আইনি নিশ্চয়তা দেয় না।
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
