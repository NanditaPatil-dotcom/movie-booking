import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { Navigation } from '../components/Navigation'

export default function Showtime() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedShowtime, setSelectedShowtime] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`)
        setMovie(response.data)
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  const handleContinue = () => {
    if (selectedShowtime) {
      navigate(`/seats/${id}?showtime=${encodeURIComponent(selectedShowtime)}`)
    }
  }

  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
        <Navigation />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
          Loading movie details...
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
        <Navigation />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
          Movie not found
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/movies')}
            style={{
              color: colors.red,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Back to Movies
          </button>
        </div>

        <div style={{
          backgroundColor: colors.white,
          borderRadius: '0.5rem',
          border: `1px solid ${colors.gray}22`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{movie.title}</h1>
          <p style={{ color: '#5A5656', marginBottom: '2rem' }}>Duration: {movie.duration} minutes</p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Select Showtime</h2>

          {movie.showtimes && movie.showtimes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {movie.showtimes.map(showtime => (
                <button
                  key={showtime.time}
                  onClick={() => setSelectedShowtime(showtime.time)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${selectedShowtime === showtime.time ? colors.red : colors.gray + '33'}`,
                    borderRadius: '0.5rem',
                    backgroundColor: selectedShowtime === showtime.time ? colors.red + '11' : colors.white,
                    color: colors.gray,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {showtime.time}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#5A5656' }}>
              No showtimes available
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedShowtime}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: selectedShowtime ? colors.red : colors.gray + '55',
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: selectedShowtime ? 'pointer' : 'not-allowed'
            }}
          >
            Continue to Seats
          </button>
        </div>
      </div>
    </div>
  )
}