// import { Navigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'user'
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const { user, isLoading } = useAuth()

  // DEVELOPMENT MODE: Authentication checks disabled
  // TODO: Enable these checks when moving to production
  
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  //     </div>
  //   )
  // }

  // if (!user) {
  //   return <Navigate to="/login" replace />
  // }

  // if (requiredRole && user.role !== requiredRole) {
  //   return <Navigate to="/login" replace />
  // }

  return <>{children}</>
}
