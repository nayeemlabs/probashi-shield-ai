# deploy.ps1 — ProbashiShield AI one-command deploy (run from repo root)
# Usage:  powershell -ExecutionPolicy Bypass -File .\deploy.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$npmBin = "$env:APPDATA\npm"

Write-Host "`n=== [1/3] Building web app ===" -ForegroundColor Cyan
Push-Location "$root\web"
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Web build failed" }
} finally { Pop-Location }

Write-Host "`n=== [2/3] Deploying to Cloudflare Pages ===" -ForegroundColor Cyan
& "$npmBin\wrangler.cmd" pages deploy "$root\web\dist" --project-name probashi-shield --branch main
if ($LASTEXITCODE -ne 0) { throw "Cloudflare Pages deploy failed" }

Write-Host "`n=== [3/3] Deploying Firebase rules ===" -ForegroundColor Cyan
& "$npmBin\firebase.cmd" deploy --only firestore:rules --project probashi-shield
if ($LASTEXITCODE -ne 0) { Write-Warning "Firestore rules deploy failed — check 'firebase login'" }
& "$npmBin\firebase.cmd" deploy --only storage --project probashi-shield
if ($LASTEXITCODE -ne 0) { Write-Warning "Storage rules skipped — enable Storage in Firebase console first" }

Write-Host "`nDone! Live at: https://probashi-shield.pages.dev" -ForegroundColor Green
