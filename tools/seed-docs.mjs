// Seed Firestore for /docs module: config, sections, features, team
// Usage: GOOGLE_APPLICATION_CREDENTIALS=<path> node tools/seed-docs.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}
const app = initializeApp({ credential: cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'))) })
const db = getFirestore(app)

const batch = db.batch()

// docsConfig
batch.set(db.doc('docsConfig/settings'), { visible: true, scheduleEnabled: false, startAt: null, endAt: null })

// Features (live matrix)
const features = [
  ['Contract & Visa Audit', 'live', 'Multimodal AI reads Arabic/English contracts and visa documents'],
  ['Agency Verification', 'live', 'BMET RL check + kafil complaint history via knowledge graph'],
  ['WhatsApp Lifeline', 'beta', 'Monthly Bangla check-ins and voice-note welfare telemetry'],
  ['SOS & Embassy Rescue', 'beta', 'Panic trigger, GPS lock, auto rescue dossier to embassy'],
  ['Bank Account Bounty', 'planned', 'Verified migrant onboarding for banks/MFS partners'],
  ['Agency SaaS Portal', 'planned', 'Bulk audit + Verified Trust Badge for ethical agencies'],
]
features.forEach(([name, status, desc], i) => batch.set(db.doc(`features/f${i}`), { name, status, desc }))

// Team, Clyber
const team = [
  ['Jannatul Nayeem', 'Team Lead', 'jannatulnayeemdev@gmail.com', ''],
  ['Sanzida Rahman', 'Product/UX Designer', '', ''],
  ['Omar Faruk Sajid', 'Member', '', ''],
  ['Abdul Awal Ibn Rafi', 'Member', '', ''],
  ['Abu Bakr Siddiq', 'Member', '', ''],
  ['Rakibul Islam', 'Member (NRB)', '', ''],
]
team.forEach(([name, role, email, photoUrl], i) => batch.set(db.doc(`team/m${i}`), { name, role, email, photoUrl }))

// Docs sections
const sections = [
  ['deck', 1, 'Problem', 'Every year 11-12 lakh Bangladeshis migrate spending ~Tk 50,000 crore. Over 60% face broker fraud: promised "driver, 2500 SAR" becomes "cleaner, 800 SAR" on the Arabic contract. After the airport, families get no real-time signal about the worker.'],
  ['deck', 2, 'Solution', 'ProbashiShield AI is a WhatsApp-native verification and crisis-response platform: multimodal contract audit, agency/kafil verification, monthly welfare check-ins, and one-tap SOS that generates embassy rescue dossiers.'],
  ['deck', 3, 'Why Now', 'Smartphone + WhatsApp penetration among migrants is near-universal; LLM vision now reads Arabic contracts accurately at ~Tk 1.5 per scan; governments actively seek migrant-welfare tech.'],
  ['deck', 4, 'Product Demo', 'Upload an Arabic contract photo: AI extracts profession, salary and hidden clauses, cross-checks BMET/MoFA registries, and returns a Bangla audio summary plus a color-coded Fact-Based Audit Report in seconds.'],
  ['deck', 5, 'Market Opportunity', '1.2 crore existing migrants plus ~12 lakh new departures yearly across Gulf and Malaysia corridors. Adjacent markets: other labor-sending countries (India, Philippines, Nepal, Sri Lanka).'],
  ['deck', 6, 'Business Model', 'B2B2C bank/MFS bounty (Tk 300-500 per verified account), B2C micro-payment (Tk 299 per full audit), B2B agency SaaS (Tk 15k-40k/month). AI cost ~Tk 3 per file; gross margin 98%+; cash-flow positive from day one.'],
  ['deck', 7, 'Traction', 'Live web platform at probashi-shield.pages.dev with Firebase auth, R2 storage pipeline, admin portal with live usage stats. Competition MVP stage; pilot partnerships in progress.'],
  ['deck', 8, 'Competition', 'Probashi (admin fee portal) and BRAC (post-crisis rescue) act after departure. ChatGPT translates but cannot verify visas against live government databases or hold sponsor complaint history.'],
  ['deck', 9, 'Unique Advantage', 'Three moats: live government database verification via custom MCP connectors, sponsor knowledge graph (agency to kafil to complaint history), and an action platform that files rescue dossiers, not just chat.'],
  ['deck', 10, 'Go-To-Market', 'Pilot wedge: 2 ethical agencies + 1 embassy welfare cell. Trust flywheel via fraud exposures. Institutional channel: banks co-brand verified migrant accounts; embassies embed SOS dashboard.'],
  ['deck', 11, 'Vision', 'The default safety layer for every labor migrant on earth: verify before departure, accompany during contract, rescue in crisis. Expand to all labor-sending corridors.'],
  ['tech', 12, 'Architecture', 'Channel: WhatsApp Cloud API + web app. Frontend: React 19 + Vite + Tailwind on Cloudflare Pages. API: Cloudflare Worker (probashi-api) with R2 binding. Auth/DB/Storage-meta: Firebase Auth, Firestore, Admin SDK. Edge AI: Ollama + Qwen2.5 for offline embassy mode. Orchestration: n8n workflows.'],
  ['tech', 13, 'Data Flow', 'Contract image -> Virus scan -> Gemini 2.5 Flash multimodal parse -> clause extraction -> BMET/MoFA verification via probashi-mcp -> Graph RAG complaint history -> discrepancy engine -> Bangla TTS audio + PDF audit report -> WhatsApp delivery.'],
  ['tech', 14, 'AI Layer', 'Vision: Gemini 2.5 Flash (Arabic+Bangla). Speech: Whisper Large v3 in, Edge TTS out. Retrieval: Contextual RAG (Gulf labor law corpus) + Graph RAG (agency-kafil-complaint graph in Neo4j) + live MCP connectors to government registries.'],
  ['tech', 15, 'Security & Privacy', 'Firebase Auth (email+Google), Firestore RBAC rules (owner/embassy/admin claims), R2 objects served only via Worker with token verification, AES-256 at rest, TLS 1.3 in transit, consent records, data minimization for vulnerable users.'],
  ['tech', 16, 'Roadmap', 'Phase 0: competition MVP (live). Phase 1: WhatsApp bot + verification desk pilot (500 migrants). Phase 2: probashi-mcp live connectors + bank bounty integration. Phase 3: multi-country expansion + government licensing.'],
  ['tech', 17, 'Changelog', 'v0.1 - Brand system, docs, landing, auth, audit upload, family/EOC/agency shells. v0.2 - R2 storage pipeline, admin portal, i18n bn/en, dark mode. v0.3 - /docs live pitch deck + tech docs with admin scheduling.'],
]
sections.forEach(([kind, order, title, body], i) => batch.set(db.doc(`docsSections/s${i}`), { kind, order, title, body }))

await batch.commit()
console.log('Seeded: 1 config,', features.length, 'features,', team.length, 'team,', sections.length, 'sections')
