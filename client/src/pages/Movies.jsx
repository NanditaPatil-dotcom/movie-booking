import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigation } from '../components/Navigation'
import { MovieCard } from '../components/MovieCard'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies')
      setMovies(response.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.light, color: colors.gray }}>
      <Navigation />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <input
            placeholder="Search..."
            style={{
              flex: 1,
              maxWidth: '400px',
              height: '2.5rem',
              borderRadius: '9999px',
              padding: '0 1rem',
              border: `1px solid ${colors.gray}33`,
              backgroundColor: colors.white,
              color: colors.gray
            }}
          />
          <div style={{ width: '1rem' }} />
          <div
            style={{
              height: '2.5rem',
              borderRadius: '9999px',
              padding: '0 1rem',
              border: `1px solid ${colors.gray}55`,
              backgroundColor: colors.light,
              display: 'inline-flex',
              alignItems: 'center',
              color: colors.gray
            }}
          >
            All genres
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem', color: colors.gray }}>
          Movies
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#5A5656' }}>Loading movies...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}