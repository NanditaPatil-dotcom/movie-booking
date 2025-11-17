const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

// Seed several sample movies if missing
const Movie = require('./models/Movie')
async function seedMovies() {
  const moviesToSeed = [
    {
      title: 'The Cosmic Adventure',
      genre: 'Sci-Fi',
      rating: 8.5,
      duration: 135,
      image: '/sci-fi-thriller-movie-poster.jpg',
      description: 'An epic journey through space and time that will leave you breathless.',
      releaseDate: new Date('2025-10-01'),
      showtimes: [
        { time: '10:00 AM', bookedSeats: [] },
        { time: '1:30 PM', bookedSeats: [] },
        { time: '4:45 PM', bookedSeats: [] },
        { time: '7:30 PM', bookedSeats: [] },
        { time: '10:00 PM', bookedSeats: [] }
      ]
    },
    {
      title: 'Ocean of Stars',
      genre: 'Adventure',
      rating: 7.9,
      duration: 122,
      image: '/ocean-of-stars.jpg',
      description: 'A small crew explores an uncharted ocean world filled with wonders and danger.',
      releaseDate: new Date('2025-09-18'),
      showtimes: [
        { time: '09:30 AM', bookedSeats: [] },
        { time: '12:45 PM', bookedSeats: [] },
        { time: '15:15 PM', bookedSeats: [] },
        { time: '18:30 PM', bookedSeats: [] }
      ]
    },
    {
      title: 'Midnight Heist',
      genre: 'Action',
      rating: 7.2,
      duration: 110,
      image: '/midnight-heist.jpg',
      description: 'A high-octane heist film that plays out over a single, tense night.',
      releaseDate: new Date('2025-11-01'),
      showtimes: [
        { time: '2025-11-20T18:30:00Z', bookedSeats: [] },
        { time: '2025-11-20T21:00:00Z', bookedSeats: [] }
      ]
    },
    {
      title: 'Animated Tales',
      genre: 'Family',
      rating: 8.0,
      duration: 90,
      image: '/animated-tales.jpg',
      description: 'A charming anthology of animated short stories for all ages.',
      releaseDate: new Date('2025-08-05'),
      showtimes: [
        { time: '10:00 AM', bookedSeats: [] },
        { time: '13:00 PM', bookedSeats: [] },
        { time: '16:00 PM', bookedSeats: [] }
      ]
    },
    {
      title: 'Romantic Sunset',
      genre: 'Romance',
      rating: 6.8,
      duration: 105,
      image: '/romantic-sunset.jpg',
      description: 'A tender story of two strangers whose paths cross at the perfect moment.',
      releaseDate: new Date('2025-07-14'),
      showtimes: [
        { time: '11:00 AM', bookedSeats: [] },
        { time: '14:30 PM', bookedSeats: [] },
        { time: '19:00 PM', bookedSeats: [] }
      ]
    }
  ]

  try {
    for (const m of moviesToSeed) {
      const exists = await Movie.findOne({ title: m.title })
      if (!exists) {
        await Movie.create(m)
        console.log('Seeded movie:', m.title)
      } else {
        // Ensure showtimes from the seed are present on existing movie documents.
        const existingTimes = (exists.showtimes || []).map(s => String(s.time).trim())
        const toAdd = (m.showtimes || []).filter(s => !existingTimes.includes(String(s.time).trim()))
        if (toAdd.length > 0) {
          await Movie.updateOne({ _id: exists._id }, { $push: { showtimes: { $each: toAdd } } })
          console.log('Updated showtimes for movie:', m.title, 'added:', toAdd.map(t => t.time))
        } else {
          console.log('Movie already has all showtimes, skipping:', m.title)
        }
      }
    }
  } catch (e) {
    console.error('Seeding error:', e)
  }
}

seedMovies()

// Routes
app.use('/api/movies', require('./routes/movies'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/bookings', require('./routes/bookings'))

app.get('/', (req, res) => {
  res.send('Movie Booking API')
})

// Health endpoint for quick status checks
app.get('/health', async (req, res) => {
  const state = mongoose.connection.readyState // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ status: 'ok', dbState: state })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})