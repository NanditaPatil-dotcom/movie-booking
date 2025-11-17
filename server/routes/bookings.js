const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Booking = require('../models/Booking')
const Showtime = require('../models/Showtime')
const User = require('../models/User')
const Movie = require('../models/Movie')
const SeatSelection = require('../models/SeatSelection')

// POST /api/bookings/create
// Creates a new booking with seat locking and validation
// POST /api/bookings/create  (REPLACEMENT)
router.post('/create', async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { userId, movieId, showtime: selectedShowtime, seats, totalAmount, email, name } = req.body;

      console.log('[BOOKING] start', { userId, movieId, selectedShowtime, seats, totalAmount });

      // Basic validations
      if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'No seats selected or invalid seats format' });
      }
      if (!userId || !movieId || !selectedShowtime) {
        return res.status(400).json({ error: 'Missing required fields: userId, movieId, showtime' });
      }
      if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid total amount' });
      }

      // normalize incoming seats to consistent strings
      const selectedClean = seats.map(s => String(s).trim().toUpperCase());

      // Fetch movie within session
      const movie = await Movie.findById(movieId).session(session);
      if (!movie) {
        console.error('[BOOKING] movie not found', movieId);
        return res.status(404).json({ error: 'Movie not found' });
      }

      // find showtime object by exact string match (use the string stored in DB)
      const showtimeObj = movie.showtimes.find(st => String(st.time) === String(selectedShowtime));
      if (!showtimeObj) {
        console.error('[BOOKING] showtime not found', { movieId, selectedShowtime, showtimes: movie.showtimes.map(s => s.time) });
        return res.status(404).json({ error: 'Showtime not found for this movie' });
      }

      // initialize bookedSeats if absent
      if (!Array.isArray(showtimeObj.bookedSeats)) {
        showtimeObj.bookedSeats = [];
      }

      // normalize alreadyBooked for comparison
      const bookedClean = showtimeObj.bookedSeats.map(s => String(s).trim().toUpperCase());

      // detect conflicts
      const conflictingSeats = selectedClean.filter(seat => bookedClean.includes(seat));
      if (conflictingSeats.length > 0) {
        console.log('[BOOKING] conflict', { requested: selectedClean, conflictingSeats });
        return res.status(400).json({ error: 'Seat already booked', conflictingSeats });
      }

      // push seats into subdocument's bookedSeats
      // modify the subdocument in-memory then save movie (inside session)
      showtimeObj.bookedSeats.push(...selectedClean);

      // persist movie update inside session
      await movie.save({ session });

      // ensure user exists or create a guest user (inside session)
      let user = await User.findById(userId).session(session);
      if (!user) {
        if (!email || !name) {
          console.error('[BOOKING] user missing and no email/name to create guest', { userId });
          return res.status(400).json({ error: 'User not found and missing email/name for creation' });
        }
        const created = await User.create([{
          name,
          email,
          password: 'guest' // make sure your User model tolerates this
        }], { session });
        user = created[0];
      }

      // Create booking: keep showtime as the string stored in the movie doc to avoid Date parsing issues
      const bookingDoc = {
        user: user._id,
        movie: movieId,
        showtime: showtimeObj.time, // store the same string as in movie.showtimes
        seats: selectedClean,
        totalAmount,
        status: 'confirmed'
      };

      const createdBooking = await Booking.create([bookingDoc], { session });
      const booking = createdBooking[0];

      console.log('[BOOKING] success', { bookingId: booking._id, userId: user._id, movieId, seats: selectedClean, showtime: showtimeObj.time });

      // Return success response from inside transaction callback
      return res.status(200).json({
        success: true,
        booking: booking._id,
        confirmationId: `CINE-${booking._id}`
      });
    }); // end transaction
  } catch (err) {
    console.error('[BOOKING] transaction error:', err);
    // surface the error message to client to help debugging (remove in prod)
    return res.status(500).json({ error: 'Failed to create booking', detail: err.message });
  } finally {
    session.endSession();
  }
});


// GET /api/bookings/booked-seats/:movieId/:showtime
// Returns all seats that are already booked for a specific movie showtime
router.get('/booked-seats/:movieId/:showtime', async (req, res) => {
  try {
    const { movieId, showtime: selectedShowtime } = req.params

    console.log('Fetching booked seats:', { movieId, selectedShowtime })

    // Fetch the movie with showtimes
    const movie = await Movie.findById(movieId)
    if (!movie) {
      console.error('Movie not found:', movieId)
      return res.status(404).json({ error: 'Movie not found' })
    }

    // Find the correct showtime object
    const showtime = movie.showtimes.find(st => st.time === selectedShowtime)
    if (!showtime) {
      console.error('Showtime not found:', { movieId, selectedShowtime })
      return res.status(404).json({ error: 'Showtime not found for this movie' })
    }

    // Return booked seats (initialize as empty array if not exists)
    const bookedSeats = showtime.bookedSeats || []

    console.log(`Booked seats for movie ${movieId} at ${selectedShowtime}:`, bookedSeats)

    res.json({ bookedSeats })
  } catch (error) {
    console.error('Error fetching booked seats:', error)
    res.status(500).json({ error: 'Failed to fetch booked seats' })
  }
})

router.get('/test', async (req, res) => {
  try {
    const showtimes = await Showtime.find({})
    res.json({
      message: 'Showtimes in database:',
      count: showtimes.length,
      showtimes: showtimes.map(s => ({
        movieTitle: s.movieTitle,
        showtime: s.showtime,
        bookedSeats: s.bookedSeats,
        id: s._id
      }))
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/save-seats', async (req, res) => {
  try {
    const { userId, movieId, movieTitle, showtime, seats } = req.body

    if (!userId || !movieId || !movieTitle || !showtime) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const showtimeDate = new Date(showtime)

    const seatSelection = await SeatSelection.findOneAndUpdate(
      {
        user: userId,
        movieId: movieId,
        showtime: {
          $gte: new Date(showtimeDate.getTime() - 5000),
          $lte: new Date(showtimeDate.getTime() + 5000)
        }
      },
      {
        user: userId,
        movieId: movieId,
        movieTitle: movieTitle,
        showtime: showtimeDate,
        seats: seats || [],
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    )

    res.json({
      success: true,
      seatSelection
    })
  } catch (error) {
    console.error('Error saving seat selection:', error)
    res.status(500).json({ error: 'Failed to save seat selection' })
  }
})

router.get('/selected-seats/:userId/:movieId/:showtime', async (req, res) => {
  try {
    const { userId, movieId, showtime } = req.params

    const showtimeDate = new Date(decodeURIComponent(showtime))

    const seatSelection = await SeatSelection.findOne({
      user: userId,
      movieId: parseInt(movieId),
      showtime: {
        $gte: new Date(showtimeDate.getTime() - 5000),
        $lte: new Date(showtimeDate.getTime() + 5000)
      }
    })

    if (!seatSelection) {
      return res.json({ selectedSeats: [] })
    }

    res.json({ selectedSeats: seatSelection.seats || [] })
  } catch (error) {
    console.error('Error fetching selected seats:', error)
    res.status(500).json({ error: 'Failed to fetch selected seats' })
  }
})

module.exports = router
