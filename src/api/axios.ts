import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios'
import { useAuthStore } from '@/store/auth.store'

// Base URL for API requests
const baseURL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://localhost:8000'

// Tracks whether a token refresh request is in-flight
let isRefreshingToken = false

// Queue of requests awaiting a refreshed access token
let pendingQueue: {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
  config: InternalAxiosRequestConfig & { _retry?: boolean }
}[] = []

// Flushes the pending queue: if error provided, rejects all, otherwise retries with the new token
const flushPendingQueue = (err: unknown, newAccessToken: string | null = null) => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (err) {
      reject(err)
      return
    }

    // Ensure the Authorization header is set when we have a new token
    if (newAccessToken) {
      config.headers =
        config.headers instanceof AxiosHeaders
          ? (config.headers as AxiosHeaders).set('Authorization', `Bearer ${newAccessToken}`)
          : new AxiosHeaders(Object.assign({}, config.headers as any, { Authorization: `Bearer ${newAccessToken}` }))
    }

    resolve(api(config))
  })
  pendingQueue = []
}

// Shared Axios instance for the app
export const api: AxiosInstance = axios.create({ baseURL })

// Attach Authorization header from the auth store when available
api.interceptors.request.use((config) => {
  const { access } = useAuthStore.getState()
  if (access) {
    config.headers =
      config.headers instanceof AxiosHeaders
        ? (config.headers as AxiosHeaders).set('Authorization', `Bearer ${access}`)
        : new AxiosHeaders(Object.assign({}, config.headers as any, { Authorization: `Bearer ${access}` }))
  }
  return config
})

// Global response interceptor to handle 401 and refresh the token
api.interceptors.response.use(
  (response) => response,
  async (err: AxiosError) => {
    const requestConfig = err.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Only attempt refresh on 401 and when we haven't retried yet
    if (err.response?.status === 401 && !requestConfig._retry) {
      requestConfig._retry = true

      const store = useAuthStore.getState()
      const { refresh, setTokens, logout } = store

      // If there's no refresh token, logout and reject
      if (!refresh) {
        logout()
        return Promise.reject(err)
      }

      // If a refresh is already in progress, enqueue this request
      if (isRefreshingToken) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: requestConfig })
        })
      }

      isRefreshingToken = true
      try {
        const refreshResponse = await axios.post(`${baseURL}/api/auth/token/refresh/`, { refresh })
        const newAccess = (refreshResponse.data as any).access as string

        setTokens(newAccess, refresh)
        flushPendingQueue(null, newAccess)

        // Retry the original request with the new token
        requestConfig.headers =
          requestConfig.headers instanceof AxiosHeaders
            ? (requestConfig.headers as AxiosHeaders).set('Authorization', `Bearer ${newAccess}`)
            : new AxiosHeaders(Object.assign({}, requestConfig.headers as any, { Authorization: `Bearer ${newAccess}` }))
        return api(requestConfig)
      } catch (refreshError) {
        flushPendingQueue(refreshError)
        store.logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshingToken = false
      }
    }

    // Non-401 errors or already retried: just propagate
    return Promise.reject(err)
  },
)
