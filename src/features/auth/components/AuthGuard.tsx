import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import type { PropsWithChildren } from 'react'

export function AuthGuard({ children }: PropsWithChildren) {
  const { access } = useAuthStore()
  const location = useLocation()

  if (!access) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
