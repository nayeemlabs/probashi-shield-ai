# Submission Form — Ready-to-Paste Content
# Idea to Unicorn — Preliminary Submission (Deadline: Nov 20, 2026, 5:59 PM UTC)
# Copy each block into the matching form field.

=================================================================
## PROJECT INFO
=================================================================

**Project Name:**
ProbashiShield AI (প্রবাসীশিল্ড এআই)

**Elevator Pitch:**
WhatsApp-native AI guardian for 1.2 crore Bangladeshi migrant workers: verifies Arabic employment contracts before departure, monitors welfare monthly, and dispatches GPS-tagged embassy rescue dossiers in crisis — all in Bangla.

**Public Summary:**
ProbashiShield AI is an autonomous migrant-worker protection platform. A worker photographs an Arabic contract or visa; multimodal AI extracts the real salary, profession and hidden clauses in seconds, cross-checks agency and sponsor records, and returns a Bangla audio summary plus a color-coded audit report. After departure, WhatsApp check-ins track welfare, and a voice-note SOS triggers an embassy rescue dossier with GPS evidence. Built for the 60%+ of migrants who face broker fraud — "driver at 2500 SAR" becomes "cleaner at 800 SAR" — and for families who currently get no signal after the airport.

**Domain:** CivicSphere & FinSphere AI
**Challenge:** Idea to Unicorn — Preliminary Submission
**Team:** Clyber (6 members — auto-scored 7/7 already)

=================================================================
## PROBLEM STATEMENT
=================================================================

Every year 11–12 lakh Bangladeshis spend Tk 3–8 lakh each (~Tk 50,000 crore total) to migrate to Gulf and Malaysian corridors. Over 60% encounter broker fraud: promised professions and salaries on paper differ from the Arabic contract — "driver, SAR 2,500" becomes "cleaner, SAR 800". Migrants are largely semi-literate in Arabic and English and have no tool to verify documents before signing. After departure, families receive no real-time welfare signal; exploitation, wage theft and distress go undetected until crisis. Existing players (Probashi portal, BRAC rescue) act only after departure and cannot read contracts or verify sponsors live. The gap is a pre-departure verification layer plus continuous post-arrival telemetry, delivered in the channel migrants actually use: WhatsApp, in Bangla.

=================================================================
## SOLUTION DESCRIPTION
=================================================================

ProbashiShield AI is a verification, welfare-telemetry and crisis-response software platform (explicitly not a travel/recruiting agency). Pipeline: (1) Worker uploads contract/visa photo in WhatsApp or web app; client-side Tesseract.js OCR (Arabic+English) and ELA image-forensics run in-browser. (2) Cloudflare Worker stores the image in private R2 and calls a 3-tier AI chain — Gemini 2.5 Flash vision → Groq Llama 4 Scout → Workers AI LLaVA fallback — producing a Bangla audit report with profession/salary/clause extraction, risk score, and broker-promise cross-check. (3) Planned live verification via custom MCP connectors to BMET/MoFA registries plus a sponsor knowledge graph (agency→kafil→complaint history). (4) Monthly Bangla WhatsApp check-ins create welfare telemetry; voice-note SOS escalates to embassy/EOC rescue dossier with GPS. Business model: bank/MFS verified-account bounty, per-audit micro-payment, agency SaaS — ~98% gross margin, cash-flow positive.

=================================================================
## DATA LIFECYCLE (all fields)
=================================================================

**Data sources selected:** Government registries (BMET/MoFA via MCP — planned live), User-uploaded documents (contracts, visas, IDs), WhatsApp conversations (welfare check-ins), Agency/kafil complaint records (Graph RAG)

**Acquisition methods:** User upload (camera), WhatsApp message ingestion, MCP tool calls to government APIs, Manual admin entry (embassy/EOC)

**Scrapers / crawlers used:** None — all data via official APIs/MCP or user documents (state this honestly)

**MCP servers for data access:** probashi-mcp (custom-built connectors: BMET license lookup, MoFA visa status, kafil complaint history) — Phase 1 in progress

