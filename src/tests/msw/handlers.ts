import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
]
