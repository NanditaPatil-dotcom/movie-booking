'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'

const MOVIES = [
  { id: 1, title: 'The Quantum Enigma', duration: 148 },
  { id: 2, title: 'Midnight Mystery', duration: 125 },
  { id: 3, title: 'Love in Paris', duration: 110 },
  { id: 4, title: 'Dragon Warriors', duration: 165 },
  { id: 5, title: 'The Last Stand', duration: 135 },
  { id: 6, title: 'Laughter Chronicles', duration: 95 },
]

const SHOWTIMES = ['10:00 AM', '1:30 PM', '4:45 PM', '7:30 PM', '10:00 PM']

export default function ShowtimePage() {
  const params = useParams()
  const router = useRouter()
  const movieId = parseInt(params.id as string)
  const movie = MOVIES.find(m => m.id === movieId)
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null)

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center">Movie not found</div>
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

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {SHOWTIMES.map(time => (
                <Button
                  key={time}
                  variant={selectedShowtime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedShowtime(time)}
                  className="h-12 text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>

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
