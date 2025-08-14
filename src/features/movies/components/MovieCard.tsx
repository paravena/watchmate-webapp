import type { Movie } from '@/api/types'
import { Link } from 'react-router-dom'

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="border rounded p-4">
      <div className="flex gap-3">
        {movie.poster_url && (
          <img src={movie.poster_url} alt={`${movie.title} poster`} className="w-16 h-24 object-cover rounded" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{movie.title}</h3>
          {movie.description && <p className="text-sm text-gray-600">{movie.description}</p>}
          {typeof movie.avg_rating === 'number' && (
            <p className="text-xs text-gray-600 mt-1">Avg: {Math.round((movie.avg_rating + Number.EPSILON) * 10) / 10} / 5</p>
          )}
          <Link to={`/movies/${movie.id}`} className="inline-block mt-2 text-blue-600 underline">
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
