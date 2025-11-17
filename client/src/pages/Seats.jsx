import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigation } from '../components/Navigation'
import { Button } from '../components/ui/Button'
import api from '../utils/axios'

const colors = {
  red: '#BD292C',
  white: '#FFFFFF',
  light: '#D9D9D9',
  gray: '#3F3B3B'
}

function useQuery() {
  const { search } = window.location
  return new URLSearchParams(search)
}

function formatTime(isoString) {
  if (!isoString) return '10:00 AM'
  // If it's an ISO timestamp or any parsable date, format it to locale time
  const date = new Date(isoString)
  if (!isNaN(date)) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  // If it's already a human-readable time like "10:00 AM", normalize and return
  const timeMatch = String(isoString).trim().match(/^(\d{1,2}:\d{2}\s?(AM|PM))$/i)
  if (timeMatch) {
    return timeMatch[0].toUpperCase()
  }

  // Fallback to returning the raw string
  return String(isoString)
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

// Seats selection page
export default function Seats() {
  const { id } = useParams()
  const query = useQuery()
  const navigate = useNavigate()
  const { user } = useAuth()
  // Accept either `showtime` (used in some places) or `time` (used elsewhere)
  const time = query.get('showtime') || query.get('time') || '10:00 AM'

  const rows = 'ABCDEFGHIJ'.split('')
  const cols = Array.from({ length: 14 }, (_, i) => i + 1)
  const [selected, setSelected] = useState([])
  const [bookedSeats, setBookedSeats] = useState([])
  const [loadingSeats, setLoadingSeats] = useState(true)

  // Fetch booked seats on mount
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        console.log('[Seats] Fetching booked seats for movie:', id, 'time:', time)
        const response = await api.get(`/bookings/booked-seats/${id}/${encodeURIComponent(time)}`)
        const booked = response.data.bookedSeats || []
        console.log('[Seats] Booked seats:', booked)
        setBookedSeats(booked)
      } catch (error) {
        console.error('[Seats] Failed to fetch booked seats:', error)
        // Continue with empty booked seats on error
        setBookedSeats([])
      } finally {
        setLoadingSeats(false)
      }
    }

    fetchBookedSeats()
  }, [id, time])

  // Restore booking state on mount
  useEffect(() => {
    const restoreBooking = async () => {
      const { getBookingPayload } = await import('../utils/bookingStorage')
      const pendingBooking = getBookingPayload()
      if (pendingBooking && pendingBooking.selectedSeats) {
        setSelected(pendingBooking.selectedSeats)
      }
    }
    restoreBooking()
  }, [])

  const toggleSeat = (seat) => {
    // Prevent selecting already booked seats
    if (bookedSeats.includes(seat)) {
      alert('This seat is already booked!')
      return
    }

    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  const proceed = async () => {
    console.log('[Seats] Proceed clicked, checking auth state:', { user: !!user, userEmail: user?.email })

    const movieId = id || 'sample'

    if (!user) {
      console.log('[Seats] User not authenticated, saving booking and redirecting to login')
      // Save booking payload and redirect to login
      const payload = {
        movieId,
        showtimeId: time, // Using time as showtimeId for simplicity
        selectedSeats: selected,
        price: 90, // Price per seat
        // Use `time` in redirectPath since SignIn/payment handlers expect `time` param
        redirectPath: `/seats/${movieId}?time=${encodeURIComponent(time)}`
      }

      // Import the save function dynamically to avoid circular imports
      const { saveBookingPayload } = await import('../utils/bookingStorage')
      if (saveBookingPayload(payload)) {
        console.log('[Seats] Booking saved, redirecting to signin')
        navigate(`/signin?redirect=${encodeURIComponent(`/seats/${movieId}?time=${encodeURIComponent(time)}`)}`)
      } else {
        console.log('[Seats] Failed to save booking')
        alert('Failed to save booking. Please try again.')
      }
      return
    }

    console.log('[Seats] User authenticated, proceeding to payment')
    // Clear any pending booking since we're proceeding with authenticated user
    const { clearBookingPayload } = await import('../utils/bookingStorage')
    clearBookingPayload()

    navigate(`/payment/${movieId}?time=${encodeURIComponent(time)}&seats=${selected.join(',')}`)
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
          <Panel>
            <h2 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Select your seats</h2>
            <div style={{ background: colors.white, borderRadius: '0.5rem', border: `1px solid ${colors.gray}22`, padding: '1rem' }}>
              <div style={{ textAlign: 'center', color: '#5A5656', marginBottom: '0.75rem' }}>SCREEN</div>
              {loadingSeats && (
                <div style={{ textAlign: 'center', padding: '1rem', color: colors.gray }}>
                  Loading seat availability...
                </div>
              )}
              <div style={{ display: 'grid', gap: '0.35rem', justifyContent: 'center' }}>
                {rows.map((r) => (
                  <div key={r} style={{ display: 'grid', gridTemplateColumns: `24px repeat(${cols.length}, 28px)`, gap: '0.35rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#7A7676' }}>{r}</div>
                    {cols.map((c) => {
                      const seat = `${r}${c}`
                      const isSel = selected.includes(seat)
                      const isBooked = bookedSeats.includes(seat)

                      return (
                        <div
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '0.35rem',
                            border: `1px solid ${colors.gray}33`,
                            background: isBooked ? '#FF6B6B' : (isSel ? '#BDE7C1' : '#EDEDED'),
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: colors.gray,
                            opacity: isBooked ? 0.7 : 1
                          }}
                          title={isBooked ? `${seat} - Already Booked` : seat}
                        >
                          {isBooked ? '❌' : c}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Button size="lg" onClick={proceed} disabled={selected.length === 0}>
                Proceed to payment
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </Panel>
          <Panel>
            <h3 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Booking Summary</h3>
            <div style={{ fontSize: '0.875rem', color: '#5A5656' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 700 }}>The Cosmic Adventure</div>
              <div style={{ marginBottom: '0.5rem' }}><span style={{ padding: '0.1rem 0.5rem', borderRadius: '9999px', background: colors.light, border: `1px solid ${colors.gray}33` }}>Sci-Fi</span></div>
              <div style={{ marginBottom: '0.25rem' }}>Grand Cinema Hall 1</div>
              <div style={{ marginBottom: '0.25rem' }}>Oct 28, 2025</div>
              <div style={{ marginBottom: '0.75rem' }}>{formatTime(time)}</div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>Selected Seats: {selected.join(', ') || '-'}</div>
              </div>
            </div>
          </Panel>
        </div>
      </Container>
    </main>
  )
}