import { useState, type ChangeEvent } from 'react'
import { Nav } from '../components/Nav'
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { uploadContract, fileUrl, analyzeContract } from '../lib/api'
import { evaluateAuditWithRAG, type FullAuditReport } from '../lib/rag'

const ENGINE_LABEL: Record<string, string> = {
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'groq-llama4-scout': 'Groq Llama 4 Scout',
  llava: 'LLaVA (fallback — কম নির্ভুল)',
  'local-rag': 'লোকাল RAG',
}

export default function Audit() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [promise, setPromise] = useState('')
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const [report, setReport] = useState('')
  const [ragReport, setRagReport] = useState<FullAuditReport | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [forensics, setForensics] = useState<{ score: number; heat: string | null } | null>(null)
  const [ocrText, setOcrText] = useState('')
  const [ocrBusy, setOcrBusy] = useState(false)
  const [engine, setEngine] = useState('')

  function playVoiceSummary(text: string) {
    if (!('speechSynthesis' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'bn-BD'
    utterance.rate = 0.95
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  // Tesseract.js Arabic+English OCR, lazy-loaded, runs fully in browser
  async function runOCR(f: File) {
    setOcrBusy(true)
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker(['ara', 'eng'])
      const { data } = await worker.recognize(f)
      await worker.terminate()
      setOcrText(data.text.trim())
    } catch { setOcrText('') } finally { setOcrBusy(false) }
  }

  // ELA (Error Level Analysis) — open-source photo-forensics technique
  // Re-save at JPEG q0.9, diff vs original, amplify: edited regions glow.
  async function runELA(f: File) {
    try {
      const bmp = await createImageBitmap(f)
      const w = bmp.width, h = bmp.height
      const c1 = document.createElement('canvas'); c1.width = w; c1.height = h
      c1.getContext('2d')!.drawImage(bmp, 0, 0)
      const orig = c1.getContext('2d')!.getImageData(0, 0, w, h).data
      // re-encode at known JPEG quality
      const blob = await new Promise<Blob>((r) => c1.toBlob((b) => r(b!), 'image/jpeg', 0.9))
      const bmp2 = await createImageBitmap(blob)
      const c2 = document.createElement('canvas'); c2.width = w; c2.height = h
      c2.getContext('2d')!.drawImage(bmp2, 0, 0)
      const resaved = c2.getContext('2d')!.getImageData(0, 0, w, h).data
      const heat = document.createElement('canvas'); heat.width = w; heat.height = h
      const hctx = heat.getContext('2d')!
      const out = hctx.createImageData(w, h)
      let hot = 0, total = w * h
      for (let i = 0; i < orig.length; i += 4) {
        const d = Math.abs(orig[i] - resaved[i]) + Math.abs(orig[i + 1] - resaved[i + 1]) + Math.abs(orig[i + 2] - resaved[i + 2])
        const v = Math.min(255, d * 6)
        if (d > 60) hot++
        out.data[i] = v; out.data[i + 1] = 0; out.data[i + 2] = 255 - v; out.data[i + 3] = 255
      }
      hctx.putImageData(out, 0, 0)
      setForensics({ score: +(hot / total * 100).toFixed(1), heat: heat.toDataURL('image/jpeg', 0.7) })
    } catch { setForensics(null) }
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setState('idle')
    setForensics(null)
    setOcrText('')
    setRagReport(null)
    setReport('')
    setEngine('')
    if (f.type === 'image/jpeg' || f.type === 'image/png') runELA(f)
    if (f.type.startsWith('image/')) runOCR(f)
  }

  async function submit() {
    if (!user || !file) return
    setState('uploading')
    setMsg('')
    try {
      const { key } = await uploadContract(file)
      const ref = await addDoc(collection(db, 'audits'), {
        ownerId: user.uid,
        imageKey: key,
        imageUrl: fileUrl(key),
        brokerPromise: promise,
        forensicsScore: forensics?.score ?? null,
        status: 'analyzing',
        createdAt: serverTimestamp(),
      })

      const localRag = evaluateAuditWithRAG({
        documentText: `${ocrText} ${file.name}`,
        brokerPromise: promise,
      })
      setRagReport(localRag)

      try {
        const { analysis, engine: usedEngine } = await analyzeContract(key, ocrText || undefined, promise || undefined)
        setReport(analysis)
        setEngine(usedEngine)
        const combinedRag = evaluateAuditWithRAG({
          documentText: `${ocrText} ${analysis}`,
          brokerPromise: promise,
        })
        setRagReport(combinedRag)
        await updateDoc(doc(db, 'audits', ref.id), {
          aiReport: analysis,
          engine: usedEngine,
          ragScore: combinedRag.riskScore,
          ragRisk: combinedRag.overallRisk,
          status: 'done',
          analyzedAt: serverTimestamp(),
        })
        setState('done')
        setMsg('অডিট সম্পন্ন! নিচে AI ও ট্রিপল-RAG রিপোর্ট দেখুন।')
      } catch {
        setReport(localRag.factBasedReportMarkdown)
        setEngine('local-rag')
        await updateDoc(doc(db, 'audits', ref.id), {
          aiReport: localRag.factBasedReportMarkdown,
          ragScore: localRag.riskScore,
          ragRisk: localRag.overallRisk,
          status: 'done',
          note: 'Evaluated via ProbashiShield Contextual RAG',
        })
        setState('done')
        setMsg('অডিট সম্পন্ন (লোকাল নলেজ RAG ইঞ্জিন দ্বারা বিশ্লেষণকৃত)। নিচে রিপোর্ট দেখুন।')
      }
    } catch (err) {
      console.error('[Audit] upload/analyze error:', err)
      setState('error')
      const msg = String((err as Error)?.message ?? err)
      setMsg(`আপলোড ব্যর্থ: ${msg.slice(0, 150)}`)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-brand">চুক্তি ও ভিসা অডিট</h1>
        <p className="mt-2 text-ink/70">
          আরবি বা ইংরেজি চুক্তি/ভিসার ছবি তুলুন। AI পড়ে বাংলায় বলে দেবে, আসল পেশা, বেতন, আর লুকানো ঝুঁকি।
        </p>

        {!user ? (
          <div className="mt-8 rounded-2xl border border-warn/30 bg-warn/5 p-6 text-center">
            <p className="font-medium text-warn">চালিয়ে যেতে লগইন করুন</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border-2 border-dashed border-line bg-white p-8 text-center">
              {preview ? (
                <img src={preview} alt="contract" className="mx-auto max-h-64 rounded-lg object-contain" />
              ) : (
                <p className="text-ink/50">কন্ট্রাক্ট বা ভিসার ছবি এখানে দিন</p>
              )}
              <input type="file" accept="image/*,application/pdf" onChange={onPick} className="mt-4 block w-full text-sm" />
            </div>

            {ocrBusy && <p className="text-center text-sm text-ink/50">OCR চলছে (عربي + English)…</p>}
            {ocrText && (
              <details className="rounded-2xl border border-line bg-white p-5">
                <summary className="cursor-pointer font-bold text-ink">OCR টেক্সট (কাঁচা)</summary>
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-ink/70" dir="auto">{ocrText}</pre>
              </details>
            )}

            {forensics && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink">ছবি ফরেনসিকস (ELA)</h3>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${forensics.score > 15 ? 'bg-danger/10 text-danger' : forensics.score > 5 ? 'bg-warn/10 text-warn' : 'bg-safe/10 text-safe'}`}>
                    {forensics.score > 15 ? 'সন্দেহজনক' : forensics.score > 5 ? 'মাঝারি' : 'পরিষ্কার'} · {forensics.score}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink/50">এডিট/জাল করা রিজিয়ন লাল-নীল heatmap-এ দেখা যায়।</p>
                {forensics.heat && <img src={forensics.heat} alt="ELA heatmap" className="mt-3 max-h-48 rounded-lg" />}
              </div>
            )}

            <div className="rounded-2xl border border-line bg-white p-6">
              <label className="mb-1 block font-medium text-ink/80">দালাল যা বলেছিল (ঐচ্ছিক)</label>
              <textarea
                value={promise} onChange={(e) => setPromise(e.target.value)} rows={3}
                placeholder="যেমন: ড্রাইভারের কাজ, বেতন ২৫০০ রিয়াল"
                className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-brand"
              />
              <p className="mt-1 text-xs text-ink/50">এটা দিলে AI প্রতিশ্রুতি আর চুক্তির পার্থক্য দেখাবে।</p>
            </div>

            <button
              onClick={submit} disabled={!file || state === 'uploading'}
              className="w-full rounded-xl bg-brand py-4 text-lg font-bold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {state === 'uploading' ? 'আপলোড হচ্ছে…' : 'ফ্রি অডিট চালান'}
            </button>

            {msg && (
              <div className={`rounded-xl p-4 text-center font-medium ${state === 'done' ? 'bg-safe/10 text-safe' : 'bg-danger/10 text-danger'}`}>
                {msg}
              </div>
            )}

            {ragReport && (
              <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-sm">
                {/* Risk Banner Header */}
                <div className={`flex flex-wrap items-center justify-between gap-4 rounded-xl p-4 ${ragReport.overallRisk === 'CRITICAL' || ragReport.overallRisk === 'HIGH' ? 'bg-danger/10 border border-danger/30 text-danger' : 'bg-safe/10 border border-safe/30 text-safe'}`}>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">রিস্ক স্কোর (Risk Score)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold">{ragReport.riskScore}</span>
                      <span className="text-sm font-semibold">/ ১০০ ({ragReport.overallRisk} RISK)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => playVoiceSummary(ragReport.banglaVoiceSummary)}
                    className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-all"
                  >
                    <span>{speaking ? '⏹️ ভয়েস বন্ধ করুন' : '🔊 বাংলায় শুনুন (Voice)'}</span>
                  </button>
                </div>

                {/* Discrepancies Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={`rounded-xl p-4 border ${ragReport.discrepancies.professionMismatch ? 'bg-danger/5 border-danger/20' : 'bg-mist border-line'}`}>
                    <span className="text-xs font-bold text-ink/60 uppercase">আসল পেশা vs প্রতিশ্রুতি</span>
                    <div className="mt-1 font-bold text-ink">
                      {ragReport.extractedProfession}
                    </div>
                    {ragReport.discrepancies.professionMismatch && (
                      <span className="mt-1 inline-block text-xs font-semibold text-danger">
                        ⚠️ প্রতিশ্রুতি ছিল: ড্রাইভার (Driver)
                      </span>
                    )}
                  </div>

                  <div className={`rounded-xl p-4 border ${ragReport.discrepancies.salaryMismatch ? 'bg-danger/5 border-danger/20' : 'bg-mist border-line'}`}>
                    <span className="text-xs font-bold text-ink/60 uppercase">মাসিক বেতন (WPS)</span>
                    <div className="mt-1 font-bold text-ink">
                      SAR {ragReport.extractedSalarySAR}
                      {ragReport.discrepancies.salaryMismatch && (
                        <span className="ml-2 text-xs font-semibold text-danger">
                          (-{ragReport.discrepancies.salaryDeficitPct}% কম)
                        </span>
                      )}
                    </div>
                    {ragReport.discrepancies.salaryMismatch && (
                      <span className="mt-1 inline-block text-xs font-semibold text-danger">
                        ⚠️ প্রতিশ্রুত বেতন: SAR {ragReport.discrepancies.promisedSalary}
                      </span>
                    )}
                  </div>

                  {ragReport.kafilVerification && (
                    <div className="rounded-xl p-4 border border-line bg-mist">
                      <span className="text-xs font-bold text-ink/60 uppercase">কফিল / নিয়োগকর্তা (Graph RAG)</span>
                      <div className="mt-1 font-bold text-ink text-sm">
                        {ragReport.kafilVerification.nameEn}
                      </div>
                      <span className={`text-xs font-semibold ${ragReport.kafilVerification.trustScore < 50 ? 'text-danger' : 'text-safe'}`}>
                        ট্রাস্ট স্কোর: {ragReport.kafilVerification.trustScore}/১০০ ({ragReport.kafilVerification.wageWithholdingRisk} Risk)
                      </span>
                    </div>
                  )}

                  {ragReport.agencyVerification && (
                    <div className="rounded-xl p-4 border border-line bg-mist">
                      <span className="text-xs font-bold text-ink/60 uppercase">এজেন্সি স্ট্যাটাস (BMET Registry)</span>
                      <div className="mt-1 font-bold text-ink text-sm">
                        {ragReport.agencyVerification.name}
                      </div>
                      <span className={`text-xs font-semibold ${ragReport.agencyVerification.status === 'VERIFIED_ACTIVE' ? 'text-safe' : 'text-danger'}`}>
                        {ragReport.agencyVerification.status === 'VERIFIED_ACTIVE' ? '✓ BMET লাইসেন্সধারী অনুমোদিত' : '🚨 অননুমোদিত দালাল'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Flagged Clauses List */}
                {ragReport.findings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold text-ink text-sm mb-2">শনাক্তকৃত আইনি ঝুঁকি ও শর্তসমূহ:</h4>
                    <div className="space-y-2">
                      {ragReport.findings.map((f, i) => (
                        <div key={i} className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm">
                          <div className="flex items-center justify-between font-bold text-danger">
                            <span>{f.titleBn}</span>
                            <span className="text-xs bg-danger/10 px-2 py-0.5 rounded">{f.citation}</span>
                          </div>
                          <p className="mt-1 text-xs text-ink/80">{f.descriptionBn}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {report && (
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
                <h3 className="mb-2 font-bold text-brand">AI অডিট পূর্ণাঙ্গ রিপোর্ট</h3>
                {engine && (
                  <p className="mb-3 inline-block rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink/60">
                    বিশ্লেষণ ইঞ্জিন: {ENGINE_LABEL[engine] ?? engine}
                  </p>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{report}</div>
              </div>
            )}

            <p className="text-center text-xs text-ink/50">
              এই রিপোর্ট ফ্যাক্ট-বেসড অডিট, আইনি পরামর্শ নয়। ভুয়া চুক্তি শনাক্তে সাহায্য করে, আইনি নিশ্চয়তা দেয় না।
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
