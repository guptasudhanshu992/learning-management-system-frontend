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
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  
  // Check if wishlist is empty
  const isEmpty = wishlist.length === 0

  // Handle move to cart
  const handleMoveToCart = (itemId: string) => {
    const item = wishlist.find(item => item.id === itemId)
    
    if (item) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        thumbnail: item.thumbnail,
        instructor: item.instructor,
      })
      removeFromWishlist(itemId)
      toast.success('Added to cart!')
    }
  }

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId)
    toast.success('Removed from wishlist')
  }

  // Move all to cart
  const handleMoveAllToCart = () => {
    wishlist.forEach(item => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        thumbnail: item.thumbnail,
        instructor: item.instructor,
      })
    })
    clearWishlist()
    toast.success('All items moved to cart!')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="mt-2 text-gray-600">
            {isEmpty ? 'Your wishlist is empty' : `You have ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} in your wishlist`}
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
                className="flex items-center text-sm text-primary-600 hover:text-primary-800"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Move all to cart
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <Link to={`/courses/${item.id}`}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  </div>

                  <div className="p-5">
                    <Link to={`/courses/${item.id}`} className="block">
                      <h2 className="font-bold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h2>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      by {item.instructor}
                    </p>

                    {item.rating && (
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-700">{item.rating}</span>
                        </div>
                        
                        {item.students && (
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mx-1">•</span>
                            <Users className="h-3 w-3 mr-1" />
                            <span>{item.students.toLocaleString()} students</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-lg font-bold">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-500 line-through ml-2">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleMoveToCart(item.id)}
                          className="p-2 text-primary-600 hover:text-primary-800 transition-colors"
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