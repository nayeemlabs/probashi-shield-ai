import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Audit from './pages/Audit'
import Family from './pages/Family'
import Eoc from './pages/Eoc'
import Agency from './pages/Agency'
import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center text-ink/50">লোড হচ্ছে…</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/audit" element={<RequireAuth><Audit /></RequireAuth>} />
          <Route path="/family" element={<RequireAuth><Family /></RequireAuth>} />
          <Route path="/eoc" element={<RequireAuth><Eoc /></RequireAuth>} />
          <Route path="/agency" element={<Agency />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
