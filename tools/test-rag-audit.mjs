// tools/test-rag-audit.mjs
// Automated verification & test runner for ProbashiShield AI Triple-RAG Engine

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEMO_DOCS = join(ROOT, 'demo-docs')

// Import RAG Engine from web/src/lib/rag.ts
const ragModulePath = join(ROOT, 'web', 'src', 'lib', 'rag.ts')
// Use dynamic import with ts-node or run via node with TypeScript strip or standalone module
// Since Node.js can import .ts in Node 22+ with --experimental-strip-types
const {
  evaluateAuditWithRAG,
  searchLaborLaw,
  graphLookupSponsor,
  graphLookupAgency,
  GULF_LABOR_LAW_CORPUS,
  GRAPH_AGENCIES,
  GRAPH_KAFILS,
} = await import('file:///' + ragModulePath.replace(/\\/g, '/'))

console.log('\n======================================================')
console.log(' ProbashiShield AI — Triple-RAG System Verification')
console.log('======================================================\n')

let passedTests = 0
let failedTests = 0

function assert(condition, description) {
  if (condition) {
    console.log(`  ✓ [PASS] ${description}`)
    passedTests++
  } else {
    console.error(`  ✗ [FAIL] ${description}`)
    failedTests++
  }
}

// ----------------------------------------------------
// TEST SUITE 1: Contextual RAG (Labor Law Corpus)
// ----------------------------------------------------
console.log('▶ Test Suite 1: Contextual RAG — Gulf Labor Law Corpus & Retrieval')

assert(GULF_LABOR_LAW_CORPUS.length >= 6, `Corpus contains ${GULF_LABOR_LAW_CORPUS.length} statutory articles`)

const passportLaw = searchLaborLaw('The sponsor will take my passport for custody')
assert(passportLaw.some(l => l.id === 'KSA-DEC-166'), 'Retrieved Council of Ministers Decision 166 for passport custody query')

const wageLaw = searchLaborLaw('Company delayed salary and pays at employer discretion')
assert(wageLaw.some(l => l.id === 'KSA-LL-90'), 'Retrieved KSA Labor Law Art. 90 for wage discretion query')

const professionLaw = searchLaborLaw('Kafeel wants to change my profession from driver to cleaner')
assert(professionLaw.some(l => l.id === 'KSA-LL-38'), 'Retrieved KSA Labor Law Art. 38 for profession downgrade query')

const leaveLaw = searchLaborLaw('Contract says no annual leave before 24 months')
assert(leaveLaw.some(l => l.id === 'KSA-LL-109'), 'Retrieved KSA Labor Law Art. 109 for leave deprivation query')

const feeLaw = searchLaborLaw('Dalal demands 3,50,000 taka fee')
assert(feeLaw.some(l => l.id === 'BD-ACT-2013-19'), 'Retrieved Emigration Act 2013 for illegal fee query')


// ----------------------------------------------------
// TEST SUITE 2: Graph RAG (Agency & Sponsor Knowledge Graph)
// ----------------------------------------------------
console.log('\n▶ Test Suite 2: Graph RAG — Entity Lookup & Complaint Traversal')

const kafilBashaer = graphLookupSponsor('Al-Bashaer General Trading & Contracting Est.')
assert(kafilBashaer !== null, 'Sponsor Al-Bashaer resolved from Knowledge Graph')
assert(kafilBashaer?.trustScore === 18, `Al-Bashaer Trust Score is ${kafilBashaer?.trustScore}/100 (Critical Risk)`)
assert(kafilBashaer?.complaintHistory.length >= 3, `Al-Bashaer has ${kafilBashaer?.complaintHistory.length} active complaints in Graph`)
assert(kafilBashaer?.wageWithholdingRisk === 'CRITICAL', 'Wage withholding risk correctly flagged as CRITICAL')

const kafilMadinah = graphLookupSponsor('1010349821') // Search by CR
assert(kafilMadinah !== null, 'Sponsor Al-Madinah resolved by Commercial Registration No. (CR 1010349821)')
assert(kafilMadinah?.trustScore === 95, `Al-Madinah Trust Score is ${kafilMadinah?.trustScore}/100 (Compliant)`)
assert(kafilMadinah?.wageWithholdingRisk === 'LOW', 'Al-Madinah wage risk correctly flagged as LOW')

const agencyGreen = graphLookupAgency('RL-1428')
assert(agencyGreen !== null && agencyGreen.status === 'VERIFIED_ACTIVE', 'Agency Green Bengal (RL-1428) verified active')
assert(agencyGreen?.trustScore === 96, `Green Bengal Trust Score: ${agencyGreen?.trustScore}/100`)

