import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMovie, rateMovie } from '@/api/movies'
import { useState } from 'react'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id!),
    enabled: !!id,
  })

  const [rating, setRating] = useState(5)
  const rate = useMutation({
    mutationFn: () => rateMovie(id!, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie', id] })
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p role="alert">Failed to load</p>

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{data?.title}</h1>
      {data?.description && <p className="text-gray-700">{data.description}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          rate.mutate()
        }}
        className="space-x-2"
      >
        <label>
          Rate:
          <select
            className="ml-2 border rounded p-1"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button className="px-3 py-1 rounded bg-blue-600 text-white">Submit</button>
        {rate.isError && <span className="text-red-600 ml-2">Failed</span>}
        {rate.isSuccess && <span className="text-green-600 ml-2">Thanks!</span>}
      </form>
    </div>
  )
}
