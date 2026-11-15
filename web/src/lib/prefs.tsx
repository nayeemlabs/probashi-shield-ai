import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Lang = 'bn' | 'en'
type Theme = 'dark' | 'light'

interface Prefs {
  lang: Lang
  theme: Theme
  setLang: (l: Lang) => void
  toggleLang: () => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  t: (key: string) => string
}

const dict: Record<string, { bn: string; en: string }> = {
  'nav.audit': { bn: 'চুক্তি যাচাই', en: 'Contract Audit' },
  'nav.family': { bn: 'পরিবার ট্র্যাকিং', en: 'Family Tracking' },
  'nav.eoc': { bn: 'জরুরি সেবা', en: 'Emergency' },
  'nav.login': { bn: 'লগইন', en: 'Login' },
  'nav.logout': { bn: 'লগ আউট', en: 'Logout' },
  'hero.kicker': { bn: 'প্রবাসীশিল্ড এআই', en: 'ProbashiShield AI' },
  'hero.sub': { bn: 'ProbashiShield AI', en: 'ProbashiShield AI' },
  'hero.line1': { bn: 'বিদেশ যাওয়ার আগে চুক্তির লুকানো ফাঁদ ধরা', en: 'Catch hidden contract traps before you leave Bangladesh' },
  'hero.line2': { bn: 'এবং যাওয়ার পর ২৪/৭ পাশে থাকা ডিজিটাল অভিভাবক।', en: 'and a 24/7 digital guardian beside every migrant worker.' },
  'hero.desc': { bn: '১.২ কোটি প্রবাসী শ্রমিকের জন্য, চুক্তি জালিয়াতি ধরা, ভিসা যাচাই, জরুরি সেবায় দূতাবাস সংযোগ।', en: 'For 1.2 crore migrant workers: contract fraud detection, visa verification, and embassy-linked crisis response.' },
  'hero.cta1': { bn: 'ফ্রি চুক্তি যাচাই', en: 'Free Contract Audit' },
  'hero.cta2': { bn: 'WhatsApp-এ শুরু করুন', en: 'Start on WhatsApp' },
  'hero.note': { bn: 'কোনো অ্যাপ ইনস্টল লাগে না · বাংলা ভয়েস রিপোর্ট', en: 'No app install needed · Bangla voice reports' },
  'feat.title': { bn: 'চারটি সুরক্ষা স্তর', en: 'Four layers of protection' },
  'feat.1.title': { bn: 'চুক্তি ও ভিসা অডিট', en: 'Contract & Visa Audit' },
  'feat.1.desc': { bn: 'আরবি/ইংরেজি কন্ট্রাক্টের ছবি তুলুন, AI ৩ সেকেন্ডে বাংলায় বলে দেবে আসল বেতন, পেশা আর লুকানো ফাঁদ।', en: 'Snap a photo of the Arabic/English contract. AI reads it in 3 seconds and tells you the real salary, job and hidden traps in Bangla.' },
  'feat.2.title': { bn: 'এজেন্সি যাচাই', en: 'Agency Verification' },
  'feat.2.desc': { bn: 'RL নম্বর BMET ডাটাবেজে যাচাই, কফিলের অতীত অভিযোগের ইতিহাস, লাইভ রেফারেন্সসহ।', en: 'RL number checked against BMET database, kafil complaint history with live references.' },
  'feat.3.title': { bn: 'WhatsApp লাইফলাইন', en: 'WhatsApp Lifeline' },
  'feat.3.desc': { bn: 'কোনো অ্যাপ লাগে না। প্রতি মাসে বাংলাে খোঁজ নেবে, বেতন-পাওয়া গেছে কিনা জানবে।', en: 'No app needed. Monthly check-ins in Bangla asking if wages arrived.' },
  'feat.4.title': { bn: 'SOS ও রেসকিউ', en: 'SOS & Rescue' },
  'feat.4.desc': { bn: 'ভয়েস নোটে SOS, GPS লোকেশনসহ দূতাবাসে এক ক্লিকে রেসকিউ ডসিয়ার।', en: 'Voice-note SOS sends GPS-tagged rescue dossiers to the embassy in one tap.' },
  'stats.migrants': { bn: 'প্রবাসী শ্রমিক', en: 'Migrant workers' },
  'stats.audit': { bn: 'চুক্তি অডিট সময়', en: 'Contract audit time' },
  'stats.guardian': { bn: 'ডিজিটাল অভিভাবক', en: 'Digital guardian' },
  'cta.title': { bn: 'বিমানে ওঠার আগে জানুন, ভুয়া চুক্তি নাকি আসল', en: 'Know before take-off: fake contract or real' },
  'cta.desc': { bn: 'দালালের কথা বিশ্বাস না করে, প্রমাণ দেখুন। আপনার চুক্তি, ভিসা আর কফিল, সবকিছু AI যাচাই করবে।', en: 'Do not trust the broker\'s word. See the proof. AI verifies your contract, visa and kafil.' },
  'cta.btn': { bn: 'শুরু করুন, ফ্রি', en: 'Get started, free' },
  'footer.line1': { bn: 'প্রবাসীশিল্ড এআই · International AI Builders Congress 2026 · CloudCamp BD', en: 'ProbashiShield AI · International AI Builders Congress 2026 · CloudCamp BD' },
  'footer.line2': { bn: 'এই প্ল্যাটফর্ম কোনো আইনি পরামর্শ নয়, এটি ফ্যাক্ট-বেসড অডিট রিপোর্ট দেয়।', en: 'This platform is not legal advice; it provides fact-based audit reports.' },
}

const Ctx = createContext<Prefs | null>(null)

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('ps_lang') as Lang) || 'bn')
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('ps_theme') as Theme) || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.lang = lang
    localStorage.setItem('ps_theme', theme)
    localStorage.setItem('ps_lang', lang)
  }, [lang, theme])

  const value: Prefs = {
    lang, theme,
    setLang, setTheme,
    toggleLang: () => setLang((l) => (l === 'bn' ? 'en' : 'bn')),
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    t: (key) => dict[key]?.[lang] ?? key,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePrefs() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePrefs outside provider')
  return ctx
}
