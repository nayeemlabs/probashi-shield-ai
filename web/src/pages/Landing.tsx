import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { usePrefs } from '../lib/prefs'

const svg = {
  doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7 text-brand"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7 text-safe"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7 text-brand-light"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/></svg>,
  sos: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7 text-danger"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>,
}

const featureKeys = [
  { icon: svg.doc, title: 'feat.1.title', desc: 'feat.1.desc' },
  { icon: svg.check, title: 'feat.2.title', desc: 'feat.2.desc' },
  { icon: svg.chat, title: 'feat.3.title', desc: 'feat.3.desc' },
  { icon: svg.sos, title: 'feat.4.title', desc: 'feat.4.desc' },
]

export default function Landing() {
  const { t } = usePrefs()
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white sm:py-20">
            <img src="/brand/logo-1024.png" alt="" className="mx-auto mb-6 h-24 w-24 drop-shadow-xl sm:h-28 sm:w-28" />
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{t('hero.kicker')}</h1>
            <p className="font-latin mt-2 text-lg font-semibold text-blue-100">{t('hero.sub')}</p>
            <p className="mx-auto mt-6 max-w-2xl text-base text-blue-100 sm:text-lg">
              {t('hero.line1')} {t('hero.line2')}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-blue-200 sm:text-base">{t('hero.desc')}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/audit" className="w-full rounded-xl bg-white px-8 py-3 font-bold text-brand shadow-lg hover:bg-blue-50 sm:w-auto">
                {t('hero.cta1')}
              </Link>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="w-full rounded-xl border-2 border-white/60 px-8 py-3 font-bold text-white hover:bg-white/10 sm:w-auto">
                {t('hero.cta2')}
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-200">{t('hero.note')}</p>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <h2 className="mb-10 text-center text-2xl font-bold text-brand sm:text-3xl">{t('feat.title')}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featureKeys.map((f) => (
              <div key={f.title} className="cursor-pointer rounded-2xl border border-line bg-white p-6 shadow-sm transition-colors hover:border-brand/40">
                <div className="mb-3">{f.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-ink">{t(f.title)}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{t(f.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-center sm:grid-cols-3">
            <div><div className="text-3xl font-bold text-brand">১.২ কোটি+</div><div className="text-sm text-ink/60">{t('stats.migrants')}</div></div>
            <div><div className="text-3xl font-bold text-safe">৩ সেকেন্ড</div><div className="text-sm text-ink/60">{t('stats.audit')}</div></div>
            <div><div className="text-3xl font-bold text-brand-light">২৪/৭</div><div className="text-sm text-ink/60">{t('stats.guardian')}</div></div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold text-brand sm:text-3xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">{t('cta.desc')}</p>
          <Link to="/login" className="mt-6 inline-block rounded-xl bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark">
            {t('cta.btn')}
          </Link>
        </section>
      </main>
      <footer className="border-t border-line bg-white py-8 text-center text-sm text-ink/50">
        <p>{t('footer.line1')}</p>
        <p className="mt-1">{t('footer.line2')}</p>
      </footer>
    </div>
  )
}
