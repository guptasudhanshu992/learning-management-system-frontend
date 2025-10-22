import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Star,
  Users,
  BookOpen,
  Heart,
  ShoppingCart,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { CourseService } from '../services/courseService'
import { CartService } from '../services/cartService'
import { WishlistService } from '../services/wishlistService'
import { useAsync, usePagination } from '../hooks/useLoading'
import { Course } from '../types/api'
import { PageLoading, LoadingSpinner } from '../components/ui/Loading'
import toast from 'react-hot-toast'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [showFilters, setShowFilters] = useState(false)

  const { addToCart } = useCart()
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

  // Pagination
  const { 
    page, 
    perPage, 
    total, 
    totalPages, 
    hasNextPage, 
    hasPrevPage,
    nextPage,
    prevPage,
    setTotal,
    setIsLoading: setPaginationLoading 
  } = usePagination(1, 12)

  // Async hooks for data fetching
  const { execute: fetchCourses, isLoading: coursesLoading } = useAsync(CourseService.getCourses)
  const { execute: fetchCategories, isLoading: categoriesLoading } = useAsync(CourseService.getCategories)
  const { execute: addCourseToCart, isLoading: addingToCart } = useAsync(CartService.addToCart)
  const { execute: addCourseToWishlist, isLoading: addingToWishlist } = useAsync(WishlistService.addToWishlist)
  const { execute: removeCourseFromWishlist, isLoading: removingFromWishlist } = useAsync(WishlistService.removeFromWishlist)

  // Load initial data
  useEffect(() => {
    loadCourses()
  }, [page, selectedCategory, sortBy, searchTerm])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCourses = async () => {
    try {
      setPaginationLoading(true)
      const filters = {
        page,
        per_page: perPage,
        search: searchTerm || undefined,
        category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort_by: sortBy as any,
        sort_order: 'desc' as const,
        is_published: true
      }
      
      const response = await fetchCourses(filters)
      if (response) {
        setCourses(response.items)
        setTotal(response.total)
      }
    } catch (error) {
      toast.error('Failed to load courses')
      console.error('Error loading courses:', error)
    } finally {
      setPaginationLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories()
      if (categoriesData) {
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleAddToCart = async (courseId: string) => {
    try {
      await addCourseToCart({ course_id: courseId })
      addToCart({ id: courseId } as any) // Update context
      toast.success('Added to cart!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add to cart')
    }
  }

  const handleWishlistToggle = async (courseId: string) => {
    try {
      const isInWishlist = wishlist.some((item: any) => item.id === courseId)
      
      if (isInWishlist) {
        await removeCourseFromWishlist(courseId)
        removeFromWishlist(courseId)
        toast.success('Removed from wishlist')
      } else {
        await addCourseToWishlist({ course_id: courseId })
        addToWishlist({ id: courseId } as any) // Update context
        toast.success('Added to wishlist!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update wishlist')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search will be triggered by useEffect when searchTerm changes
  }

  const isLoading = coursesLoading || categoriesLoading

  if (isLoading && courses.length === 0) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Explore Courses
              </h1>
              <p className="text-gray-600">
                Discover {total} courses to boost your skills
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md lg:max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="created_at">Newest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="rating">Highest Rated</option>
                    <option value="students_count">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="flex-1">
            {coursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                            {course.category_name || 'General'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleWishlistToggle(course.id)}
                          disabled={addingToWishlist || removingFromWishlist}
                          className={`absolute top-4 right-4 p-2 rounded-full ${
                            wishlist.some((item: any) => item.id === course.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-600 hover:text-red-500'
                          } transition-colors`}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(course.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {course.rating || 'No rating'} • {course.students_count || 0} students
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{course.instructor_name || 'Instructor'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              ${course.price}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(course.id)}
                              disabled={addingToCart}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {addingToCart ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <ShoppingCart className="w-4 h-4" />
                              )}
                              <span className="hidden sm:inline">Add to Cart</span>
                            </button>

                            <Link
                              to={`/course/${course.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              <span className="hidden sm:inline">Preview</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, total)} of {total} courses
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={prevPage}
                        disabled={!hasPrevPage}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = page <= 3 ? i + 1 : page - 2 + i
                          if (pageNum <= totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => {/* TODO: Add page navigation */}}
                                className={`px-3 py-2 rounded-md text-sm ${
                                  pageNum === page
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          }
                          return null
                        })}
                      </div>

                      <button
                        onClick={nextPage}
                        disabled={!hasNextPage}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}