import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AboutPage } from './components/AboutPage';
import { DashboardPage } from './components/DashboardPage';
import { AvailableMoviesPage } from './components/AvailableMoviesPage';
import { BookingPage } from './components/BookingPage';
import { BillingPage } from './components/BillingPage';
import { Navigation } from './components/Navigation';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleBookMovie = (movie, showtime) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setCurrentPage('booking');
  };

  const handleProceedToBilling = (seats) => {
    setSelectedSeats(seats);
    setCurrentPage('billing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'movies':
        return <AvailableMoviesPage onBookMovie={handleBookMovie} onNavigate={setCurrentPage} />;
      case 'booking':
        return (
          <BookingPage
            movie={selectedMovie}
            showtime={selectedShowtime}
            onProceedToBilling={handleProceedToBilling}
            onNavigate={setCurrentPage}
          />
        );
      case 'billing':
        return (
          <BillingPage
            movie={selectedMovie}
            seats={selectedSeats}
            showtime={selectedShowtime}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
