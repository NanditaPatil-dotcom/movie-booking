import React from 'react';
import { Button } from './ui/button';
import { Film, LogIn, UserPlus, Info, LayoutDashboard, Film as FilmIcon, LogOut } from 'lucide-react';

export function Navigation({ currentPage, isLoggedIn, onNavigate, onLogout }) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Film className="w-8 h-8 text-blue-600" />
            <span className="text-xl">CineBook</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'movies' ? 'default' : 'ghost'}
              onClick={() => onNavigate('movies')}
            >
              <FilmIcon className="w-4 h-4 mr-2" />
              Movies
            </Button>
            <Button
              variant={currentPage === 'about' ? 'default' : 'ghost'}
              onClick={() => onNavigate('about')}
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>

            {isLoggedIn ? (
              <>
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={currentPage === 'login' ? 'default' : 'outline'}
                  onClick={() => onNavigate('login')}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  variant={currentPage === 'signup' ? 'default' : 'outline'}
                  onClick={() => onNavigate('signup')}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
