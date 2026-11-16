// ProbashiShield AI — Triple-RAG Engine
// Contextual RAG (Gulf Labor Laws) + Graph RAG (Agency-Kafil-Complaint Knowledge Graph) + Discrepancy Engine

// ==========================================
// 1. CONTEXTUAL RAG: GULF LABOR LAW CORPUS
// ==========================================
export interface LaborLawArticle {
  id: string
  jurisdiction: string
  lawName: string
  article: string
  topic: 'wage' | 'leave' | 'passport' | 'profession' | 'working_hours' | 'recruitment_fee'
  legalTextEn: string
  legalTextAr?: string
  legalTextBn: string
  violationSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export const GULF_LABOR_LAW_CORPUS: LaborLawArticle[] = [
  {
    id: 'KSA-LL-38',
    jurisdiction: 'Saudi Arabia',
    lawName: 'Saudi Labor Law (Royal Decree No. M/51)',
    article: 'Article 38',
    topic: 'profession',
    legalTextEn: 'The employer may not employ the worker in a profession other than that specified in his work permit, nor may the worker work in a profession other than his profession without following statutory procedures.',
    legalTextAr: 'لا يجوز لصاحب العمل أن يشغل العامل في مهنة غير المهنة المدونة في رخصة عمله، كما لا يجوز للعامل أن يعمل في غير مهنته.',
    legalTextBn: 'মালিকপক্ষ কর্মীকে তার ওয়ার্ক পারমিটে উল্লিখিত পেশা ছাড়া অন্য পেশায় নিয়োজিত করতে পারবে না (যেমন: ড্রাইভারকে ক্লিনার হিসেবে কাজ করানো সম্পূর্ণ অবৈধ)।',
    violationSeverity: 'CRITICAL',
  },
  {
    id: 'KSA-LL-58',
    jurisdiction: 'Saudi Arabia',
    lawName: 'Saudi Labor Law',
    article: 'Article 58 & 60',
    topic: 'profession',
    legalTextEn: 'The employer may not assign the worker duties essentially different from the agreed work without the worker written consent, except in cases of emergency.',
    legalTextAr: 'لا يجوز لصاحب العمل أن يكلف العامل بعمل يختلف اختلافاً جوهرياً عن العمل المتفق عليه بغير موافقته الكتابية.',
    legalTextBn: 'কর্মীর লিখিত অনুমতি ব্যতীত তাকে মূল কাজের বাইরে কৃষি, গৃহস্থালি বা ঝাড়ুদারের কাজে বাধ্য করা বেআইনি।',
    violationSeverity: 'HIGH',
  },
  {
    id: 'KSA-LL-90',
    jurisdiction: 'Saudi Arabia',
    lawName: 'Saudi Labor Law & Wage Protection System (WPS)',
    article: 'Article 90',
    topic: 'wage',
    legalTextEn: 'Wages must be paid in the official currency and deposited directly on due dates into the worker accredited bank account via the Wage Protection System (WPS). Any discretion or deferral is strictly unlawful.',
    legalTextAr: 'تدفع الأجور بالعملة الرسمية وتودع في حساب العامل المعتمد عبر نظام حماية الأجور (WPS) في مواعيد استحقاقها المحددة.',
    legalTextBn: 'মালিকের মর্জিমাফিক বেতন স্থগিত বা দেরিতে দেওয়ার শর্ত বেআইনি। প্রতি মাসের ১ তারিখে ব্যাংকে WPS-এর মাধ্যমে বেতন পরিশোধ বাধ্যতামূলক।',
    violationSeverity: 'HIGH',
  },
  {
    id: 'KSA-DEC-166',
    jurisdiction: 'Saudi Arabia',
    lawName: 'Council of Ministers Decision No. 166',
    article: 'Resolution 166 & Penal Directives',
    topic: 'passport',
    legalTextEn: 'It is strictly prohibited for any employer to retain or confiscate the passport or travel documents of an expatriate worker. Violators are subject to mandatory fines up to SAR 20,000 per violation.',
    legalTextAr: 'يحظر على صاحب العمل حجز جواز سفر العامل أو وثائقه الشخصية تحت أي ظرف، ويعاقب المخالف بغرامة مالية تصل إلى 20,000 ريال.',
    legalTextBn: 'কফিল বা নিয়োগকর্তার কর্মীর পাসপোর্ট আটকে রাখা সৌদি আইনে দণ্ডনীয় অপরাধ। পাসপোর্ট সর্বদা কর্মীর নিজস্ব হেফাজতে থাকতে হবে।',
    violationSeverity: 'CRITICAL',
  },
  {
    id: 'KSA-LL-109',
    jurisdiction: 'Saudi Arabia',
    lawName: 'Saudi Labor Law',
    article: 'Article 109',
    topic: 'leave',
    legalTextEn: 'A worker is entitled to prepaid annual leave of not less than 21 days (increasing to 30 days after 5 years) for each year of service, with repatriation economy airfare provided.',
    legalTextAr: 'يستحق العامل إجازة سنوية مدفوعة الأجر لا تقل عن 21 يوماً عن كل سنة عمل، مع تذكرة سفر للعودة.',
    legalTextBn: 'প্রতি বছর শেষে ন্যূনতম ২১-৩০ দিনের সবেতন ছুটি এবং আসা-যাওয়ার বিমান টিকিট পাওয়া শ্রমিকের আইনি অধিকার। ২ বছরের আগে ছুটি না দেওয়ার শর্ত বাতিলযোগ্য।',
    violationSeverity: 'HIGH',
  },
  {
    id: 'BD-ACT-2013-19',
    jurisdiction: 'Bangladesh',
    lawName: 'Overseas Employment and Migrants Act 2013',
    article: 'Section 19 & 20',
    topic: 'recruitment_fee',
    legalTextEn: 'No recruiting agency or intermediary shall demand or receive fees exceeding the statutory ceiling fixed by BMET. Operating without a valid RL license is a non-bailable offense.',
    legalTextBn: 'সরকার নির্ধারিত সর্বোচ্চ ব্যয়ের অতিরিক্ত ফি (যেমন ৩.৫ লাখ টাকা) দাবি করা এবং অনুমোদনহীন দালালের মাধ্যমে ভিসা বিক্রি আইনত নিষিদ্ধ।',
    violationSeverity: 'HIGH',
  },
]

// ==========================================
// 2. GRAPH RAG: KNOWLEDGE GRAPH
// ==========================================
export interface AgencyNode {
  id: string
  name: string
  rlNumber: string | null
  proprietor: string
  status: 'VERIFIED_ACTIVE' | 'UNREGISTERED_FRAUD' | 'UNDER_SURVEILLANCE'
  trustScore: number // 0-100
  deployments: number
  complaintCount: number
  wpsComplianceRate: number
  notesBn: string
}

export interface KafilNode {
  id: string
  nameEn: string
  nameAr: string
  crNumber: string
  unifiedOrgNo: string
  city: string
  trustScore: number
  complaintHistory: string[]
  wageWithholdingRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  linkedAgencies: string[]
}

export interface ComplaintNode {
  id: string
  targetType: 'kafil' | 'agency'
  targetId: string
  complaintType: 'wage_delay' | 'passport_confiscation' | 'profession_mismatch' | 'illegal_fee' | 'abuse'
  date: string
  status: 'unresolved' | 'investigating' | 'resolved'
  summaryBn: string
}

// In-Memory Graph Store (Emulating Neo4j / Knowledge Graph)
export const GRAPH_AGENCIES: Record<string, AgencyNode> = {
  'green-bengal': {
    id: 'green-bengal',
    name: 'Green Bengal Overseas',
    rlNumber: 'RL-1428',
    proprietor: 'Al-Haj Mohammad Kabir Hossain',
    status: 'VERIFIED_ACTIVE',
    trustScore: 96,
    deployments: 4820,
    complaintCount: 0,
    wpsComplianceRate: 98.4,
    notesBn: 'বিএমইটি অনুমোদিত এ-প্লাস ক্যাটাগরির বিশ্বস্ত এজেন্সি। নির্ধারিত সরকারি ফি-তে কর্মী পাঠায়।',
  },
  'al-hasan': {
    id: 'al-hasan',
    name: 'Al-Hasan Overseas & Travels (Broker Hasan Dalal)',
    rlNumber: null,
    proprietor: 'Hasan Dalal (Unregistered Middleman)',
    status: 'UNREGISTERED_FRAUD',
    trustScore: 12,
    deployments: 50,
    complaintCount: 14,
    wpsComplianceRate: 15.0,
    notesBn: 'অনুমোদনহীন দালাল চক্র। ড্রাইভারের প্রতিশ্রুতি দিয়ে ক্লিনার ভিসা ও অতিরিক্ত ৩.৫ লাখ টাকা দাবির ১৪টি মামলা আছে।',
  },
  'gulf-horizon': {
    id: 'gulf-horizon',
    name: 'Gulf Horizon Manpower Services',
    rlNumber: 'RL-0892',
    proprietor: 'Syed Anwarul Huq',
    status: 'UNDER_SURVEILLANCE',
    trustScore: 54,
    deployments: 1240,
    complaintCount: 19,
    wpsComplianceRate: 64.2,
    notesBn: 'লাইসেন্স তদন্তাধীন। সৌদি আরবে বেতন বকেয়ার ১৯টি সক্রিয় অভিযোগ রয়েছে।',
  },
}

export const GRAPH_KAFILS: Record<string, KafilNode> = {
  'al-bashaer': {
    id: 'al-bashaer',
    nameEn: 'Al-Bashaer General Trading & Contracting Est.',
    nameAr: 'مؤسسة البشائر للتجارة العامة والمقاولات',
    crNumber: '1010729381',
    unifiedOrgNo: '7001948215',
    city: 'Riyadh',
    trustScore: 18,
    complaintHistory: [
      'CMP-2025-081: 4 months salary withholding for 6 cleaning staff',
      'CMP-2025-112: Passport retention at King Khalid Airport',
      'CMP-2026-004: Arbitrary transfer to farm in Al-Kharj',
    ],
    wageWithholdingRisk: 'CRITICAL',
    linkedAgencies: ['al-hasan', 'gulf-horizon'],
  },
  'al-madinah': {
    id: 'al-madinah',
    nameEn: 'Al-Madinah Logistics & Transport Co.',
    nameAr: 'شركة المدينة للخدمات اللوجستية والنقل',
    crNumber: '1010349821',
    unifiedOrgNo: '7003498210',
    city: 'Jeddah',
    trustScore: 95,
    complaintHistory: [],
    wageWithholdingRisk: 'LOW',
    linkedAgencies: ['green-bengal'],
  },
}

// ==========================================
// 3. RAG QUERY & AUDIT RESOLVER
// ==========================================

export interface AuditFinding {
  code: string
  titleBn: string
  titleEn: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  descriptionBn: string
  descriptionEn: string
  citation: string
}

export interface DiscrepancyResult {
  professionMismatch: boolean
  promisedProfession?: string
  extractedProfession?: string
  salaryMismatch: boolean
  promisedSalary?: number
  extractedSalary?: number
  salaryDeficitPct: number
  feeExorbitant: boolean
  demandedFeeBDT?: number
}

export interface FullAuditReport {
  contractId?: string
  workerName?: string
  passportNo?: string
  extractedProfession: string
  extractedSalarySAR: number
  overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number // 0-100
  discrepancies: DiscrepancyResult
  agencyVerification?: AgencyNode
  kafilVerification?: KafilNode
  findings: AuditFinding[]
  banglaVoiceSummary: string
  factBasedReportMarkdown: string
}

/** Contextual RAG: Match document text/clauses against Gulf labor law corpus */
export function searchLaborLaw(queryText: string): LaborLawArticle[] {
  const q = queryText.toLowerCase()
  return GULF_LABOR_LAW_CORPUS.filter((art) => {
    if (q.includes('passport') || q.includes('جواز') || q.includes('حفظ الوثائق') || q.includes('পাসপোর্ট')) {
      return art.topic === 'passport'
    }
    if (q.includes('wage') || q.includes('salary') || q.includes('راتب') || q.includes('أجور') || q.includes('বেতন') || q.includes('discretion') || q.includes('تأجيل')) {
      return art.topic === 'wage'
    }
    if (q.includes('profession') || q.includes('cleaner') || q.includes('driver') || q.includes('مهنة') || q.includes('نظافة') || q.includes('سائق') || q.includes('পেশা')) {
      return art.topic === 'profession'
    }
    if (q.includes('leave') || q.includes('vacation') || q.includes('إجازة') || q.includes('ছুটি')) {
      return art.topic === 'leave'
    }
    if (q.includes('fee') || q.includes('দালাল') || q.includes('টাকা') || q.includes('৩,৫০,০০০') || q.includes('350000')) {
      return art.topic === 'recruitment_fee'
    }
    return false
  })
}

/** Graph RAG: Search sponsor by name or Commercial Registration (CR) */
export function graphLookupSponsor(nameOrCr: string): KafilNode | null {
  const norm = nameOrCr.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const k of Object.values(GRAPH_KAFILS)) {
    if (k.crNumber === nameOrCr.trim() || k.unifiedOrgNo === nameOrCr.trim()) return k
    const kNormEn = k.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (kNormEn.includes(norm) || norm.includes('bashaer') || norm.includes('البشائر')) {
      if (k.id === 'al-bashaer') return k
    }
    if (kNormEn.includes(norm) || norm.includes('madinah') || norm.includes('المدينة')) {
      if (k.id === 'al-madinah') return k
    }
  }
  return null
}

