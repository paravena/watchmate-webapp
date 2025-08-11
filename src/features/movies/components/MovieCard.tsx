import type { Movie } from '@/api/types'
import { Link } from 'react-router-dom'

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold text-lg">{movie.title}</h3>
      {movie.description && <p className="text-sm text-gray-600">{movie.description}</p>}
      <Link to={`/movies/${movie.id}`} className="inline-block mt-2 text-blue-600 underline">
        View details
      </Link>
    </div>
  )
}
