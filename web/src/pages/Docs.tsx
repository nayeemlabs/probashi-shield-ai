import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { db } from '../lib/firebase'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'

interface Section { id: string; kind: 'deck' | 'tech'; title: string; order: number; body?: string }
interface TeamMember { id: string; name: string; role: string; email: string; photoUrl?: string }
interface Feature { id: string; name: string; status: 'live' | 'beta' | 'planned'; desc?: string }

const statusStyle: Record<string, string> = {
  live: 'bg-safe/15 text-safe', beta: 'bg-warn/15 text-warn', planned: 'bg-ink/10 text-ink/60',
}

export default function Docs() {
  const [state, setState] = useState<'loading' | 'off' | 'ok'>('loading')
  const [sections, setSections] = useState<Section[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [q, setQ] = useState('')
  const [active, setActive] = useState('')

  useEffect(() => {
    (async () => {
      const cfgSnap = await getDoc(doc(db, 'docsConfig', 'settings'))
      const cfg = cfgSnap.data() ?? { visible: true, scheduleEnabled: false }
      if (!cfg.visible) return setState('off')
      if (cfg.scheduleEnabled && cfg.startAt && cfg.endAt) {
        const now = Date.now()
        if (now < cfg.startAt || now > cfg.endAt) return setState('off')
      }
      const [sec, tm, ft] = await Promise.all([
        getDocs(query(collection(db, 'docsSections'), orderBy('order'))),
        getDocs(collection(db, 'team')),
        getDocs(collection(db, 'features')),
      ])
      setSections(sec.docs.map((d) => ({ id: d.id, ...d.data() } as Section)))
      setTeam(tm.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember)))
      setFeatures(ft.docs.map((d) => ({ id: d.id, ...d.data() } as Feature)))
      setState('ok')
    })().catch(() => setState('off'))
  }, [])

  const filtered = useMemo(() =>
    sections.filter((s) => !q || s.title.toLowerCase().includes(q.toLowerCase()) || (s.body ?? '').toLowerCase().includes(q.toLowerCase())),
    [sections, q])

  if (state === 'loading') return <div className="flex min-h-screen items-center justify-center text-ink/50">লোড হচ্ছে…</div>
  if (state === 'off') return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl"></div>
          <h1 className="mt-4 text-2xl font-bold text-brand">ডকুমেন্টেশন এখন উপলব্ধ নয়</h1>
          <p className="mt-2 text-ink/60">এই সেকশনটি নির্ধারিত সময়ে বা shutdown অবস্থায় আছে।</p>
          <Link to="/" className="mt-6 inline-block rounded-lg bg-brand px-6 py-2.5 font-bold text-white">হোমে ফিরে যান</Link>
        </div>
      </main>
    </div>
  )

  function exportMd() {
    const md = ['# ProbashiShield AI, Documentation & Pitch Deck\n',
      ...filtered.map((s) => `## ${s.title}\n\n${s.body ?? ''}\n`),
      '## Team\n', ...team.map((m) => `- ${m.name}, ${m.role}, ${m.email}`)].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }))
    a.download = 'probashishield-docs.md'
    a.click()
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit w-64 shrink-0 space-y-4 lg:block">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="সার্চ…"
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand" />
          <nav className="space-y-1">
            {filtered.map((s) => (
              <button key={s.id} onClick={() => { setActive(s.id); document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${active === s.id ? 'bg-brand/10 font-bold text-brand' : 'text-ink/70 hover:bg-mist'}`}>
                {s.kind === 'deck' ? '▸ ' : '# '}{s.title}
              </button>
            ))}
          </nav>
          <button onClick={exportMd} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink/70 hover:bg-mist">
            Markdown এক্সপোর্ট
          </button>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 space-y-8 pb-20">
          <header className="rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand-light p-8 text-white">
            <p className="font-latin text-sm font-semibold text-blue-200">ProbashiShield AI</p>
            <h1 className="mt-1 text-3xl font-bold">ডকুমেন্টেশন ও পিচ ডেক</h1>
            <p className="mt-2 text-blue-100">লাইভ, রিয়েল-টাইম সিস্টেম ভিউ, সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</p>
          </header>

          {/* Feature matrix (live) */}
          {features.length > 0 && (
            <section className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">ফিচার ম্যাট্রিক্স (লাইভ)</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f.id} className="flex items-start justify-between rounded-xl border border-line p-4">
                    <div><div className="font-bold text-ink">{f.name}</div>{f.desc && <div className="text-sm text-ink/60">{f.desc}</div>}</div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[f.status]}`}>{f.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sections */}
          {filtered.map((s) => (
            <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-24 rounded-2xl border border-line bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${s.kind === 'deck' ? 'bg-brand/10 text-brand' : 'bg-safe/10 text-safe'}`}>
                  {s.kind === 'deck' ? 'PITCH' : 'TECH'}
                </span>
                <h2 className="text-xl font-bold text-ink">{s.title}</h2>
              </div>
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink/80">{s.body}</div>
            </section>
          ))}

          {/* Team */}
          {team.length > 0 && (
            <section className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">টিম</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((m) => (
                  <div key={m.id} className="flex items-center gap-4 rounded-xl border border-line p-4">
                    {m.photoUrl
                      ? <img src={m.photoUrl} alt={m.name} className="h-14 w-14 rounded-full object-cover" />
                      : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-xl font-bold text-brand">{m.name[0]}</div>}
                    <div className="min-w-0">
                      <div className="truncate font-bold text-ink">{m.name}</div>
                      <div className="text-sm text-ink/60">{m.role}</div>
                      <div className="truncate text-xs text-ink/40">{m.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="pt-4 text-center text-xs text-ink/40">
            ProbashiShield AI · International AI Builders Congress 2026 · CloudCamp BD
          </footer>
        </main>
      </div>
    </div>
  )
}
