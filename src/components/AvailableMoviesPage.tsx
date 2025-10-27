import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star, Clock, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page, Movie } from '../App';

interface AvailableMoviesPageProps {
  onBookMovie: (movie: Movie, showtime: string) => void;
  onNavigate: (page: Page) => void;
}

const movies: Movie[] = [
  {
    id: 1,
    title: 'The Cosmic Adventure',
    genre: 'Sci-Fi',
    duration: '2h 15m',
    rating: '8.5',
    description: 'An epic journey through space and time that will leave you breathless.',
    showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'],
    price: 14.0,
  },
  {
    id: 2,
    title: 'Mystery Harbor',
    genre: 'Thriller',
    duration: '1h 58m',
    rating: '8.2',
    description: 'A gripping thriller that keeps you on the edge of your seat.',
    showtimes: ['11:00 AM', '2:00 PM', '5:00 PM', '8:30 PM'],
    price: 14.0,
  },
  {
    id: 3,
    title: 'Eternal Love',
    genre: 'Romance',
    duration: '2h 5m',
    rating: '7.9',
    description: 'A heartwarming tale of love that transcends all boundaries.',
    showtimes: ['12:00 PM', '3:30 PM', '6:00 PM', '9:00 PM'],
    price: 14.0,
  },
  {
    id: 4,
    title: 'The Last Stand',
    genre: 'Action',
    duration: '2h 20m',
    rating: '8.7',
    description: 'High-octane action sequences that will blow your mind.',
    showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'],
    price: 16.0,
  },
  {
    id: 5,
    title: 'Laugh Out Loud',
    genre: 'Comedy',
    duration: '1h 45m',
    rating: '7.5',
    description: 'The funniest movie of the year guaranteed to make you laugh.',
    showtimes: ['11:30 AM', '2:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'],
    price: 12.0,
  },
  {
    id: 6,
    title: 'Dark Shadows',
    genre: 'Horror',
    duration: '1h 55m',
    rating: '7.8',
    description: 'A spine-chilling horror experience that will haunt your dreams.',
    showtimes: ['4:00 PM', '7:00 PM', '10:00 PM'],
    price: 14.0,
  },
];

export function AvailableMoviesPage({ onBookMovie, onNavigate }: AvailableMoviesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const genres = ['all', ...Array.from(new Set(movies.map((m) => m.genre)))];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Available Movies</h1>
          <p className="text-gray-600">Browse and book tickets for the latest movies</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                  🎬
                </div>
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
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{movie.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">From ${movie.price.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedMovie(selectedMovie?.id === movie.id ? null : movie)
                    }
                  >
                    {selectedMovie?.id === movie.id ? 'Hide Times' : 'View Times'}
                  </Button>
                </div>
              </CardContent>
              {selectedMovie?.id === movie.id && (
                <CardFooter className="flex-col items-stretch gap-2 bg-gray-50">
                  <p className="text-sm mb-2">Select showtime:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {movie.showtimes.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => onBookMovie(movie, time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
