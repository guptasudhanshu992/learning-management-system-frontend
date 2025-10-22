import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { AuthService } from '../services/authService'
import type { User } from '../types/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored token and user
        const storedToken = AuthService.getAccessToken()
        const storedUser = AuthService.getStoredUser()
        
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(storedUser)
          
          // Validate token by fetching current user
          try {
            const currentUser = await AuthService.getCurrentUser()
            setUser(currentUser)
          } catch (error) {
            // Token is invalid, clear storage
            await AuthService.logout()
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const authData = await AuthService.login({ 
        username: email, // Backend expects username field
        password 
      })
      
      setToken(authData.access_token)
      setUser(authData.user)
      
      toast.success('Welcome back!')
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (fullName: string, email: string, password: string): Promise<void> => {
    try {
      const authData = await AuthService.register({
        full_name: fullName,
        email,
        password
      })
      
      setToken(authData.access_token)
      setUser(authData.user)
      
      toast.success('Account created successfully!')
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout()
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      // Always clear local state even if API call fails
      setToken(null)
      setUser(null)
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await AuthService.updateProfile(userData)
      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Profile update failed'
      toast.error(message)
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await AuthService.changePassword(currentPassword, newPassword)
      toast.success('Password changed successfully')
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Password change failed'
      toast.error(message)
      throw error
    }
  }

  const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      await AuthService.requestPasswordReset(email)
      toast.success('Password reset email sent')
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Password reset request failed'
      toast.error(message)
      throw error
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await AuthService.resetPassword(token, newPassword)
      toast.success('Password reset successfully')
    } catch (error: any) {
      const message = error.response?.data?.detail || error.message || 'Password reset failed'
      toast.error(message)
      throw error
    }
  }

  const isAuthenticated = AuthService.isAuthenticated()

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    isLoading,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
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
