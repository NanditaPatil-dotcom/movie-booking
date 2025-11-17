const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const Showtime = require('../models/Showtime')
const User = require('../models/User')
const Movie = require('../models/Movie')
const SeatSelection = require('../models/SeatSelection')

router.post('/create', async (req, res) => {
  try {
    const { userId, movieId, movieTitle, showtime, seats, totalAmount, email, name } = req.body

    if (!seats || seats.length === 0) {
      return res.status(400).json({ error: 'No seats selected' })
    }

    let user = await User.findById(userId)
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'guest'
      })
    }

    const showtimeDate = new Date(showtime)
    const title = movieTitle || `Movie ${movieId}`

    let showtimeRecord = await Showtime.findOne({
      movieTitle: title,
      showtime: {
        $gte: new Date(showtimeDate.getTime() - 5000),
        $lte: new Date(showtimeDate.getTime() + 5000)
      }
    })

    if (!showtimeRecord) {
      showtimeRecord = await Showtime.create({
        movieTitle: title,
        showtime: showtimeDate,
        bookedSeats: seats
      })
    } else {
      const newBookedSeats = [...new Set([...showtimeRecord.bookedSeats, ...seats])]
      showtimeRecord.bookedSeats = newBookedSeats
      await showtimeRecord.save()
    }

    const booking = await Booking.create({
      user: user._id,
      movie: movieId,
      showtime: showtimeDate,
      seats,
      totalAmount,
      status: 'confirmed'
    })

    res.json({
      success: true,
      booking: booking._id,
      confirmationId: `CINE-${booking._id}`
    })
  } catch (error) {
    console.error('Booking error:', error)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

router.get('/booked-seats/:movieTitle/:showtime', async (req, res) => {
  try {
    const { movieTitle, showtime } = req.params

    const showtimeDate = new Date(decodeURIComponent(showtime))

    let showtimeRecord = await Showtime.findOne({
      movieTitle: decodeURIComponent(movieTitle),
      showtime: {
        $gte: new Date(showtimeDate.getTime() - 5000),
        $lte: new Date(showtimeDate.getTime() + 5000)
      }
    })

    if (!showtimeRecord) {
      return res.json({ bookedSeats: [] })
    }

    res.json({ bookedSeats: showtimeRecord.bookedSeats })
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
