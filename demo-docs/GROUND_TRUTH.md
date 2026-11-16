# GROUND TRUTH AUDIT BENCHMARK — ProbashiShield AI
**Benchmark Version:** 1.0.0  
**Target Platform:** ProbashiShield AI Pre-Departure Audit Engine (Gemini 2.5 Flash / Groq Llama-4 / Graph RAG)  
**Corridor:** Bangladesh ➔ Kingdom of Saudi Arabia (KSA)  
**Worker Identity:** Shafiqul Islam (Passport: `EG0849216`, NID: `19932694582001429`)  

---

## 1. Summary Matrix

| Doc # | Filename | Doc Type | Stated / Promised Job | Actual Document Job | Stated Salary | Actual Salary | Legal Violations | Expected Risk Level |
|---|---|---|---|---|---|---|---|---|
| **Doc 1** | `contract-fraudulent.html` | Saudi WPS Employment Contract | Driver (`سائق خاص`) | Cleaner (`عامل نظافة`) | SAR 2,500 | SAR 800 | 5 Flagged Clauses + Tampering | **HIGH RISK (98/100)** |
| **Doc 2** | `contract-clean.html` | Saudi WPS Employment Contract | Driver (`سائق`) | Driver (`سائق`) | SAR 2,500 | SAR 2,200 + 300 | 0 Violations (Statutory Compliant) | **LOW RISK (4/100)** |
| **Doc 3** | `visa-mismatch.png` | Saudi MOFA Work Visa vs Chat | Driver (`সائق`) | Cleaner (`عامل نظافة`) | SAR 2,500 | - | Enjaz Code Mismatch vs Chat | **HIGH RISK (95/100)** |
| **Doc 4** | `broker-chat.html` | WhatsApp Chat Log | Driver | - | SAR 2,500 | - | Extortionate Fee (Tk 3.5L) + Fraud | **HIGH RISK (92/100)** |
| **Doc 5** | `ecr-passport.html` | Bangladesh Passport Bio Page | - | - | - | - | ECR Stamp Present (BMET Mandate) | **CLEARANCE REQUIRED** |
| **Doc 6** | `agency-badges.html` | BMET Agency Verification Registry | - | - | - | - | 1 Green (RL-1428), 1 Red (Unreg), 1 Amber (RL-0892) | **SPLIT (Green / Red / Amber)** |

---

## 2. Document 1: `contract-fraudulent.html` (The Core Demo Target)

### Document Metadata
- **Contract ID:** `KSA-WPS-2026-9482103`
- **Sponsor / Kafil:** Al-Bashaer General Trading & Contracting Est. (CR: `1010729381`, Unified: `7001948215`)
- **Representative:** Tariq Abdulaziz Al-Otaibi
- **Worker:** Shafiqul Islam (Bangladeshi, Passport: `EG0849216`)
- **Promised Terms (Verbal/Broker):** Private Driver, Monthly Salary: SAR 2,500

### Expected AI Extraction Findings (Must Catch 5/5 Planted Frauds)

#### Finding 1: Critical Profession Mismatch (Bait-and-Switch)
- **Severity:** 🔴 **CRITICAL**
- **Promised Occupation:** Private Driver (`سائق خاص`)
- **Actual Extracted Profession:** Cleaner / Laborer (`عامل نظافة / خدمات عامة`, Code: `911201`)
- **Legal Violation:** KSA Labor Law Article 38 (Employer may not employ worker in profession other than that stated in contract/work license)
- **Impact:** Worker will be assigned menial janitorial/domestic chores, ineligible for Saudi driver license conversion.

#### Finding 2: Severe Wage Suppression & Physical Tampering
- **Severity:** 🔴 **CRITICAL**
- **Promised Monthly Salary:** SAR 2,500 / month
- **Contract Basic Salary:** SAR 800.00 / month (Eight Hundred Saudi Riyals)
- **Wage Deficit:** -SAR 1,700 / month (-68.0% suppression)
- **Visual Tampering:** White-out correction over the basic salary box where original "2,500" was whited out and over-typed with "800.00".
- **Legal Violation:** Violation of minimum bilateral wage standards; unconscionable wage suppression.

#### Finding 3: Discretionary Wage Payment Clause
- **Severity:** 🔴 **HIGH**
- **Contract Clause:** Clause 4 (`دفع الأجور`) — *"Wages shall be disbursed via WPS bank transfer, in cash, or deferred at the sole discretion of the Employer based on enterprise cashflow availability."*
- **Legal Violation:** KSA Labor Law Article 90 & Wage Protection System (WPS) regulations. Monthly electronic bank transfer is unconditional; employer discretion or deferred payment is strictly unlawful.

