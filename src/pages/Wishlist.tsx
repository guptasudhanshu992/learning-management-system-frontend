import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'
import { WishlistService } from '../services/wishlistService'
import { CartService } from '../services/cartService'
import { useAuth } from '../contexts/AuthContext'
import { useAsync } from '../hooks/useLoading'
import { WishlistItem } from '../types/api'
import { PageLoading } from '../components/ui/Loading'

export default function Wishlist() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  
  // Async hooks
  const { execute: fetchWishlist, isLoading: wishlistLoading } = useAsync(WishlistService.getWishlist)
  const { execute: removeFromWishlistAPI, isLoading: removingItem } = useAsync(WishlistService.removeFromWishlist)
  const { execute: clearWishlistAPI, isLoading: clearingWishlist } = useAsync(WishlistService.clearWishlist)
  const { execute: addToCartAPI, isLoading: addingToCart } = useAsync(CartService.addToCart)

  useEffect(() => {
    if (user) {
      loadWishlist()
    }
  }, [user])

  const loadWishlist = async () => {
    try {
      const response = await fetchWishlist(1, 50) // Get all items
      if (response?.items) {
        setWishlistItems(response.items)
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      toast.error('Failed to load wishlist')
    }
  }

  // Handle move to cart
  const handleMoveToCart = async (courseId: string) => {
    try {
      // Add to cart
      await addToCartAPI({ course_id: courseId })
      
      // Remove from wishlist
      await removeFromWishlistAPI(courseId)
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item.course_id !== courseId))
      
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to move item to cart')
    }
  }

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      await removeFromWishlistAPI(courseId)
      setWishlistItems(prev => prev.filter(item => item.course_id !== courseId))
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove item from wishlist')
    }
  }

  // Move all to cart
  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return

    try {
      // Add all items to cart
      const promises = wishlistItems.map(item => 
        addToCartAPI({ course_id: item.course_id })
      )
      
      await Promise.all(promises)
      
      // Clear wishlist
      await clearWishlistAPI()
      setWishlistItems([])
      
      toast.success('All items moved to cart!')
    } catch (error) {
      toast.error('Failed to move all items to cart')
    }
  }

  // Check if wishlist is empty
  const isEmpty = wishlistItems.length === 0

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please login to view your wishlist</h2>
            <p className="text-gray-600 mb-8">
              You need to be logged in to access your wishlist.
            </p>
            <Link to="/auth/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (wishlistLoading) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="mt-2 text-gray-600">
            {isEmpty ? 'Your wishlist is empty' : `You have ${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Save courses you're interested in to come back to them later.
            </p>
            <Link to="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleMoveAllToCart}
                disabled={addingToCart || clearingWishlist}
                className="flex items-center text-sm text-primary-600 hover:text-primary-800 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {addingToCart || clearingWishlist ? 'Moving...' : 'Move all to cart'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <Link to={`/courses/${item.course.id}`}>
                      <img
                        src={item.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                        alt={item.course.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  </div>

                  <div className="p-5">
                    <Link to={`/courses/${item.course.id}`} className="block">
                      <h2 className="font-bold text-gray-900 mb-1 line-clamp-2">
                        {item.course.title}
                      </h2>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      by {item.course.instructor_name}
                    </p>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.course.description}
                    </p>

                    {(item.course.rating || item.course.students_count) && (
                      <div className="flex items-center space-x-1 mb-3">
                        {item.course.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-gray-700">{item.course.rating}</span>
                          </div>
                        )}
                        
                        {item.course.students_count && (
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mx-1">•</span>
                            <Users className="h-3 w-3 mr-1" />
                            <span>{item.course.students_count.toLocaleString()} students</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-lg font-bold">${item.course.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.course_id)}
                          disabled={removingItem}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleMoveToCart(item.course_id)}
                          disabled={addingToCart}
                          className="p-2 text-primary-600 hover:text-primary-800 transition-colors disabled:opacity-50"
                          aria-label="Move to cart"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}