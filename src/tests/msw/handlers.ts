import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const mockGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' },
]

const mockPlatforms = [
  { id: 1, name: 'Netflix', website: 'https://www.netflix.com' },
  { id: 2, name: 'Hulu', website: 'https://www.hulu.com' },
  { id: 3, name: 'HBO Max' },
]

export const handlers = [
  http.post(`${API}/api/auth/token/`, async ({ request }) => {
    const body = (await request.json()) as any
    if (body.username && body.password) {
      return HttpResponse.json({ access: 'access-token', refresh: 'refresh-token' })
    }
    return new HttpResponse('Unauthorized', { status: 401 })
  }),
  http.get(`${API}/api/movies/`, () => {
    return HttpResponse.json({ count: 1, next: null, previous: null, results: [{ id: 1, title: 'Mock Movie', description: 'A mocked description' }] })
  }),
  http.get(`${API}/api/movies/:id/`, ({ params }) => {
    const { id } = params as { id: string }
    return HttpResponse.json({
      id: Number(id),
      title: 'Mock Movie',
      description: 'Mock details',
      poster_url: 'https://picsum.photos/200/300',
      avg_rating: 4.2,
      genres: mockGenres.slice(0, 2),
      platforms: mockPlatforms.slice(0, 2),
    })
  }),
  http.post(`${API}/api/movies/:id/rate/`, async () => {
    return HttpResponse.json({ ok: true })
  }),
  http.get(`${API}/api/platforms/`, () => {
    return HttpResponse.json(mockPlatforms)
  }),
  http.get(`${API}/api/genres/`, () => {
    return HttpResponse.json(mockGenres)
  }),
  http.patch(`${API}/api/movies/:id/`, async ({ request, params }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as any
    // Simulate applying updates and returning updated detail
    return HttpResponse.json({
      id: Number(id),
      title: 'Mock Movie',
      description: 'Mock details',
      poster_url: body.poster_url ?? 'https://picsum.photos/200/300',
      avg_rating: 4.2,
      genres: (body.genres ?? [1, 2]).map((gid: number) => mockGenres.find((g) => g.id === gid)).filter(Boolean),
      platforms: (body.platforms ?? [1, 2]).map((pid: number) => mockPlatforms.find((p) => p.id === pid)).filter(Boolean),
    })
  }),
]
