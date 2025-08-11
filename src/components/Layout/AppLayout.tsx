import { Header } from './Header'
import type { PropsWithChildren } from 'react'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 flex-1">{children}</main>
      <footer className="p-4 text-center text-sm text-gray-500">
        <a href="http://localhost:8000/swagger" target="_blank" rel="noreferrer">
          API Swagger Docs
        </a>
      </footer>
    </div>
  )
}
