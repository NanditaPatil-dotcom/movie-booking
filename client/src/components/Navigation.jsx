import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { useState, useEffect } from 'react'

export function Navigation() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    navigate('/')
  }

  return (
    <nav style={{
      borderBottom: '1px solid #374151',
      backgroundColor: '#1f2937'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#fbbf24'
        }}>
          CineBook
        </Link>

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {user ? (
            <>
              <span style={{
                fontSize: '0.875rem',
                color: '#9ca3af'
              }}>
                Welcome, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}