import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Trash2,
  ShoppingCart,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, discount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  // Mocked available coupons
  const availableCoupons = {
    'NEWUSER20': 20,   // 20% off
    'WELCOME15': 15,   // 15% off
    'FLASH10': 10,     // 10% off
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    // Check if coupon is valid
    const couponKey = couponCode.toUpperCase() as keyof typeof availableCoupons
    const discountPercent = availableCoupons[couponKey]

    if (discountPercent) {
      const discountAmount = (subtotal * discountPercent) / 100
      setCouponDiscount(discountAmount)
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponError(null)
      toast.success(`Coupon applied! ${discountPercent}% off`)
      setCouponCode('')
    } else {
      setCouponError('Invalid or expired coupon code')
      setAppliedCoupon(null)
      setCouponDiscount(0)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    toast.success('Coupon removed')
  }

  // Calculate totals
  const finalDiscount = discount + couponDiscount
  const finalTotal = subtotal - finalDiscount
  const tax = finalTotal * 0.18 // 18% tax
  const orderTotal = finalTotal + tax

  // Check if cart is empty
  const isCartEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mr-3">Shopping Cart</h1>
          {items.length > 0 && (
            <span className="bg-primary-100 text-primary-800 text-sm font-medium py-1 px-3 rounded-full">
              {items.length} {items.length === 1 ? 'Course' : 'Courses'}
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
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row">
                      {/* Course Thumbnail */}
                      <div className="sm:w-40 mb-4 sm:mb-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 sm:ml-6 flex flex-col">
                        <div className="flex justify-between mb-2">
                          <Link
                            to={`/courses/${item.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <p className="text-gray-500 text-sm mb-3">By {item.instructor}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-auto">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                          >
                            <MinusCircle className="w-5 h-5 text-gray-500" />
                          </button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <PlusCircle className="w-5 h-5 text-gray-500" />
                          </button>

                          <div className="ml-auto flex flex-col items-end">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>
                            {item.originalPrice && (
                              <span className="text-xs text-green-600 font-medium">
                                Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-6 text-right">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your cart?')) {
                        clearCart()
                        toast.success('Cart cleared')
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
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
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Course Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        Coupon: {appliedCoupon}
                        <button
                          onClick={handleRemoveCoupon}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t border-b border-gray-200 py-3 my-3">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold text-primary-700 border-t border-gray-200 pt-3 mt-3">
                    <span>Order Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon code */}
                {!appliedCoupon && (
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