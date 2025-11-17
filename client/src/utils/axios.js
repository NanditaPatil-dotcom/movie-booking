import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API] Adding auth token to request:', config.url)
    } else {
      console.log('[API] No auth token found for request:', config.url)
    }
    return config
  },
  (error) => {
    console.error('[API] Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      console.log('[API] 401 response received, checking if user was authenticated...')

      // Check if user was previously authenticated
      const token = localStorage.getItem('authToken')
      const currentUser = localStorage.getItem('currentUser')

      if (token && currentUser) {
        console.log('[API] User was authenticated but got 401 - token likely expired, logging out')

        // Clear auth data
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')

        // Reload page to reset auth state (or dispatch logout if using context)
        // For now, we'll reload to ensure clean state
        window.location.href = '/signin'
        return Promise.reject(error)
      } else {
        console.log('[API] User was not authenticated, 401 is expected')
      }
    }

    console.error('[API] Response error:', response?.status, error.message)
    return Promise.reject(error)
  }
)

export default api