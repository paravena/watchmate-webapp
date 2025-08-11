import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Header } from '@/components/Layout/Header'
import { renderWithProviders } from '@/tests/utils'
import { useAuthStore } from '@/store/auth.store'

describe('Header', () => {
  it('renders app name and links', () => {
    useAuthStore.getState().logout()
    renderWithProviders(<Header />)
    expect(screen.getByText(/Watchmate Web/i)).toBeInTheDocument()
    expect(screen.getByText(/Movies/i)).toBeInTheDocument()
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })
})
