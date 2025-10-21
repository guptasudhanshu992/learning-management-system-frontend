import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

// Commented out as it's not currently used in this file
// interface CourseChapterType {
//   id: string
//   title: string
//   description: string
//   duration: string
//   lessons: CourseLessonType[]
// }

// Commented out as it's not currently used in this file
// interface CourseLessonType {
//   id: string
//   title: string
//   type: 'video' | 'text' | 'quiz'
//   duration?: string
//   isFree?: boolean
// }

export default function CourseDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('curriculum')
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])
  
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  // This would normally be fetched from an API based on the id
  const course = {
    id: id || '1',
    title: 'Complete Web Development Bootcamp 2025',
    description: `Learn web development from scratch with this comprehensive bootcamp. This course takes you from absolute beginner to advanced developer in a matter of weeks. You'll learn HTML, CSS, JavaScript, React, Node.js, MongoDB, and much more.

By the end of this course, you'll be able to:
- Build fully-fledged websites and web applications
- Create responsive designs that work on all devices
- Implement authentication and authorization
- Build RESTful APIs
- Deploy your applications to the cloud
- Work with databases and server-side logic
    
Whether you're looking to start a career as a web developer, create your own projects, or improve your existing skills, this course has everything you need to succeed.`,
    learningOutcomes: [
      'Build 16 web development projects from scratch',
      'Learn the latest technologies, including React 18, Next.js 14, and TypeScript',
      'Create responsive, accessible, and beautiful websites',
      'Understand how to work with APIs and external data sources',
      'Learn modern deployment techniques with CI/CD',
      'Master both front-end and back-end development'
    ],
    prerequisites: [
      'Basic computer literacy',
      'A computer with internet access (Windows, Mac, or Linux)',
      'No prior programming experience required - we start from the absolute basics'
    ],
    certification: {
      included: true,
      provider: 'Learning Management System',
      validFor: 'Lifetime access'
    },
    instructor: {
      id: '101',
      name: 'Dr. Angela Yu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100',
      title: 'Senior Web Developer & Lead Instructor',
      bio: "Dr. Angela Yu is a developer with a passion for teaching. She's trained hundreds of thousands of students, worked as a iOS developer for London's top tech companies, and has her own app in the App Store.",
      courses: 12,
      reviews: 45832,
      students: 312547,
      rating: 4.7,
    },
    price: 84.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 45832,
    students: 312547,
    duration: '65 hours',
    lastUpdated: '2024-10-15',
    language: 'English',
    level: 'Beginner to Advanced',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000',
    isBestseller: true,
    enrolled: false,
    relatedCourses: [
      {
        id: '2',
        title: 'JavaScript Algorithms and Data Structures Masterclass',
        instructor: 'Colt Steele',
        price: 69.99,
        rating: 4.8,
        reviews: 18542,
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
      },
      {
        id: '3',
        title: 'React - The Complete Guide 2025',
        instructor: 'Maximilian Schwarzmüller',
        price: 79.99,
        rating: 4.9,
        reviews: 22145,
        thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400'
      },
      {
        id: '4',
        title: 'Node.js API Masterclass',
        instructor: 'Brad Traversy',
        price: 64.99,
        rating: 4.7,
        reviews: 9875,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
      }
    ],
    chapters: [
      {
        id: 'ch1',
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of how the web works',
        duration: '2h 15m',
        lessons: [
          {
            id: 'l1',
            title: 'Course Overview and Setup',
            type: 'video',
            duration: '10:35',
            isFree: true,
          },
          {
            id: 'l2',
            title: 'How the Internet Works',
            type: 'video',
            duration: '15:22',
            isFree: true,
          },
          {
            id: 'l3',
            title: 'Setting Up Your Development Environment',
            type: 'video',
            duration: '18:43',
          },
          {
            id: 'l4',
            title: 'Web Development Overview',
            type: 'text',
          },
          {
            id: 'l5',
            title: 'Knowledge Check',
            type: 'quiz',
          },
        ],
      },
      {
        id: 'ch2',
        title: 'HTML Fundamentals',
        description: 'Master the building blocks of web pages',
        duration: '4h 30m',
        lessons: [
          {
            id: 'l6',
            title: 'HTML Structure and Elements',
            type: 'video',
            duration: '22:15',
          },
          {
            id: 'l7',
            title: 'Text Formatting and Lists',
            type: 'video',
            duration: '18:30',
          },
          {
            id: 'l8',
            title: 'Links and Navigation',
            type: 'video',
            duration: '15:45',
          },
          {
            id: 'l9',
            title: 'Images and Multimedia',
            type: 'video',
            duration: '20:12',
          },
          {
            id: 'l10',
            title: 'HTML Forms and Inputs',
            type: 'video',
            duration: '25:18',
          },
          {
            id: 'l11',
            title: 'HTML5 Semantic Elements',
            type: 'text',
          },
          {
            id: 'l12',
            title: 'HTML Quiz',
            type: 'quiz',
          },
        ],
      },
      {
        id: 'ch3',
        title: 'CSS Styling',
        description: 'Make your websites beautiful and responsive',
        duration: '5h 45m',
        lessons: [
          {
            id: 'l13',
            title: 'CSS Selectors and Properties',
            type: 'video',
            duration: '24:10',
          },
          {
            id: 'l14',
            title: 'Box Model and Layout',
            type: 'video',
            duration: '22:35',
          },
          {
            id: 'l15',
            title: 'Flexbox Layout',
            type: 'video',
            duration: '28:15',
          },
          {
            id: 'l16',
            title: 'CSS Grid Layout',
            type: 'video',
            duration: '26:20',
          },
          {
            id: 'l17',
            title: 'Responsive Design',
            type: 'video',
            duration: '30:45',
          },
          {
            id: 'l18',
            title: 'CSS Animations',
            type: 'video',
            duration: '22:18',
          },
          {
            id: 'l19',
            title: 'CSS Best Practices',
            type: 'text',
          },
          {
            id: 'l20',
            title: 'CSS Challenge',
            type: 'quiz',
          },
        ],
      },
    ],
    requirements: [
      'No prior coding experience is required',
      'A computer with internet access',
      'A willingness to learn and put in the work',
      'Basic computer skills (ability to install software)',
    ],
    // Learning outcomes already defined earlier in the object
  }

  // Handle expanding/collapsing chapters
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  // Handle share course
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Check out this course: ${course.title}`,
        url: window.location.href,
      })
      .catch(() => {
        // Fallback if sharing fails
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      })
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      instructor: course.instructor.name,
    })
    toast.success('Added to cart!')
  }

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    const inWishlist = isInWishlist(course.id)
    
    if (inWishlist) {
      removeFromWishlist(course.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({
        id: course.id,
        title: course.title,
        price: course.price,
        originalPrice: course.originalPrice,
        thumbnail: course.thumbnail,
        instructor: course.instructor.name,
        rating: course.rating,
        students: course.students,
      })
      toast.success('Added to wishlist!')
    }
  }

  // Calculate total lessons
  const totalLessons = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length, 
    0
  )

  const inWishlist = isInWishlist(course.id)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Course Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-300">
                  {course.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-300">
                  {course.level}
                </span>
                {course.isBestseller && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      BESTSELLER
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-lg text-gray-300 mb-4">
                {course.description.split('\n\n')[0]}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold ml-1">{course.rating}</span>
                  <span className="text-gray-300 ml-1">
                    ({course.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{course.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{course.language}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-primary-300">{course.instructor.name}</p>
                </div>
              </div>
            </div>
            
            <div className="relative lg:max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden text-gray-900">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-52 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </motion.button>
                    
                    <button
                      onClick={handleWishlistToggle}
                      className="w-full py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg flex items-center justify-center"
                    >
                      <Heart 
                        className={`w-5 h-5 mr-2 ${inWishlist ? 'text-red-500 fill-red-500' : ''}`} 
                      />
                      {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                  
                  <div className="mt-6 space-y-4 text-sm">
                    <p className="text-center text-gray-500">30-Day Money-Back Guarantee</p>
                    
                    <div className="border-t border-b border-gray-200 py-4">
                      <h3 className="font-semibold mb-2">This course includes:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <PlayCircle className="w-5 h-5 text-gray-500 mr-2" />
                          {course.duration} of on-demand video
                        </li>
                        <li className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-500 mr-2" />
                          {course.chapters.length} sections
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-gray-500 mr-2" />
                          {totalLessons} lessons
                        </li>
                        <li className="flex items-center">
                          <Award className="w-5 h-5 text-gray-500 mr-2" />
                          Certificate of completion
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        onClick={handleShare}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'curriculum'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'overview'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('prerequisites')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'prerequisites'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Prerequisites
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'instructor'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Instructor
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Course Content
                    </h2>
                    <div className="text-sm text-gray-600">
                      <span>{course.chapters.length} sections</span>
                      <span className="mx-2">•</span>
                      <span>{totalLessons} lessons</span>
                      <span className="mx-2">•</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Chapters Accordion */}
                  <div className="space-y-4">
                    {course.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <div 
                          onClick={() => toggleChapter(chapter.id)}
                          className="bg-gray-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <button className="mr-3">
                              {expandedChapters.includes(chapter.id) ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                            <div>
                              <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                              <p className="text-sm text-gray-500">{chapter.description}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span>{chapter.lessons.length} lessons</span>
                            <span className="mx-2">•</span>
                            <span>{chapter.duration}</span>
                          </div>
                        </div>

                        {/* Chapter Content */}
                        {expandedChapters.includes(chapter.id) && (
                          <div className="border-t border-gray-200 divide-y divide-gray-200">
                            {chapter.lessons.map((lesson) => (
                              <div 
                                key={lesson.id}
                                className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                              >
                                <div className="flex items-center">
                                  {lesson.type === 'video' && (
                                    <PlayCircle className="w-5 h-5 text-gray-500 mr-3" />
                                  )}
                                  {lesson.type === 'text' && (
                                    <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                  )}
                                  {lesson.type === 'quiz' && (
                                    <CheckCircle className="w-5 h-5 text-gray-500 mr-3" />
                                  )}
                                  <span className={lesson.isFree ? 'text-gray-900' : 'text-gray-700'}>
                                    {lesson.title}
                                  </span>
                                  {lesson.isFree && (
                                    <span className="ml-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      Free
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  {!course.enrolled && !lesson.isFree && (
                                    <Lock className="w-4 h-4 mr-2" />
                                  )}
                                  {lesson.duration && <span>{lesson.duration}</span>}
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

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About This Course
                  </h2>
                  
                  <div className="prose prose-gray max-w-none mb-6">
                    {course.description.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      What you'll learn
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.learningOutcomes.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 mr-3" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Prerequisites Tab */}
              {activeTab === 'prerequisites' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Prerequisites
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Before taking this course, you should be familiar with:
                    </p>
                    <ul className="space-y-3">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Instructor Tab */}
              {activeTab === 'instructor' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Meet Your Instructor
                  </h2>
                  
                  <div className="flex items-start">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-20 h-20 rounded-full mr-6"
                    />
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.instructor.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{course.instructor.title}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{course.instructor.rating} Instructor Rating</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-gray-500 mr-1" />
                          <span>{course.instructor.reviews.toLocaleString()} Reviews</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-500 mr-1" />
                          <span>{course.instructor.students.toLocaleString()} Students</span>
                        </div>
                        
                        <div className="flex items-center">
                          <PlayCircle className="w-4 h-4 text-gray-500 mr-1" />
                          <span>{course.instructor.courses} Courses</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">
                        {course.instructor.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Student Reviews
                    </h2>
                    <div className="flex items-center">
                      <div className="mr-2 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${
                              star <= Math.round(course.rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg">{course.rating}</span>
                      <span className="text-gray-500 ml-2">({course.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Review breakdown */}
                  <div className="space-y-3 mb-6">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = rating === 5 ? 78 : 
                                        rating === 4 ? 12 : 
                                        rating === 3 ? 6 : 
                                        rating === 2 ? 3 : 1;
                      return (
                        <div key={rating} className="flex items-center">
                          <div className="flex items-center w-16">
                            <span className="mr-1">{rating}</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                            <div 
                              className="bg-primary-500 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }} 
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-12">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-6">
                    <p className="text-gray-700">
                      Read authentic reviews from real students who have taken this course!
                    </p>
                    <button className="btn-primary">Write a Review</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Training 5 or more people?
              </h2>
              <p className="text-gray-600 mb-6">
                Get your team access to 25,000+ top courses anytime, anywhere.
              </p>
              
              <Link to="/business" className="btn-secondary w-full justify-center mb-4">
                Try Business Plan
              </Link>
              
              <div className="border-t border-gray-200 pt-6 mt-2">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Top companies choose us
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">Company 1</span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">Company 2</span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">Company 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Courses Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.relatedCourses.map((relatedCourse) => (
              <Link to={`/courses/${relatedCourse.id}`} key={relatedCourse.id}>
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src={relatedCourse.thumbnail} 
                    alt={relatedCourse.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                      {relatedCourse.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{relatedCourse.instructor}</p>
                    
                    <div className="flex items-center mb-3">
                      <span className="font-bold text-amber-700 mr-1">{relatedCourse.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= Math.round(relatedCourse.rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">
                        ({relatedCourse.reviews.toLocaleString()})
                      </span>
                    </div>
                    
                    <div className="font-bold text-gray-900">
                      ${relatedCourse.price.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}