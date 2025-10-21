import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, Eye, Users, BookOpen, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  thumbnail: string
  instructor: string
  duration: string
  students: number
  chapters: number
  status: 'published' | 'draft'
  createdAt: string
}

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, and more.',
      category: 'Development',
      level: 'beginner',
      price: 49.99,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
      instructor: 'John Doe',
      duration: '12 weeks',
      students: 1234,
      chapters: 15,
      status: 'published',
      createdAt: '2024-10-15',
    },
    {
      id: '2',
      title: 'Advanced JavaScript Patterns',
      description: 'Master advanced JavaScript concepts, design patterns, and best practices.',
      category: 'Development',
      level: 'advanced',
      price: 79.99,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600',
      instructor: 'Jane Smith',
      duration: '8 weeks',
      students: 856,
      chapters: 10,
      status: 'published',
      createdAt: '2024-10-10',
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design.',
      category: 'Design',
      level: 'beginner',
      price: 39.99,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      instructor: 'Mike Johnson',
      duration: '6 weeks',
      students: 542,
      chapters: 8,
      status: 'draft',
      createdAt: '2024-10-08',
    },
  ])

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all chapters and lessons.')) {
      setCourses(courses.filter((course) => course.id !== id))
      toast.success('Course deleted successfully')
    }
  }

  const toggleStatus = (id: string) => {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? { ...course, status: course.status === 'published' ? 'draft' : 'published' }
          : course
      )
    )
    toast.success('Status updated successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your courses</p>
        </div>
        <Link to="/admin/courses/create">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </motion.button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{courses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Published</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {courses.filter((c) => c.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {courses.reduce((acc, c) => acc + c.students, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${courses.reduce((acc, c) => acc + c.price * c.students, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-0 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative h-48">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'published'
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {course.level}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ${course.price}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span className="px-2 py-1 bg-gray-100 rounded">{course.category}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{course.chapters} chapters</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <p>Instructor: <span className="font-medium text-gray-700">{course.instructor}</span></p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/admin/courses/${course.id}/edit`} className="flex-1">
                  <button className="w-full flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => toggleStatus(course.id)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    course.status === 'published'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {course.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No courses found. Create your first course!</p>
        </div>
      )}
    </div>
  )
}
