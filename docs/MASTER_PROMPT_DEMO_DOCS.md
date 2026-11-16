# MASTER PROMPT — Demo Document Generator
# Give this entire file to the coding agent (Antigravity/Devin local).
# Goal: generate realistic Gulf-migration documents for testing ProbashiShield AI.

---

## PROMPT (copy everything below the line)

You are generating realistic test documents for "ProbashiShield AI", a Bangladeshi migrant-worker protection platform. The app audits employment contracts and visa documents (Arabic/English) and flags fraud: job mismatch, salary suppression, hidden clauses, fake agency details.

Generate the following files into `demo-docs/` using HTML (print-to-PDF ready) or high-quality PNG via canvas/SVG. Documents must look authentic: Gulf labor-contract formatting, Arabic RTL text where appropriate, stamps, signatures, table layouts, small print clauses. Use realistic Bangladeshi names, Saudi/Gulf employer names, and passport-style MRZ where relevant.

### DOCUMENT SET

**1. `contract-fraudulent.html` — THE KEY DEMO DOC (must contain detectable fraud)**
A Saudi Arabian WPS (Wage Protection System) domestic/labor employment contract, bilingual Arabic + English:
- Promised job: "Driver" (سائق) — salary SAR 2,500/month
- Actual printed contract: profession "Cleaner" (عامل نظافة), salary SAR 800/month
- Hidden clauses: 2-year contract, no annual leave beyond legal minimum, salary paid "as per employer discretion", kafil can change worker's profession "when needed", passport held by sponsor clause
- Agency/broker section at bottom: Bangladeshi recruiting agency name, phone, "processing fee Tk 3,50,000"
- A visa page image attached: visit/work visa, profession field shows "Cleaner" (mismatch with verbal promise)
- Visual signs of tampering potential: white-out correction over salary field, signature misaligned

**2. `contract-clean.html` — legitimate contract (control case)**
Same layout, honest details: profession Driver, SAR 2,200, standard MOL terms, clear clauses, no contradictions. Used to prove the system does NOT false-positive.

**3. `visa-mismatch.png`** — Saudi visa (تأشيرة عمل) showing profession "Cleaner" while a mock broker SMS/chat screenshot says "Driver job, 2500 SAR".

**4. `broker-chat.html`** — WhatsApp-style chat export: broker promises "Driver, Saudi Arabia, 2500 SAR/month, Tk 3 lakh total" vs what contract says.

**5. `ecr-passport.html` — mock passport bio page**: Bangladeshi passport, ECR (Emigration Check Required) stamp, name matching contract worker, DOB, passport no.

**6. `agency-badges.html` — 3 mock agency profiles**: one valid BMET RL-registered agency (green), one unregistered (red), one with kafil complaint history (amber).

### GROUND TRUTH FILE — `demo-docs/GROUND_TRUTH.md`
For each document, write the expected audit findings so we can validate AI output:
- Document 1 expected: profession mismatch (Driver→Cleaner), salary fraud (2500→800 SAR), passport-holding clause, profession-change clause, risk=HIGH, ~5 findings
- Document 2 expected: risk=LOW, no findings
- Document 3 expected: visa profession mismatch flagged

### STYLE RULES
- Arabic text must render correctly RTL — embed a webfont or use system fonts; verify no broken shaping (no isolated letters, conjuncts intact)
- Bangla text where needed must not break conjuncts
- Include realistic stamps: "Ministry of Human Resources and Social Development — KSA", "WPS Registered", agency chop
- Resolution: A4 ratio, 150-200 DPI equivalent, JPG/PNG quality suitable for mobile camera photos (slight noise/rotation acceptable for doc 1 to test robustness)

Deliverables: all files in `demo-docs/`, plus a `README.md` inside listing each file, what fraud it contains, and expected AI findings. Make doc 1 genuinely deceptive — it should fool a quick human glance but be catchable by careful reading.

---

## Why this matters
Doc 1 is the competition demo centerpiece: upload → AI catches the fraud in Bangla. Doc 2 proves no false positives. The ground truth file lets us measure AI accuracy for the pitch ("our system caught 5/5 planted frauds").
