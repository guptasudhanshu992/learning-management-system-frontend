import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Trash2,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { CartService } from '../services/cartService'
import { useAuth } from '../contexts/AuthContext'
import { useAsync } from '../hooks/useLoading'
import { CartItem, Course } from '../types/api'
import { PageLoading } from '../components/ui/Loading'

interface CartDetailsResponse {
  items: Array<CartItem & { course: Course }>;
  total_items: number;
  total_amount: number;
  discount_amount?: number;
  final_amount: number;
  applied_coupon?: {
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
  };
}

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cartDetails, setCartDetails] = useState<CartDetailsResponse | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)

  // Async hooks
  const { execute: fetchCartDetails, isLoading: cartLoading } = useAsync(CartService.getCartDetails)
  const { execute: removeFromCartAPI, isLoading: removingItem } = useAsync(CartService.removeFromCart)
  const { execute: clearCartAPI, isLoading: clearingCart } = useAsync(CartService.clearCart)
  const { execute: applyCouponAPI } = useAsync(CartService.applyCoupon)
  const { execute: removeCouponAPI } = useAsync(CartService.removeCoupon)

  useEffect(() => {
    if (user) {
      loadCartDetails()
    }
  }, [user])

  const loadCartDetails = async () => {
    try {
      const details = await fetchCartDetails()
      if (details) {
        setCartDetails(details)
      }
    } catch (error) {
      console.error('Error loading cart details:', error)
      toast.error('Failed to load cart details')
    }
  }

  const handleRemoveFromCart = async (courseId: string) => {
    try {
      await removeFromCartAPI(courseId)
      toast.success('Course removed from cart')
      // Reload cart details
      loadCartDetails()
    } catch (error) {
      toast.error('Failed to remove course from cart')
    }
  }

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return

    try {
      await clearCartAPI()
      setCartDetails(prev => prev ? { ...prev, items: [], total_items: 0, total_amount: 0, final_amount: 0 } : null)
      toast.success('Cart cleared')
    } catch (error) {
      toast.error('Failed to clear cart')
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    try {
      const result = await applyCouponAPI(couponCode)
      if (result) {
        toast.success('Coupon applied successfully!')
        setCouponCode('')
        setCouponError(null)
        // Reload cart details to get updated totals
        loadCartDetails()
      }
    } catch (error) {
      setCouponError('Invalid or expired coupon code')
      toast.error('Failed to apply coupon')
    }
  }

  const handleRemoveCoupon = async () => {
    try {
      await removeCouponAPI()
      toast.success('Coupon removed')
      // Reload cart details
      loadCartDetails()
    } catch (error) {
      toast.error('Failed to remove coupon')
    }
  }

  // Check if cart is empty
  const isCartEmpty = !cartDetails || cartDetails.items.length === 0

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Please login to view your cart</h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to access your shopping cart.
            </p>
            <Link to="/auth/login">
              <button className="btn-primary px-8">Login</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartLoading) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mr-3">Shopping Cart</h1>
          {cartDetails && cartDetails.items.length > 0 && (
            <span className="bg-primary-100 text-primary-800 text-sm font-medium py-1 px-3 rounded-full">
              {cartDetails.items.length} {cartDetails.items.length === 1 ? 'Course' : 'Courses'}
            </span>
          )}
        </div>

        {isCartEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any courses to your cart yet.
            </p>
            <Link to="/courses">
              <button className="btn-primary px-8">Browse Courses</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                {cartDetails!.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row">
                      {/* Course Thumbnail */}
                      <div className="sm:w-40 mb-4 sm:mb-0">
                        <img
                          src={item.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                          alt={item.course.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 sm:ml-6 flex flex-col">
                        <div className="flex justify-between mb-2">
                          <Link
                            to={`/courses/${item.course.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {item.course.title}
                          </Link>
                          <button
                            onClick={() => handleRemoveFromCart(item.course_id)}
                            disabled={removingItem}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <p className="text-gray-500 text-sm mb-3">By {item.course.instructor_name}</p>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.course.description}</p>

                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Students:</span>
                            <span className="text-sm font-medium">{item.course.students_count || 0}</span>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-xl font-bold text-gray-900">
                              ${item.course.price?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-6 text-right">
                  <button
                    onClick={handleClearCart}
                    disabled={clearingCart}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    {clearingCart ? 'Clearing...' : 'Clear Cart'}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${cartDetails!.total_amount.toFixed(2)}</span>
                  </div>
                  
                  {cartDetails!.discount_amount && cartDetails!.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${cartDetails!.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {cartDetails!.applied_coupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        Coupon: {cartDetails!.applied_coupon.code}
                        <button
                          onClick={handleRemoveCoupon}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </span>
                      <span>
                        -{cartDetails!.applied_coupon.discount_type === 'percentage' ? 
                          `${cartDetails!.applied_coupon.discount_value}%` : 
                          `$${cartDetails!.applied_coupon.discount_value}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t border-b border-gray-200 py-3 my-3">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">${cartDetails!.final_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium text-gray-900">${(cartDetails!.final_amount * 0.18).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold text-primary-700 border-t border-gray-200 pt-3 mt-3">
                    <span>Order Total</span>
                    <span>${(cartDetails!.final_amount * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon code */}
                {!cartDetails!.applied_coupon && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Apply Coupon
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="input-field py-2 flex-1"
                      />
                      <button onClick={handleApplyCoupon} className="btn-secondary py-2">
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {couponError}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Available coupons for testing: NEWUSER20, WELCOME15, FLASH10
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium mt-6 flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </motion.button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full text-center text-primary-600 hover:text-primary-800 font-medium mt-4 text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}