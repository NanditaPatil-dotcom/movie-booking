const mongoose = require('mongoose')

const seatSelectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  showtime: {
    type: String,
    required: true
  },
  seats: [{
    type: String,
    required: true
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

seatSelectionSchema.index({ user: 1, movieId: 1, showtime: 1 }, { unique: true })

module.exports = mongoose.model('SeatSelection', seatSelectionSchema)
