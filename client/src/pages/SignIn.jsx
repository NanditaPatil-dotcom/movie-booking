import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import api from '../utils/axios'
import { Button } from '../components/ui/Button'
import { Navigation } from '../components/Navigation'
import { useAuth } from '../contexts/AuthContext'

export default function SignIn() {
  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get redirect path from query params
  const queryParams = new URLSearchParams(location.search)
  const redirectPath = queryParams.get('redirect') || '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user, token } = res.data

      // Use the auth context login method
      login(token, user)

      // Check for pending booking and proceed directly to payment
      const { getBookingPayload, clearBookingPayload } = await import('../utils/bookingStorage')
      const pendingBooking = getBookingPayload()

      if (pendingBooking) {
        // Clear the stored booking and navigate directly to payment
        clearBookingPayload()
        const paymentUrl = `/payment/${pendingBooking.movieId}?time=${encodeURIComponent(pendingBooking.showtimeId)}&seats=${pendingBooking.selectedSeats.join(',')}`
        navigate(paymentUrl)
      } else {
        // No pending booking, go to redirect path or home
        navigate(redirectPath)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Link to="/">
            <Button variant="outline" size="sm">Back to home</Button>
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '28rem',
              backgroundColor: colors.white,
              borderRadius: '0.5rem',
              border: `1px solid ${colors.gray}22`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              padding: '1.5rem'
            }}
          >
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: colors.gray }}>
              Welcome Back
            </h2>

            <form onSubmit={onSubmit}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  padding: '0 0.75rem',
                  border: `1px solid ${colors.gray}33`,
                  backgroundColor: colors.white,
                  color: colors.gray,
                  marginBottom: '0.75rem'
                }}
              />

              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  padding: '0 0.75rem',
                  border: `1px solid ${colors.gray}33`,
                  backgroundColor: colors.white,
                  color: colors.gray,
                  marginBottom: '0.75rem'
                }}
              />

              {error && (
                <div style={{ color: colors.red, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{error}</div>
              )}

              <div style={{ textAlign: 'center', margin: '0.75rem 0 1rem', fontSize: '0.875rem' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: colors.red, textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
              </div>

              <Button type="submit" size="lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
