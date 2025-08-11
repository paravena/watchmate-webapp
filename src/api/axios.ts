import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

let isRefreshing = false
let failedQueue: {
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
  config: InternalAxiosRequestConfig
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    } else {
      if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
      resolve(api(config))
    }
  })
  failedQueue = []
}

export const api: AxiosInstance = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const { access } = useAuthStore.getState()
  if (access && config.headers) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { refresh, setTokens, logout } = useAuthStore.getState()

      if (!refresh) {
        logout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      isRefreshing = true
      try {
        const resp = await axios.post(`${baseURL}/api/auth/token/refresh/`, { refresh })
        const newAccess = (resp.data as any).access as string
        setTokens(newAccess, refresh)
        processQueue(null, newAccess)
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr)
        useAuthStore.getState().logout()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
