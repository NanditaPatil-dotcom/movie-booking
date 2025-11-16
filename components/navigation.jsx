'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          CineBook
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
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
