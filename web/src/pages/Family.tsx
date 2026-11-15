import { useEffect, useState } from 'react'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface Worker {
  id: string
  name: string
  country: string
  status: string
  lastCheckIn?: string
}

const statusStyle: Record<string, { label: string; cls: string }> = {
  safe: { label: 'সব ঠিক আছে', cls: 'bg-safe/10 text-safe' },
  attention: { label: 'খোঁজ দরকার', cls: 'bg-warn/10 text-warn' },
  critical: { label: 'জরুরি', cls: 'bg-danger/10 text-danger' },
}

export default function Family() {
  const { user, loading } = useAuth()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    getDocs(query(collection(db, 'workers'), where('familyIds', 'array-contains', user.uid)))
      .then((snap) => {
        setWorkers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Worker)))
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [user])

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-brand">পরিবার ট্র্যাকিং</h1>
        <p className="mt-2 text-ink/70">আপনার প্রিয়জনদের বর্তমান অবস্থা, মাসিক চেক-ইন ও SOS আপডেট।</p>

        {loading || !user ? (
          <div className="mt-8 rounded-2xl border border-warn/30 bg-warn/5 p-6 text-center font-medium text-warn">
            চালিয়ে যেতে লগইন করুন
          </div>
        ) : !loaded ? (
          <p className="mt-8 text-center text-ink/50">লোড হচ্ছে…</p>
        ) : workers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-line bg-white p-8 text-center">
            <p className="text-lg font-medium text-ink">এখনো কোনো প্রিয়জন যুক্ত হয়নি</p>
            <p className="mt-2 text-sm text-ink/60">
              প্রবাসীকে বলুন যে সে ProbashiShield-এ যোগ হোক, শীঘ্রই WhatsApp link flow আসছে।
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {workers.map((w) => {
              const s = statusStyle[w.status] ?? statusStyle.safe
              return (
                <div key={w.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-5">
                  <div>
                    <div className="text-lg font-bold text-ink">{w.name}</div>
                    <div className="text-sm text-ink/60">{w.country}{w.lastCheckIn ? ` · শেষ চেক-ইন: ${w.lastCheckIn}` : ''}</div>
                  </div>
                  <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${s.cls}`}>{s.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
