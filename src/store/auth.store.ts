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
  is_superuser: boolean
  setTokens: (access: string, refresh: string) => void
  setUser: (user: User | null) => void
  setIsSuperuser: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      user: null,
      is_superuser: false,
      setTokens: (access, refresh) => {
        // Decode JWT access token to extract is_superuser from payload when available
        let is_superuser = false
        try {
          const payloadRaw = access?.split?.('.')?.[1]
          if (payloadRaw) {
            const payload = JSON.parse(atob(payloadRaw)) as any
            if (typeof payload?.is_superuser === 'boolean') {
              is_superuser = payload.is_superuser
            }
          }
        } catch {}
        set({ access, refresh, is_superuser })
      },
      setUser: (user) => set({ user }),
      setIsSuperuser: (value) => set({ is_superuser: value }),
      logout: () => set({ access: null, refresh: null, user: null, is_superuser: false }),
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
