
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
  showtime: { type: Schema.Types.ObjectId },
  seats: [String],
  customer: {
    name: String,
    email: String
  },
  createdAt: Date
});

module.exports = mongoose.model('Booking', BookingSchema);
