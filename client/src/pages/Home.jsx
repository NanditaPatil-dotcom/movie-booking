import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Navigation } from '../components/Navigation'

export default function Home() {
  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: colors.light,
        color: colors.gray
      }}
    >
      <Navigation />

      {/* Hero Section - light theme with dark-gray banner */}
      <section
        style={{
          position: 'relative',
          padding: '3rem 1rem',
          backgroundColor: colors.light
        }}
      >
        <div
          style={{
            maxWidth: '64rem',
            margin: '0 auto',
            backgroundColor: '#4A4545',
            borderRadius: '0.5rem',
            padding: '3rem 1rem',
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: colors.white,
              letterSpacing: '0.5px'
            }}
          >
            WELCOME
          </h1>
          <p style={{ fontSize: '1rem', color: '#E9E9E9', marginBottom: '1.5rem' }}>
            Movie tickets, events, cinemas nearby
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link to="/movies">
              <Button size="lg" style={{ padding: '0 2rem' }}>
                Book tickets
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" style={{ padding: '0 2rem' }}>
                Sign-up now!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '2rem',
              color: colors.gray
            }}
          >
            Why CineBook?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {[
              { title: 'Easy Booking', desc: 'Browse, select, and book tickets in minutes. No hassle, no queues.' },
              { title: 'Secure Payment', desc: 'Multiple payment options with encrypted transactions for your safety.' },
              { title: 'Instant Confirmation', desc: 'Get your tickets instantly via email with complete booking details.' }
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  backgroundColor: colors.white,
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${colors.gray}22`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: colors.gray }}>
                  {f.title}
                </h3>
                <p style={{ color: '#5A5656' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}