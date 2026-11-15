# ProbashiShield AI, Product Requirements Document (PRD)

**Competition:** International AI Builders Congress 2026, CloudCamp BD
**Track:** Idea to Unicorn (I2U)
**Domain:** CivicSphere & FinSphere AI
**Version:** 1.0, Draft for Submission
**Status:** Pre-build / Concept Validation

---

## 1. Product Overview

### 1.1 One-liner
ProbashiShield AI is the 24/7 autonomous AI guardian and crisis-response network for ~1.2 crore Bangladeshi migrant workers, catching contract fraud before departure and standing by as a digital life-guardian after arrival.

### 1.2 Problem Statement

- **Scale of migration:** 11-12 lakh Bangladeshis migrate annually (mostly to the Gulf & Malaysia), spending ~৳50,000 crore (~$4.5B) per year on migration.
- **Fraud prevalence:** Over 60% of migrants report being cheated by brokers (dalals). Promised "driver job at 2,500 SAR" becomes "cleaner at 800 SAR, food & lodging deducted" on the actual Arabic contract.
- **Information asymmetry:** Most migrants are semi-literate and cannot read Arabic or English contracts; no tool exists to verify them.
- **Post-departure blindness:** After clearing the airport, neither the family nor the government has real-time telemetry on whether the worker is alive, paid, or in danger. Rescue today is reactive, driven by word-of-mouth reaching Dhaka weeks later.

### 1.3 Product Boundary (What We Are / Are Not)

| We ARE | We are NOT |
|---|---|
| An autonomous verification, welfare-telemetry, and crisis-response software platform | A travel or recruiting agency |
| A diagnostic/audit tool that produces fact-based reports | A visa processor, passport issuer, or migration facilitator |
| A WhatsApp-native guardian that talks to migrants in Bangla | A smartphone app requiring installation |

> Legal positioning (mirrors a diagnostic lab, not a law firm): we issue **fact-based audit reports** with live government-database references and cited labor-law clauses, not legal certificates or court verdicts. The migrant uses the report as evidence against the broker.

---

## 2. Target Users & Personas

| Persona | Context | Primary Need |
|---|---|---|
| **Prospective migrant (pre-departure)** | Semi-literate, WhatsApp-only, about to pay a dalal | "Is this contract/job/visa real? Explain it in Bangla before I sign." |
| **Family member in Bangladesh** | Wants assurance worker is safe & paid | Monthly check-in answers, SOS alerts |
| **Migrant worker abroad (in-destination)** | Gulf/Malaysia, low connectivity, low literacy | Zero-install WhatsApp guardian; SOS in panic |
| **Bangladesh Embassy / Welfare cell (EOC)** | Needs actionable rescue dossiers, not anecdotes | Structured incident packets with GPS, documents, kafil history |
| **Ethical recruiting agencies** | Want to differentiate from fraudulent competitors | Bulk contract audit + "Verified Trust Badge" |
| **Banks / MFIs (BRAC Bank, Islami Bank, bKash partners)** | Want verified, remittance-ready customer acquisition | API/lead feed of visa-verified migrants for account opening |

---

## 3. Core Feature Architecture

### Feature 1, Multimodal Visa & Contract Audit (Pre-Departure Scanner)

- **Input:** Photo/PDF of Arabic/English contract + visa, sent via WhatsApp image message.
- **Processing (≤3s target):** Multimodal LLM extracts profession, salary, overtime, food/lodging clauses, and flags up to 5 critical hidden clauses (passport confiscation, exit bans, contract substitution risk, etc.).
- **Output:**
  - ~2-minute plain-Bangla audio summary (Edge TTS / Whisper pipeline).
  - One-page color-coded **Fact-Based Audit Report** (PDF/WhatsApp card) listing discrepancies vs. the broker's verbal promise.
- **Verification layer:** Sponsor/agency RL number checked against BMET database; visa existence checked against sponsor-country government portals (MoFA KSA / Malaysia eVISA) via custom MCP connectors.

### Feature 2, Sponsor & Agency Real-Time Verification (Legitimacy Engine)

- **Agency check:** BMET license status (valid / blacklisted / expired).
- **Sponsor check:** Kafil/company name resolved against destination-country registries; historical wage-default / complaint history pulled from Graph-RAG knowledge graph (agency → kafil → complaint records).
- **Output:** Trust score (0-100) attached to the audit report.

### Feature 3, WhatsApp "Digital Lifeline" & Routine Check-Ins (In-Destination Telemetry)

- **Zero-install:** Works inside WhatsApp/IMO, no app download.
- **Monthly ritual:** On scheduled days, the AI checks in in warm, personal Bangla: *"Kemon achen Shafik vai? Company ki ei mash er baten thik moto diyeche?"*
- **Passive telemetry:** Audio replies are transcribed (Whisper Large v3, Bangla-tuned) and mined for welfare signals (location changes, unpaid wages, illness, distress keywords) to auto-update worker status.

### Feature 4, Panic SOS & Embassy Rescue Dashboard (Crisis Response / EOC)

- **Trigger:** "SOS" keyword or panic voice note.
- **Automation:** Locks last-known GPS coordinates; computes crisis severity score (0-100) via triage rules + LLM classification.
- **Escalation:** n8n workflow dispatches a one-click **Rescue Dossier** (worker photo, passport scan, kafil name, GPS pin, severity score, transcript) to the relevant Bangladesh Embassy mission and the Dhaka control room.
- **Dashboard:** Next.js EOC map view for embassy operators, live incident feed, dossier generation, status tracking.

---

