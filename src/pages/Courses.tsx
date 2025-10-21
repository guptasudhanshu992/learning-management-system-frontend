import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Heart,
  ShoppingCart,
  Play,
  Award,
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  students: number
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  thumbnail: string
  lessons: number
  lastUpdated: string
  bestseller?: boolean
  isNew?: boolean
}

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp 2025',
    description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects.',
    instructor: 'Dr. Angela Yu',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100',
    price: 84.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 45832,
    students: 312547,
    duration: '65 hours',
    level: 'beginner',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
    lessons: 154,
    lastUpdated: '2024-10-15',
    bestseller: true,
  },
  {
    id: '2',
    title: 'Advanced JavaScript: The Weird Parts',
    description: 'Deep dive into JavaScript\'s most confusing concepts. Understand closures, prototypes, and the \'this\' keyword.',
    instructor: 'Anthony Alicea',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviews: 28456,
    students: 185432,
    duration: '11.5 hours',
    level: 'advanced',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600',
    lessons: 85,
    lastUpdated: '2024-09-28',
  },
  {
    id: '3',
    title: 'Complete React Developer Course',
    description: 'Master React, Redux, React Router, Hooks, and Context API. Build real-world applications with modern React.',
    instructor: 'Andrew Mead',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    price: 94.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviews: 35672,
    students: 245789,
    duration: '39 hours',
    level: 'intermediate',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    lessons: 197,
    lastUpdated: '2024-10-10',
    bestseller: true,
  },
  {
    id: '4',
    title: 'UI/UX Design Complete Course',
    description: 'Learn user interface and user experience design from scratch. Master Figma, design systems, and user research.',
    instructor: 'Daniel Schifano',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    price: 79.99,
    originalPrice: 159.99,
    rating: 4.5,
    reviews: 18923,
    students: 89654,
    duration: '22 hours',
    level: 'beginner',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    lessons: 156,
    lastUpdated: '2024-10-05',
  },
  {
    id: '5',
    title: 'Python for Everybody Specialization',
    description: 'Learn Python programming from basics to advanced. Data structures, web scraping, databases, and APIs.',
    instructor: 'Dr. Charles Severance',
    instructorAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100',
    price: 69.99,
    originalPrice: 129.99,
    rating: 4.9,
    reviews: 52341,
    students: 423156,
    duration: '58 hours',
    level: 'beginner',
    category: 'Programming',
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=600',
    lessons: 178,
    lastUpdated: '2024-10-12',
    isNew: true,
  },
  {
    id: '6',
    title: 'Machine Learning A-Z™',
    description: 'Learn Machine Learning algorithms with Python and R. Hands-on approach with real-world datasets.',
    instructor: 'Kirill Eremenko',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
    price: 109.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 41278,
    students: 167834,
    duration: '44 hours',
    level: 'intermediate',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
    lessons: 267,
    lastUpdated: '2024-09-30',
    bestseller: true,
  },
  {
    id: '7',
    title: 'Digital Marketing Complete Course',
    description: 'Master SEO, Google Ads, Facebook Marketing, Email Marketing, and Analytics. 12 courses in 1.',
    instructor: 'Rob Percival',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    price: 74.99,
    originalPrice: 149.99,
    rating: 4.4,
    reviews: 22156,
    students: 78923,
    duration: '26 hours',
    level: 'beginner',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    lessons: 142,
    lastUpdated: '2024-10-08',
  },
  {
    id: '8',
    title: 'Complete iOS App Development Course',
    description: 'Learn iOS development with Swift and SwiftUI. Build and publish apps to the App Store.',
    instructor: 'Angela Yu',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100',
    price: 94.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviews: 29834,
    students: 134567,
    duration: '42 hours',
    level: 'intermediate',
    category: 'Mobile Development',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
    lessons: 189,
    lastUpdated: '2024-10-01',
    isNew: true,
  },
]

export default function Courses() {
  const [courses] = useState<Course[]>(sampleCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('popularity')
  const [showFilters, setShowFilters] = useState(false)

  const { addToCart } = useCart()
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

  // Get unique categories
  const categories = ['all', ...new Set(courses.map((course) => course.category))]

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' || course.category === selectedCategory

      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        default: // popularity
          return b.students - a.students
      }
    })

  const handleAddToCart = (course: Course) => {
    addToCart(course)
    toast.success('Added to cart!')
  }

  const handleWishlistToggle = (course: Course) => {
    const isInWishlist = wishlist.some((item) => item.id === course.id)
    if (isInWishlist) {
      removeFromWishlist(course.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(course)
      toast.success('Added to wishlist!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn Without Limits
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Choose from thousands of courses taught by expert instructors. Start learning today!
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-100">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm">Instructors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>

            {/* Quick Filters - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 lg:hidden space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => {
            const isInWishlist = wishlist.some((item) => item.id === course.id)
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {course.bestseller && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Bestseller
                      </span>
                    )}
                    {course.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        New
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlistToggle(course)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      } transition-colors`}
                    />
                  </button>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary-600 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Category & Level */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                      {course.level}
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/courses/${course.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
                      {course.title}
                    </h3>
                  </Link>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-medium text-gray-700 mr-1">{course.rating}</span>
                      <span>({course.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      <span>Certificate</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(course)}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}