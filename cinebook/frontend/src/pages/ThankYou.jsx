
import React from 'react'
import { useLocation, Link } from 'react-router-dom'
export default function ThankYou(){
  const loc = useLocation();
  const id = loc.state?.bookingId || '—';
  return (
    <div>
      <h2>Thank you!</h2>
      <p>Your booking id: <strong>{id}</strong></p>
      <p><Link to="/movies">Back to movies</Link></p>
    </div>
  )
}
