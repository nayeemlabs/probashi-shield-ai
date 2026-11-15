import { Nav } from '../components/Nav'

const benefits = [
  'বাল্ক চুক্তি অডিট, প্রতিটি কন্ট্রাক্ট স্বয়ংক্রিয় যাচাই',
  '"Verified Trust Badge", সৎ এজেন্সিদের জন্য ভেরিফাইড ব্যাজ',
  'কফিলের অভিযোগ-ইতিহাস রিপোর্ট, গ্রাহক আস্থা বাড়ায়',
  'মাসিক সাবস্ক্রিপশন, কোনো লুকানো চার্জ নেই',
]

export default function Agency() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-brand">এজেন্সি পার্টনার প্রোগ্রাম</h1>
        <p className="mt-2 text-ink/70">
          সৎ রিক্রুটিং এজেন্সিগুলোর জন্য, আপনার কন্ট্রাক্ট যাচাই করে "Verified Trust Badge" পান, প্রতিযোগীদের থেকে এগিয়ে থাকুন।
        </p>

        <div className="mt-8 rounded-2xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold text-ink">প্ল্যান</h2>
          <ul className="mt-4 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 text-safe">✓</span>
                <span className="text-ink/80">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-mist p-4 text-sm text-ink/70">
            <span className="font-bold text-ink">মূল্য:</span> মাসিক ৳১৫,০০০-৳৪০,০০০ (ভলিউম অনুযায়ী)
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold text-ink">আগ্রহী? যোগাযোগ করুন</h2>
          <p className="mt-2 text-sm text-ink/60">
            আমাদের টিম শীঘ্রই যোগাযোগ করবে, অথবা সরাসরি WhatsApp-এ লিখুন।
          </p>
          <a
            href="https://wa.me/"
            target="_blank" rel="noreferrer"
            className="mt-4 inline-block rounded-lg bg-safe px-6 py-3 font-bold text-white hover:opacity-90"
          >
            WhatsApp-এ যোগাযোগ করুন
          </a>
        </div>
      </main>
    </div>
  )
}
