import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/axios'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[Auth] Initializing auth state...')
      const token = localStorage.getItem('authToken')
      const currentUser = localStorage.getItem('currentUser')

      if (!token || !currentUser) {
        console.log('[Auth] No stored token/user, setting loading to false')
        setLoading(false)
        return
      }

      try {
        // Verify token with server
        console.log('[Auth] Verifying stored token with server...')
        const response = await api.get('/auth/me')

        // Token is valid, set user
        const userData = JSON.parse(currentUser)
        console.log('[Auth] Token valid, user authenticated:', userData.email)
        setUser(userData)
      } catch (error) {
        console.log('[Auth] Token verification failed:', error.response?.status, error.message)
        // Token invalid/expired, clear storage
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (token, userData) => {
    console.log('[Auth] Logging in user:', userData.email)
    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    console.log('[Auth] Logging out user')
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    // Clear axios default headers
    delete axios.defaults.headers.common['Authorization']
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}