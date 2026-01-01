import { createContext, useContext, useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    // Check if dev mode is enabled
    authAPI.checkDevMode()
      .then(res => setDevMode(res.data.dev_mode))
      .catch(() => setDevMode(false))

    // Check for existing session
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      // Verify token is still valid
      authAPI.getMe()
        .then(res => {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        })
        .catch(() => {
          logout()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Dev login - no Google required
  const devLogin = async (isAdmin = true) => {
    try {
      const response = await authAPI.devLogin({
        name: isAdmin ? 'Admin User' : 'Test User',
        email: isAdmin ? 'admin@aurafashions.com' : 'user@aurafashions.com',
        is_admin: isAdmin
      })
      
      const { access_token, user } = response.data
      
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      toast.success(`Welcome, ${user.name}!`)
    } catch (error) {
      console.error('Dev login error:', error)
      toast.error('Failed to login')
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await authAPI.googleLogin(tokenResponse.access_token)
        
        const { access_token, user } = response.data
        
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        
        toast.success(`Welcome, ${user.name}!`)
      } catch (error) {
        console.error('Login error:', error)
        toast.error('Failed to login. Please try again.')
      }
    },
    onError: () => {
      toast.error('Google login failed')
    },
    flow: 'implicit',
  })

  // Use dev login if in dev mode, otherwise use Google
  const login = devMode ? () => devLogin(true) : googleLogin

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      devLogin,
      logout, 
      isAdmin,
      isAuthenticated: !!user,
      devMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

