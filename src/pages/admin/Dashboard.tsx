import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, TrendingUp, Activity, AlertCircle } from 'lucide-react'
import { UserService } from '../../services/userService'
import { CourseService } from '../../services/courseService'
import { useAsync } from '../../hooks/useLoading'
import { User } from '../../types/api'
import { PageLoading } from '../../components/ui/Loading'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  publishedCourses: number
  recentUsers: User[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  
  // Async hooks
  const { execute: fetchUserStats, isLoading: userStatsLoading } = useAsync(UserService.getUserStatistics)
  const { execute: fetchCourseStats, isLoading: courseStatsLoading } = useAsync(CourseService.getCourseStatistics)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const [userStats, courseStats] = await Promise.all([
        fetchUserStats(),
        fetchCourseStats()
      ])

      if (userStats && courseStats) {
        setStats({
          totalUsers: userStats.total_users,
          activeUsers: userStats.active_users,
          totalCourses: courseStats.total_courses,
          publishedCourses: courseStats.published_courses,
          recentUsers: userStats.recent_registrations
        })
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast.error('Failed to load dashboard statistics')
    }
  }

  const isLoading = userStatsLoading || courseStatsLoading

  if (isLoading && !stats) {
    return <PageLoading />
  }

  const dashboardStats = [
    { 
      name: 'Total Users', 
      value: stats?.totalUsers?.toLocaleString() || '0', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Active Users', 
      value: stats?.activeUsers?.toLocaleString() || '0', 
      change: '+8%', 
      icon: Activity, 
      color: 'bg-green-500' 
    },
    { 
      name: 'Total Courses', 
      value: stats?.totalCourses?.toLocaleString() || '0', 
      change: '+5%', 
      icon: BookOpen, 
      color: 'bg-purple-500' 
    },
    { 
      name: 'Published Courses', 
      value: stats?.publishedCourses?.toLocaleString() || '0', 
      change: '+3%', 
      icon: TrendingUp, 
      color: 'bg-orange-500' 
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Registrations</h2>
        {stats?.recentUsers && stats.recentUsers.length > 0 ? (
          <div className="space-y-4">
            {stats.recentUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent registrations</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Users className="w-8 h-8 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">Add, edit, or remove users</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <BookOpen className="w-8 h-8 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Courses</p>
            <p className="text-sm text-gray-500">Create and update courses</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <TrendingUp className="w-8 h-8 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-500">Track platform performance</p>
          </button>
        </div>
      </motion.div>
    </div>
  )
}