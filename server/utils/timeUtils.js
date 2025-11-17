function findShowtime(movie, selectedShowtime) {
  const key = String(selectedShowtime).trim();
  // 1) exact string match
  let st = movie.showtimes.find(s => String(s.time).trim() === key);
  if (st) return st;
  // 2) compare ISO strings
  st = movie.showtimes.find(s => {
    try { return new Date(s.time).toISOString() === new Date(key).toISOString(); } catch(e) { return false; }
  });
  if (st) return st;
  // 3) +/- 60 seconds tolerance (only if both parse to valid Date)
  try {
    const target = new Date(key);
    if (!isNaN(target)) {
      const start = new Date(target.getTime() - 60000), end = new Date(target.getTime() + 60000);
      return movie.showtimes.find(s => {
        const d = new Date(s.time);
        return !isNaN(d) && d >= start && d <= end;
      });
    }
  } catch(e) {}
  return null;
}

module.exports = { findShowtime };