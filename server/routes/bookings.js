const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Booking = require('../models/Booking')
const Showtime = require('../models/Showtime')
const User = require('../models/User')
const Movie = require('../models/Movie')
const SeatSelection = require('../models/SeatSelection')
const { findShowtime } = require('../utils/timeUtils')

// POST /api/bookings/create
// Creates a new booking with seat locking and validation
// POST /api/bookings/create  (REPLACEMENT)
// POST /api/bookings/create  (atomic, no transactions)
router.post('/create', async (req, res) => {
  try {
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    const { userId, movieId, showtime: selectedShowtime, seats, totalAmount, email, name } = req.body;

    console.log('[BOOKING] start', { userId, movieId, selectedShowtime, seats, totalAmount });

    // basic validation
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'No seats selected or invalid seats format' });
    }
    if (!userId || !movieId || !selectedShowtime) {
      return res.status(400).json({ error: 'Missing required fields: userId, movieId, showtime' });
    }
    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // normalize incoming seats
    const selectedClean = seats.map(s => String(s).trim().toUpperCase());

    // Fetch movie to find exact showtime for tolerant matching
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(400).json({ error: 'Movie not found' });
    }
    const showtimeObj = findShowtime(movie, selectedShowtime);
    if (!showtimeObj) {
      return res.status(404).json({
        error: 'Showtime not found',
        availableShowtimes: movie.showtimes.map(s => s.time)
      });
    }
    const exactShowtime = showtimeObj.time;

    // ATOMIC STEP:
    // Try to push seats into the matched showtime's bookedSeats only if that showtime
    // exists AND none of its bookedSeats are in selectedClean.
    // Use $elemMatch so both conditions apply to the same array element.
    const filter = {
      _id: movieId,
      showtimes: {
        $elemMatch: {
          time: exactShowtime,
          bookedSeats: { $nin: selectedClean } // for arrays, $nin ensures none of the elements equal any of selectedClean
        }
      }
    };

    const update = {
      $push: { 'showtimes.$.bookedSeats': { $each: selectedClean } }
    };

    const updateResult = await Movie.updateOne(filter, update);

    if (updateResult.matchedCount === 0 || updateResult.modifiedCount === 0) {
      // No matching showtime OR some seat already booked (so update didn't happen)
      return res.status(400).json({ error: 'Seat already booked or showtime not found' });
    }

    // At this point, seats were atomically reserved in the movie doc.
    // Ensure user exists (create guest if necessary)
    let user = await User.findById(userId);
    if (!user) {
      if (!email || !name) {
        // Rollback the seat reservation as best-effort
        await Movie.updateOne(
          { _id: movieId, 'showtimes.time': String(selectedShowtime) },
          { $pullAll: { 'showtimes.$.bookedSeats': selectedClean } }
        );
        return res.status(400).json({ error: 'User not found and missing email/name for creation' });
      }
      const created = await User.create({ name, email, password: 'guest' });
      user = created;
    }

    // Create booking record
    const bookingDoc = {
      user: user._id,
      movie: movieId,
      showtime: exactShowtime, // use exact showtime from DB
      seats: selectedClean,
      totalAmount,
      status: 'confirmed'
    };

    const booking = await Booking.create(bookingDoc);

    console.log('[BOOKING] success', { bookingId: booking._id, userId: user._id, movieId, seats: selectedClean, showtime: selectedShowtime });

    return res.status(200).json({
      success: true,
      booking: booking._id,
      confirmationId: `CINE-${booking._id}`
    });

  } catch (err) {
    console.error('[BOOKING] error:', err);

    // If error happened after seats were pushed, try best-effort rollback
    try {
      if (movie && exactShowtime && selectedClean) {
        await Movie.updateOne(
          { _id: movieId, 'showtimes.time': exactShowtime },
          { $pullAll: { 'showtimes.$.bookedSeats': selectedClean } }
        );
        console.log('[BOOKING] rollback attempted for seats', selectedClean);
      }
    } catch (rbErr) {
      console.error('[BOOKING] rollback failed:', rbErr);
    }

    return res.status(500).json({ error: 'Failed to create booking', detail: err.message });
  }
});



// GET /api/bookings/booked-seats/:movieId/:showtime
// Returns all seats that are already booked for a specific movie showtime
router.get('/booked-seats/:movieId/:showtime', async (req, res) => {
  try {
    console.log('req.params:', JSON.stringify(req.params, null, 2));
    const { movieId, showtime: selectedShowtime } = req.params

    console.log('Fetching booked seats:', { movieId, selectedShowtime })

    // Fetch the movie with showtimes
    const movie = await Movie.findById(movieId)
    if (!movie) {
      console.error('Movie not found:', movieId)
      return res.status(404).json({ error: 'Movie not found' })
    }
    console.log('Movie showtimes:', movie.showtimes)

    // Find the correct showtime object
    const showtime = findShowtime(movie, selectedShowtime)
    if (!showtime) {
      console.error('Showtime not found:', { movieId, selectedShowtime })
      return res.status(404).json({
        error: 'Showtime not found for this movie',
        availableShowtimes: movie.showtimes.map(s => s.time)
      })
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
        showtime: showtimeDate
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
      showtime: showtimeDate
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
