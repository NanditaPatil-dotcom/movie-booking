import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Home from './pages/Home'
import Movies from './pages/Movies'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { Navigation } from './components/Navigation'
import { Button } from './components/ui/Button'
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

// ShowTime selection page
function ShowTime() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')

  const times = ['10:00 AM', '1:30 PM', '5:00 PM', '7:30 PM', '10:00 PM']

  const goSeats = () => {
    const movieId = id || 'sample'
    if (!selected) return
    navigate(`/seats/${movieId}?time=${encodeURIComponent(selected)}`)
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          <Panel style={{ height: '22rem' }}>
            <div style={{ height: '100%', background: '#BFBFBF', borderRadius: '0.5rem' }} />
          </Panel>
          <Panel>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Select Show Time</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelected(t)}
                  style={{
                    height: '2.5rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${colors.gray}${selected === t ? '55' : '33'}`,
                    background: selected === t ? colors.light : colors.white,
                    color: colors.gray,
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button size="lg" style={{ width: '100%' }} onClick={goSeats} disabled={!selected}>
                Select Movie Seats
              </Button>
            </div>
          </Panel>
        </div>
      </Container>
    </main>
  )
}

// Seats selection page
function Seats() {
  const { id } = useParams()
  const query = useQuery()
  const navigate = useNavigate()
  const time = query.get('time') || '10:00 AM'

  const rows = 'ABCDEFGHIJ'.split('')
  const cols = Array.from({ length: 14 }, (_, i) => i + 1)
  const [selected, setSelected] = useState([])

  const toggleSeat = (seat) => {
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  const proceed = () => {
    const movieId = id || 'sample'
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
              <div style={{ display: 'grid', gap: '0.35rem', justifyContent: 'center' }}>
                {rows.map((r) => (
                  <div key={r} style={{ display: 'grid', gridTemplateColumns: `24px repeat(${cols.length}, 28px)`, gap: '0.35rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#7A7676' }}>{r}</div>
                    {cols.map((c) => {
                      const seat = `${r}${c}`
                      const isSel = selected.includes(seat)
                      return (
                        <div
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '0.35rem',
                            border: `1px solid ${colors.gray}33`,
                            background: isSel ? '#BDE7C1' : '#EDEDED',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: colors.gray
                          }}
                          title={seat}
                        >
                          {c}
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
              <div style={{ marginBottom: '0.75rem' }}>{time}</div>
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

// Payment page
function Payment() {
  const { id } = useParams()
  const query = useQuery()
  const navigate = useNavigate()
  const time = query.get('time') || '10:00 AM'
  const seats = (query.get('seats') || '').split(',').filter(Boolean)

  const pricePerSeat = 90
  const subtotal = seats.length * pricePerSeat
  const convenience = 50
  const tax = 30
  const total = subtotal + convenience + tax

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('card')

  const confirm = () => {
    // Mock payment success
    navigate('/confirmation')
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
              <div style={{ marginBottom: '0.25rem' }}>{time}</div>
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
              <Button size="lg" style={{ width: '100%' }} onClick={confirm}>Confirm and Pay</Button>
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/showtime/:id" element={<ShowTime />} />
          <Route path="/showtime" element={<ShowTime />} />
          <Route path="/seats/:id" element={<Seats />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
