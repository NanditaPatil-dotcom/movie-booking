'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { useAuth } from '@/hooks/use-auth'

// Mock movie data with showtimes for development
const MOCK_MOVIES = [
  {
    _id: '1',
    title: 'The Quantum Enigma',
    duration: 148,
    showtimes: [
      { time: '10:00 AM', bookedSeats: [] },
      { time: '1:30 PM', bookedSeats: [] },
      { time: '4:45 PM', bookedSeats: [] },
      { time: '7:30 PM', bookedSeats: [] },
      { time: '10:00 PM', bookedSeats: [] }
    ]
  },
  {
    _id: '2',
    title: 'Midnight Mystery',
    duration: 125,
    showtimes: [
      { time: '11:00 AM', bookedSeats: [] },
      { time: '2:30 PM', bookedSeats: [] },
      { time: '5:45 PM', bookedSeats: [] },
      { time: '8:30 PM', bookedSeats: [] }
    ]
  },
  {
    _id: '3',
    title: 'Love in Paris',
    duration: 110,
    showtimes: [
      { time: '10:30 AM', bookedSeats: [] },
      { time: '1:00 PM', bookedSeats: [] },
      { time: '4:00 PM', bookedSeats: [] },
      { time: '7:00 PM', bookedSeats: [] },
      { time: '9:30 PM', bookedSeats: [] }
    ]
  },
  {
    _id: '4',
    title: 'Dragon Warriors',
    duration: 165,
    showtimes: [
      { time: '12:00 PM', bookedSeats: [] },
      { time: '3:30 PM', bookedSeats: [] },
      { time: '7:00 PM', bookedSeats: [] },
      { time: '10:30 PM', bookedSeats: [] }
    ]
  },
  {
    _id: '5',
    title: 'The Last Stand',
    duration: 135,
    showtimes: [
      { time: '11:30 AM', bookedSeats: [] },
      { time: '2:45 PM', bookedSeats: [] },
      { time: '6:00 PM', bookedSeats: [] },
      { time: '9:15 PM', bookedSeats: [] }
    ]
  },
  {
    _id: '6',
    title: 'Laughter Chronicles',
    duration: 95,
    showtimes: [
      { time: '10:15 AM', bookedSeats: [] },
      { time: '12:45 PM', bookedSeats: [] },
      { time: '3:15 PM', bookedSeats: [] },
      { time: '5:45 PM', bookedSeats: [] },
      { time: '8:15 PM', bookedSeats: [] }
    ]
  }
]

export default function ShowtimePage() {
  const { checked } = useAuth()

  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchMovie = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const movieData = MOCK_MOVIES.find(m => m._id === movieId)
        if (!movieData) {
          throw new Error('Movie not found')
        }
        setMovie(movieData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [movieId])

  if (!checked) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="py-12 px-4 flex items-center justify-center">
          <div>Checking authentication...</div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="py-12 px-4 flex items-center justify-center">
          <div>Loading movie details...</div>
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

  if (!movie) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="py-12 px-4 flex items-center justify-center">
          <div>Movie not found</div>
        </div>
      </main>
    )
  }

  const handleContinue = () => {
    if (selectedShowtime) {
      router.push(`/seats/${movieId}?showtime=${encodeURIComponent(selectedShowtime)}`)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/movies" className="text-primary hover:underline text-sm">
              ← Back to Movies
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-muted-foreground mb-8">Duration: {movie.duration} minutes</p>

            <h2 className="text-2xl font-bold mb-6">Select Showtime</h2>

            {movie.showtimes && movie.showtimes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {movie.showtimes.map(showtime => (
                  <Button
                    key={showtime.time}
                    variant={selectedShowtime === showtime.time ? 'default' : 'outline'}
                    onClick={() => setSelectedShowtime(showtime.time)}
                    className="h-12 text-sm"
                  >
                    {showtime.time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No showtimes available for this movie
              </div>
            )}

            <Button
              onClick={handleContinue}
              disabled={!selectedShowtime}
              className="w-full py-6 text-lg"
            >
              Continue to Seats
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
