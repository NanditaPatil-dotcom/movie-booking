'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'

interface BookingData {
  movieTitle: string
  showtime: string
  seats: string[]
  totalPrice: number
}

export default function PaymentPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('bookingData')
    if (data) {
      setBookingData(JSON.parse(data))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create booking in database
      const bookingPayload = {
        movieId: bookingData?.movieId || '',
        movieTitle: bookingData?.movieTitle || '',
        showtime: bookingData?.showtime || new Date().toISOString(),
        seats: bookingData?.seats || [],
        totalAmount: bookingData?.totalPrice || 0,
        email: formData.email,
        name: formData.name,
        userId: localStorage.getItem('userId') || ''
      }

      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const result = await response.json()

      const confirmation = {
        ...bookingData,
        ...formData,
        confirmationId: result.confirmationId || `CINE-${Date.now()}`,
        bookingDate: new Date().toLocaleDateString(),
      }
      localStorage.setItem('confirmation', JSON.stringify(confirmation))

      router.push('/confirmation')
    } catch (error) {
      console.error('Error during payment:', error)
      alert('Error processing payment. Please try again.')
      setLoading(false)
    }
  }

  if (!bookingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Complete your booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-secondary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-secondary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-secondary text-foreground"
                      />
                    </div>

                    <div className="border-t border-border pt-4">
                      <label className="text-sm font-medium mb-2 block">Card Number</label>
                      <Input
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="bg-secondary text-foreground mb-4"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Expiry</label>
                        <Input
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          className="bg-secondary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">CVV</label>
                        <Input
                          name="cardCVV"
                          placeholder="123"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          required
                          className="bg-secondary text-foreground"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                      {loading ? 'Processing...' : 'Complete Payment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Movie</p>
                    <p className="font-semibold">{bookingData.movieTitle}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Showtime</p>
                    <p className="font-semibold">{bookingData.showtime}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-semibold">{bookingData.seats.sort().join(', ')}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Per Seat</span>
                      <span>₹150</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{bookingData.totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
