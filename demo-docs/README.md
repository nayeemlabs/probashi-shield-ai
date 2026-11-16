# ProbashiShield AI — Demo Documents Suite
**Authentic Gulf-Migration Contract & Visa Test Set**  
Generated for: **ProbashiShield AI (প্রবাসীশিল্ড)** Pre-Departure Verification & Audit Demos

---

## Overview

This directory (`demo-docs/`) contains print-ready, high-fidelity mock migration documents designed to test and demonstrate the multimodal audit capabilities of **ProbashiShield AI**.

The documents represent a typical Bangladesh-to-Saudi Arabia labor migration workflow, featuring:
- Official Gulf labor contract layouts (Saudi Ministry of Human Resources / Qiwa / WPS platform)
- Full Arabic RTL typography with correct ligature shaping and legal terminology
- Authentic government stamps, QR codes, Enjaz barcodes, and biometric signatures
- Planted fraud patterns designed to deceive quick human inspection but trigger multimodal AI flags

---

## File Catalog

| File | Type | Description | Primary Audit Focus |
|---|---|---|---|
| [`contract-fraudulent.html`](./contract-fraudulent.html) | HTML / Print-to-PDF | **THE KEY DEMO DOC** — Saudi WPS Contract with 5 planted frauds | Profession downgrade, wage cut, illegal clauses, white-out tampering |
| [`contract-clean.html`](./contract-clean.html) | HTML / Print-to-PDF | **Control Case** — 100% compliant Saudi labor contract | Zero false positives test |
| [`visa-mismatch.png`](./visa-mismatch.png) | High-Res PNG (1200x900) | Saudi MOFA Work Visa vs WhatsApp Broker Commitment | Visual proof of Driver promise vs Cleaner visa |
| [`visa-mismatch.html`](./visa-mismatch.html) | HTML / Companion | Interactive split-view comparison of visa vs broker chat | High-DPI browser presentation & export |
| [`broker-chat.html`](./broker-chat.html) | HTML / Mobile Mockup | WhatsApp chat between Broker Hasan Dalal and Migrant Shafiq | Predatory bait-and-switch deception & illegal fee extortion |
| [`ecr-passport.html`](./ecr-passport.html) | HTML / Passport Mockup | Bangladesh Passport Bio Page with ECR Stamp & ICAO MRZ | Biometric & emigration clearance verification |
| [`agency-badges.html`](./agency-badges.html) | HTML / Registry Dashboard | BMET Agency Verification Portal with Green, Red, Amber profiles | Graph RAG license & kafil complaint history lookup |
| [`GROUND_TRUTH.md`](./GROUND_TRUTH.md) | Markdown | Comprehensive benchmark reference & expected JSON output | Automated evaluation & AI accuracy scoring |

---

## Planted Fraud Details in Document 1 (`contract-fraudulent.html`)

Document 1 is crafted to look completely authentic to a semi-literate migrant worker or rushed immigration officer, but contains severe planted violations:

1. **Profession Downgrade (Bait-and-Switch):**
   - Promised: Private Driver (`سائق خاص`)
   - Documented: Cleaner / General Laborer (`عامل نظافة / خدمات عامة`, Code: `911201`)
   - Violation: KSA Labor Law Art. 38

2. **Severe Wage Suppression & Physical Tampering:**
   - Promised: SAR 2,500 / month
   - Documented: SAR 800.00 / month (-68% suppression)
   - Forensic Feature: Visible white-out correction patch over the salary field where "2,500" was taped over and over-typed with "800.00"

3. **Discretionary Wage Payment Clause (Clause 4):**
   - Text: Payment via bank or deferred as per employer cash flow discretion
   - Violation: KSA Labor Law Art. 90 (WPS mandates unconditional monthly bank transfer)

4. **Statutory Annual Leave Deprivation (Clause 6):**
   - Text: No paid annual leave until completion of full 24 months; worker pays early repatriation ticket
   - Violation: KSA Labor Law Art. 109

5. **Illegal Passport Confiscation Clause (Clause 8):**
   - Text: Employee must surrender original passport and Iqama to employer custody
   - Violation: Saudi Council of Ministers Decision No. 166

6. **Unilateral Reassignment Clause (Clause 11):**
   - Text: Employer reserves right to transfer worker to domestic, agricultural, or cleaning duties anywhere in KSA without consent
   - Violation: KSA Labor Law Art. 38 & 58

7. **Unregistered Broker & Exorbitant Fee Note:**
   - Text: Al-Hasan Overseas & Travels (Hasan Dalal), Fee: BDT 3,50,000 paid in advance
   - Violation: Bangladesh Overseas Employment and Migrants Act 2013

---

## How to Run & Test in ProbashiShield AI

### Method 1: Using the Web App UI (`/audit`)
1. Start the web application:
   ```bash
   cd web
   npm.cmd run dev
   ```
2. Navigate to `http://localhost:5173/audit` in your browser.
3. Upload `visa-mismatch.png` or an exported screenshot of `contract-fraudulent.html`.
4. Enter the broker's promise in the prompt input:
   ```
   Driver job, 2500 SAR monthly salary
   ```
5. Click **"Analyze Contract"**:
   - The multimodal AI (Gemini 2.5 Flash / Groq Llama-4) will extract Arabic/English fields.
   - The system flags the profession mismatch (Cleaner vs Driver) and salary suppression (800 SAR vs 2,500 SAR).
   - Listen to the generated Bangla voice summary:
     > *"সতর্কতা! দালালের প্রতিশ্রুতি ড্রাইভার হওয়া সত্ত্বেও আরবি কন্ট্রাক্টে আপনার পদ ক্লিনার এবং বেতন মাত্র ৮০০ রিয়াল..."*

### Method 2: Testing Document 2 (`contract-clean.html`) for Zero False Positives
1. Upload `contract-clean.html` (or screenshot).
2. Enter the promise: `Driver, 2500 SAR`.
3. AI returns **LOW RISK** with zero flagged clauses, verifying no false alarms.

---

## Print to PDF / High-DPI Export

All HTML files are styled with `@media print` rules for clean, border-accurate export:
1. Open any HTML document in Chrome or Edge:
   - `demo-docs/contract-fraudulent.html`
   - `demo-docs/contract-clean.html`
   - `demo-docs/ecr-passport.html`
   - `demo-docs/broker-chat.html`
   - `demo-docs/agency-badges.html`
2. Press `Ctrl + P` (Print).
3. Set destination to **"Save as PDF"**, Paper size: **A4**, Margins: **None**, and enable **"Background graphics"**.
4. The output produces an authentic, crisp government document ready for physical presentation or offline demo evaluation.
