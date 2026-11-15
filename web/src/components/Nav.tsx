import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function Nav() {
  const { user, signOut, loading } = useAuth()
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
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/audit" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:bg-mist sm:block">চুক্তি যাচাই</Link>
          <Link to="/family" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:bg-mist sm:block">পরিবার ট্র্যাকিং</Link>
          <Link to="/eoc" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:bg-mist sm:block">জরুরি সেবা</Link>
          {loading ? null : user ? (
            <button onClick={() => signOut()} className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
              লগ আউট
            </button>
          ) : (
            <Link to="/login" className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
              লগইন
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
