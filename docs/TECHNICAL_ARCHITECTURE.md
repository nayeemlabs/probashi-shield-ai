# ProbashiShield AI, Technical Architecture

## 1. High-Level System Diagram

```
┌─────────────┐   WhatsApp/IMO    ┌──────────────────────────────────────┐
│  Migrant /  │ ──── messages ──▶ │         WhatsApp Cloud API           │
│  Family     │ ◀─── replies ──── │            (webhook ingress)         │
└─────────────┘                   └──────────────┬───────────────────────┘
                                                 │
                                                 ▼
                              ┌──────────────────────────────────┐
                              │   Orchestrator (Node.js/TS API) │
                              │  • intent routing               │
                              │  • session & consent state      │
                              │  • queue dispatch (Redis/BullMQ)│
                              └──┬───────┬───────────┬───────────┘
                                 │       │           │
            ┌────────────────────┘       │           └────────────────────┐
            ▼                            ▼                                ▼
 ┌─────────────────────┐      ┌───────────────────┐          ┌──────────────────────┐
 │ Contract Audit      │      │ Welfare Telemetry │          │ Crisis Pipeline      │
 │ Pipeline            │      │ Engine            │          │ (SOS)                │
 │ • image ingest      │      │ • monthly check-in│          │ • panic classifier   │
 │ • Gemini 2.5 Flash  │      │ • Whisper VTT     │          │ • severity 0-100     │
 │   multimodal parse  │      │ • status signals  │          │ • GPS lock           │
 │ • clause extraction │      │ • family updates  │          │ • Rescue Dossier PDF │
 └─────────┬───────────┘      └─────────┬─────────┘          └──────────┬───────────┘
           │                            │                               │
           ▼                            ▼                               ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                        Verification & Knowledge Layer                        │
 │  • probashi-mcp server: MoFA visa status • BMET license • sponsor history    │
 │  • Contextual RAG: Gulf labor-law corpus (pgvector)                          │
 │  • Graph RAG: agency → kafil → complaint graph (Neo4j)                       │
 │  • Edge fallback: Ollama + Qwen2.5 on-prem (embassy offline mode)            │
 └─────────────────────────────────────────────────────────────────────────────┘
           │                            │                               │
           ▼                            ▼                               ▼
 ┌─────────────────────┐      ┌───────────────────┐          ┌──────────────────────┐
 │ Report Generation   │      │ n8n Workflows     │          │ Embassy EOC          │
 │ • Bangla TTS audio  │      │ • check-in cron   │          │ • Next.js dashboard  │
 │ • color-coded PDF   │      │ • SOS escalation  │          │ • live incident map  │
 │   audit report      │      │ • email/SMS/WA    │          │ • dossier queue      │
 └─────────────────────┘      └───────────────────┘          └──────────────────────┘
```

## 2. Component Details

### 2.1 Channel Layer
- **WhatsApp Cloud API**, official Business API; media download for contract images; template messages for scheduled check-ins (24h session window requires approved templates for proactive outreach).
- **IMO fallback**, for users without WhatsApp; same webhook abstraction.
- **Web dashboard**, Next.js 14 + Tailwind for embassy EOC and agency portal.

### 2.2 Orchestrator (core API)
- TypeScript (Node.js 20) service; REST + webhook endpoints.
- Redis + BullMQ for job queues: audit jobs, transcription jobs, check-in campaigns, SOS escalation.
- PostgreSQL: users, sessions, documents, audit results, telemetry events.
- Consent & privacy: explicit opt-in recorded per user; data-minimization fields only; encryption at rest (AES-256) and in transit (TLS 1.3).

### 2.3 Contract Audit Pipeline
1. **Ingest:** WhatsApp media → short-lived signed URL → virus scan → store.
2. **Vision parse:** Gemini 2.5 Flash multimodal, extracts structured JSON: profession, salary, currency, overtime, working hours, food/lodging, penalty clauses, passport clauses, kafil/sponsor name, visa number, nationality.
3. **Cross-checks:**
   - Clauses vs. destination-country labor law (Contextual RAG retrieval).
   - Kafil/agency → BMET license via probashi-mcp.
   - Kafil → complaint history via Graph RAG.
   - Visa number → sponsor-country portal (MoFA KSA / Malaysia eVISA) where accessible.
