import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setIsAuthenticated(true)
    } else {
      router.push('/signin')
    }
    setChecked(true)
  }, [router])

  return { isAuthenticated, checked }
}
