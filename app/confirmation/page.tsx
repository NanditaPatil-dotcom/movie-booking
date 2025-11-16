'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'

interface Confirmation {
  movieTitle: string
  showtime: string
  seats: string[]
  totalPrice: number
  confirmationId: string
  bookingDate: string
  name: string
  email: string
}

export default function ConfirmationPage() {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('confirmation')
    if (data) {
      setConfirmation(JSON.parse(data))
    }
  }, [])

  if (!confirmation) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your tickets are ready</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Confirmation ID: {confirmation.confirmationId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Movie</p>
                  <p className="text-xl font-semibold">{confirmation.movieTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Showtime</p>
                  <p className="text-xl font-semibold">{confirmation.showtime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Seats</p>
                  <p className="text-xl font-semibold">{confirmation.seats.sort().join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                  <p className="text-xl font-semibold text-primary">₹{confirmation.totalPrice}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-2">Customer Name</p>
                <p className="font-semibold mb-4">{confirmation.name}</p>
                <p className="text-sm text-muted-foreground mb-2">Confirmation sent to</p>
                <p className="font-semibold">{confirmation.email}</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-card p-6 rounded-lg border border-border mb-8">
            <h3 className="font-semibold mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ A confirmation email has been sent to your inbox</li>
              <li>✓ Please arrive 15 minutes before your showtime</li>
              <li>✓ Show your confirmation ID at the counter</li>
              <li>✓ Enjoy your movie!</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link href="/movies" className="flex-1">
              <Button variant="outline" className="w-full">
                Book Another Movie
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
