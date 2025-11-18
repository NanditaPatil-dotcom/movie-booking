const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

const path = require('path')

// Middleware
app.use(cors())
app.use(express.json())

// Serve static assets from the repo-level `public/` so seeded movie images are available
app.use(express.static(path.join(__dirname, '..', 'public')))

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
      image: 'pinterest:https://i.pinimg.com/736x/aa/45/d2/aa45d2009244b72ced03a261f5202207.jpg',
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
      image: 'pinterest:https://i.pinimg.com/1200x/a9/d2/ab/a9d2abda06ef95be07c9d635bd8760d1.jpg',
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
      image: 'pinterest:https://i.pinimg.com/736x/fd/8d/4e/fd8d4e0442314a435fe3ae56384b59ae.jpg',
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
      image: 'pinterest:https://i.pinimg.com/736x/06/d5/de/06d5de799f561acb3ed9897c2c60f9d8.jpg',
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
      image: 'pinterest:https://i.pinimg.com/1200x/08/e5/1c/08e51cbc6739d5a4148a69447dc4815d.jpg',
      description: 'A tender story of two strangers whose paths cross at the perfect moment.',
      releaseDate: new Date('2025-07-14'),
      showtimes: [
        { time: '11:00 AM', bookedSeats: [] },
        { time: '14:30 PM', bookedSeats: [] },
        { time: '19:00 PM', bookedSeats: [] }
      ]
    },
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
        // Ensure image field from seed is applied to existing movie when provided
        if (m.image && String(exists.image || '').trim() !== String(m.image).trim()) {
          await Movie.updateOne({ _id: exists._id }, { $set: { image: m.image } })
          console.log('Updated image for movie:', m.title)
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