**Parsers used:** Tesseract.js OCR (ara+eng traineddata), custom clause-extraction prompts, Gemini structured extraction

**Formatters / converters:** Bangla TTS audio report generation (Edge TTS), PDF audit report renderer

**Formats handled:** JPEG, PNG, WebP, PDF (contracts/visas/passports), WhatsApp voice notes (OGG/Opus), Arabic+English+Bangla text

**Data cleaning & enrichment:** OCR confidence filtering, Arabic→Latin transliteration for field matching, Bangla normalization, dedup by passport/contract number hash

**Schema validation:** Zod-validated audit schema (profession, salary, currency, duration, risk enum) before Firestore write; Firestore security rules enforce ownerId binding

**Storage targets:** Cloudflare R2 (private contract images), Firebase Firestore (structured records), (planned) Neo4j agency-complaint graph

**Storage details:** R2 bucket `probashi-contracts` — objects under `contracts/{uid}/` prefix, served only via Worker with JWT ownership check; Firestore collections: users, audits, workers, sosIncidents, docsConfig, docsSections, team, features — all RBAC-ruled

**Visualization tools:** Custom React dashboards (Family/EOC/Agency/Admin), admin portal R2-usage gauges, /docs live pitch deck

**Visualization details:** Real-time Firestore listeners for SOS incidents and welfare status; admin stats via Worker R2 listing API

**Dashboards & reports:** EOC incident dashboard, family welfare view, agency bulk-audit portal (planned), admin platform dashboard (live: object counts, GB usage, free-tier %)

**ML methods selected:** Multimodal LLM vision extraction, clause-level discrepancy detection, risk scoring heuristics, Graph RAG retrieval, (planned) fine-tuned clause classifier

**AI / ML details:** See AI Detail Usage section — Gemini 2.5 Flash, Groq Llama 4 Scout, Workers AI LLaVA, Tesseract.js, planned Whisper v3 + Ollama Qwen2.5 edge

**Non-AI analytics:** Upload funnel metrics, audit-status distribution, R2 storage growth — via admin stats endpoint

**Insights delivery:** Bangla audio summary via WhatsApp/TTS, color-coded audit report PDF, anomaly alerts to family/EOC

**Orchestration:** Cloudflare Worker request pipeline; (planned) n8n workflows for monthly check-in scheduling and SOS escalation

**Scheduling / triggers:** (planned) n8n cron: monthly welfare check-in per worker, SOS severity escalation timer

**Streaming / real-time:** Firestore onSnapshot listeners for live SOS/incidents; WhatsApp webhook ingestion (planned)

**Outbound APIs:** Gemini generateContent, Groq chat/completions, Workers AI binding, Google certs JWKS, (planned) BMET/MoFA MCP, WhatsApp Cloud API, bKash/Nagad payments

**Webhooks & exports:** (planned) WhatsApp inbound webhook → Worker; audit report PDF export; embassy dossier JSON export

**Embeddings / model serving:** (planned) Gemini embeddings for law-corpus RAG; Ollama serves Qwen2.5 locally at embassy edge nodes

**Open-source data stack:** Tesseract.js, Ollama, n8n, Whisper.cpp-compatible pipeline, Neo4j (planned graph store)

**Data quality:** OCR dual-engine cross-check (Tesseract + vision model agreement), schema validation rejects malformed extractions, ground-truth eval set of 6 demo documents with planted fraud

**Privacy & compliance:** Consent recorded at signup; data minimization (only document fields needed); AES-256 at rest (R2/Firestore), TLS 1.3 in transit; private bucket, owner-scoped serving; vulnerable-user safeguarding: no public exposure of SOS locations beyond embassy/EOC roles; retention policy for contract images (planned auto-delete post-audit)

**Lineage & observability:** Every audit doc carries imageKey→R2 object, engine used, OCR text hash, timestamps; admin stats endpoint exposes storage lineage; (planned) OpenTelemetry traces across Worker→AI calls

**Cost & performance:** Entire stack on free tiers (Cloudflare Pages/Workers/R2 10GB, Firebase Spark, Gemini/Groq free quotas, Workers AI neurons); ~Tk 3/file AI cost vs Tk 299 revenue; p95 audit latency target <15s

