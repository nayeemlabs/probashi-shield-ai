import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { usePrefs } from '../lib/prefs'

export function Nav() {
  const { user, signOut, loading } = useAuth()
  const { t, lang, toggleLang, theme, toggleTheme } = usePrefs()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/brand/logo-1024.png" alt="ProbashiShield" className="h-10 w-10" />
          <div className="leading-tight">
            <div className="text-lg font-bold text-brand">প্রবাসীশিল্ড</div>
            <div className="font-latin text-[11px] font-semibold tracking-wide text-ink/60">
              ProbashiShield <span className="text-brand-light">AI</span>
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link to="/audit" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:bg-mist md:block">{t('nav.audit')}</Link>
          <Link to="/family" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:bg-mist lg:block">{t('nav.family')}</Link>
          <Link to="/eoc" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:bg-mist lg:block">{t('nav.eoc')}</Link>
          <button onClick={toggleLang} className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink/70 hover:bg-mist" aria-label="language">
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
          <button onClick={toggleTheme} className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink/70 hover:bg-mist" aria-label="theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {loading ? null : user ? (
            <button onClick={() => signOut()} className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
              {t('nav.logout')}
            </button>
          ) : (
            <Link to="/login" className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
              {t('nav.login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
