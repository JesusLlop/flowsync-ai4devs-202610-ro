import { useEffect, useState } from 'react'
import { AuthForm } from '@/components/auth-form'
import { ProfileView } from '@/components/profile-view'
import { clearSession, getProfile, getToken, logout, type User } from '@/lib/api'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => getToken() !== null)

  // Restore the session from a stored token on first load.
  useEffect(() => {
    if (!getToken()) return
    getProfile()
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await logout().catch(() => {})
    setUser(null)
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight">FlowSync</h1>
      {loading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : user ? (
        <ProfileView user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthenticated={setUser} />
      )}
    </main>
  )
}

export default App