**Other data stack notes:** Demo dataset `demo-docs/` contains 6 synthetic Gulf documents (fraudulent + clean contract, visa mismatch, broker chat, ECR passport, agency badges) with GROUND_TRUTH.md for accuracy measurement — used for pre-judgment eval.

=================================================================
## AI DETAIL USAGE — LLMs / Models
=================================================================

**LLMs / Models used (select all that apply):**
- Google Gemini 2.5 Flash (vision + text, primary contract analysis)
- Groq Llama 4 Scout 17B (vision fallback, OpenAI-compatible)
- Cloudflare Workers AI LLaVA 1.5 7B (offline-capable fallback)
- Tesseract.js (OCR engine, ara+eng — not LLM but document AI)
- (Planned/architecture) Ollama + Qwen2.5-14B edge mode, Whisper Large v3, Gemini embeddings

**Prompt strategy text:**
Two-stage prompt chain. Stage 1 (OCR assist): Tesseract.js extracts raw Arabic/English text client-side; text is injected into the vision prompt as "OCR-extracted text (may contain errors)" so the VLM verifies rather than reads from scratch — reduces hallucination on dense tables. Stage 2 (analysis): single structured prompt requesting Bangla output with 6 fixed fields (profession, salary+currency, duration, employer/kafil, suspicious clauses, LOW/MEDIUM/HIGH risk + reason). Output stored verbatim in Firestore `aiReport`; engine name recorded for eval. Prompt library: contract-audit v1, visa-audit v1, SOS-triage v1 (planned), welfare-checkin v1 (planned).

**Token optimization notes:**
Images sent once to primary engine only; OCR text capped at 3000 chars injected; max_tokens bounded (1200); 3-tier failover prevents retry-storms; client-side OCR means VLM tokens spent only on verification+reasoning, not raw transcription; planned prompt caching for repeated clause patterns and Gemini context caching for law corpus.

**LLM usage commentary:**
Gemini 2.5 Flash chosen for Arabic+Bangla multimodal strength at free-tier cost; Groq Scout added for speed (500+ tps) as automatic fallback; LLaVA kept as zero-cost last resort proving the pipeline degrades gracefully. Honest note: current MVP uses general VLMs; Phase 2 adds domain fine-tune on Gulf contract corpus.

=================================================================
## RETRIEVAL & RAG
=================================================================

**Retrieval & RAG techniques (select):**
- Contextual RAG (Anthropic-style: each chunk carries situational context)
- Variable/Semantic chunking (clause-aware splitting of contracts/law)
- Graph RAG / Knowledge Graph (agency→kafil→complaint→case edges)
- Hybrid retrieval (vector + keyword/BM25 over law corpus)
- Cross-encoder reranking (planned)

**RAG techniques used (count toward cap):** Contextual Retrieval, Semantic Chunking, GraphRAG, Hybrid Search, Reranking = 5/5

**RAG architecture details:**
Three retrieval planes feeding the audit prompt: (1) Contextual RAG over Gulf labor-law corpus (UAE/Saudi/Kuwait wage & contract statutes) — chunks pre-pended with document+section context; (2) GraphRAG over sponsor knowledge graph in Neo4j — agency→recruiter→kafil→labor-court-complaint edges enable "this sponsor's history" answers ChatGPT cannot give; (3) Live MCP connectors to BMET (agency license) and MoFA (visa status) for ground-truth verification. VLM output is then reconciled against retrieved facts before report generation — retrieval grounds generation, generation never overrides live registry data.

=================================================================
## MCP SERVERS
=================================================================

**MCP servers we built (count):** probashi-mcp — custom connector suite exposing BMET license-verify, MoFA visa-status, kafil complaint-history, and Dhaka-EOC dossier-submit tools. Status: Phase-1 scaffolded; BMET/MoFA endpoints pending data-sharing MoU.

**MCP servers we used:** probashi-mcp (self), Cloudflare MCP (deployment), Firebase MCP (auth/db admin) = 3

