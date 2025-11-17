import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  duration: number
  image: string
}

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Card className="group cursor-pointer hover:border-primary transition overflow-hidden h-full">
      <CardContent className="p-0">
        <div className="relative h-64 bg-secondary overflow-hidden">
          <img
            src={movie.image || "/cosmic.png"}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-2">{movie.title}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Genre: {movie.genre}</p>
            <p>Duration: {movie.duration} min</p>
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold">{movie.rating}</span>
              <span>⭐</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
