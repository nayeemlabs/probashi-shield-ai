# ProbashiShield AI, UI/UX Design Plan

**Stack constraint:** Frontend hosted on **Cloudflare Pages** (static Next.js export or plain React/Vite), backend functions on **Cloudflare Workers**, auth & data on **Firebase** (Auth, Firestore, Storage, FCM). All on free tiers.

---

## 1. Design Philosophy

### 1.1 Core principle: "Voice-first, Bangla-first, thumb-first"
Our users are semi-literate migrant workers using mid-range Android phones on patchy networks, often one-handed, often stressed. Design decisions flow from three rules:

1. **Voice before text**, every critical output has an audio version. Reading is optional; listening is primary.
2. **Bangla before English**, UI copy in Bangla (with English legal terms kept where they carry authority, e.g., "কফিল", "ভিসা", "RTL"). Font: **Li Alinur Tatsama (Unicode)**, the team's chosen typeface, verified for Bengali conjuncts (যুক্তবর্ণ: ক্ষ, জ্ঞ, ত্র, হ্ম all shape correctly via GSUB). Fallback stack: `Li Alinur Tatsama Unicode, "Noto Sans Bengali", sans-serif`. Latin/UI numerals: **Inter**.
3. **Thumb-zone everything**, all primary actions in the bottom 40% of the screen. Minimum touch target 48×48px (we exceed WCAG at 56px).

### 1.2 Design method (what we'll actually follow)

| Method | Application |
|---|---|
| **Human-centered design (HCD / ISO 9241-210)** | Design starts from the 4 personas in the PRD; every feature maps to a job-to-be-done |
| **Jobs-to-be-Done framing** | "When I'm about to pay a dalal, help me know if I'm being cheated", not "build a dashboard" |
| **WCAG 2.2 AA accessibility** | Contrast ≥4.5:1, focus states, screen-reader labels on all icons, no color-only meaning (icons + text + color) |
| **Mobile-first responsive** | 360px baseline design; dashboards scale to desktop |
| **Trust-centered UX** | Every screen answers "can I trust this?", source citations, live DB reference numbers, confidence scores always visible |
| **Graceful degradation** | Slow 2G fallback: text-first, lazy audio, skeleton loaders, offline SOS queue |

### 1.3 Emotional design targets
- **Pre-departure:** anxiety → *relief or clear warning*. The audit report must feel like a shield, not a legal document.
- **In-destination:** loneliness → *being remembered*. Check-in messages must feel human, never robotic.
- **Crisis:** panic → *someone is already moving*. SOS flow must feel instant and confirming ("আমরা পেয়েছি, সাহায্য আসছে").

---

## 2. Information Architecture, Two Surfaces

```
Surface A: WhatsApp/IMO (worker-facing, 90% of users)
  └─ Conversational flows only, no app install

Surface B: Web App (dashboards, family, agency, embassy)
  ├─ /family    , worker welfare status
  ├─ /audit     , upload contract → report viewer
  ├─ /agency    , bulk audit + trust badges
  └─ /eoc       , embassy emergency ops center
```

The web app is a **progressive enhancement**, not a requirement. A migrant can complete their entire journey inside WhatsApp.

---

## 3. Design System

### 3.1 Color palette (semantic, trust-coded)

| Token | Hex | Meaning |
|---|---|---|
| `--safe` | `#0E7C4A` (green) | Verified / no critical findings / all-clear |
| `--warn` | `#B45309` (amber) | Discrepancies found, review needed |
| `--danger` | `#B91C1C` (red) | Critical clauses / SOS active |
| `--brand` | `#0B3D91` (deep blue) | Trust, authority, government-adjacent |
| `--bg` | `#F7F8FA` | Soft off-white background (easier on eyes than pure white) |
| `--ink` | `#111827` | Primary text (14:1 contrast) |

Rules: risk is **never** communicated by color alone, every state pairs color with icon + Bangla text label (যেমন: "নিরাপদ ✅", "সতর্কতা ⚠️", "ঝুঁকিপূর্ণ 🚨").

### 3.2 Typography scale

- **Display/Hero:** Li Alinur Tatsama Unicode, audit headline numbers (salary figures)
- **Body:** Li Alinur Tatsama Unicode, 18px base (larger than typical, readability for low-literacy); Latin/numerals in Inter
- **Caption/labels:** 14px minimum, never smaller
- Line-height 1.6 minimum for Bangla (tall script needs breathing room)

### 3.3 Components (custom, minimal library)

- **RiskBadge**, color+icon+label triple-encoded severity chip
- **AuditReportCard**, the one-page report: sponsor block → discrepancy table → trust score → audio player → "দালালের কাছে কী বলবেন" script box
- **VoiceNoteButton**, big mic button, waveform animation, holds-to-record
- **SOSButton**, persistent, red, bottom-right on worker chat; 3-second hold-to-activate (prevents pocket presses) but single-tap in confirmed panic flow
- **CheckInCard**, WhatsApp-rendered monthly check-in (text+audio buttons, not a web component)
- **EOCIncidentCard**, embassy dashboard: severity ring (0-100), GPS map embed, dossier download, acknowledge/escalate buttons
- **SkeletonLoader**, shimmer placeholders shaped like the final content (never spinners for >1s waits)