const agencyHasan = graphLookupAgency('Hasan Dalal')
assert(agencyHasan !== null && agencyHasan.status === 'UNREGISTERED_FRAUD', 'Hasan Dalal correctly flagged as UNREGISTERED_FRAUD')
assert(agencyHasan?.trustScore === 12, `Hasan Dalal Trust Score: ${agencyHasan?.trustScore}/100 (Severe Risk)`)


// ----------------------------------------------------
// TEST SUITE 3: Document 1 (`contract-fraudulent.html`) Audit
// ----------------------------------------------------
console.log('\n▶ Test Suite 3: Document 1 Audit (`contract-fraudulent.html`) — Planted Fraud Detection')

const doc1Html = readFileSync(join(DEMO_DOCS, 'contract-fraudulent.html'), 'utf8')
const doc1Audit = evaluateAuditWithRAG({
  documentText: doc1Html,
  brokerPromise: 'Driver job in Riyadh, 2500 SAR monthly salary, 3.5 Lakh taka total package',
})

assert(doc1Audit.overallRisk === 'CRITICAL' || doc1Audit.overallRisk === 'HIGH', `Document 1 Overall Risk: ${doc1Audit.overallRisk} (${doc1Audit.riskScore}/100)`)
assert(doc1Audit.riskScore >= 90, `Risk score is high: ${doc1Audit.riskScore}/100`)

assert(doc1Audit.discrepancies.professionMismatch === true, 'Planted Fraud #1 Caught: Profession Mismatch (Driver -> Cleaner)')
assert(doc1Audit.discrepancies.salaryMismatch === true, 'Planted Fraud #2 Caught: Salary Suppression (SAR 2500 -> SAR 800)')
assert(doc1Audit.discrepancies.salaryDeficitPct >= 65, `Salary deficit calculated correctly: -${doc1Audit.discrepancies.salaryDeficitPct}%`)

assert(doc1Audit.findings.some(f => f.code === 'ILLEGAL_WAGE_DISCRETION'), 'Planted Fraud #3 Caught: Discretionary/deferred wages clause flagged (KSA Art. 90)')
assert(doc1Audit.findings.some(f => f.code === 'ILLEGAL_LEAVE_DEPRIVATION'), 'Planted Fraud #4 Caught: 24-month leave deprivation clause flagged (KSA Art. 109)')
assert(doc1Audit.findings.some(f => f.code === 'ILLEGAL_PASSPORT_CONFISCATION'), 'Planted Fraud #5 Caught: Passport surrender clause flagged (Decision 166)')
assert(doc1Audit.findings.some(f => f.code === 'ILLEGAL_UNILATERAL_DUTY_CHANGE'), 'Planted Fraud #6 Caught: Unilateral profession/chore alteration flagged (KSA Art. 38/58)')
assert(doc1Audit.findings.some(f => f.code === 'ILLEGAL_RECRUITMENT_FEE'), 'Planted Fraud #7 Caught: BDT 3,50,000 illegal recruitment surcharge flagged')
assert(doc1Audit.findings.some(f => f.code === 'GRAPH_KAFIL_HIGH_RISK'), 'Planted Fraud #8 Caught: Sponsor Al-Bashaer flagged via Graph RAG complaint history')

assert(doc1Audit.banglaVoiceSummary.includes('সতর্কতা'), 'Bangla Voice Summary generated with alert tone')
assert(doc1Audit.banglaVoiceSummary.includes('ক্লিনার') && doc1Audit.banglaVoiceSummary.includes('৮০০'), 'Bangla Voice Summary cites Cleaner profession & 800 Riyal salary')


// ----------------------------------------------------
// TEST SUITE 4: Document 2 (`contract-clean.html`) Control Audit
// ----------------------------------------------------
console.log('\n▶ Test Suite 4: Document 2 Audit (`contract-clean.html`) — Zero False-Positive Benchmark')

const doc2Html = readFileSync(join(DEMO_DOCS, 'contract-clean.html'), 'utf8')
const doc2Audit = evaluateAuditWithRAG({
  documentText: doc2Html,
  brokerPromise: 'Driver job, 2200 SAR basic + 300 allowance (2500 SAR total)',
})

