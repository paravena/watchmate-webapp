import { api } from './axios'
import type { Movie, Paginated, MovieDetail } from './types'

export async function fetchMovies(page?: number) {
  const url = page ? `/api/movies/?page=${page}` : '/api/movies/'
  const { data } = await api.get<Paginated<Movie>>(url)
  return data
}

export async function fetchMovie(id: string | number) {
  const { data } = await api.get<MovieDetail>(`/api/movies/${id}/`)
  return data
}

export async function rateMovie(id: string | number, score: number) {
  const { data } = await api.post(`/api/movies/${id}/rate/`, { score })
  return data
}

export async function fetchPlatforms() {
  const { data } = await api.get('/api/platforms/')
  return data
}

export async function fetchGenres() {
  const { data } = await api.get('/api/genres/')
  return data
}

export async function updateMovie(
  id: string | number,
  payload: Partial<{
    poster_url: string | null
    genres: number[]
    platforms: number[]
    title: string
    description: string
    release_date: string | null
    duration: number | null
  }>,
) {
  const { data } = await api.patch<MovieDetail>(`/api/movies/${id}/`, payload)
  return data
}
