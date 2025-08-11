export type Tokens = { access: string; refresh: string }

export type Movie = {
  id: number
  title: string
  description?: string
}

export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
