export function MovieCard({ movie }) {
  return (
    <div style={{
      border: '1px solid #374151',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      height: '100%',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      backgroundColor: '#1f2937'
    }}
    onMouseEnter={(e) => e.target.style.borderColor = '#fbbf24'}
    onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
    >
      <div style={{
        padding: 0
      }}>
        <div style={{
          position: 'relative',
          height: '16rem',
          backgroundColor: '#374151',
          overflow: 'hidden'
        }}>
          <img
            src={movie.image || "/placeholder.svg"}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
        <div style={{
          padding: '1rem'
        }}>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{movie.title}</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <p>Genre: {movie.genre}</p>
            <p>Duration: {movie.duration} min</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                color: '#fbbf24',
                fontWeight: '600'
              }}>{movie.rating}</span>
              <span>⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}