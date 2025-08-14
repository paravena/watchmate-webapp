import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMovie, rateMovie, fetchGenres, fetchPlatforms, updateMovie } from '@/api/movies'
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import type { Genre, Platform } from '@/api/types'
import PlatformList from '@/features/movies/pages/PlatformList'
import GenreList from '@/features/movies/pages/GenreList'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id!),
    enabled: !!id,
  })

  const { access, is_superuser } = useAuthStore()

  const [rating, setRating] = useState(5)
  const rate = useMutation({
    mutationFn: () => rateMovie(id!, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie', id] })
    },
  })

  // Inline edit state (only for superusers)
  const [isEditing, setIsEditing] = useState(false)
  const [posterUrl, setPosterUrl] = useState<string>('')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([])

  useEffect(() => {
    if (data && isEditing) {
      setPosterUrl(data.poster_url ?? '')
      setSelectedGenres((data.genres ?? []).map((g) => g.id))
      setSelectedPlatforms((data.platforms ?? []).map((p) => p.id))
    }
  }, [data, isEditing])

  const { data: genresData } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () => fetchGenres() as Promise<Genre[]>,
    enabled: isEditing,
  })
  const { data: platformsData } = useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: () => fetchPlatforms() as Promise<Platform[]>,
    enabled: isEditing,
  })

  const avgRatingLabel = useMemo(() => {
    if (data?.avg_rating == null) return null
    const rounded = Math.round((data.avg_rating + Number.EPSILON) * 10) / 10
    return `${rounded} / 5`
    // Assuming a five-star average; adjust if backend uses different scale
  }, [data?.avg_rating])

  const save = useMutation({
    mutationFn: (payload: { poster_url: string | null; genres: number[]; platforms: number[] }) =>
      updateMovie(id!, payload),
    onSuccess: () => {
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['movie', id] })
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load</p>

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-4 items-start">
          {data?.poster_url && (
            <img
              src={data.poster_url}
              alt={`${data.title} poster`}
              className="w-28 sm:w-36 rounded shadow"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{data?.title}</h1>
            {data?.description && <p className="text-gray-700">{data.description}</p>}
            {avgRatingLabel && (
              <p className="text-sm text-gray-600 mt-1">Average rating: {avgRatingLabel}</p>
            )}
            <GenreList genres={data?.genres || []} />
            <PlatformList platforms={data?.platforms || []} />
          </div>
        </div>
        {access && is_superuser && (
          <div className="flex flex-col items-end gap-2">
            <Link to={`/movies/${id}/edit`} className="text-blue-600 underline whitespace-nowrap">
              Edit movie
            </Link>
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="text-blue-600 underline whitespace-nowrap"
            >
              {isEditing ? 'Cancel editing' : 'Modify details'}
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            save.mutate({
              poster_url: posterUrl || null,
              genres: selectedGenres,
              platforms: selectedPlatforms,
            })
          }}
          className="space-y-3 border rounded p-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Poster URL</label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <span className="block text-sm font-medium mb-1">Genres</span>
            <div className="flex flex-wrap gap-3">
              {(genresData ?? []).map((g) => {
                const checked = selectedGenres.includes(g.id)
                return (
                  <label key={g.id} className="inline-flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedGenres((prev) => [...prev, g.id])
                        else setSelectedGenres((prev) => prev.filter((id) => id !== g.id))
                      }}
                    />
                    {g.name}
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium mb-1">Platforms</span>
            <div className="flex flex-wrap gap-3">
              {(platformsData ?? []).map((p) => {
                const checked = selectedPlatforms.includes(p.id)
                return (
                  <label key={p.id} className="inline-flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPlatforms((prev) => [...prev, p.id])
                        else setSelectedPlatforms((prev) => prev.filter((id) => id !== p.id))
                      }}
                    />
                    {p.name}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
              disabled={save.isPending}
            >
              {save.isPending ? 'Saving...' : 'Save changes'}
            </button>
            {save.isError && <span className="text-red-600">Failed to save</span>}
            {save.isSuccess && <span className="text-green-600">Saved</span>}
          </div>
        </form>
      )}

      {/* Rating form with stars */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          rate.mutate()
        }}
      >
        <div className="py-3 flex items-center gap-2">
          <span>Rate:</span>
          <div role="group" aria-label="Rate" className="inline-flex">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
                data-testid={`star-${n}`}
                className="text-2xl leading-none px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
                onClick={() => setRating(n)}
                title={`${n}`}
              >
                <span className={n <= rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
              </button>
            ))}
          </div>
        </div>
        <button className="px-3 py-1 rounded bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent">
          Submit
        </button>
        {rate.isError && <span className="text-red-600 ml-2">Failed</span>}
        {rate.isSuccess && <span className="text-green-600 ml-2">Thanks!</span>}
      </form>

      {access && (
        <button className="py-1 px-3 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent text-gray-800">
          Add to Watchlist
        </button>
      )}
    </div>
  )
}
