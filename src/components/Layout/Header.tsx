import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function Header() {
  const navigate = useNavigate()
  const { access, user, logout } = useAuthStore()
  const isAuthed = Boolean(access)

  return (
    <header className="border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/movies" className="font-bold">
          {import.meta.env.VITE_APP_NAME ?? 'Watchmate Web'}
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/movies" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
            Movies
          </NavLink>
          <NavLink to="/watchlists" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
            Watchlists
          </NavLink>
          {!isAuthed ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user?.username ?? 'User'}</span>
              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
