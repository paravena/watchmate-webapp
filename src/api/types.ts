export type Tokens = { access: string; refresh: string }

export type Movie = {
  id: number
  title: string
  description: string
}

export type Genre = {
  id: number
  name: string
}

export type Platform = {
  id: number
  name: string
  website?: string
  description?: string
}

export type MovieDetail = {
  id: number
  title: string
  description: string
  release_date?: string | null
  duration?: number | null
  poster_url?: string | null
  genres?: Genre[]
  platforms?: Platform[]
  avg_rating?: number
}

export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
