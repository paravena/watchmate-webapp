import { useAuthStore } from '@/store/auth.store'

export function WatchlistsPage() {
  const { access } = useAuthStore()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Watchlists</h1>
      <p className="text-sm text-gray-600">Protected area. Your token starts with: {access?.slice(0, 10)}...</p>
      <ul className="list-disc pl-6 mt-3">
        <li>My Watchlist (stub)</li>
      </ul>
    </div>
  )
}
