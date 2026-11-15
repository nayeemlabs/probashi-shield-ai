// Set Firebase custom claims for admin/embassy roles.
// Usage: node tools/set-admin-claim.mjs <email> [admin|embassy|none]
// Requires: service account JSON at GOOGLE_APPLICATION_CREDENTIALS (see root .env)
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// load root .env if present
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
try {
  for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
} catch { /* no .env */ }

const [email, role = 'admin'] = process.argv.slice(2)
if (!email) {
  console.error('Usage: node tools/set-admin-claim.mjs <email> [admin|embassy|none]')
  process.exit(1)
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
const app = keyPath
  ? initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, 'utf8'))) })
  : initializeApp({ credential: applicationDefault() })

const auth = getAuth(app)
const user = await auth.getUserByEmail(email)

const claims = { ...(user.customClaims ?? {}) }
if (role === 'none') {
  delete claims.admin
  delete claims.embassy
} else {
  claims[role] = true
}

await auth.setCustomUserClaims(user.uid, claims)
console.log(`✓ ${email} (uid ${user.uid}) claims:`, claims)
