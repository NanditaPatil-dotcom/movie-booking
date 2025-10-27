import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Ticket, Calendar, Clock, MapPin, User, Mail, Phone } from 'lucide-react';
import type { Page } from '../App';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

const mockBookings = [
  {
    id: 1,
    movieTitle: 'The Cosmic Adventure',
    theater: 'Grand Cinema Hall 1',
    date: 'Oct 28, 2025',
    time: '7:30 PM',
    seats: ['A12', 'A13'],
    status: 'Confirmed',
    total: 28.0,
  },
  {
    id: 2,
    movieTitle: 'Mystery Harbor',
    theater: 'Starlight Theater Hall 3',
    date: 'Oct 30, 2025',
    time: '5:00 PM',
    seats: ['B5', 'B6', 'B7'],
    status: 'Confirmed',
    total: 42.0,
  },
  {
    id: 3,
    movieTitle: 'Eternal Love',
    theater: 'Metro Cinema Hall 2',
    date: 'Oct 25, 2025',
    time: '9:00 PM',
    seats: ['C10', 'C11'],
    status: 'Completed',
    total: 28.0,
  },
];

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl">John Doe</h3>
                  <Badge variant="secondary" className="mt-2">
                    Premium Member
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>john.doe@example.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Member since Oct 2024</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="text-xl">24</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Movies Watched</span>
                  <span className="text-xl">18</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Loyalty Points</span>
                  <span className="text-xl">450</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your movie bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-blue-600">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg mb-1">{booking.movieTitle}</h3>
                          <Badge
                            variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="text-xl">${booking.total.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{booking.theater}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-gray-500" />
                          <span>Seats: {booking.seats.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          View Ticket
                        </Button>
                        {booking.status === 'Confirmed' && (
                          <Button variant="outline" size="sm">
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button className="w-full" onClick={() => onNavigate('movies')}>
                  <Ticket className="w-4 h-4 mr-2" />
                  Book New Movie
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
