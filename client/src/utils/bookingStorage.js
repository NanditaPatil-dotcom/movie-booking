// Booking storage utilities for preserving selection through login

const BOOKING_KEY = 'pendingBooking'

export function saveBookingPayload(payload) {
  try {
    // Validate payload structure
    if (!payload || typeof payload !== 'object') {
      console.warn('Invalid booking payload')
      return false
    }

    // Required fields
    const required = ['movieId', 'showtimeId', 'selectedSeats']
    for (const field of required) {
      if (!payload[field]) {
        console.warn(`Missing required field: ${field}`)
        return false
      }
    }

    // Optional but recommended
    if (!Array.isArray(payload.selectedSeats) || payload.selectedSeats.length === 0) {
      console.warn('selectedSeats must be a non-empty array')
      return false
    }

    localStorage.setItem(BOOKING_KEY, JSON.stringify(payload))
    return true
  } catch (error) {
    console.error('Failed to save booking payload:', error)
    return false
  }
}

export function getBookingPayload() {
  try {
    const stored = localStorage.getItem(BOOKING_KEY)
    if (!stored) return null

    const payload = JSON.parse(stored)

    // Basic validation
    if (!payload || !payload.movieId || !payload.selectedSeats) {
      console.warn('Invalid stored booking payload')
      clearBookingPayload()
      return null
    }

    return payload
  } catch (error) {
    console.error('Failed to retrieve booking payload:', error)
    clearBookingPayload()
    return null
  }
}

export function clearBookingPayload() {
  localStorage.removeItem(BOOKING_KEY)
}

export function hasPendingBooking() {
  return getBookingPayload() !== null
}