import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('[RequireAuth] Checking auth for:', location.pathname, { user: !!user, loading })

  if (loading) {
    console.log('[RequireAuth] Auth still loading, showing loading screen')
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Verifying authentication...
      </div>
    )
  }

  if (!user) {
    console.log('[RequireAuth] User not authenticated, redirecting to signin')
    // Redirect to signin with the current location as redirect param
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  console.log('[RequireAuth] User authenticated, rendering protected content')
  return children
}