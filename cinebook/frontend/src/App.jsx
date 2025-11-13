
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Showtimes from './pages/Showtimes'
import Seats from './pages/Seats'
import ThankYou from './pages/ThankYou'

export default function App(){
  return (
    <div className="app">
      <header className="topbar">
        <h1><Link to="/">CineBook</Link></h1>
        <nav><Link to="/movies">Movies</Link></nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/movies" element={<Movies/>} />
          <Route path="/movies/:id/showtimes" element={<Showtimes/>} />
          <Route path="/booking/:movieId/:showtimeId" element={<Seats/>} />
          <Route path="/thankyou" element={<ThankYou/>} />
        </Routes>
      </main>
      <footer className="footer">built by Rakshitha K B - 2025</footer>
    </div>
  )
}
