import { useQuery } from '@tanstack/react-query'
import { fetchMovies } from '@/api/movies'
import { MovieCard } from '../components/MovieCard'

export function MoviesListPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['movies'], queryFn: () => fetchMovies() })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load</p>

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold mb-2">Movies</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {data?.results?.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  )
}
