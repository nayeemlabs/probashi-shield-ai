// Generate 3-minute pitch deck PPTX — ProbashiShield AI (Clyber)
// Usage: node tools/make-deck.mjs  →  docs/ProbashiShield_Pitch_Deck.pptx
import PptxGenJS from 'pptxgenjs'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const p = new PptxGenJS()
p.layout = 'LAYOUT_WIDE'
p.author = 'Clyber — ProbashiShield AI'

const NAVY = '0B3D91', BLUE = '1E5FB8', GREEN = '0E7C4A', RED = 'B91C1C', INK = '111827', GREY = '6B7280', LIGHT = 'F7F8FA'

function slide(title, kicker) {
  const s = p.addSlide()
  s.background = { color: 'FFFFFF' }
  if (kicker) s.addText(kicker, { x: 0.6, y: 0.35, w: 12, h: 0.35, fontSize: 12, color: BLUE, bold: true })
  s.addText(title, { x: 0.6, y: 0.7, w: 12, h: 0.8, fontSize: 30, bold: true, color: NAVY })
  s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.45, w: 1.2, h: 0.06, fill: { color: BLUE } })
  return s
}
function bullets(s, items, x = 0.8, y = 1.8, w = 11.6, size = 18) {
  s.addText(items.map((t) => ({ text: t, options: { bullet: { code: '25AA' }, breakLine: true } })),
    { x, y, w, h: 4.5, fontSize: size, color: INK, valign: 'top', lineSpacing: 26 })
}
function big(s, text, sub, color = NAVY) {
  s.addText(text, { x: 0.8, y: 2.6, w: 11.6, h: 1.4, fontSize: 54, bold: true, color, align: 'center' })
  if (sub) s.addText(sub, { x: 0.8, y: 4.0, w: 11.6, h: 0.7, fontSize: 20, color: GREY, align: 'center' })
}

// 1. Title
let s = p.addSlide()
s.background = { color: NAVY }
s.addText('ProbashiShield AI', { x: 0.8, y: 1.8, w: 11.6, h: 1.2, fontSize: 54, bold: true, color: 'FFFFFF', align: 'center' })
s.addText('প্রবাসীশিল্ড এআই', { x: 0.8, y: 3.0, w: 11.6, h: 0.8, fontSize: 30, color: '9CC3EE', align: 'center' })
s.addText('The 24/7 Autonomous AI Guardian for 1.2 Crore Migrant Workers', { x: 0.8, y: 4.0, w: 11.6, h: 0.6, fontSize: 20, color: 'CFE0F5', align: 'center' })
s.addText('Clyber · International AI Builders Congress 2026 · CloudCamp BD', { x: 0.8, y: 5.2, w: 11.6, h: 0.4, fontSize: 14, color: '8FB4DE', align: 'center' })

// 2. Problem
s = slide('Problem: 1.2 Crore Migrants, Zero Safety Net', '0:00-0:30')
bullets(s, [
  '11-12 lakh Bangladeshis migrate yearly; ~Tk 50,000 crore spent annually',
  '60%+ face broker fraud: "driver, 2500 SAR" becomes "cleaner, 800 SAR" on the Arabic contract',
  'Semi-literate workers cannot read Arabic/English contracts; no verification tool exists',
  'After the airport: no real-time signal on safety, wages, or survival',
])

// 3. Solution
s = slide('Solution: WhatsApp-Native AI Guardian', '0:30-1:00')
bullets(s, [
  'Contract & visa photo → AI audit in 3 seconds → Bangla audio + color-coded report',
  'Agency RL check (BMET) + kafil complaint history (Graph RAG) + live MoFA/BMET verification (MCP)',
  'Monthly Bangla check-ins inside WhatsApp; voice replies update welfare telemetry',
  'One-tap SOS → GPS lock → auto Rescue Dossier to embassy + Dhaka EOC',
])

