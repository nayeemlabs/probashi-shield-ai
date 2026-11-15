import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { signInEmail, signUpEmail, signInGoogle } = useAuth()
  const nav = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await signInEmail(email, password)
      else await signUpEmail(email, password)
      nav('/')
    } catch (err: any) {
      setError(err?.message?.includes('auth/') ? 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' : 'কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।')
    } finally {
      setBusy(false)
    }
  }

  async function google() {
    setError('')
    setBusy(true)
    try {
      await signInGoogle()
      nav('/')
    } catch {
      setError('Google লগইন বাতিল হয়েছে বা সমস্যা হয়েছে।')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <img src="/brand/logo-1024.png" alt="" className="mx-auto mb-3 h-16 w-16" />
            <h1 className="text-2xl font-bold text-brand">
              {mode === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
            </h1>
            <p className="mt-1 text-sm text-ink/60">চুক্তি যাচাই, ফ্যামিলি ট্র্যাকিং ও SOS সেবার জন্য</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">ইমেইল</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">পাসওয়ার্ড</label>
              <input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="কমপক্ষে ৬ অক্ষর"
              />
            </div>
            {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
            <button
              type="submit" disabled={busy}
              className="w-full rounded-lg bg-brand py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {busy ? 'অপেক্ষা করুন…' : mode === 'login' ? 'লগইন' : 'সাইন আপ'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
            <div className="h-px flex-1 bg-line" /> অথবা <div className="h-px flex-1 bg-line" />
          </div>

          <button
            onClick={google} disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-line py-3 font-medium text-ink hover:bg-mist disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9 1-3.1 1a5.4 5.4 0 0 1-5.1-3.7H.9v2.3A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.9 10.9a5.4 5.4 0 0 1 0-3.4V5.2H.9a9 9 0 0 0 0 8l3-2.3z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5.2l3 2.3A5.4 5.4 0 0 1 9 3.6z"/></svg>
            Google দিয়ে চালিয়ে যান
          </button>

          <p className="mt-5 text-center text-sm text-ink/60">
            {mode === 'login' ? 'নতুন ব্যবহারকারী? ' : 'ইতিমধ্যে অ্যাকাউন্ট আছে? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-bold text-brand hover:underline">
              {mode === 'login' ? 'সাইন আপ করুন' : 'লগইন করুন'}
            </button>
          </p>
          <p className="mt-2 text-center text-xs text-ink/40">
            <Link to="/" className="hover:underline">← হোমে ফিরে যান</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
