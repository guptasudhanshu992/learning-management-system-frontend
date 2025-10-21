import { motion } from 'framer-motion'
import { Users, BookOpen, TrendingUp, Activity } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    { name: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { name: 'Active Courses', value: '45', change: '+5%', icon: BookOpen, color: 'bg-green-500' },
    { name: 'Enrollments', value: '892', change: '+18%', icon: TrendingUp, color: 'bg-purple-500' },
    { name: 'Completion Rate', value: '87%', change: '+3%', icon: Activity, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-sm text-gray-500">user{item}@example.com joined the platform</p>
                <p className="text-xs text-gray-400 mt-1">{item} hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
