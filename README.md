# Watchmate Web

A React + TypeScript app bootstrapped with Vite that consumes a Django REST API.

- API base URL is configurable via `VITE_API_BASE_URL` (default: `http://localhost:8000`).
- Swagger docs for the API: http://localhost:8000/swagger

## Getting started

1. Install deps:

   npm i

2. Copy `.env.example` to `.env` and adjust if needed:

   cp .env.example .env

3. Run the app:

   npm run dev

The app expects the backend to be available at `VITE_API_BASE_URL`.

## Build and preview

- Build: `npm run build`
- Preview: `npm run preview`

## Lint, format, and test

- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm run test`

## Architecture notes

- React Router v6 with public and protected routes. `/` redirects to `/movies`.
- Zustand (with persist) stores tokens and current user.
- Axios instance reads `VITE_API_BASE_URL` and attaches `Authorization: Bearer <access>`.
- 401 responses trigger a refresh flow (`POST /api/auth/token/refresh/`) with queuing of pending requests.
- React Query handles server cache, fetching, pagination, and invalidation.
- Tailwind CSS for minimal styles.
- Swagger for exploring endpoints: http://localhost:8000/swagger

