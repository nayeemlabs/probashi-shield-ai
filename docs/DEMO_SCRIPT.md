# ProbashiShield AI — Interactive Demo Walkthrough & Script

**Target Platform:** [probashi-shield.pages.dev](https://probashi-shield.pages.dev)  
**Target Audience:** Competition Judges, Labor Attachés, and Prospective Partners  
**Benchmark Suite:** [`demo-docs/`](file:///c:/Users/AI/Documents/CLYBo/demo-docs/) & [`tools/test-rag-audit.mjs`](file:///c:/Users/AI/Documents/CLYBo/tools/test-rag-audit.mjs)  

---

## 1. Demo Overview & Ground Truth Documents

The repository contains 6 realistic, production-grade test documents generated according to official bilateral Gulf migration standards:

| Doc # | Filename | Description & Planted Elements | Expected Outcome |
|---|---|---|---|
| **Doc 1** | `contract-fraudulent.html` | Saudi WPS Bilingual Contract with 7 planted frauds: Driver→Cleaner profession switch, 2,500→800 SAR wage suppression with whiteout tampering, 5 illegal clauses, extortionate fee. | **Risk Score: 98/100 (HIGH RISK)** · 5/5 statutory violations flagged |
| **Doc 2** | `contract-clean.html` | Compliant Control Contract: Private Driver, 2,200 SAR basic + 300 SAR food, full statutory compliance. | **Risk Score: 4/100 (LOW RISK)** · 0 false positives |
| **Doc 3** | `visa-mismatch.png` | Saudi MOFA Work Visa: Stamped with Enjaz code `911201` (Cleaner) directly contradicting broker promise. | **Risk Score: 95/100 (HIGH RISK)** |
| **Doc 4** | `broker-chat.html` | WhatsApp deception dialogue between worker Shafiqul and broker Hasan Dalal demanding ৳3,50,000 fee. | **Risk Score: 92/100 (HIGH RISK)** · Section 19/20 violation |
| **Doc 5** | `ecr-passport.html` | Bangladesh Passport bio-page with ECR clearance stamp and ICAO 9303 MRZ lines. | **Clearance Required** · BMET mandate |
| **Doc 6** | `agency-badges.html` | BMET 3-Tier Agency Registry: Green (RL-1428, 96/100), Red (Unregistered), Amber (RL-0892, 54/100). | **Verified Tiering** |

---

## 2. Live Demo Script (Step-by-Step)

### Step 1: Landing Page & Localization (`/`)
1. Navigate to [probashi-shield.pages.dev](https://probashi-shield.pages.dev).
2. Point out the bilingual toggle (Bangla / English) and dark/light mode switches.
3. Highlight key metrics: **1.2 Crore+ Migrants**, **3-Second Audit**, **24/7 Guardian**.
4. Click **"ফ্রি অডিট চালান" (Run Free Audit)** to enter the audit suite.

### Step 2: Pre-Departure Contract Audit (`/audit`)
1. Log in using Google OAuth or test credentials.
2. Under **"চুক্তির ছবি আপলোড করুন"**, choose `demo-docs/contract-fraudulent.html` (or a screenshot thereof).
3. **Show Forensic Heatmap (ELA):**
   - Point out the client-side Error Level Analysis rendering the whiteout tampering over the basic salary box where `2,500` was whited out to `800`.
   - Score indicates high tampering probability (>15%).
4. **Input Broker Verbal Promise:**
   - In the optional text field, enter: `"ড্রাইভারের কাজ, বেতন ২৫০০ রিয়াল"` (Driver job, 2,500 SAR salary).
5. Click **"ফ্রি অডিট চালান"**.

### Step 3: Triple-RAG Audit Results
Within 3 seconds, the audit report renders:
- **Risk Score Badge:** `98 / 100 (CRITICAL FRAUD DETECTED)`.
- **Discrepancy Matrix:**
  - *Profession:* Actual: **Cleaner (عامل نظافة)** vs. Promised: **Driver** (Violation of KSA Art 38).
  - *Salary:* Actual: **SAR 800** vs. Promised: **SAR 2,500** (-68% wage deficit).
  - *Sponsor Resolution (Graph RAG):* Al-Bashaer Trading Est. (Trust Score: 23/100, wage-withholding history).
  - *Agency Verification:* Hasan Dalal (Unregistered / Red Tier).
- **Statutory Legal Findings:**
  1. *Article 38:* Unlawful profession substitution.
  2. *Article 90 / WPS:* Discretionary deferred salary clause.
  3. *Article 109:* Unlawful 24-month leave ban.
  4. *Decision 166:* Illegal passport and Iqama confiscation clause.
  5. *Emigration Act 2013:* Illegal broker fee exceeding statutory ceiling.
- **Bangla Audio Playback:**
  - Click **"🔊 বাংলায় শুনুন (Voice)"**.
  - System plays the spoken advisory in natural Bangla: *"সাবধান! এই চুক্তিতে মারাত্মক প্রতারণা আছে..."*

### Step 4: Agency Verification Registry (`/agency`)
1. Open `/agency` to show the BMET agency intelligence lookup.
2. Demonstrate how Green-tier agencies build trust while Red-tier illicit brokers are exposed.

### Step 5: Family Tracking & Emergency Operations Center (`/family` & `/eoc`)
1. Open `/family` to display real-time check-in telemetry for migrant workers.
2. Open `/eoc` to show the embassy emergency rescue dashboard with GPS-locked rescue dossiers.

### Step 6: Super Admin & Real-Time R2 Telemetry (`/admin`)
1. Open `/admin` as administrator.
2. View live Cloudflare R2 bucket telemetry (`probashi-contracts`), showing stored contract objects, byte storage, and free-tier headroom.

---

## 3. Automated Benchmark Verification (Command Line)

To demonstrate reproducible test evidence for judges, run the automated test harness:

```powershell
node --experimental-strip-types tools/test-rag-audit.mjs
```

**Expected Output:**
```
▶ Test Suite 1: Contextual RAG Retrieval (Labor Law Articles)
  ✓ [PASS] Article 38 (Profession Mismatch) retrieved
  ✓ [PASS] Article 90 (WPS Unconditional Wages) retrieved
  ✓ [PASS] Article 109 (Annual Leave & Ticket) retrieved
  ✓ [PASS] Decision 166 (Passport Confiscation Ban) retrieved
  ✓ [PASS] Bangladesh Emigration Act 2013 retrieved

▶ Test Suite 4: Document 1 Audit (`contract-fraudulent.html`)
  ✓ [PASS] High risk score calculated (98/100)
  ✓ [PASS] Profession mismatch correctly flagged (Driver vs Cleaner)
  ✓ [PASS] Salary deficit correctly calculated (2,500 vs 800 SAR)
  ✓ [PASS] Passport confiscation clause detected (Decision 166)
  ✓ [PASS] Discretionary wage clause detected (Article 90)
  ✓ [PASS] Leave restriction clause detected (Article 109)
  ✓ [PASS] Sponsor identified as Al-Bashaer General Trading
  ✓ [PASS] Bangla voice summary generated

======================================================
 FINAL RESULTS: 50 PASSED, 0 FAILED
 ACCURACY RATE: 100.0%
======================================================
```
