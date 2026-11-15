# ProbashiShield AI — প্রবাসীশিল্ড এআই

**The 24/7 Autonomous AI Guardian for 1.2 Crore Migrant Workers.**
WhatsApp-native verification, welfare telemetry and crisis-response platform for Bangladeshi migrant workers. Team **Clyber** — International AI Builders Congress 2026, CivicSphere & FinSphere AI, Idea to Unicorn track.

Live: https://probashi-shield.pages.dev · Docs: https://probashi-shield.pages.dev/docs · Repo: https://github.com/nayeemlabs/probashi-shield-ai

---

## System Architecture

```mermaid
flowchart TB
    subgraph Channels
        WA[WhatsApp Cloud API]
        WEB[React Web App<br/>probashi-shield.pages.dev]
    end
    subgraph Edge["Cloudflare Edge (free tier)"]
        PAGES[Pages Hosting]
        WORKER[Worker: probashi-api<br/>JWT verify · R2 · Workers AI]
        R2[(R2: probashi-contracts<br/>contract images)]
    end
    subgraph Firebase
        AUTH[Authentication<br/>Email + Google]
        FS[(Firestore<br/>users, audits, workers,<br/>sosIncidents, docs*)]
        ADM[Admin SDK<br/>custom claims]
    end
    subgraph AI["AI Layer"]
        GEM[Gemini 2.5 Flash<br/>vision: Arabic/BN contracts]
        WHI[Whisper v3 + Edge TTS<br/>Bangla voice in/out]
        RAG[Triple-RAG<br/>law corpus · agency graph · live MCP]
        OLL[Ollama + Qwen2.5<br/>offline embassy edge]
    end
    WA --> WORKER
    WEB --> PAGES
    WEB --> AUTH
    WORKER --> R2
    WORKER --> FS
    WORKER --> AI
    AUTH --> FS
    ADM --> FS
```

## Use Case Diagram

```mermaid
flowchart LR
    W(( migrant worker )) -->|contract photo| AUD[Contract Audit]
    W -->|monthly reply| WEL[Welfare Telemetry]
    W -->|voice SOS| SOS[SOS Rescue]
    F((family in BD)) -->|status view| WEL
    E((embassy EOC)) -->|dossier| SOS
    A((agency)) -->|bulk verify| AUD
    B((bank/MFS)) -->|verified leads| BOUNTY[Account Bounty]
    AUD --> RPT[Bangla Audit Report + audio]
    WEL --> ALERT[Anomaly alerts]
    SOS --> DOS[Rescue Dossier]
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as Worker (WhatsApp/Web)
    participant W as probashi-api Worker
    participant R2 as Cloudflare R2
    participant F as Firestore
    participant A as AI Pipeline
    U->>W: upload contract image + Firebase ID token
    W->>W: verify JWT (Google certs)
    W->>R2: put contracts/{uid}/{ts}.jpg
    W-->>U: object key
    U->>F: create audit doc (status=queued)
    A->>R2: fetch image
    A->>A: OCR/vision parse (Arabic→BN)
    A->>A: BMET/MoFA verify + Graph RAG
    A->>F: write report + status=done
    F-->>U: Bangla summary + PDF/audio
```

## Deployment Map

| Layer | Service | Cost |
|---|---|---|
| Hosting | Cloudflare Pages `probashi-shield` | Free |
| API/Storage | Worker `probashi-api` + R2 `probashi-contracts` | Free (10GB) |
| Auth/DB | Firebase Spark (Auth, Firestore) | Free |
| AI | Workers AI + Gemini API | Free tier |
| Repo | github.com/nayeemlabs/probashi-shield-ai | Public |

## Repo Layout

```
web/                 React 19 + TS + Vite + Tailwind v4 frontend
workers/api/         Cloudflare Worker (upload, file serve, admin stats, AI binding)
firestore.rules      RBAC: owner / family / embassy / admin claims
firebase.json        Firestore rules deploy config
deploy.ps1           One-command local deploy (build + Pages + rules)
tools/               Asset renderer, deck generator, admin-claim, docs seeder
assets/              Brand SVG/PNG, OG images, fonts (local only)
docs/                Internal docs (gitignored): PRD, deck PPTX, video script
tools/make-deck.mjs  Pitch deck generator (pptxgenjs)
```

## Key Routes

`/` landing · `/login` auth · `/audit` contract upload · `/family` `/eoc` `/agency` dashboards · `/settings` profile+avatar · `/admin` super-admin portal · `/admin/docs` docs editor · `/docs` live pitch deck + tech docs (schedulable)

## Security Model

Firebase Auth JWT verified in Worker via Google certs; Firestore rules enforce owner/role claims; R2 objects private, served only through Worker with ownership check; admin via `admin` custom claim; secrets in `.env` (gitignored) and Worker bindings, never in repo.