#### Finding 4: Denial of Statutory Annual Leave
- **Severity:** 🔴 **HIGH**
- **Contract Clause:** Clause 6 (`الإجازات وتذاكر السفر`) — *"Employee is not entitled to paid vacation until fulfilling the full 24 months. Early departure airfares are fully payable by Employee without indemnity."*
- **Legal Violation:** KSA Labor Law Article 109. Expatriate workers are entitled to a minimum of 21-30 days fully paid leave per year of service, with round-trip economy airfare provided upon completion of each contract cycle.

#### Finding 5: Unlawful Passport & Iqama Confiscation
- **Severity:** 🔴 **CRITICAL**
- **Contract Clause:** Clause 8 (`حفظ الوثائق الثبوتية`) — *"Employee agrees to surrender their original passport and residency (Iqama) card to Employer custody for the entire contract duration."*
- **Legal Violation:** Saudi Council of Ministers Decision No. 166 & Royal Decree M/51. Confiscation or retention of worker passports is a penal offense carrying mandatory fines up to SAR 20,000 per violation.

#### Finding 6: Unilateral Reassignment to Domestic / Agricultural Duties
- **Severity:** 🔴 **HIGH**
- **Contract Clause:** Clause 11 (`تعديل المهنة ونوع العمل`) — *"Employer reserves the absolute right to alter the Employee's designated profession, transfer worksites, or assign cleaning, farm, or domestic chores anywhere in KSA without worker written consent."*
- **Legal Violation:** KSA Labor Law Article 58 & 60. Substantial alteration of job scope or non-consensual transfer to another category (domestic/farm labor) is void.

#### Finding 7: Unregistered Broker & Illegal Recruitment Surcharge
- **Severity:** 🔴 **HIGH**
- **Agency Listed:** Al-Hasan Overseas & Travels (Nayapaltan / Cumilla) — Broker: Hasan Dalal (`+880 1712-984531`)
- **BMET Registration:** Not registered / License absent
- **Recruitment Fee Demanded:** BDT 3,50,000 (Three Lakh Fifty Thousand Taka)
- **Legal Violation:** Bangladesh Overseas Employment and Migrants Act 2013, Section 19 & 20 (Illegal recruitment fees exceeding government ceiling; unauthorized intermediary broker fee extraction).

### Expected Automated Risk Assessment Output
```json
{
  "contractId": "KSA-WPS-2026-9482103",
  "overallRisk": "HIGH",
  "riskScore": 98,
  "profession": {
    "extracted": "Cleaner (عامل نظافة)",
    "promised": "Driver (سائق)",
    "mismatch": true
  },
  "salary": {
    "currency": "SAR",
    "extractedMonthly": 800,
    "promisedMonthly": 2500,
    "deficitPercent": 68.0,
    "tamperingDetected": true
  },
  "flaggedClauses": [
    { "clause": 4, "type": "discretionary_payment", "violation": "KSA Labor Law Art. 90" },
    { "clause": 6, "type": "leave_deprivation", "violation": "KSA Labor Law Art. 109" },
    { "clause": 8, "type": "passport_retention", "violation": "Cabinet Decision 166" },
    { "clause": 11, "type": "unilateral_reassignment", "violation": "KSA Labor Law Art. 38/58" }
  ],
  "agency": {
    "name": "Al-Hasan Overseas & Travels",
    "bmetStatus": "UNREGISTERED",
    "recruitmentFeeBDT": 350000,
    "feeExorbitant": true
  },
  "banglaVoiceSummary": "সতর্কতা! দালালের প্রতিশ্রুতি ড্রাইভার হওয়া সত্ত্বেও আরবি কন্ট্রাক্টে আপনার পদ ক্লিনার (عامل نظافة) এবং বেতন মাত্র ৮০০ রিয়াল। এই চুক্তিতে পাসপোর্ট আটকে রাখা এবং জোরপূর্বক অন্য কাজে পাঠানোর অবৈধ শর্ত রয়েছে। এই পেপারে স্বাক্ষর করবেন না।"
}
```

---

## 3. Document 2: `contract-clean.html` (Control Benchmark)

### Document Metadata
- **Contract ID:** `KSA-WPS-2026-1184920`
- **Sponsor / Kafil:** Al-Madinah Logistics & Transport Co. (CR: `1010349821`, Unified: `7003498210`)
- **Worker:** Shafiqul Islam (Bangladeshi, Passport: `EG0849216`)
- **Recruiting Agency:** Green Bengal Overseas (BMET License `RL-1428`)

### Expected AI Extraction Findings (Must Pass with Zero False Positives)

