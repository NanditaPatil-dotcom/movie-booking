
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Movie = require('./models/Movie');
const Booking = require('./models/Booking');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/cinebook';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('Mongo connect error', err); process.exit(1); });

// GET all movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find().lean();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch movies' });
  }
});

// GET showtimes for a movie (sample)
app.get('/api/movies/:id/showtimes', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ error: 'movie not found' });
    res.json(movie.showtimes || []);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch showtimes' });
  }
});

// POST booking (simple seat locking simulated)
app.post('/api/book', async (req, res) => {
  try {
    const { movieId, showtimeId, seats, customer } = req.body;
    if (!movieId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'invalid booking payload' });
    }
    // simple check - in production use transactions/locks
    const booking = new Booking({ movie: movieId, showtime: showtimeId, seats, customer, createdAt: new Date() });
    await booking.save();
    res.json({ success: true, bookingId: booking._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create booking' });
  }
});

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve static frontend build if present
const buildPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'not found' });
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));