### 3.4 Iconography & imagery
- **Lucide icons** (open source) + custom illustrated spot-illustrations of Bangladeshi workers (diverse skin tones, modest dress, Gulf/Malaysia settings), no generic stock photos.
- Photos of real documents should be shown as they are (real Arabic contracts), authenticity over polish in the audit flow.

### 3.5 Motion
- Restrained: 150-250ms ease-out transitions; pulse animation on SOS only; no decorative animation in crisis flows (calm = trustworthy).
- Respect `prefers-reduced-motion`.

---

## 4. Key Screen Flows

### 4.1 Contract Audit (web `/audit` + WhatsApp mirror)
```
Upload → Processing (show what's being read: "ভিসা পড়া হচ্ছে… ৩টি ক্লজ পাওয়া গেছে")
       → Findings list (each with severity + plain-Bangla explanation + law citation)
       → Trust score reveal (animated count-up, 0-100)
       → Audio summary player (prominent, one-tap)
       → Report PDF download / share to WhatsApp
       → CTA: "এটি আমার কেনা কন্ট্রাক্ট" (confirm) / "দালালের সাথে শেয়ার করুন"
```
Empty/error states: blurry photo → retake guidance with example image; unsupported language → "এই ভাষা এখনও সমর্থিত নয়, ইংরেজি/আরবি পাঠান".

### 4.2 WhatsApp Onboarding (first 3 messages)
1. Language pick: "বাংলায় চালিয়ে যাব?"
2. Consent (required, stored): what we collect, who sees it, how to delete → "হ্যাঁ, আমি রাজি"
3. First value in <60s: send contract photo OR "আমার কনট্রাক্ট এখনো পাইনি" → education drip.

### 4.3 Monthly Check-in (WhatsApp)
AI message → migrant replies by voice/text → transcript + welfare signals → family dashboard status dot (সব ঠিক আছে / খোঁজ দরকার / জরুরি).

### 4.4 SOS Flow
Trigger → immediate confirm screen "পেয়েছি ✓ সাহায্য আসছে" → background: GPS lock + dossier + embassy alert → follow-up message with embassy contact + "আপনারsav 제3…(যেমন: srck…)", keep it simple: next steps in Bangla.

### 4.5 Embassy EOC Dashboard (`/eoc`)
Map of active incidents (color-coded severity), live feed, one-click dossier view, acknowledge → status tracking. Dark-mode friendly for 24/7 ops rooms; large tap targets for field tablets.

---

## 5. Content & Tone Guidelines (Bangla UX writing)

| Do | Don't |
|---|---|
| "আপনার বেতন চুক্তিতে ৮০০ রিয়াল লেখা আছে" | "নগদ বেতন সংক্রান্ত অসংগতিসমূহ শনাক্ত হয়েছে" |
| "কোম্পানি বেতন দেয়নি?SOR… (write plainly:）"কোম্পানি বেতন দেয়নি? বলুন" | "আপনি কি বেতন সংক্রান্ত সমস্যা Faz…" |
| Address user as "আপনি"; migrants as "ভাই/আপু… (keep "আপনি")" | Formal "আপনাকে", bureaucratic passive voice |
| Numbers spelled + digits: "৮০০ রিয়াল (800 SAR)" | Digits only |
| Every warning ends with what to *do* | Fear without action |

Microcopy rule: **every screen has a "এখন কী করব?" (what now) box**, users always know the next step.

---

## 6. Trust & Safety UX Requirements

- Consent screen before any data collection; granular toggles (check-ins, family sharing, SOS).
- Every audit finding cites its source: "📄 কন্ট্রাক্ট পৃষ্ঠা ২, দফা ৪" + "⚖️ সৌদি শ্রম আইন ধারা ৬০" + "🗄️ BMET রেফারেন্স #…".
- "এই রিপোর্ট আইনি পরামর্শ নয়" disclaimer, persistent but non-alarming footer.
- Data transparency page: what we store, retention, delete-my-data button (Firebase: user-initiated account+data deletion, also required by stores/policies).
- SOS data visible ONLY to embassy role + user's family (RBAC enforced in Firestore rules).

---

## 7. Performance & Accessibility Budget

- Lighthouse ≥90 Performance, ≥95 Accessibility on all pages.
- First Contentful Paint <1.5s on 4G; <3s on slow-3G simulation.
- Total JS <200KB initial (Bangla font subsetted); audio streamed, not bundled.
- All flows operable by keyboard; all images have Bangla alt text.

---

## 8. Design Deliverables Checklist

- [ ] Design tokens file (`tokens.json` → CSS variables)
- [ ] Component library (React + Tailwind, shadcn-style primitives)
- [ ] Bangla typography setup (@font-face for Li Alinur Tatsama Unicode, TTFs in `assets/fonts/alinur-tatsama/Unicode/`; note: Lipighor license requires email permission + footer backlink for webfont use, request permission before production deploy)
- [ ] WhatsApp message templates (check-in, SOS confirm, audit result), requires Meta template approval
- [ ] EOC dashboard wireframes → hi-fi
- [ ] Audit report PDF template (print-optimized, one page, color-coded)
- [ ] Empty/error/loading states for every screen
- [ ] User-testing plan: 5 migrants + 2 family members + 1 embassy desk officer
