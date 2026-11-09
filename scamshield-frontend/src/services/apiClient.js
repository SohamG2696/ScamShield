import axios from 'axios'

export const AZURE_PRODUCTION_BACKEND_URL =
  'https://scamshield-backend.proudglacier-1b7506b7.centralindia.azurecontainerapps.io'
export const LOCAL_DEV_BACKEND_URL = 'http://localhost:8000'

export function getBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()

  if (import.meta.env.PROD) {
    // In production build: enforce HTTPS and ensure it never points to localhost
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return AZURE_PRODUCTION_BACKEND_URL
    }
    return envUrl.replace(/\/+$/, '')
  }

  // In local development mode: use env URL if present, otherwise default to local backend
  return envUrl ? envUrl.replace(/\/+$/, '') : LOCAL_DEV_BACKEND_URL
}

export const BASE_URL = getBaseUrl()

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
      let message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
    error?.message

    if (!message || error?.code === 'ERR_NETWORK') {
      message = import.meta.env.PROD
        ? 'Could not connect to the ScamShield analysis service. Please check your network connection and try again.'
        : `Could not connect to ScamShield backend at ${BASE_URL}. Please ensure the backend server is running.`
    }

    return Promise.reject({ ...error, friendlyMessage: message })
  }
)