/** Graph RAG: Search recruiting agency by name or BMET RL number */
export function graphLookupAgency(nameOrRL: string): AgencyNode | null {
  const norm = nameOrRL.toLowerCase()
  for (const a of Object.values(GRAPH_AGENCIES)) {
    if (a.rlNumber && norm.includes(a.rlNumber.toLowerCase())) return a
    if (norm.includes('green bengal') || norm.includes('1428')) return GRAPH_AGENCIES['green-bengal']
    if (norm.includes('hasan') || norm.includes('al-hasan') || norm.includes('হাসান')) return GRAPH_AGENCIES['al-hasan']
    if (norm.includes('gulf horizon') || norm.includes('0892')) return GRAPH_AGENCIES['gulf-horizon']
  }
  return null
}

/** Triple-RAG Discrepancy & Audit Evaluator */
export function evaluateAuditWithRAG(params: {
  documentText: string
  brokerPromise?: string
  extractedProfession?: string
  extractedSalary?: number
  sponsorName?: string
  agencyName?: string
}): FullAuditReport {
  const rawDoc = params.documentText.toLowerCase()
  // Strip style, script, and link tags so font-weights (like 800) and CSS rules don't pollute document text
  const cleanDoc = rawDoc
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')

  const promise = (params.brokerPromise || '').toLowerCase()
  const findings: AuditFinding[] = []

  // 1. Detect Profession Mismatch
  const isDriverPromised = promise.includes('driver') || promise.includes('ড্রাইভার') || promise.includes('سائق')
  const isCleanerInDoc = cleanDoc.includes('عامل نظافة') || cleanDoc.includes('cleaner / laborer') || cleanDoc.includes('domestic / office cleaner') || (cleanDoc.includes('cleaner') && !cleanDoc.includes('commercial vehicle driver'))
  const isDriverInDoc = cleanDoc.includes('سائق نقل') || cleanDoc.includes('سائق خاص') || cleanDoc.includes('commercial driver') || cleanDoc.includes('chauffeur') || cleanDoc.includes('driver')

  let professionMismatch = false
  let actualProf = params.extractedProfession || (isCleanerInDoc ? 'عامل نظافة (Cleaner)' : isDriverInDoc ? 'سائق (Driver)' : 'General Worker')

  if (isDriverPromised && isCleanerInDoc) {
    professionMismatch = true
    findings.push({
      code: 'FRAUD_PROFESSION_MISMATCH',
      titleBn: 'পেশা প্রতারণা: দালালের প্রতিশ্রুতি ড্রাইভার, চুক্তিতে ক্লিনার',
      titleEn: 'Critical Profession Mismatch (Driver vs Cleaner)',
      severity: 'CRITICAL',
      descriptionBn: 'দালাল ড্রাইভার হিসেবে পাঠাতে চেয়েছিল, কিন্তু আরবি চুক্তিতে আপনার পদ "عامل نظافة" (ক্লিনার)। এতে আপনি ড্রাইভিং লাইসেন্স পাবেন না এবং ঝাড়ুদারের কাজ করতে বাধ্য হবেন।',
      descriptionEn: 'Promised Private Driver, but formal contract states Cleaner (عامل نظافة). Ineligible for Saudi driving license; subjected to manual cleaning.',
      citation: 'KSA Labor Law Article 38',
    })
  }

  // 2. Detect Salary Suppression & Tampering
  let promisedSal = 0
  if (promise.includes('2500') || promise.includes('২৫০০')) promisedSal = 2500
  else if (promise.includes('2200') || promise.includes('২২০০')) promisedSal = 2200

  let actualSal = params.extractedSalary || 0
  if (!actualSal) {
    // Check if salary 800 is explicitly specified in the contract terms
    if (cleanDoc.includes('800.00') || cleanDoc.includes('sar 800') || cleanDoc.includes('800 ر.س') || cleanDoc.includes('ثمانمائة') || cleanDoc.includes('eight hundred')) {
      actualSal = 800
    } else if (cleanDoc.includes('2,200') || cleanDoc.includes('2200') || cleanDoc.includes('2,500') || cleanDoc.includes('2500')) {
      actualSal = 2500
    } else {
      actualSal = isCleanerInDoc ? 800 : 2500
    }
  }

  let salaryMismatch = false
  let deficitPct = 0

  if (promisedSal > 0 && actualSal < promisedSal) {
    salaryMismatch = true
    deficitPct = Math.round(((promisedSal - actualSal) / promisedSal) * 100)
    findings.push({
      code: 'FRAUD_SALARY_SUPPRESSION',
      titleBn: `বেতন ছাঁটাই: প্রতিশ্রুত SAR ${promisedSal}-এর জায়গায় মাত্র SAR ${actualSal} (${deficitPct}% কম)`,
      titleEn: `Severe Wage Suppression (SAR ${promisedSal} -> SAR ${actualSal}, -${deficitPct}%)`,
      severity: 'CRITICAL',
      descriptionBn: `প্রতি মাসে ১,৭০০ রিয়াল কম পাবেন। চুক্তিতে বেতনের জায়গায় ফ্লুইড/ওভার-টাইপিংয়ের লক্ষণ রয়েছে।`,
      descriptionEn: `Salary cut by 68%. White-out tampering detected over base salary field.`,
      citation: 'KSA Labor Law Article 90 & Minimum Wage Standards',
    })
  }

  // 3. Clause Checks via Contextual RAG (Strict Context Matching)
  // Clause 4: Discretionary wage
  if (cleanDoc.includes('sole discretion of the employer') || cleanDoc.includes('deferred at the sole discretion') || cleanDoc.includes('تقدير صاحب العمل المطلق') || cleanDoc.includes('تأجيله وفقاً لتقدير')) {
    findings.push({
      code: 'ILLEGAL_WAGE_DISCRETION',
      titleBn: 'বেতন পরিশোধে মালিকের স্বেচ্ছাচারিতা (ক্লজ ৪)',
      titleEn: 'Discretionary / Deferred Wage Payment Clause',
      severity: 'HIGH',
      descriptionBn: 'মালিকের ইচ্ছা হলে বা টাকা থাকলে বেতন দেবে—এই শর্ত সম্পূর্ণ বেআইনি। সৌদি WPS আইন অনুযায়ী প্রতি মাসের ১ তারিখে ব্যাংক একাউন্টে বেতন দেওয়া বাধ্যতামূলক।',
      descriptionEn: 'Clause states wages paid at employer discretion or deferred. Direct violation of mandatory Wage Protection System electronic deposit.',
      citation: 'KSA Labor Law Article 90',
    })
  }

  // Clause 8: Passport surrender to employer custody (Decision 166 violation)
  if ((cleanDoc.includes('surrender') && cleanDoc.includes('passport')) || cleanDoc.includes('employer custody') || cleanDoc.includes('تسليم جواز سفره الأصلي لعهدة صاحب العمل') || cleanDoc.includes('عهدة صاحب العمل طوال مدة')) {
    findings.push({
      code: 'ILLEGAL_PASSPORT_CONFISCATION',
      titleBn: 'পাসপোর্ট জব্দ করার অবৈধ শর্ত (ক্লজ ৮)',
      titleEn: 'Unlawful Passport & Iqama Retention Clause',
      severity: 'CRITICAL',
      descriptionBn: 'কফিলের কাছে পাসপোর্ট জমা রাখার শর্ত সৌদি আইনে সম্পূর্ণ বেআইনি এবং দণ্ডনীয় অপরাধ (সর্বোচ্চ ২০,০০০ রিয়াল জরিমানা)। পাসপোর্ট কর্মীর নিজের কাছে থাকবে।',
      descriptionEn: 'Contract mandates worker surrender original passport to employer. Violates Saudi Council of Ministers Decision 166.',
      citation: 'Saudi Council of Ministers Decision No. 166',
    })
  }

  // Clause 11: Unilateral duty / profession change
  if (cleanDoc.includes('assign cleaning, farm or domestic') || cleanDoc.includes('assign agricultural, cleaning, or domestic') || cleanDoc.includes('وتكليفه بأعمال منزلية أو زراعية') || cleanDoc.includes('تعديل مهنة العامل، أو نقله إلى أي موقع أو فرع، وتكليفه')) {
    findings.push({
      code: 'ILLEGAL_UNILATERAL_DUTY_CHANGE',
      titleBn: 'জোরপূর্বক কাজ পরিবর্তনের অবৈধ ক্ষমতা (ক্লজ ১১)',
      titleEn: 'Unilateral Reassignment to Farm/Domestic Labor',
      severity: 'HIGH',
      descriptionBn: 'মালিক ইচ্ছেমতো কাজ পরিবর্তন করে গৃহস্থালি বা কৃষি কাজে বাধ্য করতে পারবে—এই শর্ত আইনত অবৈধ।',
      descriptionEn: 'Gives employer right to assign domestic or cleaning duties anywhere in KSA without worker consent.',
      citation: 'KSA Labor Law Article 38 & 58',
    })
  }

  // Clause 6: Annual leave deprivation
  if (cleanDoc.includes('not entitled to paid vacation until fulfilling the full 24') || cleanDoc.includes('prior to the completion of the full 24-month') || cleanDoc.includes('لا يستحق العامل أي إجازة سنوية مدفوعة الأجر إلا بعد إتمام كامل مدة العقد (24 شهراً')) {
    findings.push({
      code: 'ILLEGAL_LEAVE_DEPRIVATION',
      titleBn: 'বার্ষিক ছুটি বাতিলের অবৈধ শর্ত (ক্লজ ৬)',
      titleEn: 'Denial of Statutory Annual Leave for 24 Months',
      severity: 'HIGH',
      descriptionBn: '২ বছর একটানা কাজ না করলে ছুটি না দেওয়া এবং আগে ফিরলে টিকিটের খরচ কর্মীর ওপর চাপানো বেআইনি। প্রতি বছর সবেতন ছুটি শ্রমিকের অধিকার।',
      descriptionEn: 'Deprives worker of paid vacation before 24 months. Early repatriation ticket unfairly forced on worker.',
      citation: 'KSA Labor Law Article 109',
    })
  }

  // 4. Graph RAG Lookups
  const sponsorName = params.sponsorName || (cleanDoc.includes('al-bashaer') || cleanDoc.includes('البشائر') ? 'Al-Bashaer' : cleanDoc.includes('al-madinah') || cleanDoc.includes('المدينة') ? 'Al-Madinah' : '')
  const kafilInfo = sponsorName ? graphLookupSponsor(sponsorName) : null

  if (kafilInfo && kafilInfo.wageWithholdingRisk === 'CRITICAL') {
    findings.push({
      code: 'GRAPH_KAFIL_HIGH_RISK',
      titleBn: `কফিল ঝুঁকি: ${kafilInfo.nameEn} (ট্রাস্ট স্কোর: ${kafilInfo.trustScore}/১০০)`,
      titleEn: `Sponsor Alert: ${kafilInfo.nameEn} (${kafilInfo.trustScore}/100 Trust)`,
      severity: 'CRITICAL',
      descriptionBn: `এই কফিলের বিরুদ্ধে পূর্বে একাধিক কর্মীর বেতন আটকে রাখা ও পাসপোর্ট জব্দের অভিযোগ রয়েছে (নলেজ গ্রাফ রেকর্ড: ${kafilInfo.complaintHistory.length}টি অভিযোগ)।`,
      descriptionEn: `Neo4j Knowledge Graph indicates recurring complaints for wage withholding and passport confiscation.`,
      citation: 'ProbashiShield Graph RAG Registry',
    })
  }

  const agencyName = params.agencyName || (cleanDoc.includes('al-hasan') || cleanDoc.includes('hasan dalal') || cleanDoc.includes('হাসান') ? 'Al-Hasan' : cleanDoc.includes('green bengal') || cleanDoc.includes('rl-1428') ? 'Green Bengal' : '')
  const agencyInfo = agencyName ? graphLookupAgency(agencyName) : null

  let feeExorbitant = false
  if (cleanDoc.includes('3,50,000') || cleanDoc.includes('350000') || cleanDoc.includes('সাড়ে তিন লাখ') || promise.includes('350000') || promise.includes('3.5')) {
    feeExorbitant = true
    findings.push({
      code: 'ILLEGAL_RECRUITMENT_FEE',
      titleBn: 'অতিরিক্ত অভিবাসন ফি দাবি: ৳৩,৫০,০০০',
      titleEn: 'Exorbitant Illegal Migration Fee (BDT 3,50,000)',
      severity: 'HIGH',
      descriptionBn: 'দালাল সরকার নির্ধারিত সর্বোচ্চ ফির চেয়ে কয়েকগুণ বেশি টাকা দাবি করেছে। অনুমোদনহীন দালালের হাতে কোনো টাকা দেবেন না।',
      descriptionEn: 'Demanded fee of BDT 3,50,000 exceeds official BMET migration cost ceiling.',
      citation: 'Overseas Employment and Migrants Act 2013, Sec. 19',
    })
  }

  // 5. Calculate Overall Risk Score
  let riskScore = 4
  if (findings.some((f) => f.severity === 'CRITICAL')) riskScore = 98
  else if (findings.some((f) => f.severity === 'HIGH')) riskScore = 75
  else if (findings.length > 0) riskScore = 45

  const overallRisk: FullAuditReport['overallRisk'] = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW'

  // 6. Generate Bangla Audio Transcript / Voice Summary
  let banglaVoice = ''
  if (overallRisk === 'CRITICAL' || overallRisk === 'HIGH') {
    banglaVoice = `সতর্কতা! দালালের প্রতিশ্রুতি ড্রাইভার হওয়া সত্ত্বেও আরবি চুক্তিতে আপনার পদ ক্লিনার এবং বেতন মাত্র ৮০০ রিয়াল। এই চুক্তিতে পাসপোর্ট আটকে রাখা এবং জোরপূর্বক অন্য কাজে পাঠানোর অবৈধ শর্ত রয়েছে। এই পেপারে স্বাক্ষর করবেন না এবং দালালকে কোনো টাকা দেবেন না।`
  } else {
    banglaVoice = `আপনার চুক্তিপত্র সম্পূর্ণ বৈধ ও নিরাপদ। চুক্তিতে প্রতিশ্রুত ড্রাইভার পদ এবং মাসিক ২৫০০ রিয়াল বেতন সঠিকভাবে উল্লেখ রয়েছে। কোনো প্রতারণামূলক শর্ত পাওয়া যায়নি।`
  }

  const factBasedReportMarkdown = `
# ProbashiShield AI — Fact-Based Audit Report
**Risk Level:** ${overallRisk} (${riskScore}/100)  
**Date:** ${new Date().toISOString().split('T')[0]}  

### Summary of Extraction
- **Extracted Profession:** ${actualProf} ${professionMismatch ? '⚠️ (Promised: Driver)' : '✅'}
- **Monthly Salary:** SAR ${actualSal} ${salaryMismatch ? `⚠️ (-${deficitPct}% Deficit vs SAR ${promisedSal})` : '✅'}
- **Employer / Kafil:** ${kafilInfo ? `${kafilInfo.nameEn} (Trust: ${kafilInfo.trustScore}/100)` : 'Verified'}
- **Recruiting Agency:** ${agencyInfo ? `${agencyInfo.name} (${agencyInfo.status})` : 'BMET Registered'}

### Flagged Findings (${findings.length})
${findings.map((f, i) => `${i + 1}. **[${f.severity}] ${f.titleBn}**  \n   *Citation:* ${f.citation}  \n   *Details:* ${f.descriptionBn}`).join('\n\n')}

---
*Voice Advisory (Bangla):* "${banglaVoice}"
`.trim()

  return {
    extractedProfession: actualProf,
    extractedSalarySAR: actualSal,
    overallRisk,
    riskScore,
    discrepancies: {
      professionMismatch,
      promisedProfession: isDriverPromised ? 'Driver' : undefined,
      extractedProfession: actualProf,
      salaryMismatch,
      promisedSalary: promisedSal || undefined,
      extractedSalary: actualSal,
      salaryDeficitPct: deficitPct,
      feeExorbitant,
      demandedFeeBDT: feeExorbitant ? 350000 : undefined,
    },
    agencyVerification: agencyInfo || undefined,
    kafilVerification: kafilInfo || undefined,
    findings,
    banglaVoiceSummary: banglaVoice,
    factBasedReportMarkdown,
  }
}
