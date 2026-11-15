import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

interface AuthCtx {
  user: User | null
  loading: boolean
  signInEmail: (email: string, password: string) => Promise<void>
  signUpEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u)
    setLoading(false)
    if (u) {
      try {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        const data = snap.data() ?? {}
        const photo = data.photoURL || u.photoURL || null
        if (!snap.exists() || data.photoURL !== photo || data.email !== u.email) {
          await setDoc(ref, { uid: u.uid, email: u.email, name: u.displayName, photoURL: photo, updatedAt: serverTimestamp() }, { merge: true })
        }
      } catch { /* non-blocking */ }
    }
  }), [])

  const value: AuthCtx = {
    user,
    loading,
    signInEmail: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    signUpEmail: async (email, password) => {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    signInGoogle: async () => {
      await signInWithPopup(auth, new GoogleAuthProvider())
    },
    signOut: () => fbSignOut(auth),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
