'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'

const MOVIES = [
  { id: 1, title: 'The Quantum Enigma' },
  { id: 2, title: 'Midnight Mystery' },
  { id: 3, title: 'Love in Paris' },
  { id: 4, title: 'Dragon Warriors' },
  { id: 5, title: 'The Last Stand' },
  { id: 6, title: 'Laughter Chronicles' },
]

const SEAT_PRICE = 150

export default function SeatsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const movieId = parseInt(params.id as string)
  const showtime = searchParams.get('showtime')
  const movie = MOVIES.find(m => m.id === movieId)

  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  // Generate seat layout (10 rows x 12 seats)
  const generateSeats = () => {
    const seats: { id: string; status: 'available' | 'booked' }[] = []
    for (let row = 0; row < 10; row++) {
      for (let seat = 0; seat < 12; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`
        seats.push({
          id: seatId,
          status: Math.random() > 0.7 ? 'booked' : 'available',
        })
      }
    }
    return seats
  }

  const allSeats = generateSeats()
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  const toggleSeat = (seatId: string) => {
    const seat = allSeats.find(s => s.id === seatId)
    if (seat?.status === 'booked') return

    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    )
  }

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      const bookingData = {
        movieId,
        movieTitle: movie?.title,
        showtime,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * SEAT_PRICE,
      }
      localStorage.setItem('bookingData', JSON.stringify(bookingData))
      router.push('/payment')
    }
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center">Movie not found</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href={`/showtime/${movieId}`} className="text-primary hover:underline text-sm">
              ← Back to Showtimes
            </Link>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-muted-foreground mb-8">{showtime}</p>

            {/* Seat Legend */}
            <div className="flex gap-8 mb-12 justify-center flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded" />
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded" />
                <span className="text-sm">Selected</span>
              </div>
            </div>

            {/* Screen */}
            <div className="mb-12 text-center">
              <div className="inline-block border-b-4 border-primary w-64 pb-2 mb-8">
                <p className="text-muted-foreground">Screen</p>
              </div>
            </div>

            {/* Seats */}
            <div className="flex justify-center mb-12">
              <div className="space-y-2">
                {rows.map(row => (
                  <div key={row} className="flex gap-2 justify-center items-center">
                    <span className="w-6 text-sm text-muted-foreground">{row}</span>
                    <div className="flex gap-2">
                      {allSeats
                        .filter(s => s.id.startsWith(row))
                        .map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id)}
                            disabled={seat.status === 'booked'}
                            className={`w-6 h-6 rounded text-xs font-semibold transition ${
                              seat.status === 'booked'
                                ? 'bg-red-600 cursor-not-allowed'
                                : selectedSeats.includes(seat.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                          >
                            {seat.id.slice(1)}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Seats Summary */}
            <div className="bg-secondary p-6 rounded-lg mb-8">
              <p className="text-muted-foreground mb-2">Selected Seats:</p>
              <p className="text-2xl font-bold mb-4">
                {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'No seats selected'}
              </p>
              <p className="text-lg font-semibold">
                Total Price: ₹{selectedSeats.length * SEAT_PRICE}
              </p>
            </div>

            <Button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="w-full py-6 text-lg"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