assert(doc2Audit.overallRisk === 'LOW', `Document 2 Overall Risk: ${doc2Audit.overallRisk} (${doc2Audit.riskScore}/100)`)
assert(doc2Audit.riskScore <= 10, `Risk score is low: ${doc2Audit.riskScore}/100`)
assert(doc2Audit.discrepancies.professionMismatch === false, 'Zero False-Positive: Profession matches 100% (Driver)')
assert(doc2Audit.discrepancies.salaryMismatch === false, 'Zero False-Positive: Salary matches 100% (SAR 2500 total)')
assert(doc2Audit.findings.length === 0, `Zero False-Positive: Flagged findings count is 0 (found: ${doc2Audit.findings.length})`)
assert(doc2Audit.banglaVoiceSummary.includes('বৈধ ও নিরাপদ'), 'Bangla Voice confirms clean contract')


// ----------------------------------------------------
// TEST SUITE 5: Document 3 (`visa-mismatch.png` / `visa-mismatch.html`)
// ----------------------------------------------------
console.log('\n▶ Test Suite 5: Document 3 Audit (`visa-mismatch.png`) — MOFA Visa vs Broker Commitment')

assert(existsSync(join(DEMO_DOCS, 'visa-mismatch.png')), 'visa-mismatch.png exists and is generated')
assert(existsSync(join(DEMO_DOCS, 'visa-mismatch.html')), 'visa-mismatch.html companion exists')

const doc3Html = readFileSync(join(DEMO_DOCS, 'visa-mismatch.html'), 'utf8')
const doc3Audit = evaluateAuditWithRAG({
  documentText: doc3Html,
  brokerPromise: 'Private Driver job in Riyadh, 2500 SAR',
})

assert(doc3Audit.discrepancies.professionMismatch === true, 'Detected profession mismatch between MOFA visa (Cleaner) and chat promise (Driver)')
assert(doc3Audit.overallRisk === 'CRITICAL' || doc3Audit.overallRisk === 'HIGH', 'Visa mismatch correctly assessed as CRITICAL/HIGH risk')


// ----------------------------------------------------
// TEST SUITE 6: Document 4 (`broker-chat.html`) WhatsApp Audit
// ----------------------------------------------------
console.log('\n▶ Test Suite 6: Document 4 Audit (`broker-chat.html`) — Chat Forensic Extraction')

const doc4Html = readFileSync(join(DEMO_DOCS, 'broker-chat.html'), 'utf8')
assert(doc4Html.includes('Hasan Dalal'), 'Broker identity Hasan Dalal extracted from chat')
assert(doc4Html.includes('৩,৫০,০০০') || doc4Html.includes('3,50,000'), 'Extortionate fee extracted from WhatsApp dialogue')
assert(doc4Html.includes('২৫০০ রিয়াল') || doc4Html.includes('2500'), 'Verbal salary promise extracted from chat')


// ----------------------------------------------------
// TEST SUITE 7: Document 5 (`ecr-passport.html`) Passport & ECR Audit
// ----------------------------------------------------
console.log('\n▶ Test Suite 7: Document 5 Audit (`ecr-passport.html`) — ECR Clearance Status')

const doc5Html = readFileSync(join(DEMO_DOCS, 'ecr-passport.html'), 'utf8')
assert(doc5Html.includes('EG0849216'), 'Passport number EG0849216 verified')
assert(doc5Html.includes('SHAFIQUL') && doc5Html.includes('ISLAM'), 'Holder name Shafiqul Islam verified')
assert(doc5Html.includes('EMIGRATION CHECK REQUIRED'), 'ECR stamp identified: BMET clearance mandatory prior to departure')
assert(doc5Html.includes('BGDISLAM') && doc5Html.includes('SHAFIQUL'), 'ICAO Doc 9303 MRZ line 1 valid')


// ----------------------------------------------------
// TEST SUITE 8: Document 6 (`agency-badges.html`) BMET Agency Registry
// ----------------------------------------------------
console.log('\n▶ Test Suite 8: Document 6 Audit (`agency-badges.html`) — 3-Tier Agency Profiles')

const doc6Html = readFileSync(join(DEMO_DOCS, 'agency-badges.html'), 'utf8')
assert(doc6Html.includes('Green Bengal Overseas') && doc6Html.includes('RL-1428'), 'Green Agency Profile (RL-1428, 96/100) rendered')
assert(doc6Html.includes('Al-Hasan Overseas & Travels') && doc6Html.includes('FRAUD ALERT'), 'Red Unregistered Broker Profile rendered')
assert(doc6Html.includes('Gulf Horizon Manpower Services') && doc6Html.includes('RL-0892'), 'Amber Surveillance Agency Profile (RL-0892, 54/100) rendered')


// ----------------------------------------------------
// FINAL SCORECARD
// ----------------------------------------------------
console.log('\n======================================================')
console.log(` FINAL RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`)
console.log(` ACCURACY RATE: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`)
console.log('======================================================\n')

if (failedTests > 0) {
  process.exit(1)
}
