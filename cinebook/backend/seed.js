
/**
 * Seed script for movies sample data.
 * Run: npm run seed
 */
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/cinebook';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

const movies = [
  {
    title: 'The Silent Lake',
    synopsis: 'A quiet drama about discovery and friendship.',
    genre: 'Drama',
    duration: 110,
    poster: '/assets/posters/silent-lake.jpg',
    showtimes: [
      { time: '10:00 AM' },
      { time: '1:00 PM' },
      { time: '6:30 PM' }
    ]
  },
  {
    title: 'Midnight Run',
    synopsis: 'Fast-paced thriller through the city at night.',
    genre: 'Thriller',
    duration: 95,
    poster: '/assets/posters/midnight-run.jpg',
    showtimes: [
      { time: '11:30 AM' },
      { time: '4:00 PM' },
      { time: '9:00 PM' }
    ]
  }
];

async function seed() {
  await Movie.deleteMany({});
  await Movie.insertMany(movies);
  console.log('Seeded movies');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
