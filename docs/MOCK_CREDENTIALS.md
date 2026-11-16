# Mock / Judge Credentials — ProbashiShield AI
# Fill secret fields at submission time. Everything else is live and working.

# === PUBLIC (no login needed) ===
SITE_URL=https://probashi-shield.pages.dev
DOCS_URL=https://probashi-shield.pages.dev/docs
API_URL=https://probashi-api.probashishield.workers.dev
REPO_URL=https://github.com/nayeemlabs/probashi-shield-ai
ADMIN_DOCS_URL=https://probashi-shield.pages.dev/admin/docs

# === JUDGE LOGIN (pick one) ===
# Option A — Google login (recommended, no password needed):
JUDGE_GOOGLE_EMAIL=<fill: any gmail — creates account on first login>
# Option B — Email/password demo account (create at submission or use):
JUDGE_EMAIL=<fill>
JUDGE_PASSWORD=<fill>

# === SUPER ADMIN (team use) ===
ADMIN_EMAIL=jannatulnayeemdev@gmail.com
ADMIN_PASSWORD=<fill if email login used>
ADMIN_CLAIM=admin:true (Firebase custom claim, already set)

# === WHAT JUDGES CAN SEE ===
# /            landing (bn default, en toggle, dark/light toggle)
# /docs        live pitch deck + tech docs + team + feature matrix
# /login       email/password + Google
# /audit       contract image upload → R2 (requires login)
# /family /eoc /agency  dashboard shells (require login)
# /admin       super admin only (R2 stats, platform counts, revenue)
# /admin/docs  docs visibility/schedule/section/team editor (admin only)
# /settings    profile photo upload (square crop + 256px JPEG → R2)

# === PROFILE PHOTO PIPELINE ===
# Google login → photoURL auto-synced to Firestore users/{uid}
# Email login → /settings upload → canvas square-crop → 256px JPEG q0.85 → R2 → Firestore
# Avatar shown in top nav + /settings

# === FREE-TIER GUARANTEE ===
# Cloudflare Pages/Workers/R2: free tier only, zero egress fees
# Firebase Spark: Auth + Firestore free quotas
# No paid services, no card charges
