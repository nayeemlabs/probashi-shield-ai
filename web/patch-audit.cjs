const fs = require('fs')
const p = 'src/pages/Audit.tsx'
let s = fs.readFileSync(p, 'utf8')
s = s.replace("import { uploadContract, fileUrl } from '../lib/api'", "import { uploadContract, fileUrl, analyzeContract } from '../lib/api'")
s = s.replace("import { collection, addDoc, serverTimestamp } from", "import { collection, addDoc, updateDoc, doc, serverTimestamp } from")
const oldBlock = `      const { key } = await uploadContract(file)
      await addDoc(collection(db, 'audits'), {
        ownerId: user.uid,
        imageKey: key,
        imageUrl: fileUrl(key),
        brokerPromise: promise,
        status: 'queued',
        createdAt: serverTimestamp(),
      })`
const newBlock = `      const { key } = await uploadContract(file)
      const ref = await addDoc(collection(db, 'audits'), {
        ownerId: user.uid,
        imageKey: key,
        imageUrl: fileUrl(key),
        brokerPromise: promise,
        status: 'analyzing',
        createdAt: serverTimestamp(),
      })
      try {
        const analysis = await analyzeContract(key)
        await updateDoc(doc(db, 'audits', ref.id), { aiReport: analysis, status: 'done', analyzedAt: serverTimestamp() })
      } catch {
        await updateDoc(doc(db, 'audits', ref.id), { status: 'queued', note: 'AI analysis pending' })
      }`
if (!s.includes(oldBlock)) { console.error('BLOCK NOT FOUND'); process.exit(1) }
s = s.replace(oldBlock, newBlock)
fs.writeFileSync(p, s)
console.log('patched ok')
