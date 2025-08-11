import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/movies'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore((s) => s.setUser)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ username, password })
      setUser({ id: 0, username })
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="block text-sm">Username</span>
          <input
            className="w-full border rounded p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="block text-sm">Password</span>
          <input
            className="w-full border rounded p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  )
}
