import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
  id: number
  username: string
  email?: string
}

export type AuthState = {
  access: string | null
  refresh: string | null
  user: User | null
  setTokens: (access: string, refresh: string) => void
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      user: null,
      setTokens: (access, refresh) => set({ access, refresh }),
      setUser: (user) => set({ user }),
      logout: () => set({ access: null, refresh: null, user: null }),
    }),
    { name: 'auth-store' },
  ),
)

export const isAccessTokenExpired = (token?: string | null) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number }
    if (!payload.exp) return false
    const now = Math.floor(Date.now() / 1000)
    return payload.exp <= now
  } catch {
    return false
  }
}
