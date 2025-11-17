const { findShowtime } = require('../utils/timeUtils')

describe('findShowtime', () => {
  const mockMovie = {
    showtimes: [
      { time: '2025-10-28T13:30:00', bookedSeats: [] },
      { time: '2025-10-28T15:00:00Z', bookedSeats: [] },
      { time: '10:00 AM', bookedSeats: [] }
    ]
  }

  test('exact string match', () => {
    const result = findShowtime(mockMovie, '2025-10-28T13:30:00')
    expect(result).toEqual(mockMovie.showtimes[0])
  })

  test('trimmed input matches', () => {
    const result = findShowtime(mockMovie, '  2025-10-28T13:30:00  ')
    expect(result).toEqual(mockMovie.showtimes[0])
  })

  test('ISO with Z matches', () => {
    const result = findShowtime(mockMovie, '2025-10-28T15:00:00.000Z')
    expect(result).toEqual(mockMovie.showtimes[1])
  })

  test('within tolerance (30s) matches', () => {
    const result = findShowtime(mockMovie, '2025-10-28T13:30:30') // within 30 seconds
    expect(result).toEqual(mockMovie.showtimes[0])
  })

  test('not found returns null', () => {
    const result = findShowtime(mockMovie, '2025-10-28T20:00:00')
    expect(result).toBeNull()
  })

  test('invalid input returns null', () => {
    const result = findShowtime(mockMovie, 'invalid')
    expect(result).toBeNull()
  })
})
const { findShowtime } = require('../utils/timeUtils');

describe('findShowtime', () => {
  const mockMovie = {
    showtimes: [
      { time: '2025-10-28T13:30:00', bookedSeats: [] },
      { time: '2025-10-28T15:00:00Z', bookedSeats: [] },
      { time: '10:00 AM', bookedSeats: [] }
    ]
  };

  test('exact string match', () => {
    const result = findShowtime(mockMovie, '2025-10-28T13:30:00');
    expect(result).toEqual(mockMovie.showtimes[0]);
  });

  test('exact string match with trim', () => {
    const result = findShowtime(mockMovie, '  2025-10-28T13:30:00  ');
    expect(result).toEqual(mockMovie.showtimes[0]);
  });

  test('ISO string comparison', () => {
    const result = findShowtime(mockMovie, '2025-10-28T15:00:00.000Z');
    expect(result).toEqual(mockMovie.showtimes[1]);
  });

  test('time tolerance match', () => {
    const result = findShowtime(mockMovie, '2025-10-28T13:30:30'); // within 30 seconds
    expect(result).toEqual(mockMovie.showtimes[0]);
  });

  test('no match', () => {
    const result = findShowtime(mockMovie, '2025-10-28T20:00:00');
    expect(result).toBeNull();
  });

  test('invalid date fallback', () => {
    const result = findShowtime(mockMovie, 'invalid');
    expect(result).toBeNull();
  });
});