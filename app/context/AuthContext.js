'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authAPI } from '@/app/lib/apiClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user')
    const accessToken = localStorage.getItem('accessToken')
    
    if (loggedInUser && accessToken) {
      setUser(JSON.parse(loggedInUser))
    }
    setLoading(false)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      const publicRoutes = ['/', '/login', '/signup']
      if (!publicRoutes.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [loading, user, pathname, router])

  const login = async (email, password) => {
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return false
    }

    try {
      setError(null)
      const response = await authAPI.login(email, password)
      
      console.log('🔐 Login Response:', response)
      console.log('📦 access token:', response.tokens?.access)
      console.log('📦 refresh token:', response.tokens?.refresh)
      console.log('👤 user:', response.user)

      // Store tokens and user data (API uses tokens.access and tokens.refresh)
      if (response.tokens?.access) {
        localStorage.setItem('accessToken', response.tokens.access)
        console.log('✅ accessToken stored')
      } else {
        console.error('❌ access token missing from response')
      }
      
      if (response.tokens?.refresh) {
        localStorage.setItem('refreshToken', response.tokens.refresh)
        console.log('✅ refreshToken stored')
      } else {
        console.error('❌ refresh token missing from response')
      }

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('✅ user stored')
      }

      setUser(response.user)
      router.push('/dashboard')
      return true
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.'
      setError(errorMessage)
      console.error('Login error:', err)
      return false
    }
  }

  const signup = async (email, password, confirmPassword, role = 'user') => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    try {
      setError(null)
      const response = await authAPI.register(email, password, role)

      console.log('🔐 Signup Response:', response)
      console.log('📦 access token:', response.tokens?.access)
      console.log('📦 refresh token:', response.tokens?.refresh)
      console.log('👤 user:', response.user)

      // Store tokens and user data (API uses tokens.access and tokens.refresh)
      if (response.tokens?.access) {
        localStorage.setItem('accessToken', response.tokens.access)
        console.log('✅ accessToken stored')
      } else {
        console.error('❌ access token missing from response')
      }
      
      if (response.tokens?.refresh) {
        localStorage.setItem('refreshToken', response.tokens.refresh)
        console.log('✅ refreshToken stored')
      } else {
        console.error('❌ refresh token missing from response')
      }

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('✅ user stored')
      }

      setUser(response.user)
      router.push('/dashboard')
      return true
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      console.error('Signup error:', err)
      return false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
