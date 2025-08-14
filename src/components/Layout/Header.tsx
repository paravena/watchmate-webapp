import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function Header() {
  const navigate = useNavigate()
  const { access, user, logout, is_superuser } = useAuthStore()
  const isAuthed = Boolean(access)

  return (
    <header className="border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/movies" className="inline-flex items-center">
          <img src="/logo.svg" alt={import.meta.env.VITE_APP_NAME ?? 'Watchmate Web'} className="h-8 w-8" />
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/movies" className={({ isActive }) => `text-blue-600 underline ${isActive ? 'font-semibold' : ''}`}>
            Movies
          </NavLink>
          {isAuthed && (
            <NavLink to="/watchlists" className={({ isActive }) => `text-blue-600 underline ${isActive ? 'font-semibold' : ''}`}>
              Watchlists
            </NavLink>
          )}
          {isAuthed && is_superuser && (
            <NavLink to="/movies/new" className={({ isActive }) => `text-blue-600 underline ${isActive ? 'font-semibold' : ''}`}>
              Create Movie
            </NavLink>
          )}
          {!isAuthed ? (
            <>
              <Link to="/login" className="text-blue-600 underline">Login</Link>
              <Link to="/signup" className="text-blue-600 underline">Signup</Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user?.username ?? 'User'}</span>
              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
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
