import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'
import { getAdminStats, type AdminStats } from '../lib/api'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

const ADMIN_EMAIL = 'jannatulnayeemdev@gmail.com'

export default function Admin() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [counts, setCounts] = useState({ audits: 0, workers: 0, incidents: 0 })
  const [err, setErr] = useState('')

  const isAdmin = !!user && (user.email === ADMIN_EMAIL || (user as any).admin === true)

  useEffect(() => {
    if (!isAdmin) return
    getAdminStats().then(setStats).catch((e) => setErr(e.message))
    Promise.all([
      getDocs(collection(db, 'audits')).catch(() => ({ size: 0 })),
      getDocs(collection(db, 'workers')).catch(() => ({ size: 0 })),
      getDocs(collection(db, 'sosIncidents')).catch(() => ({ size: 0 })),
    ]).then(([a, w, s]) => setCounts({ audits: a.size, workers: w.size, incidents: s.size }))
  }, [isAdmin])

  if (loading) return <div className="flex min-h-screen items-center justify-center text-ink/50">লোড হচ্ছে…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-4 text-2xl font-bold text-brand">প্রবেশাধিকার নেই</h1>
          <p className="mt-2 text-ink/60">এই পোর্টালটি কেবল super admin-এর জন্য।</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand">অ্যাডমিন পোর্টাল</h1>
            <p className="mt-1 text-sm text-ink/60">সুপার অ্যাডমিন, {user.email}</p>
          </div>
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">SUPER ADMIN</span>
        </div>

        {/* Platform overview */}
        <h2 className="mt-8 mb-4 text-xl font-bold text-ink">প্ল্যাটফর্ম ওভারভিউ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'মোট অডিট', value: counts.audits, icon: '📄' },
            { label: 'প্রবাসী ওয়ার্কার', value: counts.workers, icon: '🧑‍💼' },
            { label: 'SOS ঘটনা', value: counts.incidents, icon: '🆘' },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-2 text-3xl font-bold text-brand">{c.value}</div>
              <div className="text-sm text-ink/60">{c.label}</div>
            </div>
          ))}
        </div>

        {/* R2 storage */}
        <h2 className="mt-10 mb-4 text-xl font-bold text-ink">Cloudflare R2 স্টোরেজ</h2>
        {err ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-danger">{err}</div>
        ) : !stats ? (
          <p className="text-ink/50">লোড হচ্ছে…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="text-sm text-ink/60">মোট অবজেক্ট</div>
              <div className="text-3xl font-bold text-ink">{stats.r2.objects}</div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="text-sm text-ink/60">মোট ব্যবহার</div>
              <div className="text-3xl font-bold text-ink">{stats.r2.totalGB} GB</div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="text-sm text-ink/60">ফ্রি টিয়ার ব্যবহার</div>
              <div className={`text-3xl font-bold ${stats.freeTier.usedPct > 80 ? 'text-danger' : 'text-safe'}`}>
                {stats.freeTier.usedPct}%
              </div>
              <div className="text-xs text-ink/50">of {stats.freeTier.storageGB} GB free</div>
            </div>
          </div>
        )}

        {/* Revenue placeholder */}
        <h2 className="mt-10 mb-4 text-xl font-bold text-ink">রাজস্ব (Revenue)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'বাংক বাউন্টি', value: '৳0', note: 'প্রতি অ্যাকাউন্ট ওপেনিংয়ে ৳৩০০-৫০০' },
            { label: 'মাইক্রো-পেমেন্ট', value: '৳0', note: 'প্রতি ফুল অডিটে ৳২৯৯' },
            { label: 'এজেন্সি SaaS', value: '৳0', note: 'মাসিক সাবস্ক্রিপশন' },
          ].map((r) => (
            <div key={r.label} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-sm text-ink/60">{r.label}</div>
              <div className="text-3xl font-bold text-safe">{r.value}</div>
              <div className="mt-1 text-xs text-ink/50">{r.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/40">পেমেন্ট ইনটিগ্রেশন (bKash/Nagad/Stripe) পরের phase-এ যোগ হবে।</p>
      </main>
    </div>
  )
}
