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

// Seed sample movie if missing (The Cosmic Adventure)
const Movie = require('./models/Movie')
async function seedSampleMovie() {
  try {
    const exists = await Movie.findOne({ title: 'The Cosmic Adventure' })
    if (!exists) {
      await Movie.create({
        title: 'The Cosmic Adventure',
        genre: 'Sci-Fi',
        rating: 8.5,
        duration: 135,
        image: '/sci-fi-thriller-movie-poster.jpg',
        description: 'An epic journey through space and time that will leave you breathless.',
        releaseDate: new Date('2025-10-01')
      })
      console.log('Seeded sample movie: The Cosmic Adventure')
    }
  } catch (e) {
    console.error('Seeding error:', e)
  }
}
seedSampleMovie()

// Routes
app.use('/api/movies', require('./routes/movies'))
app.use('/api/auth', require('./routes/auth'))

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