// 4. Demo
s = slide('Live Demo: From Photo to Rescue', '1:00-2:00')
bullets(s, [
  'Upload real Saudi Arabic contract → profession, salary, 5 hidden clauses extracted',
  'Trust score + labor-law citations + Bangla audio summary generated',
  'WhatsApp check-in conversation with voice-note welfare signals',
  'SOS trigger → severity score → embassy rescue dossier on live EOC dashboard',
  'Already deployed: probashi-shield.pages.dev',
])

// 5. AI Approach
s = slide('AI Approach: Real Depth, Not a Chatbot', '2:00-2:30')
bullets(s, [
  'Triple-RAG: Contextual (Gulf labor law) + Graph (agency→kafil→complaints) + live MCP connectors',
  'Gemini 2.5 Flash vision for Arabic/Bangla documents; Whisper V3 + Edge TTS for voice',
  'Ollama + Qwen2.5 edge mode: offline operation inside embassies',
  'Cost ~Tk 3/file vs revenue Tk 300+; 98% gross margin; cash-flow positive day one',
])

// 6. Business Model
s = slide('Business Model: Three Revenue Streams', '')
s.addTable([
  ['Stream', 'Model', 'Year-1 Math'],
  ['Bank/MFS bounty (B2B2C)', 'Tk 300-500 per verified account', '2 lakh openings → Tk 6-10 Cr'],
  ['Micro-payment (B2C)', 'Tk 299 per full audit', '1 lakh users → Tk 3-4 Cr'],
  ['Agency SaaS (B2B)', 'Tk 15k-40k/month subscription', 'Recurring, high margin'],
], { x: 0.8, y: 1.8, w: 11.6, fontSize: 16, border: { pt: 1, color: 'E5E7EB' }, fill: { color: LIGHT }, color: INK, valign: 'middle' })

// 7. Why Not ChatGPT
s = slide('Moat: What ChatGPT Cannot Do', '')
bullets(s, [
  'Live government DB verification: MoFA visa status, BMET license, sponsor history',
  'Sponsor knowledge graph: this specific kafil\'s wage-theft record',
  'Action platform: official audit files, banking leads, embassy SOS dispatch',
])

// 8. Traction & Vision
s = slide('Traction & Vision', '2:30-3:00')
bullets(s, [
  'Live platform: Firebase Auth + Firestore + R2 + Cloudflare Pages/Workers, all free tier',
  'Admin portal with live R2 usage, platform stats, scheduling-controlled /docs pitch deck',
  'Bangla default + English toggle, dark/light mode, WhatsApp-safe OG assets',
  'Next: WhatsApp bot, bank bounty pilots, embassy welfare cell, multi-country corridors',
])
big(s, 'Every migrant deserves a guardian.', 'Verify before departure. Accompany during contract. Rescue in crisis.', GREEN)

// 9. Team
s = slide('Team: Clyber', '')
s.addTable([
  ['Name', 'Role'],
  ['Jannatul Nayeem', 'Team Lead'],
  ['Sanzida Rahman', 'Product / UX Designer'],
  ['Omar Faruk Sajid', 'Member'],
  ['Abdul Awal Ibn Rafi', 'Member'],
  ['Abu Bakr Siddiq', 'Member'],
  ['Rakibul Islam (NRB)', 'Member'],
], { x: 0.8, y: 1.9, w: 8, fontSize: 16, border: { pt: 1, color: 'E5E7EB' }, fill: { color: LIGHT }, color: INK, valign: 'middle' })
s.addText('International AI Builders Congress 2026\nCivicSphere & FinSphere AI\nIdea to Unicorn track', { x: 9.2, y: 2.4, w: 3.4, h: 2, fontSize: 14, color: GREY, valign: 'top' })

// 10. Ask
s = slide('The Ask', '')
bullets(s, [
  'BMET / MoFA data-sharing MoU for live verification',
  '1 bank pilot + 1 embassy welfare pilot + 2 agency pilots',
  'Capital for verification ops and government liaison, not logistics',
])

p.writeFile({ fileName: join(root, 'docs', 'ProbashiShield_Pitch_Deck.pptx') }).then(() => console.log('Deck written: docs/ProbashiShield_Pitch_Deck.pptx'))
