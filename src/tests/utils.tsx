import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { PropsWithChildren, ReactElement } from 'react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
    logger: { log: console.log, warn: console.warn, error: () => {} },
  })

export function renderWithProviders(ui: ReactElement) {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={createTestQueryClient()}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
  return render(ui, { wrapper: Wrapper })
}
