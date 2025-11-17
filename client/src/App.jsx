import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Seats from './pages/Seats'
import Showtime from './pages/Showtime'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { Navigation } from './components/Navigation'
import { Button } from './components/ui/Button'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { RequireAuth } from './components/RequireAuth'
import api from './utils/axios'
import './styles/App.css'

const colors = {
  red: '#BD292C',
  white: '#FFFFFF',
  light: '#D9D9D9',
  gray: '#3F3B3B'
}

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

function formatTime(isoString) {
  if (!isoString) return '10:00 AM'
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  } catch {
    return isoString
  }
}

function Container({ children, maxWidth = '1200px' }) {
  return (
    <div style={{ maxWidth, margin: '0 auto', padding: '2rem 1rem' }}>{children}</div>
  )
}

function Panel({ children, style }) {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: '0.5rem',
        border: `1px solid ${colors.gray}22`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        padding: '1rem',
        ...style
      }}
    >
      {children}
    </div>
  )
}




// Payment page
function Payment() {
  const { id } = useParams()
  const query = useQuery()
  const navigate = useNavigate()
  const { user } = useAuth()
  const time = query.get('showtime') || '10:00 AM'
  const seats = (query.get('seats') || '').split(',').filter(Boolean)

  const pricePerSeat = 90
  const subtotal = seats.length * pricePerSeat
  const convenience = 50
  const tax = 30
  const total = subtotal + convenience + tax

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!user) {
      alert('Please log in to complete your booking')
      navigate('/signin')
      return
    }

    console.log('[Payment] User object:', user)
    console.log('[Payment] Seats array:', seats)

    setLoading(true)
    try {
      console.log('[Payment] Creating booking:', { movieId: id, showtime: time, seats, totalAmount: total })

      const bookingData = {
        userId: user._id || user.id,
        movieId: id,
        movieTitle: 'Movie Title', // This should come from movie data
        showtime: time,
        seats,
        totalAmount: total,
        email: user.email,
        name: user.name
      }

      console.log('[Payment] Sending booking data:', bookingData)

      const response = await api.post('/bookings/create', bookingData)

      console.log('[Payment] Booking created successfully:', response.data)
      navigate('/confirmation')
    } catch (error) {
      console.error('[Payment] Booking failed:', error)

      if (error.response?.status === 400 && error.response?.data?.error?.includes('already booked')) {
        alert('Booking conflict: One or more seats were already booked. Please select different seats.')
        // Navigate back to seats page to refresh and show updated availability
        navigate(`/seats/${id}?showtime=${encodeURIComponent(time)}`)
      } else {
        alert('Booking failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          <Panel>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Payment Details</h2>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Contact Information</div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email:</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{ width: '100%', height: '2.5rem', borderRadius: '0.5rem', padding: '0 0.75rem', border: `1px solid ${colors.gray}33`, background: colors.white, color: colors.gray, marginBottom: '0.5rem' }}
              />
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone:</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                style={{ width: '100%', height: '2.5rem', borderRadius: '0.5rem', padding: '0 0.75rem', border: `1px solid ${colors.gray}33`, background: colors.white, color: colors.gray }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Choose Payment Method</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input type="radio" name="pm" checked={method==='card'} onChange={() => setMethod('card')} /> Credit/Debit Card
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input type="radio" name="pm" checked={method==='upi'} onChange={() => setMethod('upi')} /> UPI / Digital Wallet
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="radio" name="pm" checked={method==='mobile'} onChange={() => setMethod('mobile')} /> Mobile Wallet
              </label>
            </div>
          </Panel>
          <Panel>
            <h3 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Booking Summary</h3>
            <div style={{ fontSize: '0.875rem', color: '#5A5656' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 700 }}>The Cosmic Adventure</div>
              <div style={{ marginBottom: '0.5rem' }}><span style={{ padding: '0.1rem 0.5rem', borderRadius: '9999px', background: colors.light, border: `1px solid ${colors.gray}33` }}>Sci-Fi</span></div>
              <div style={{ marginBottom: '0.25rem' }}>Grand Cinema Hall 1</div>
              <div style={{ marginBottom: '0.25rem' }}>Oct 28, 2025</div>
              <div style={{ marginBottom: '0.25rem' }}>{formatTime(time)}</div>
              <div style={{ marginBottom: '0.75rem' }}>Seats: {seats.join(', ') || '-'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.25rem' }}>
                <div>Subtotal</div><div>Rs. {subtotal}</div>
                <div>Convenience fee</div><div>Rs. {convenience}</div>
                <div>Tax (8%)</div><div>Rs. {tax}</div>
                <div style={{ fontWeight: 800, borderTop: `1px solid ${colors.gray}22`, paddingTop: '0.25rem' }}>Total</div>
                <div style={{ fontWeight: 800, borderTop: `1px solid ${colors.gray}22`, paddingTop: '0.25rem' }}>Rs. {total}</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button size="lg" style={{ width: '100%' }} onClick={confirm} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm and Pay'}
              </Button>
            </div>
          </Panel>
        </div>
      </Container>
    </main>
  )
}

function Confirmation() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />
      <Container maxWidth="900px">
        <div style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Thank You !</h1>
          <p style={{ color: '#5A5656', marginBottom: '1rem' }}>
            A confirmation regarding the tickets booked is sent to your email
          </p>
          <Link to="/movies" style={{ color: colors.red, fontWeight: 700, textDecoration: 'none' }}>Enjoy your Movie</Link>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/movies">
              <Button size="lg">Continue browsing movies</Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/showtime/:id" element={<Showtime />} />
            <Route path="/seats/:id" element={<Seats />} />
            <Route path="/payment/:id" element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            } />
            <Route path="/confirmation" element={
              <RequireAuth>
                <Confirmation />
              </RequireAuth>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
