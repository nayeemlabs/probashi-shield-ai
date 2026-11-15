import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'

const features = [
  {
    icon: '📄',
    title: 'চুক্তি ও ভিসা অডিট',
    desc: 'আরবি/ইংরেজি কন্ট্রাক্টের ছবি তুলুন — AI ৩ সেকেন্ডে বাংলায় বলে দেবে আসল বেতন, পেশা আর লুকানো ফাঁদ।',
  },
  {
    icon: '✅',
    title: 'এজেন্সি যাচাই',
    desc: 'RL নম্বর tenté হলে BMET ডাটাবেজে যাচাই, কফিলের অতীত অভিযোগের ইতিহাস — লাইভ রেফারেন্সসহ।',
  },
  {
    icon: '💬',
    title: 'WhatsApp লাইফলাইন',
    desc: 'কোনো অ্যাপ লাগে না। প্রতি মাসে বাংলাে খোঁজ নেবে, বেতন-পাওয়া গেছে কিনা জানবে।',
  },
  {
    icon: '🆘',
    title: 'SOS ও রেসকিউ',
    desc: 'ভয়েস নোটে SOS — GPS লোকেশনসহ দূতাবাসে এক ক্লিকে রেসকিউ ডসিয়ার।',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center text-white">
            <img src="/brand/logo-1024.png" alt="" className="mx-auto mb-6 h-28 w-28 drop-shadow-xl" />
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              প্রবাসীশিল্ড এআই
            </h1>
            <p className="font-latin mt-2 text-lg font-semibold text-blue-100">
              ProbashiShield <span className="text-emerald-300">AI</span>
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              বিদেশ যাওয়ার আগে চুক্তির লুকানো ফাঁদ ধরা — আর যাওয়ার পর ২৪/৭ পাশে থাকা ডিজিটাল অভিভাবক।
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-blue-200">
              ১.২ কোটি প্রবাসী শ্রমিকের জন্য — চুক্তি জালিয়াতি ধরা, ভিসা যাচাই, জরুরি সেবায় দূতাবাস সংযোগ।
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/audit" className="rounded-xl bg-white px-8 py-3 font-bold text-brand shadow-lg hover:bg-blue-50">
                ফ্রি চুক্তি যাচাই
              </Link>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="rounded-xl border-2 border-white/60 px-8 py-3 font-bold text-white hover:bg-white/10">
                WhatsApp-এ শুরু করুন
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-200">কোনো অ্যাপ ইনস্টল লাগে না · বাংলা ভয়েস রিপোর্ট</p>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-center text-3xl font-bold text-brand">চারটি সুরক্ষা স্তর</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-ink">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-center sm:grid-cols-3">
            <div><div className="text-3xl font-bold text-brand">১.২ কোটি+</div><div className="text-sm text-ink/60">প্রবাসী শ্রমিক</div></div>
            <div><div className="text-3xl font-bold text-safe">৩ সেকেন্ড</div><div className="text-sm text-ink/60">চুক্তি অডিট সময়</div></div>
            <div><div className="text-3xl font-bold text-brand-light">২৪/৭</div><div className="text-sm text-ink/60">ডিজিটাল অভিভাবক</div></div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-brand">বিমানে ওঠার আগে জানুন — ভুয়া চুক্তি নাকি আসল</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            দালালের কথা বিশ্বাস না করে, প্রমাণ দেখুন। আপনার চুক্তি, ভিসা আর কফিল — সবকিছু AI যাচাই করবে।
          </p>
          <Link to="/login" className="mt-6 inline-block rounded-xl bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark">
            শুরু করুন — ফ্রি
          </Link>
        </section>
      </main>
      <footer className="border-t border-line bg-white py-8 text-center text-sm text-ink/50">
        <p>প্রবাসীশিল্ড এআই · International AI Builders Congress 2026 · CloudCamp BD</p>
        <p className="mt-1">এই প্ল্যাটফর্ম কোনো আইনি পরামর্শ নয় — এটি ফ্যাক্ট-বেসড অডিট রিপোর্ট দেয়।</p>
      </footer>
    </div>
  )
}
