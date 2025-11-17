const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// Helper to generate JWT
function generateToken(user) {
  const payload = { id: user._id, email: user.email, name: user.name }
  const secret = process.env.JWT_SECRET || 'your-secret-key'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, password: hashed })

    const token = generateToken(user)
    return res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
