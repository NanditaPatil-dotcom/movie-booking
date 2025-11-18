import { Link } from 'react-router-dom'

export function MovieCard({ movie }) {
  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  return (
    <Link to={`/showtime/${movie._id || ''}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          border: `1px solid ${colors.gray}33`,
          borderRadius: '0.75rem',
          overflow: 'hidden',
          height: '100%',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          backgroundColor: colors.white,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
          e.currentTarget.style.borderColor = `${colors.red}55`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
          e.currentTarget.style.borderColor = `${colors.gray}33`
        }}
      >
        <div style={{ padding: 0 }}>
          <div
            style={{
              position: 'relative',
              height: '16rem',
              backgroundColor: '#BFBFBF',
              overflow: 'hidden'
            }}
          >
            <img
              src={(() => {
                const img = movie.image || ''
                // Full remote URL (Pinterest or other)
                if (img.startsWith('http://') || img.startsWith('https://')) return img
                // Custom placeholder syntax: 'pinterest:<url>' -> use the URL after ':'
                if (img.startsWith('pinterest:')) return img.slice('pinterest:'.length) || '/placeholder.svg'
                // Server-served absolute path stored on movie (e.g. '/movie1.jpeg')
                if (img.startsWith('/')) return (process.env.REACT_APP_API_URL || 'http://localhost:5000') + img
                // Relative path or missing -> use as-is or fallback
                return img || '/placeholder.svg'
              })()}
              alt={movie.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
          <div style={{ padding: '1rem' }}>
            <h3
              style={{
                fontWeight: '700',
                fontSize: '1.125rem',
                lineHeight: '1.5rem',
                marginBottom: '0.5rem',
                color: colors.gray,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {movie.title}
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                fontSize: '0.875rem',
                color: '#5A5656'
              }}
            >
              <p>Genre: {movie.genre}</p>
              <p>Duration: {movie.duration} min</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: colors.red, fontWeight: '700' }}>{movie.rating}</span>
                <span>⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}