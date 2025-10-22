import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  PlayCircle, 
  FileText, 
  CheckCircle, 
  Lock, 
  Heart, 
  ShoppingCart, 
  Share2,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useAuth } from '../contexts/AuthContext'
import { CourseService } from '../services/courseService'
import { CartService } from '../services/cartService'
import { WishlistService } from '../services/wishlistService'
import { useAsync } from '../hooks/useLoading'
import { Course } from '../types/api'
import { PageLoading, LoadingSpinner } from '../components/ui/Loading'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  // Async hooks for API calls
  const { execute: fetchCourse, isLoading: courseLoading } = useAsync(CourseService.getCourseById)
  const { execute: checkEnrollment } = useAsync(CourseService.getCourseEnrollmentStatus)
  const { execute: enrollInCourse, isLoading: enrolling } = useAsync(CourseService.enrollInCourse)
  const { execute: addCourseToCart, isLoading: addingToCart } = useAsync(CartService.addToCart)
  const { execute: addCourseToWishlist, isLoading: addingToWishlist } = useAsync(WishlistService.addToWishlist)
  const { execute: removeCourseFromWishlist, isLoading: removingFromWishlist } = useAsync(WishlistService.removeFromWishlist)
  const { execute: fetchReviews } = useAsync(CourseService.getCourseReviews)
  const { execute: addReview, isLoading: addingReview } = useAsync(CourseService.addCourseReview)

  useEffect(() => {
    if (!id) {
      navigate('/courses')
      return
    }
    
    loadCourse()
    if (user) {
      checkEnrollmentStatus()
    }
    loadReviews()
  }, [id, user])

  const loadCourse = async () => {
    if (!id) return
    
    try {
      const courseData = await fetchCourse(id)
      if (courseData) {
        setCourse(courseData)
      }
    } catch (error: any) {
      toast.error('Failed to load course details')
      console.error('Error loading course:', error)
    }
  }

  const checkEnrollmentStatus = async () => {
    if (!id) return
    
    try {
      const status = await checkEnrollment(id)
      if (status) {
        setIsEnrolled(status.enrolled)
      }
    } catch (error) {
      console.error('Error checking enrollment:', error)
    }
  }

  const loadReviews = async () => {
    if (!id) return
    
    try {
      const reviewsData = await fetchReviews(id, 1, 10)
      if (reviewsData) {
        setReviews(reviewsData.items)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    }
  }

  const handleEnroll = async () => {
    if (!id || !user) {
      toast.error('Please login to enroll in this course')
      navigate('/login')
      return
    }

    try {
      await enrollInCourse(id)
      setIsEnrolled(true)
      toast.success('Successfully enrolled in the course!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to enroll in course')
    }
  }

  const handleAddToCart = async () => {
    if (!id) return
    
    try {
      await addCourseToCart({ course_id: id })
      addToCart({ id } as any) // Update context
      toast.success('Added to cart!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add to cart')
    }
  }

  const handleWishlistToggle = async () => {
    if (!id) return
    
    try {
      const isInWishlist = wishlist.some((item: any) => item.id === id)
      
      if (isInWishlist) {
        await removeCourseFromWishlist(id)
        removeFromWishlist(id)
        toast.success('Removed from wishlist')
      } else {
        await addCourseToWishlist({ course_id: id })
        addToWishlist({ id } as any) // Update context
        toast.success('Added to wishlist!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update wishlist')
    }
  }

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !user) {
      toast.error('Please login to add a review')
      return
    }

    try {
      await addReview(id, { rating: newReview.rating, comment: newReview.comment })
      setNewReview({ rating: 5, comment: '' })
      loadReviews() // Reload reviews
      toast.success('Review added successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add review')
    }
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  if (courseLoading || !course) {
    return <PageLoading />
  }

  const isInWishlist = wishlist.some((item: any) => item.id === course.id)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/courses"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>
      </div>

      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
                  {course.category_name || 'Course'}
                </span>
                {course.is_published && (
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                    Published
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(course.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {course.rating || 'No rating'} ({course.students_count || 0} students)
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>Instructor: {course.instructor_name || 'TBA'}</span>
                <Clock className="w-5 h-5 ml-6 mr-2" />
                <span>Updated {new Date(course.updated_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Course Image and Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-24">
                <div className="relative">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      ${course.price}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {isEnrolled ? (
                      <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Enrolled
                      </button>
                    ) : user ? (
                      <>
                        <button
                          onClick={handleEnroll}
                          disabled={enrolling}
                          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                          {enrolling ? <LoadingSpinner size="sm" /> : 'Enroll Now'}
                        </button>
                        <button
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                          className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                          {addingToCart ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                      >
                        Login to Enroll
                      </Link>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleWishlistToggle}
                        disabled={addingToWishlist || removingFromWishlist}
                        className={`flex-1 border rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50 flex items-center justify-center ${
                          isInWishlist
                            ? 'border-red-300 text-red-600 bg-red-50'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {addingToWishlist || removingFromWishlist ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                            {isInWishlist ? 'Wishlisted' : 'Wishlist'}
                          </>
                        )}
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'curriculum', label: 'Curriculum' },
                    { id: 'reviews', label: 'Reviews' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About This Course
                      </h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Course Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Duration</div>
                            <div className="text-gray-600">Self-paced</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Students</div>
                            <div className="text-gray-600">{course.students_count || 0} enrolled</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Certificate</div>
                            <div className="text-gray-600">Upon completion</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Language</div>
                            <div className="text-gray-600">English</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Course Curriculum
                    </h3>
                    <div className="space-y-2">
                      {/* Placeholder curriculum - would come from API */}
                      {[1, 2, 3].map((chapter) => (
                        <div key={chapter} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => toggleChapter(chapter.toString())}
                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Chapter {chapter}: Getting Started
                              </h4>
                              <p className="text-sm text-gray-600">5 lessons • 45 min</p>
                            </div>
                            {expandedChapters.includes(chapter.toString()) ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          
                          {expandedChapters.includes(chapter.toString()) && (
                            <div className="px-4 pb-3 border-t border-gray-100">
                              {[1, 2, 3].map((lesson) => (
                                <div key={lesson} className="flex items-center justify-between py-2 text-sm">
                                  <div className="flex items-center">
                                    <PlayCircle className="w-4 h-4 text-gray-400 mr-2" />
                                    <span>Lesson {lesson}: Introduction</span>
                                  </div>
                                  <div className="flex items-center text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>8 min</span>
                                    {!isEnrolled && <Lock className="w-3 h-3 ml-2" />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Student Reviews
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{course.rating || 'No rating'}</span>
                        <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
                      </div>
                    </div>

                    {/* Add Review Form (for enrolled users) */}
                    {isEnrolled && (
                      <form onSubmit={handleAddReview} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Add Your Review</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Rating
                            </label>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                                  className={`w-6 h-6 ${
                                    rating <= newReview.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  <Star className="w-full h-full" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Comment
                            </label>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Share your thoughts about this course..."
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={addingReview}
                            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                          >
                            {addingReview ? <LoadingSpinner size="sm" /> : 'Submit Review'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this course!</p>
                      ) : (
                        reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {review.author_name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-gray-900">{review.author_name || 'Anonymous'}</p>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Self-paced learning</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Community support</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}