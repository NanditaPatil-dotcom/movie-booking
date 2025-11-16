const express = require('express')
const Movie = require('../models/Movie')

const router = express.Router()

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find()
    res.json(movies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json(movie)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create movie
router.post('/', async (req, res) => {
  const movie = new Movie(req.body)
  try {
    const newMovie = await movie.save()
    res.status(201).json(newMovie)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router