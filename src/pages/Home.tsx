import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, Award, TrendingUp, ArrowRight, CheckCircle, Star, Clock } from 'lucide-react'
import { CourseService } from '../services/courseService'
import { BlogService } from '../services/blogService'
import { useAsync } from '../hooks/useLoading'
import { Course, Blog } from '../types/api'
import { handleDataLoadError, retryOperation } from '../utils/errorHandling'
import { FeaturedCoursesEmptyState, BlogsEmptyState } from '../components/ui/EmptyState'

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([])
  
  // Refs to prevent multiple loading attempts
  const coursesLoaded = useRef(false)
  const blogsLoaded = useRef(false)

  // Async hooks for data fetching
  const { execute: fetchFeaturedCourses, isLoading: coursesLoading } = useAsync(CourseService.getFeaturedCourses)
  const { execute: fetchRecentBlogs, isLoading: blogsLoading } = useAsync(BlogService.getRecentBlogs)

  const loadFeaturedCourses = async () => {
    if (coursesLoaded.current) return
    coursesLoaded.current = true
    
    try {
      const courses = await retryOperation(() => fetchFeaturedCourses(6))
      if (courses && courses.length > 0) {
        setFeaturedCourses(courses)
      } else {
        // No courses found - this is normal, not an error
        setFeaturedCourses([])
      }
    } catch (error) {
      // Handle error gracefully - log but don't show toast for data loading
      handleDataLoadError(error, 'Featured Courses Loading')
      setFeaturedCourses([]) // Ensure empty state is shown
    }
  }

  const loadRecentBlogs = async () => {
    if (blogsLoaded.current) return
    blogsLoaded.current = true
    
    try {
      const blogs = await retryOperation(() => fetchRecentBlogs(3))
      if (blogs && blogs.length > 0) {
        setRecentBlogs(blogs)
      } else {
        // No blogs found - this is normal, not an error
        setRecentBlogs([])
      }
    } catch (error) {
      // Handle error gracefully - log but don't show toast for data loading
      handleDataLoadError(error, 'Recent Blogs Loading')
      setRecentBlogs([]) // Ensure empty state is shown
    }
  }

  const retryFeaturedCourses = async () => {
    coursesLoaded.current = false
    await loadFeaturedCourses()
  }

  const retryRecentBlogs = async () => {
    blogsLoaded.current = false
    await loadRecentBlogs()
  }

  useEffect(() => {
    loadFeaturedCourses()
    loadRecentBlogs()
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Access a wide range of courses designed by industry experts',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from experienced professionals in their fields',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Earn recognized certificates upon course completion',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics',
    },
  ]

  const benefits = [
    'Self-paced learning',
    'Interactive content',
    'Mobile-friendly platform',
    'Lifetime access',
    '24/7 support',
    'Community forums',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Learn Without Limits
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Unlock your potential with our comprehensive learning management system.
                Access thousands of courses and learn at your own pace.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full w-4/5 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-2/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to succeed in your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for Modern Learners
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform is designed to provide you with the best learning experience
                possible. With cutting-edge technology and user-friendly interface, your
                success is our priority.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-4">Start Learning Today</h3>
                <p className="text-primary-100 mb-6">
                  Join thousands of students already learning on our platform
                </p>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold">10,000+</div>
                    <div className="text-primary-100">Active Students</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-primary-100">Courses Available</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-primary-100">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Start your learning journey with our most popular courses
            </p>
          </motion.div>

          {coursesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
          ) : featuredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                        {course.category_name || 'Course'}
                      </span>
                    </div>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${course.price}
                        </span>
                      </div>

                      <Link
                        to={`/course/${course.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <FeaturedCoursesEmptyState 
              onRetry={retryFeaturedCourses} 
              loading={coursesLoading} 
            />
          )}

          {featuredCourses.length > 0 && (
            <div className="text-center">
              <Link
                to="/courses"
                className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest From Our Blog
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest insights and learning tips
            </p>
          </motion.div>

          {blogsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
          ) : recentBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={blog.featured_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                        {blog.category_name || 'Article'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>By {blog.author_name || 'Admin'}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <Link
                      to={`/blog/${blog.slug || blog.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                    >
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <BlogsEmptyState 
              onRetry={retryRecentBlogs} 
              loading={blogsLoading} 
            />
          )}

          {recentBlogs.length > 0 && (
            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                View All Articles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join our community today and unlock your full potential
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
