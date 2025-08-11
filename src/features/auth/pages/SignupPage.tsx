import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'

export function SignupPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore((s) => s.setUser)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const payload = email ? { username, email, password } : { username, password }
      const resp = await signup(payload as any)
      setUser(resp.user)
      navigate('/movies', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="block text-sm">Username</span>
          <input className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label className="block">
          <span className="block text-sm">Email (optional)</span>
          <input className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="block text-sm">Password</span>
          <input className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent">Create account</button>
      </form>
      <p className="mt-4 text-sm">
        Have an account? <Link to="/login" className="text-blue-600 underline">Log in</Link>
      </p>
    </div>
  )
}
