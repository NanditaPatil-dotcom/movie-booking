import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;

export function BookingPage({ movie, showtime, onProceedToBilling, onNavigate }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mock some seats as already booked
  const bookedSeats = ['A5', 'A6', 'B8', 'C5', 'C6', 'C7', 'D10', 'E5', 'E6'];

  if (!movie) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Movie Selected</CardTitle>
            <CardDescription>Please select a movie first</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('movies')}>Browse Movies</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  const totalPrice = selectedSeats.length * movie.price;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-8">Select Your Seats</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seating Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Seating Chart</CardTitle>
                <CardDescription>Click on available seats to select them</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Screen */}
                <div className="mb-8">
                  <div className="bg-gray-200 rounded-t-full h-3 mb-2"></div>
                  <p className="text-center text-sm text-gray-500">SCREEN</p>
                </div>

                {/* Seats */}
                <div className="space-y-3">
                  {ROWS.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-2">
                      <div className="w-8 text-center text-sm">{row}</div>
                      <div className="flex gap-2">
                        {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                          const seatNumber = i + 1;
                          const seatId = `${row}${seatNumber}`;
                          const status = getSeatStatus(seatId);

                          return (
                            <button
                              key={seatId}
                              onClick={() => toggleSeat(seatId)}
                              disabled={status === 'booked'}
                              className={`w-8 h-8 rounded-t-lg text-xs transition-colors ${
                                status === 'booked'
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : status === 'selected'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-green-100 hover:bg-green-200'
                              }`}
                            >
                              {seatNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-t-lg"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-t-lg"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-t-lg"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg mb-2">{movie.title}</h3>
                  <Badge>{movie.genre}</Badge>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>Grand Cinema Hall 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Oct 28, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{showtime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>
                      {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                    </span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm mb-2">Selected Seats:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <Badge key={seat} variant="secondary">
                            {seat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {selectedSeats.length} × ${movie.price.toFixed(2)}
                    </span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-xl">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={selectedSeats.length === 0}
                  onClick={() => onProceedToBilling(selectedSeats)}
                >
                  Proceed to Payment
                </Button>
                <Button className="w-full" variant="outline" onClick={() => onNavigate('movies')}>
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
