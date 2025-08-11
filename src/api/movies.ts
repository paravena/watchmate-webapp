import { api } from './axios'
import type { Movie, Paginated } from './types'

export async function fetchMovies(page?: number) {
  const url = page ? `/api/movies/?page=${page}` : '/api/movies/'
  const { data } = await api.get<Paginated<Movie>>(url)
  return data
}

export async function fetchMovie(id: string | number) {
  const { data } = await api.get<Movie>(`/api/movies/${id}/`)
  return data
}

export async function rateMovie(id: string | number, rating: number) {
  const { data } = await api.post(`/api/movies/${id}/rate/`, { rating })
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
