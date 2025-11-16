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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827'
    }}>
      <Navigation />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#f9fafb'
        }}>Movies</h1>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#9ca3af'
          }}>Loading movies...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}