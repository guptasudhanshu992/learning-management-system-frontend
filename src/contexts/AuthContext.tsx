import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

// Configure Axios with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
})

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
    
    setIsLoading(false)
  }, [])

  // Using _ prefix to indicate unused parameter
  const login = async (email: string, _password: string) => {
    try {
      // TODO: Replace with actual API endpoint
      // Mock authentication for testing - REMOVE THIS IN PRODUCTION
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setToken(mockToken)
      setUser(mockUser as any)
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`
      
      // Uncomment this when you have a real backend:
      // const response = await api.post('/auth/login', { email, password })
      // const { token: newToken, user: userData } = response.data
      // setToken(newToken)
      // setUser(userData)
      // localStorage.setItem('token', newToken)
      // localStorage.setItem('user', JSON.stringify(userData))
      // api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, _password: string) => {
    try {
      // TODO: Replace with actual API endpoint
      // Mock authentication for testing - REMOVE THIS IN PRODUCTION
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: 'user',
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setToken(mockToken)
      setUser(mockUser as any)
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`
      
      // Uncomment this when you have a real backend:
      // const response = await api.post('/auth/register', { name, email, password })
      // const { token: newToken, user: userData } = response.data
      // setToken(newToken)
      // setUser(userData)
      // localStorage.setItem('token', newToken)
      // localStorage.setItem('user', JSON.stringify(userData))
      // api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
