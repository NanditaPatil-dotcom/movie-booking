import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function Navigation() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      borderBottom: `1px solid ${colors.gray}20`,
      backgroundColor: colors.light
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
          fontSize: '1.75rem',
          fontWeight: '800',
          color: colors.red,
          letterSpacing: '0.5px'
        }}>
          CineBook
        </Link>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          {user ? (
            <>
              <span style={{
                fontSize: '0.875rem',
                color: colors.gray
              }}>
                Welcome, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  signup
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}