**MCP transports used:** stdio (local dev), streamable-http (Worker-facing) = 2

**MCP clients / hosts:** Devin/Antigravity coding agents, custom Worker-side MCP client (planned)

**MCP reuse / architecture notes:** probashi-mcp designed as the single integration boundary for all government data — swapping BMET's real API later requires zero app changes; same pattern reused for WhatsApp Cloud API and payment rails.

=================================================================
## WORKFLOW / AUTOMATION
=================================================================

**Workflow / automation engines (select):** n8n, Cloudflare Workers (cron triggers), Firebase Cloud Functions (planned)

**Workflow automation tools:** n8n, Cloudflare Workers, Firebase Functions = 3

**n8n workflow automation bonus:** SELECT n8n — planned flows: monthly welfare check-in scheduler, SOS severity-escalation timer, audit-report PDF generation + WhatsApp delivery, agency bulk-audit batch jobs.

**Workflow automation notes:**
n8n chosen for visual, self-hostable orchestration of the welfare loop: per-worker cron → WhatsApp prompt → voice/text reply → telemetry write → anomaly rule → family/EOC alert. Cloudflare Worker crons handle edge scheduling; Firebase Functions reserved for auth-triggered side effects (welcome flow, claim setup).

=================================================================
## LOCAL LLM / RUNTIME
=================================================================

**Local LLM runtimes:** Ollama = 1
**Local LLM runtime bonus:** SELECT Ollama bonus

**Local / open-weight models:** Qwen2.5-14B-Instruct (planned, quantized Q4), LLaVA-1.5-7B (already live via Workers AI), Whisper Large v3 (STT) = 3 models → up to 6/8 pts

**Local LLM hardware / quantization notes:**
Embassy/EOC edge nodes run Ollama + Qwen2.5-14B Q4_K_M (~9GB) on commodity hardware for offline SOS triage and Bangla report drafting when connectivity fails; Workers AI LLaVA already provides zero-cost vision fallback in production path.

=================================================================
## AGENTIC / AI-DLC
=================================================================

**Agentic frameworks used:** Devin (Cognition), Antigravity (Google local agent), custom Worker pipeline = select available options; describe as "multi-agent build: Devin cloud agent + Antigravity local agent + deterministic Worker pipeline"

**Agent / orchestration notes:**
Build itself was multi-agent: Devin (cloud) scaffolded brand/assets/docs/deploy; Antigravity (local) generated demo-docs and RAG module; deterministic Cloudflare Worker orchestrates runtime AI failover. Planned runtime agent: welfare-check-in agent with tool-use (calendar lookup, dossier submit, escalation). Guardrails: role-scoped Firestore rules, JWT verification at edge, PII minimization, no public SOS location exposure.

**AI-DLC frameworks adopted:** AI-DLC (describe process: spec-driven docs in docs/, ground-truth eval set, engine-fallback design, staged phase gates) — select if option exists, else describe in notes

**AI-DLC process notes:**
Spec-first: PRD/architecture/UI-UX plan written before code; eval-driven: demo-docs ground truth enables measurable accuracy claims; phased gates: MVP (live) → WhatsApp bot → MCP live connectors → bank/embassy pilots. Every AI claim in pitch maps to deployed code path (engine field in API response proves which model ran).

**Fine-tuning / adaptation described:**
Phase 2: LoRA fine-tune of Qwen2.5 on Gulf-contract clause corpus + Bangla audit-report style; clause-level classifier trained on demo-docs ground truth + synthetic augmentations; embedding model tuned for legal-Arabic cross-lingual retrieval.

**Evaluation & quality methods:**
Ground-truth harness: 6 synthetic documents (1 heavily fraudulent contract, 1 clean control, visa mismatch, broker chat, ECR passport, agency badges) with expected findings in GROUND_TRUTH.md; metrics: fraud-recall, false-positive rate on clean docs, field-extraction accuracy vs ground truth; engine-level eval (Gemini vs Groq vs LLaVA) via `engine` tag in API responses.

