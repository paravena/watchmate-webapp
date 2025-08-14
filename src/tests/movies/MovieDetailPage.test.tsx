import { describe, expect, it } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { MovieDetailPage } from '@/features/movies/pages/MovieDetailPage'
import { renderWithProviders } from '@/tests/utils'
import { useAuthStore } from '@/store/auth.store'

describe('MovieDetailPage', () => {
  it('renders star rating UI', async () => {
    useAuthStore.getState().logout()
    renderWithProviders(<MovieDetailPage />)
    const stars = await screen.findAllByLabelText(/star/)
    expect(stars.length).toBe(10)
  })

  it('shows Add to Watchlist for authenticated users', async () => {
    const payload = btoa(JSON.stringify({ is_superuser: false }))
    useAuthStore.getState().setTokens(`aaa.${payload}.ccc`, 'refresh-token')
    renderWithProviders(<MovieDetailPage />)
    expect(await screen.findByText(/Add to Watchlist/i)).toBeInTheDocument()
  })

  it('shows Edit movie for superusers', async () => {
    const payload = btoa(JSON.stringify({ is_superuser: true }))
    useAuthStore.getState().setTokens(`aaa.${payload}.ccc`, 'refresh-token')
    renderWithProviders(<MovieDetailPage />)
    expect(await screen.findByText(/Edit movie/i)).toBeInTheDocument()
  })

  it('submits rating and shows success message', async () => {
    useAuthStore.getState().logout()
    renderWithProviders(<MovieDetailPage />)
    const stars = await screen.findAllByLabelText(/star/)
    fireEvent.click(stars[6])
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText(/Thanks!/i)).toBeInTheDocument()
  })
})
