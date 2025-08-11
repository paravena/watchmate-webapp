import { useRoutes, Navigate } from 'react-router-dom'
import App from '@/App'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignupPage } from '@/features/auth/pages/SignupPage'
import { MoviesListPage } from '@/features/movies/pages/MoviesListPage'
import { MovieDetailPage } from '@/features/movies/pages/MovieDetailPage'
import { WatchlistsPage } from '@/features/watchlists/pages/WatchlistsPage'
import { AuthGuard } from '@/features/auth/components/AuthGuard'

export function Router() {
  const element = useRoutes([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Navigate to="/movies" replace /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'signup', element: <SignupPage /> },
        { path: 'movies', element: <MoviesListPage /> },
        { path: 'movies/:id', element: <MovieDetailPage /> },
        {
          path: 'watchlists',
          element: (
            <AuthGuard>
              <WatchlistsPage />
            </AuthGuard>
          ),
        },
      ],
    },
  ])

  return element
}
