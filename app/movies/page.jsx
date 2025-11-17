'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MovieCard } from '@/components/movie-card'
import { Navigation } from '@/components/navigation'

const MOVIES = [
  {
    id: '1',
    title: 'The Quantum Enigma',
    genre: 'Sci-Fi',
    rating: 8.5,
    duration: 148,
    image: '/sci-fi-thriller-movie-poster.jpg',
  },
  {
    id: '2',
    title: 'Midnight Mystery',
    genre: 'Thriller',
    rating: 7.8,
    duration: 125,
    image: '/thriller-mystery-movie-poster.jpg',
  },
  {
    id: '3',
    title: 'Love in Paris',
    genre: 'Romance',
    rating: 7.2,
    duration: 110,
    image: '/rom-com-movie-poster.png',
  },
  {
    id: '4',
    title: 'Dragon Warriors',
    genre: 'Fantasy',
    rating: 8.9,
    duration: 165,
    image: '/fantasy-adventure-movie-poster.png',
  },
  {
    id: '5',
    title: 'The Last Stand',
    genre: 'Action',
    rating: 8.1,
    duration: 135,
    image: '/action-movie-poster.png',
  },
  {
    id: '6',
    title: 'Laughter Chronicles',
    genre: 'Comedy',
    rating: 7.5,
    duration: 95,
    image: '/comedy-movie-poster.png',
  },
]

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')

  const genres = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Romance', 'Fantasy', 'Comedy']

  const filteredMovies = useMemo(() => {
    return MOVIES.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre
      return matchesSearch && matchesGenre
    })
  }, [searchQuery, selectedGenre])

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
                <Link key={movie.id} href={`/showtime/${movie.id}`}>
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
