import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Clock, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const featuredMovies = [
  {
    id: 1,
    title: 'The Cosmic Adventure',
    genre: 'Sci-Fi',
    rating: '8.5',
    duration: '2h 15m',
    image: 'https://images.unsplash.com/photo-1640127249308-098702574176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjB0aGVhdGVyJTIwc2NyZWVufGVufDF8fHx8MTc2MTUxNDM2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Mystery Harbor',
    genre: 'Thriller',
    rating: '8.2',
    duration: '1h 58m',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvcGNvcm58ZW58MXx8fHwxNzYxNDUxNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Eternal Love',
    genre: 'Romance',
    rating: '7.9',
    duration: '2h 5m',
    image: 'https://images.unsplash.com/photo-1520088258008-0f0a636a00a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBzZWF0c3xlbnwxfHx8fDE3NjE1MjY2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl mb-4">Welcome to CineBook</h1>
            <p className="text-xl mb-8">Book your favorite movies in seconds</p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => onNavigate('movies')}>
                Browse Movies
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('signup')}>
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8">Now Showing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMovies.map((movie) => (
              <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <ImageWithFallback
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{movie.title}</CardTitle>
                    <Badge variant="secondary">{movie.genre}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {movie.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.duration}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" onClick={() => onNavigate('movies')}>
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-12 text-center">Why Choose CineBook?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Book your tickets in just a few clicks. No hassle, no waiting in queues.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Star className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Best Seats</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Choose your preferred seats from an interactive seating chart.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Flexible Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Multiple showtimes available throughout the day to fit your schedule.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