#### Verified Terms
1. **Profession:** Commercial Transport Driver (`سائق نقل تجاري / سائق خاص`, Code: `833202`) — **Matches Verbal Commitment 100%**.
2. **Salary:** SAR 2,200 (Basic) + SAR 300 (Food Allowance) = SAR 2,500 Gross Monthly — **Matches Promised Package 100%**.
3. **WPS Wage Compliance:** Explicitly bound to electronic bank transfer on the 1st of each calendar month per Article 90.
4. **Leave:** 30 days paid annual vacation with round-trip economy airfare per Article 109.
5. **Passport Custody:** Explicitly protected in worker's personal possession per Council of Ministers Resolution 166.
6. **Duties Protection:** Profession cannot be changed without mutual written agreement and Qiwa filing.
7. **Agency Fee:** BMET statutory fee structure, zero illegal surcharges.

### Expected Automated Risk Assessment Output
```json
{
  "contractId": "KSA-WPS-2026-1184920",
  "overallRisk": "LOW",
  "riskScore": 4,
  "profession": {
    "extracted": "Driver (سائق)",
    "promised": "Driver (سائق)",
    "mismatch": false
  },
  "salary": {
    "currency": "SAR",
    "extractedMonthly": 2500,
    "promisedMonthly": 2500,
    "deficitPercent": 0.0,
    "tamperingDetected": false
  },
  "flaggedClauses": [],
  "agency": {
    "name": "Green Bengal Overseas",
    "bmetStatus": "VERIFIED_ACTIVE",
    "licenseNo": "RL-1428",
    "feeExorbitant": false
  },
  "banglaVoiceSummary": "আপনার চুক্তিপত্র সম্পূর্ণ বৈধ ও নিরাপদ। চুক্তিতে প্রতিশ্রুত ড্রাইভার পদ এবং মাসিক ২৫০০ রিয়াল বেতন সঠিকভাবে উল্লেখ রয়েছে। কোনো প্রতারণামূলক শর্ত পাওয়া যায়নি।"
}
```

---

## 4. Document 3: `visa-mismatch.png` (Visual Discrepancy Evidence)

### Expected AI Findings
- **Enjaz Visa Number:** `1304928174`
- **Passport Number:** `EG0849216`
- **Sponsor:** Al-Bashaer Trading Est.
- **Printed MOFA Visa Profession:** `عامل نظافة` (Cleaner / Laborer)
- **Broker Chat Evidence:** Explicit promise of Private Driver (SAR 2,500)
- **Flagged Discrepancy:** High-risk occupational downgrade (Worker will be denied a Saudi private driving license upon arrival).

---

## 5. Document 4: `broker-chat.html` (WhatsApp Chat Audit)

### Expected AI Findings
- **Sender:** Hasan Dalal (`+880 1712-984531`)
- **Key Fraud Tactics Extracted:**
  1. Promises "VIP Private Driver" at SAR 2,500/mo.
  2. Demands Tk 3,50,000 migration fee (Tk 1.5 Lakh advance).
  3. Fraudulent justification: Dismisses "Cleaner" Arabic contract term as a "mere tax formality" and falsely guarantees car keys at airport.
  4. High-pressure sales deadline ("Pay within 12 hours or visa will be assigned to someone else").

---

## 6. Document 5: `ecr-passport.html` (Bio Page & ECR Audit)

### Expected AI Findings
- **Document Type:** Bangladesh Machine Readable Passport (MRP)
- **Passport No:** `EG0849216`
- **Holder Name:** SHAFIQUL ISLAM
- **Date of Birth:** 14 MAR 1993
- **ECR Status:** **ECR Stamp Active (Emigration Check Required)**
- **System Action:** Worker must obtain BMET Smart Card Clearance before airport departure. Unregistered brokers cannot lawfully process this passport.

---

## 7. Document 6: `agency-badges.html` (Knowledge Graph Evaluation)

### Expected Registry Lookup Outputs
1. **Green Bengal Overseas (RL-1428):**
   - Trust Score: `96/100` (Grade A+)
   - Status: Active, Compliant, Recommended.
2. **Al-Hasan Overseas & Travels (Broker Hasan Dalal):**
   - Trust Score: `12/100` (Critical Risk)
   - Status: Unlicensed Broker, 14 active fraud complaints.
   - Action: Block transactions, report to BMET hotline `16135`.
3. **Gulf Horizon Manpower Services (RL-0892):**
   - Trust Score: `54/100` (Moderate Risk)
   - Status: Under Investigation (19 complaints, 4 delayed-wage kafeels).

---

## 8. Evaluation Metric Equations for Judges / Test Runner

$$\text{Precision} = \frac{\text{True Frauds Detected}}{\text{Total Frauds Flagged}} = \frac{5}{5} = 100\%$$

$$\text{Recall} = \frac{\text{True Frauds Detected}}{\text{Total Planted Frauds}} = \frac{5}{5} = 100\%$$

$$\text{False Positive Rate (Doc 2)} = \frac{0}{1} = 0.0\%$$
