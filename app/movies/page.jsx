'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MovieCard } from '@/components/movie-card'
import { Navigation } from '@/components/navigation'

export default function MoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies')
        if (!response.ok) throw new Error('Failed to fetch movies')
        const data = await response.json()
        setMovies(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const genres = useMemo(() => {
    const allGenres = movies.map(movie => movie.genre)
    return ['All', ...new Set(allGenres)]
  }, [movies])

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre
      return matchesSearch && matchesGenre
    })
  }, [movies, searchQuery, selectedGenre])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="py-12 px-4 flex items-center justify-center">
          <div>Loading movies...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="py-12 px-4 flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Now Showing</h1>

          {/* Search and Filter */}
          <div className="space-y-6 mb-12">
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md bg-secondary text-foreground"
            />

            <div className="flex gap-2 flex-wrap">
              {genres.map(genre => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  onClick={() => setSelectedGenre(genre)}
                  className="text-sm"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Movies Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map(movie => (
                <Link key={movie._id} href={`/showtime/${movie._id}`}>
                  <MovieCard movie={movie} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No movies found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
