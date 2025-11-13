
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShowtimeSchema = new Schema({
  time: String,
  seats: [[Boolean]]
}, { _id: true });

const MovieSchema = new Schema({
  title: { type: String, required: true },
  synopsis: String,
  genre: String,
  duration: Number,
  poster: String,
  showtimes: [ShowtimeSchema]
});

module.exports = mongoose.model('Movie', MovieSchema);
