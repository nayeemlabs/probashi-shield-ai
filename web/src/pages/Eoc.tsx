import { useEffect, useState } from 'react'
import { Nav } from '../components/Nav'
import { db } from '../lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

interface Incident {
  id: string
  workerName: string
  country: string
  severity: number
  status: string
  location?: string
}

function severityColor(score: number) {
  if (score >= 75) return 'text-danger'
  if (score >= 40) return 'text-warn'
  return 'text-safe'
}

export default function Eoc() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loaded, setLoaded] = useState(false)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    getDocs(query(collection(db, 'sosIncidents'), orderBy('createdAt', 'desc'), limit(20)))
      .then((snap) => {
        setIncidents(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident)))
        setLoaded(true)
      })
      .catch(() => {
        setDenied(true)
        setLoaded(true)
      })
  }, [])

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-brand">জরুরি সেবা কেন্দ্র (EOC)</h1>
        <p className="mt-2 text-ink/70">সক্রিয় SOS ঘটনা — দূতাবাস ও নিয়ন্ত্রণ কক্ষের জন্য রেসকিউ ড্যাশবোর্ড।</p>

        {denied ? (
          <div className="mt-8 rounded-2xl border border-warn/30 bg-warn/5 p-6 text-center">
            <p className="font-medium text-warn">এই সেকশনটি কেবল দূতাবাস ও অনুমোদিত অ্যাকাউন্টের জন্য</p>
            <p className="mt-2 text-sm text-ink/60">নিয়ন্ত্রক অ্যাক্সেসের জন্য বিশেষ অনুমতি প্রয়োজন।</p>
          </div>
        ) : !loaded ? (
          <p className="mt-8 text-center text-ink/50">লোড হচ্ছে…</p>
        ) : incidents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-line bg-white p-10 text-center">
            <div className="text-4xl">✅</div>
            <p className="mt-3 font-medium text-ink">কোনো সক্রিয় জরুরি ঘটনা নেই</p>
            <p className="mt-1 text-sm text-ink/60">সবাই নিরাপদে আছে — এই সেকশন নিজে থেকেই আপডেট হবে।</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {incidents.map((i) => (
              <div key={i.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">{i.workerName} · {i.country}</div>
                    <div className="text-sm text-ink/60">{i.location ?? 'লোকেশন প্রক্রিয়াধীন'}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${severityColor(i.severity)}`}>{i.severity}</div>
                    <div className="text-xs text-ink/50">তীব্রতা</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">{i.status}</span>
                  <button className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">
                    রেসকিউ ডসিয়ার দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
