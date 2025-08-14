import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Header } from '@/components/Layout/Header'
import { renderWithProviders } from '@/tests/utils'
import { useAuthStore } from '@/store/auth.store'

describe('Header', () => {
  it('renders logo and guest links', () => {
    useAuthStore.getState().logout()
    renderWithProviders(<Header />)
    expect(screen.getByRole('img', { name: /Watchmate Web/i })).toBeInTheDocument()
    expect(screen.getByText(/Movies/i)).toBeInTheDocument()
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
    expect(screen.queryByText(/Watchlists/i)).not.toBeInTheDocument()
  })

  it('shows Watchlists when authenticated', () => {
    const payload = btoa(JSON.stringify({ is_superuser: false }))
    useAuthStore.getState().setTokens(`aaa.${payload}.ccc`, 'refresh-token')
    renderWithProviders(<Header />)
    expect(screen.getByText(/Watchlists/i)).toBeInTheDocument()
    expect(screen.queryByText(/Create Movie/i)).not.toBeInTheDocument()
  })

  it('shows Create Movie when superuser', () => {
    const payload = btoa(JSON.stringify({ is_superuser: true }))
    useAuthStore.getState().setTokens(`aaa.${payload}.ccc`, 'refresh-token')
    renderWithProviders(<Header />)
    expect(screen.getByText(/Create Movie/i)).toBeInTheDocument()
  })
})
