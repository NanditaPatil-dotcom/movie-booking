const mongoose = require('mongoose')

const showtimeSchema = new mongoose.Schema({
  movieTitle: {
    type: String,
    required: true
  },
  showtime: {
    type: String,
    required: true
  },
  bookedSeats: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

showtimeSchema.index({ movieTitle: 1, showtime: 1 }, { unique: true })

module.exports = mongoose.model('Showtime', showtimeSchema)