4. **Discrepancy engine:** compares extracted terms against broker's declared promise (captured in onboarding chat) and flags up to 5 critical findings.
5. **Report:** color-coded one-pager PDF + Bangla audio summary (Edge TTS; ~2 min).

### 2.4 Welfare Telemetry Engine
- **Check-in scheduler (n8n cron):** monthly, per-user timezone; WhatsApp template → conversational thread.
- **Voice processing:** user audio replies → Whisper Large v3 (Bangla fine-tuned) → Bangla transcript.
- **Signal extraction:** LLM pass classifies welfare signals, wage status, health, location hints, distress keywords, into a telemetry record; family dashboard gets summarized status.

### 2.5 Crisis Pipeline (SOS)
1. Trigger: explicit "SOS" or panic classification (severity model).
2. **GPS lock:** last known coordinates (from check-in metadata / user-shared pin); if unavailable, request pin via interactive WhatsApp message.
3. **Severity scoring:** rule-based triage + LLM classification → 0-100.
4. **Dossier generation:** Rescue Dossier PDF, photo, passport data, kafil, employer, GPS, severity, recent telemetry, transcript.
5. **Escalation (n8n):** parallel alerts to embassy mission desk + Dhaka EOC; SMS fallback; escalation timer if unacknowledged (e.g., re-alert at T+15min, T+60min).

### 2.6 probashi-mcp (Custom MCP Server)
MCP tools exposed to the orchestrator:
- `bmet_check_license(rl_number)`, BMET database license status.
- `mofa_check_visa(visa_no, nationality)`, KSA MoFA visa verification (subject to portal availability/agreement).
- `sponsor_history(kafil_name)`, Graph RAG complaint/wage-default history.
- `labor_law_lookup(clause_topic, country)`, Contextual RAG retrieval.

> Architecture note: MCP servers are stateless tool providers; heavy lifting stays in the orchestrator. Graph data lives in Neo4j; vectors in pgvector.

### 2.7 Edge / Offline Mode
- Embassy field kits: Ollama + Qwen2.5 14B on a mini-PC, runs contract OCR-lite and SOS triage with no cloud dependency.
- Syncs audit results when connectivity returns.

## 3. Data Model (core entities)

`Migrant` → `IdentityDocument` (passport/visa), `Contract` (audit results), `Employer`/`Kafil`, `Agency` (RL no.), `TelemetryEvent`, `SOSIncident` (severity, GPS, dossier), `ConsentRecord`.

Graph edges: `Agency -[:PLACED_WITH]-> Kafil`, `Kafil -[:HAS_COMPLAINT {type, date, outcome}]-> Complaint`, `Migrant -[:EMPLOYED_BY]-> Kafil`.

## 4. Non-Functional Requirements

- **Latency:** contract audit ≤ 10s end-to-end (3s LLM target); SOS dossier ≤ 60s.
- **Availability:** 99.9% webhook ingress; embassy edge mode works offline.
- **Cost:** ≤ ৳3.50 per audit at expected volume (Gemini Flash pricing + Whisper batch + TTS).
- **Security:** PII encrypted; role-based access for embassy/admin; audit log for every SOS action.
- **Scale:** designed for 10 lakh+ users; stateless services, queue-based backpressure.

## 5. MVP Scope (Competition Demo)

| In scope | Out of scope (Phase 1+) |
|---|---|
| Web upload → Gemini audit → Bangla audio + report PDF | Live MoFA/BMET API integration (simulated MCP responses w/ real-format data) |
| WhatsApp bot persona (check-in dialogue demo) | Full telemetry ML pipeline at scale |
| SOS trigger → severity → rescue dossier → EOC dashboard | Real embassy dispatch integrations |
| Sample complaint-history Graph RAG answers | Formal government data agreements |
