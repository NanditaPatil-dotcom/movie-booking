'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            CineBook
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            Discover, Select, Enjoy. Your favorite movies are just a few clicks away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/movies">
              <Button size="lg" className="px-8">
                Book Tickets
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="px-8">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured movies preview */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why CineBook?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-bold mb-4">Easy Booking</h3>
              <p className="text-muted-foreground">
                Browse, select, and book tickets in minutes. No hassle, no queues.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-bold mb-4">Secure Payment</h3>
              <p className="text-muted-foreground">
                Multiple payment options with encrypted transactions for your safety.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-bold mb-4">Instant Confirmation</h3>
              <p className="text-muted-foreground">
                Get your tickets instantly via email with complete booking details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
