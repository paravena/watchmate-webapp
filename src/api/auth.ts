import { api } from './axios'
import type { Tokens } from './types'
import type { SignupInput, LoginInput } from './schemas'
import { useAuthStore, type User } from '@/store/auth.store'

export async function login(payload: LoginInput): Promise<Tokens> {
  const { data } = await api.post<Tokens>('/api/auth/token/', payload)
  useAuthStore.getState().setTokens(data.access, data.refresh)
  return data
}

export async function signup(payload: SignupInput): Promise<{ user: User; access?: string; refresh?: string; tokens?: Tokens }> {
  const { data } = await api.post('/api/auth/signup/', payload)

  // Accept either top-level { access, refresh } or { tokens: { access, refresh } }
  const tokens = (data as any).tokens as Tokens | undefined
  const access = (data as any).access as string | undefined
  const refresh = (data as any).refresh as string | undefined
  const a = tokens?.access ?? access
  const r = tokens?.refresh ?? refresh
  if (a && r) {
    useAuthStore.getState().setTokens(a, r)
  }
  if ((data as any).user) {
    useAuthStore.getState().setUser((data as any).user as User)
  }
  return data as any
}

export function logout() {
  useAuthStore.getState().logout()
}