## 4. AI Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| Channel | WhatsApp Cloud API (webhooks) + IMO fallback; Next.js 14 + Tailwind for dashboards | Meets users where they already are; zero install |
| Multimodal vision | Google Gemini 2.5 Flash | Best-in-class Arabic+Bangla OCR/understanding; ~৳1.50/contact |
| Edge/on-prem AI | Ollama + Qwen 2.5 (7B/14B) | Free, offline-capable, embassies & low-connectivity operation |
| Retrieval | Triple-RAG: (a) Contextual RAG, Gulf labor-law corpus; (b) Graph RAG, agency→kafil→complaint knowledge graph; (c) BMET/MoFA live connectors | Grounded answers + entity history ChatGPT cannot access |
| Custom MCP server | `probashi-mcp`, MoFA visa status, BMET license, sponsor history tools | Live government verification = the moat |
| Orchestration | n8n workflows | SOS escalation, monthly check-in scheduler, alert fan-out |
| Speech | Whisper Large v3 (Bangla VTT) + Edge TTS (Bangla audio out) | Voice-first UX for low-literacy users |
| Backend | Node.js/TypeScript API, PostgreSQL + pgvector, Neo4j (graph), Redis queues | Standard, scalable |

> **Note on live government data:** MoFA/BMET endpoints vary by country and may require formal data-sharing agreements. Phase-1 plan: manual/semi-automated verification with human-in-the-loop; Phase-2: formal API/MCP integration. This must be stated honestly in the pitch to preempt judge scrutiny.

---

## 5. Defensibility, "Why Not Just ChatGPT?"

1. **Live government database access.** ChatGPT can read a photo but cannot query MoFA or BMET to confirm a visa is genuine. Our MCP layer verifies against source systems.
2. **Sponsor knowledge graph.** ChatGPT doesn't know that *this specific Saudi kafil* has a history of wage theft. Our Graph RAG stores entity-level complaint history.
3. **Action platform, not a chatbot.** ChatGPT talks; ProbashiShield *does*: generates official audit files, opens verified banking leads, and pushes rescue dossiers to embassies automatically.

---

## 6. Business Model (Unicorn Economics)

| Stream | Model | Year-1 math (illustrative) |
|---|---|---|
| **B2B2C bank/MFI bounty** | ৳300-500 per verified bank/MFS account opened for a scanned migrant (BRAC Bank, Islami Bank, bKash ecosystem) | 2 lakh openings → ৳6-10 crore |
| **B2C micro-payment** | Free basic scan; ৳299 for full Bangla translation + audio audit file via bKash/Nagad | 1 lakh users → ৳3-4 crore (≈98% gross margin) |
| **B2B agency SaaS** | Monthly subscription ৳15k-40k for bulk audit + Trust Badge | Recurring, high-margin |
| **Unit economics** | AI cost ≈ ৳2.50-3.50/file; avg revenue/user > ৳300; gross margin 98-99% | Cash-flow positive from Day 1, no burn dependency |

**Honesty note for judges:** unit economics assume conversion rates that need pilot validation. Present as modeled projections with stated assumptions, not guarantees.

---

## 7. Success Metrics (KPIs)

- Contracts audited / month; % flagged with critical clauses
- False-negative rate on fraud detection (target <5%)
- Check-in response rate among enrolled migrants
- Median time-to-rescue-dossier after SOS trigger (<60s)
- Revenue: scans, micro-payments, bank bounties, agency subscriptions
- Impact: estimated fraud losses prevented (৳ per caught discrepancy × average migrant loss)

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Government APIs unavailable / restricted | Human-in-the-loop verification ops; formal MoU route; public-data fallbacks (BMET notices, embassy bulletins) |
| WhatsApp API cost & policy limits at scale | IMO fallback; pricing tier design; NGO/embassy sponsored access |
| Liability on audit accuracy | Clear disclaimer (diagnostic report, not legal advice); confidence scores; human review for edge cases |
| Adoption among low-literacy users | Voice-first Bangla UX; family-member proxy accounts; union/agent partnerships |
| Data privacy of vulnerable migrants | Encryption at rest/transit; data minimization; embassy-grade access controls for SOS data |

---

## 9. Roadmap

- **Phase 0 (Competition MVP):** Web demo, upload contract → Gemini audit → Bangla audio → sample SOS dashboard trigger.
- **Phase 1 (Pilot):** WhatsApp bot + manual verification desk; onboard 500 migrants via 2 partner agencies + 1 embassy welfare cell.
- **Phase 2:** probashi-mcp live connectors, Graph RAG complaint history, bank bounty integration.
- **Phase 3:** Multi-country expansion (UAE, Oman, Qatar), government/NGO licensing, API platform.

---

## 10. Judge Q&A, Prepared Answers

**Q: "Probashi and BRAC already exist, what do you add?"**
Probashi handles post-departure administrative fee collection; BRAC rescues after crisis. ProbashiShield intervenes *before the plane takes off*, reading the contract the dalal doesn't want you to read, and provides continuous telemetry afterward. Different layer, earlier in the timeline.

**Q: "How do you provide legal certification? Are you a lawyer/government?"**
We don't issue legal certificates. Like a diagnostic lab issuing a test report, we issue a fact-based audit report: live database reference numbers, labor-law clause mismatches, and a trust score, evidence the migrant can hold against the broker.

**Q: "What if funding fails / you can't scale?"**
We're not a cash-burning logistics business. Processing cost is ~৳3/file against ৳300+ revenue per user, cash-flow positive from day one and self-sustaining without investor capital.

---

*Document owner: ProbashiShield AI team, EquiSaaS BD / CloudCamp BD*
