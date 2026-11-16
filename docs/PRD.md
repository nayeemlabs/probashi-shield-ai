# ProbashiShield AI — Product Requirements Document (PRD)

**Competition:** International AI Builders Congress 2026, CloudCamp BD  
**Track:** Idea to Unicorn (I2U)  
**Domain:** CivicSphere & FinSphere AI  
**Version:** 2.0 — Production MVP & Benchmark Complete  
**Status:** **Live in Production & 100% Tested**  
**Live Application:** [probashi-shield.pages.dev](https://probashi-shield.pages.dev)  
**API Endpoint:** [probashi-api.probashishield.workers.dev](https://probashi-api.probashishield.workers.dev)  
**GitHub Repository:** [github.com/nayeemlabs/probashi-shield-ai](https://github.com/nayeemlabs/probashi-shield-ai)  

---

## 1. Executive Summary & One-Liner

**ProbashiShield AI** is an autonomous AI legal guardian and crisis-response network for ~1.2 crore (12M+) Bangladeshi migrant workers. It detects contract fraud and wage suppression before departure via a browser-native Triple-RAG audit engine, and stands by as a 24/7 digital guardian post-arrival.

### 1.1 The Problem (The Vibe)
- **Scale:** 11–12 lakh Bangladeshis migrate annually (primarily to Saudi Arabia, UAE, Qatar, Oman, and Malaysia), spending over ৳50,000 crore ($4.5B+) per year on migration expenses.
- **Deception & Fraud:** Over 60% of migrant workers report being cheated by middlemen (dalals). A worker verbally promised a "Private Driver" role at 2,500 SAR/month frequently lands in the Gulf to find their official Arabic contract specifies "Cleaner" at 800 SAR/month.
- **Information Asymmetry:** Most migrant workers are semi-literate in legal Arabic and English. No accessible, automated tool existed to audit contracts before signing.
- **Post-Departure Blindness:** Once workers clear airport immigration, families and embassies have zero real-time telemetry on their safety, living conditions, or wage payments until a crisis erupts weeks or months later.

### 1.2 Product Boundary (What We Are vs. What We Are Not)

| We ARE | We are NOT |
|---|---|
| An autonomous verification, welfare-telemetry, and crisis-response software platform | A recruitment or travel agency |
| A diagnostic/audit tool producing fact-based reports with legal citations | A visa processor, passport issuer, or law firm |
| A voice-first, Bangla-first platform running on any smartphone | A heavy native app requiring large downloads |

> **Legal Positioning:** ProbashiShield operates analogously to a medical diagnostic laboratory: it issues a **Fact-Based Audit Report** with statutory legal citations (KSA Labor Law, Bangladesh Emigration Act 2013) and database reference checks. The migrant uses this verified evidence to confront fraudulent brokers before departure.

---

## 2. Team Structure & Pre-Judgment Eligibility (+7 Points)

The ProbashiShield team represents a cross-functional mix of physical and virtual collaborators spanning engineering, design, growth, video, and on-ground domain expertise:

| Member | Role | Mode | Diversity / Bonus |
|---|---|---|---|
| **Jannatul Nayeem** | Team Lead | Physical (In-person) 🇧🇩 | Core Leadership |
| **Sanzida Rahman** | Product / UX Designer | Virtual (Online) 🇧🇩 | **Female Member (+1)** |
| **Abdul Awal Ibn Rafi** | Full-Stack Developer | Physical (In-person) 🇧🇩 | Engineering Lead |
| **Omar Faruk Sajid** | SEO & Growth Strategist | Virtual (Online) 🇧🇩 | Distribution & Search |
| **Abu Bakr Siddiq** | Jr. Video Editor & Designer | Physical (In-person) 🇧🇩 | Visuals & Media Production |
| **Rakibul Islam** | Domain Expert (Saudi Arabia) | Virtual (Online) 🇸🇦 | **NRB Member (+1)** |

**Pre-Judgment Scoring Bonus:**
- Team Size: 6 members (Cap 5 pts) → **+5 pts**
- NRB Member Bonus: Rakibul Islam (KSA) → **+1 pt**
- Female Member Bonus: Sanzida Rahman → **+1 pt**
- **Total Eligibility Bonus:** **+7 pts**

---

## 3. Core Implemented Features (Production Reality)

### Feature 1: Pre-Departure Contract & Visa Audit (Live at `/audit`)
- **Multimodal Ingest:** Worker uploads photo or PDF of Gulf contract / visa.
- **Browser-Native ELA Forensics (Error Level Analysis):** Re-compresses JPEG via HTML5 Canvas at q0.9, computes per-pixel differential matrix, and renders an amplified heatmap highlighting whiteouts, altered numbers, and spliced stamps with an ELA tampering score.
- **Client-Side OCR (Tesseract.js):** Arabic (`ara`) and English (`eng`) text extracted locally in the browser with dedicated vendor chunk isolation.
- **Broker Promise Comparator:** Worker declares broker's verbal promise (e.g. "Driver, 2,500 SAR"); system computes exact wage deficit percentage and flags profession bait-and-switch.
- **Triple-RAG Engine (`web/src/lib/rag.ts`):**
  1. *Contextual RAG:* Searches statutory corpus of Gulf labor laws (KSA Labor Law Articles 38, 58, 90 WPS, 109, Decision 166, BD Emigration Act 2013).
  2. *Graph RAG:* Resolves sponsor / kafil and recruiting agency against in-memory knowledge graphs with trust scores (0–100) and historical wage-default complaints.
  3. *Discrepancy Engine:* Generates structured findings, overall risk score (0–100), and categorical risk rating (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Bangla Voice Summary:** Web Speech API synthesizes an actionable, dialect-aware spoken summary for low-literacy workers.

### Feature 2: 3-Tier Agency & Sponsor Verification (Live at `/agency`)
- Verification registry classifying agencies into 3 distinct tiers:
  - **Green Tier (RL-1428):** Valid BMET license, compliant contracts, 96/100 trust score.
  - **Red Tier (Unregistered):** Illicit middlemen, no recruiting license, severe extortion history.
  - **Amber Tier (RL-0892):** Under BMET regulatory surveillance, high dispute ratio.

### Feature 3: Family Telemetry & Status Tracker (Live at `/family`)
- Family-facing dashboard connected to Firebase Firestore tracking loved ones abroad, showing last monthly check-in dates, wage receipts, and status indicators (`সব ঠিক আছে`, `খোঁজ দরকার`, `জরুরি`).

### Feature 4: Emergency Operations Center / SOS Dashboard (Live at `/eoc`)
- Crisis-response interface for embassies and welfare cells:
  - Incident severity rating (0–100).
  - One-click rescue dossier generation with worker passport, sponsor CR, GPS location, and Arabic contract evidence.

### Feature 5: Super Admin & Storage Analytics (Live at `/admin`)
- Real-time Cloudflare R2 bucket telemetry (`probashi-contracts`), tracking total stored objects, gigabytes consumed, and remaining free-tier capacity.

---

## 4. AI & Engineering Stack

| Layer | Implemented Technology | Production Function |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS v4 | Deployed to Cloudflare Pages (Global CDN) |
| **Serverless API** | Cloudflare Workers (`probashi-api`) | TypeScript handler, sub-millisecond cold start |
| **Object Storage** | Cloudflare R2 (`probashi-contracts`) | S3-compatible private document storage with 0 egress fees |
| **Database & Auth** | Firebase Authentication + Cloud Firestore | RS256 token verification, real-time sync |
| **Primary Vision AI** | Google Gemini 2.5 Flash | Multimodal Arabic/English document parsing & structured extraction |
| **Secondary Vision AI**| Groq Llama-4 Scout 17B | Ultra-fast secondary fallback via OpenAI-compatible endpoint |
| **Edge AI Fallback** | Cloudflare Workers AI (`@cf/llava-hf/llava-1.5-7b-hf`) | Free zero-cost vision AI fallback |
| **Client Forensics** | HTML5 Canvas Error Level Analysis (ELA) | Whiteout & digital photo forgery detection |
| **Client OCR** | Tesseract.js (`ara` + `eng`) | In-browser text extraction feeding AI prompts |
| **RAG Knowledge Base**| TypeScript Triple-RAG (`web/src/lib/rag.ts`) | Contextual RAG + Graph RAG + Discrepancy Engine |
| **Voice Output** | Web Speech API (`SpeechSynthesis`) | Dialect-aware Bangla audio playback |

---

## 5. Verification & Benchmark Results (100% Accuracy)

A comprehensive ground-truth test suite (`tools/test-rag-audit.mjs`) validates the entire RAG pipeline across 6 realistic demo documents:

```
======================================================
 FINAL RESULTS: 50 PASSED, 0 FAILED
 ACCURACY RATE: 100.0%
======================================================
```

- **Doc 1 (`contract-fraudulent.html`):** Correctly flags all 7 planted frauds (Driver→Cleaner, 2500→800 SAR, whiteout, 5 illegal clauses). Risk score: **98/100 (HIGH RISK)**.
- **Doc 2 (`contract-clean.html`):** Correctly assesses compliant control contract. Zero false positives. Risk score: **4/100 (LOW RISK)**.
- **Doc 3 (`visa-mismatch.png`):** Detects Enjaz profession mismatch vs. broker claim.
- **Doc 4 (`broker-chat.html`):** Flags illegal broker fee (৳৩.৫ লাখ) exceeding government ceiling.
- **Doc 5 (`ecr-passport.html`):** Verifies ICAO 9303 MRZ, holder name, and ECR stamp mandate.
- **Doc 6 (`agency-badges.html`):** Successfully validates BMET 3-tier profiles.

---

## 6. Business Model & Unicorn Economics

| Stream | Model | Projected Year-1 Economics |
|---|---|---|
| **B2B2C Bank Bounty** | ৳300–500 per verified bank / MFS remittance account opened (BRAC Bank, Islami Bank, bKash) | 200,000 accounts → **৳6–10 Crore** |
| **B2C Micro-Payment** | Free quick scan; ৳299 for full bilingual audit report + downloadable audio advisory via bKash/Nagad | 100,000 audits → **৳3–4 Crore** |
| **B2B Agency SaaS** | Monthly subscription (৳15,000–40,000/mo) for bulk contract verification and BMET Trust Badges | 200 agencies → **৳3.6–9.6 Crore** |
| **Unit Economics** | AI API cost: ~৳0.04/audit (Gemini 2.5 Flash token rates) + free Cloudflare/Firebase tiers | **>99% Gross Margin** · Day-1 Cash Flow Positive |

---

## 7. Roadmap & Next Steps

- **Current (Phase 0 — Complete):** Live web platform, Cloudflare Worker API, Triple-RAG engine, 100% test benchmark, 180s pitch assets.
- **Phase 1 (Q2 2026):** WhatsApp Business Cloud API integration for direct zero-install chat interactions.
- **Phase 2 (Q3 2026):** Expansion to additional labor-sending corridors: Nepal (Nepali), India (Hindi/Tamil), and Philippines (Tagalog).
- **Phase 3 (Q4 2026):** Institutional API licensing for BMET, Ministry of Foreign Affairs (MoFA), and commercial remittance banks.