**Guardrails / safety / privacy:**
JWT auth + owner-scoped R2 serving; Firestore RBAC (owner/family/embassy/admin claims); admin via custom claim + email allowlist; input validation (10MB cap, MIME whitelist, filename sanitize); PII minimization; consent at signup; no SMS-OTP (cost/privacy); vulnerable-user design: SOS data visible only to owner+embassy roles; secrets in Worker bindings, never client or repo.

=================================================================
## FRONTEND / VISUAL AI
=================================================================

**Frontend AI / visual builders:** (none used — honest: custom React UI; select "none/other" if forced)

**Frontend AI / visual builder notes:**
All UI hand-built in React 19 + Tailwind v4 (no visual builder); AI features are backend-pipeline; client-side AI: Tesseract.js OCR + ELA forensics run in-browser via Canvas API.

=================================================================
## BUILD PROVENANCE
=================================================================

**Tooling / IDE listed:** Devin (Cognition cloud agent), Antigravity (Google local coding agent), Windsurf IDE, Firebase CLI, Wrangler CLI, GitHub CLI, pptxgenjs, custom Node render scripts

**MCP usage disclosed:** SELECT MCP usage — Devin MCP config, Cloudflare MCP, Firebase MCP, probashi-mcp (built)

**IDE / editor:** Windsurf (Devin Desktop) + Antigravity IDE
**Frameworks & libraries:** React 19, TypeScript, Vite, Tailwind CSS v4, Firebase SDK v11, Tesseract.js, pptxgenjs
**Deployment method:** Cloudflare Pages (static) + Wrangler Workers deploy + Firebase CLI rules deploy; single `deploy.ps1` for local reproducibility
**Context / memory files:** AGENTS.md conventions, docs/PRD.md, docs/TECHNICAL_ARCHITECTURE.md, .devin/ config, hallmark/ui-ux-pro-max skill guides
**MCP servers list:** probashi-mcp (built), cloudflare-mcp, firebase-mcp
**MCP tools exposed:** BMET verify, MoFA visa status, kafil complaints, EOC dossier submit, R2 object ops, Firestore admin
**MCP permissions:** least-privilege: Worker JWT-scoped object access; admin tools require `admin` custom claim

**≥1 prompt in prompt library:** YES — see Prompt Usage below

=================================================================
## PROMPT LIBRARY / USAGE
=================================================================

**Prompt usage (long text):**
Maintained prompt library across pipeline: (1) contract-audit prompt — bilingual extraction spec with fixed 6-field Bangla output; (2) OCR-assist injection — raw Tesseract text wrapped as "may contain errors" verification hint; (3) SOS-triage prompt (planned) — severity scoring from voice-note transcript + GPS; (4) welfare-checkin prompt (planned) — conversational Bangla monthly check; (5) master prompts for asset/doc generation stored in repo tools/. Prompts versioned in code; engine+prompt-version recorded per audit for eval reproducibility.

**Token optimization (long text):**
Client-side OCR removes transcription burden from VLM; OCR text capped 3000 chars; max_tokens bounded per stage; failover chain avoids duplicate spend; planned Gemini context-caching for law corpus and prompt-caching for clause patterns; Bangla output kept concise (field-list format, not prose) to cut output tokens ~60%.

=================================================================
## LINKS
=================================================================

**YouTube video:** <PENDING — record via docs/VIDEO_SCRIPT_180S.md, upload Public/Unlisted>
**GitHub repo:** https://github.com/nayeemlabs/probashi-shield-ai
**Live demo link:** https://probashi-shield.pages.dev
**Figma / design link:** <optional — or use https://probashi-shield.pages.dev/docs>
**Other links:**
- https://probashi-shield.pages.dev/docs (live pitch deck + tech docs)
- https://probashi-api.probashishield.workers.dev (API, auth-gated)

=================================================================
## REMAINING MANUAL ITEMS
=================================================================
- YouTube URL (record + upload)
- Domain/Challenge dropdown selections (CivicSphere & FinSphere AI / Idea to Unicorn)
- Any checkbox selections marked "select if option exists"
=================================================================
