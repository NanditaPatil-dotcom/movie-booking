import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Navigation } from '../components/Navigation'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#111827'
    }}>
      <Navigation />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background gradient effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.2), transparent)'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1rem',
          maxWidth: '50rem',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            CineBook
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#9ca3af',
            marginBottom: '2rem',
            lineHeight: '1.2'
          }}>
            Discover, Select, Enjoy. Your favorite movies are just a few clicks away.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Link to="/movies">
              <Button size="lg" style={{ padding: '0 2rem' }}>
                Book Tickets
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" style={{ padding: '0 2rem' }}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured movies preview */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8rem',
          background: 'linear-gradient(to top, #111827, transparent)'
        }} />
      </section>

      {/* Features Section */}
      <section style={{
        padding: '5rem 1rem'
      }}>
        <div style={{
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '4rem'
          }}>Why CineBook?</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '2rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>Easy Booking</h3>
              <p style={{
                color: '#9ca3af'
              }}>
                Browse, select, and book tickets in minutes. No hassle, no queues.
              </p>
            </div>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '2rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>Secure Payment</h3>
              <p style={{
                color: '#9ca3af'
              }}>
                Multiple payment options with encrypted transactions for your safety.
              </p>
            </div>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '2rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>Instant Confirmation</h3>
              <p style={{
                color: '#9ca3af'
              }}>
                Get your tickets instantly via email with complete booking details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}