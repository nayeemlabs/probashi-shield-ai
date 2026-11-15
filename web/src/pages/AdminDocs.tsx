import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'

const ADMIN_EMAIL = 'jannatulnayeemdev@gmail.com'

export default function AdminDocs() {
  const { user, loading } = useAuth()
  const [cfg, setCfg] = useState<any>({ visible: true, scheduleEnabled: false, startAt: '', endAt: '' })
  const [sections, setSections] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [msg, setMsg] = useState('')

  const isAdmin = !!user && (user.email === ADMIN_EMAIL || (user as any).admin === true)

  useEffect(() => {
    if (!isAdmin) return
    getDoc(doc(db, 'docsConfig', 'settings')).then((s) => {
      const d = s.data() ?? {}
      setCfg({
        visible: d.visible ?? true,
        scheduleEnabled: d.scheduleEnabled ?? false,
        startAt: d.startAt ? new Date(d.startAt).toISOString().slice(0, 16) : '',
        endAt: d.endAt ? new Date(d.endAt).toISOString().slice(0, 16) : '',
      })
    })
    getDocs(collection(db, 'docsSections')).then((s) => setSections(s.docs.map((d) => ({ id: d.id, ...d.data() }) as any).sort((a, b) => a.order - b.order)))
    getDocs(collection(db, 'team')).then((s) => setTeam(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [isAdmin])

  if (loading) return <div className="flex min-h-screen items-center justify-center">লোড হচ্ছে…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/admin" replace />

  async function saveCfg() {
    await setDoc(doc(db, 'docsConfig', 'settings'), {
      visible: cfg.visible,
      scheduleEnabled: cfg.scheduleEnabled,
      startAt: cfg.startAt ? new Date(cfg.startAt).getTime() : null,
      endAt: cfg.endAt ? new Date(cfg.endAt).getTime() : null,
    })
    setMsg('সেটিংস সেভ হয়েছে ✓')
    setTimeout(() => setMsg(''), 2000)
  }

  async function saveSection(sec: any) {
    if (sec.id) await updateDoc(doc(db, 'docsSections', sec.id), { title: sec.title, kind: sec.kind, body: sec.body, order: sec.order })
    else await addDoc(collection(db, 'docsSections'), { title: sec.title, kind: sec.kind, body: sec.body, order: sec.order })
    const s = await getDocs(collection(db, 'docsSections'))
    setSections(s.docs.map((d) => ({ id: d.id, ...d.data() }) as any).sort((a, b) => a.order - b.order))
  }

  async function addTeam() {
    await addDoc(collection(db, 'team'), { name: '', role: '', email: '', photoUrl: '' })
    const s = await getDocs(collection(db, 'team'))
    setTeam(s.docs.map((d) => ({ id: d.id, ...d.data() })))
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand">/docs ম্যানেজমেন্ট</h1>
          <a href="/docs" target="_blank" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium">পাবলিক ভিউ ↗</a>
        </div>
        {msg && <div className="rounded-lg bg-safe/10 px-4 py-2 font-medium text-safe">{msg}</div>}

        {/* Visibility */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold">ভিজিবিলিটি</h2>
          <label className="mt-3 flex items-center gap-3">
            <input type="checkbox" checked={cfg.visible} onChange={(e) => setCfg({ ...cfg, visible: e.target.checked })} className="h-5 w-5" />
            <span className="font-medium">/docs পাবলিকভাবে খোলা</span>
          </label>
          <label className="mt-3 flex items-center gap-3">
            <input type="checkbox" checked={cfg.scheduleEnabled} onChange={(e) => setCfg({ ...cfg, scheduleEnabled: e.target.checked })} className="h-5 w-5" />
            <span className="font-medium">শিডিউল অনুযায়ী দেখাবে</span>
          </label>
          {cfg.scheduleEnabled && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">শুরু<input type="datetime-local" value={cfg.startAt} onChange={(e) => setCfg({ ...cfg, startAt: e.target.value })} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
              <label className="text-sm">শেষ<input type="datetime-local" value={cfg.endAt} onChange={(e) => setCfg({ ...cfg, endAt: e.target.value })} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            </div>
          )}
          <button onClick={saveCfg} className="mt-4 rounded-lg bg-brand px-6 py-2.5 font-bold text-white">সেভ করুন</button>
        </section>

        {/* Sections */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold">ডকুমেন্ট সেকশন</h2>
          <div className="mt-4 space-y-4">
            {sections.map((s) => (
              <div key={s.id} className="rounded-xl border border-line p-4">
                <div className="flex gap-2">
                  <input value={s.title} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, title: e.target.value } : x))} className="flex-1 rounded-lg border border-line px-3 py-2 font-bold" />
                  <select value={s.kind} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, kind: e.target.value } : x))} className="rounded-lg border border-line px-2">
                    <option value="deck">PITCH</option><option value="tech">TECH</option>
                  </select>
                  <input type="number" value={s.order} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, order: +e.target.value } : x))} className="w-20 rounded-lg border border-line px-2" title="order" />
                  <button onClick={() => saveSection(s)} className="rounded-lg bg-safe px-4 py-2 text-sm font-bold text-white">সেভ</button>
                  <button onClick={async () => { await deleteDoc(doc(db, 'docsSections', s.id)); setSections(sections.filter((x) => x.id !== s.id)) }} className="rounded-lg bg-danger px-3 py-2 text-sm font-bold text-white">✕</button>
                </div>
                <textarea value={s.body} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, body: e.target.value } : x))} rows={5} className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm" />
              </div>
            ))}
            <button onClick={() => setSections([...sections, { id: '', title: 'নতুন সেকশন', kind: 'tech', body: '', order: sections.length + 1 }])} className="rounded-lg border-2 border-dashed border-line px-4 py-3 font-medium text-ink/60 hover:border-brand">+ সেকশন যোগ করুন</button>
          </div>
        </section>

        {/* Team */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">টিম সদস্য</h2>
            <button onClick={addTeam} className="rounded-lg border-2 border-dashed border-line px-4 py-2 text-sm font-medium">+ সদস্য</button>
          </div>
          <div className="mt-4 space-y-3">
            {team.map((m) => (
              <div key={m.id} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-4">
                <input value={m.name} placeholder="নাম" onChange={(e) => setTeam(team.map((x) => x.id === m.id ? { ...x, name: e.target.value } : x))} className="rounded-lg border border-line px-3 py-2" />
                <input value={m.role} placeholder="ভূমিকা" onChange={(e) => setTeam(team.map((x) => x.id === m.id ? { ...x, role: e.target.value } : x))} className="rounded-lg border border-line px-3 py-2" />
                <input value={m.email} placeholder="ইমেইল" onChange={(e) => setTeam(team.map((x) => x.id === m.id ? { ...x, email: e.target.value } : x))} className="rounded-lg border border-line px-3 py-2" />
                <div className="flex gap-2">
                  <input value={m.photoUrl} placeholder="ছবি URL" onChange={(e) => setTeam(team.map((x) => x.id === m.id ? { ...x, photoUrl: e.target.value } : x))} className="flex-1 rounded-lg border border-line px-3 py-2" />
                  <button onClick={async () => { await setDoc(doc(db, 'team', m.id), { name: m.name, role: m.role, email: m.email, photoUrl: m.photoUrl }); setMsg('টিম সেভ ✓'); setTimeout(() => setMsg(''), 1500) }} className="rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white">সেভ</button>
                  <button onClick={async () => { await deleteDoc(doc(db, 'team', m.id)); setTeam(team.filter((x) => x.id !== m.id)) }} className="rounded-lg bg-danger px-3 py-2 text-sm font-bold text-white">✕</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
