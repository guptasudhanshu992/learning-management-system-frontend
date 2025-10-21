import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Calendar, 
  Lock, 
  // ShoppingBag, 
  Check, 
  // X,
  ChevronsRight,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { usePayment } from '../contexts/PaymentContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, discount, clearCart } = useCart()
  const { 
    isProcessing, 
    paymentError, 
    // paymentSuccess, 
    selectedMethod,
    setSelectedMethod, 
    processStripePayment,
    processRazorpayPayment,
    resetPaymentState
  } = usePayment()

  // Customer details form state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  })

  // Payment details form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [activeStep, setActiveStep] = useState<'customer' | 'payment' | 'confirmation'>('customer')
  const [orderNumber, setOrderNumber] = useState('')

  // Calculate totals
  const tax = subtotal * 0.18 // 18% tax
  const finalTotal = subtotal - discount + tax

  // Check if cart is empty
  if (items.length === 0 && activeStep !== 'confirmation') {
    navigate('/cart')
    return null
  }

  // Validate customer information
  const validateCustomerInfo = () => {
    const errors: Record<string, string> = {}

    if (!customerInfo.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!customerInfo.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(customerInfo.email)) {
      errors.email = 'Invalid email address'
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (!customerInfo.address.trim()) {
      errors.address = 'Address is required'
    }

    if (!customerInfo.city.trim()) {
      errors.city = 'City is required'
    }

    if (!customerInfo.country.trim()) {
      errors.country = 'Country is required'
    }

    if (!customerInfo.postalCode.trim()) {
      errors.postalCode = 'Postal code is required'
    }

    return errors
  }

  // Validate payment information
  const validatePaymentInfo = () => {
    const errors: Record<string, string> = {}

    if (!selectedMethod) {
      errors.paymentMethod = 'Please select a payment method'
      return errors
    }

    if (selectedMethod === 'stripe') {
      if (!paymentInfo.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Card number must be 16 digits'
      }

      if (!paymentInfo.cardName.trim()) {
        errors.cardName = 'Name on card is required'
      }

      if (!paymentInfo.expMonth.trim()) {
        errors.expMonth = 'Expiration month is required'
      } else if (!/^(0[1-9]|1[0-2])$/.test(paymentInfo.expMonth)) {
        errors.expMonth = 'Invalid month (01-12)'
      }

      if (!paymentInfo.expYear.trim()) {
        errors.expYear = 'Expiration year is required'
      } else if (!/^\d{4}$/.test(paymentInfo.expYear) || parseInt(paymentInfo.expYear) < new Date().getFullYear()) {
        errors.expYear = 'Invalid year'
      }

      if (!paymentInfo.cvc.trim()) {
        errors.cvc = 'CVC is required'
      } else if (!/^\d{3,4}$/.test(paymentInfo.cvc)) {
        errors.cvc = 'CVC must be 3 or 4 digits'
      }
    }

    return errors
  }

  // Handle form submission for customer information step
  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateCustomerInfo()
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      setActiveStep('payment')
      window.scrollTo(0, 0)
    }
  }

  // Handle form submission for payment step
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validatePaymentInfo()
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      // Process payment based on selected method
      const orderDetails = {
        items,
        total: subtotal,
        discount,
        shipping: 0,
        tax,
        finalAmount: finalTotal,
      }

      let success = false

      if (selectedMethod === 'stripe') {
        success = await processStripePayment(
          {
            type: 'stripe',
            cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''),
            expMonth: paymentInfo.expMonth,
            expYear: paymentInfo.expYear,
            cvc: paymentInfo.cvc,
            name: paymentInfo.cardName,
          },
          orderDetails
        )
      } else if (selectedMethod === 'razorpay') {
        success = await processRazorpayPayment(orderDetails)
      }

      if (success) {
        // Generate a random order number
        setOrderNumber(`ORD-${Math.floor(10000000 + Math.random() * 90000000)}`)
        setActiveStep('confirmation')
        clearCart()
        window.scrollTo(0, 0)
      } else {
        toast.error('Payment failed. Please try again.')
      }
    }
  }

  const handleGoBack = () => {
    if (activeStep === 'payment') {
      setActiveStep('customer')
    } else if (activeStep === 'confirmation') {
      resetPaymentState()
      navigate('/courses')
    }
  }

  // Format card number with spaces
  const formatCardNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '')
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted.substring(0, 19) // Limit to 16 digits plus 3 spaces
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button 
            onClick={handleGoBack} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {activeStep === 'confirmation' ? 'Back to Courses' : 'Back'}
          </button>
        </div>

        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${activeStep !== 'customer' ? 'text-primary-600' : 'text-gray-900'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep !== 'customer' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {activeStep !== 'customer' ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <span className="ml-2 font-medium">Customer Info</span>
          </div>

          <div className="w-16 h-1 mx-3 bg-gray-200">
            <div 
              className="h-full bg-primary-600 transition-all" 
              style={{ width: activeStep === 'customer' ? '0%' : '100%' }}
            />
          </div>

          <div className={`flex items-center ${activeStep === 'confirmation' ? 'text-primary-600' : activeStep === 'payment' ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activeStep === 'confirmation' ? 'bg-primary-600 text-white' : 
              activeStep === 'payment' ? 'bg-gray-200' : 'bg-gray-100'
            }`}>
              {activeStep === 'confirmation' ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>

          <div className="w-16 h-1 mx-3 bg-gray-200">
            <div 
              className="h-full bg-primary-600 transition-all" 
              style={{ width: activeStep === 'confirmation' ? '100%' : '0%' }}
            />
          </div>

          <div className={`flex items-center ${activeStep === 'confirmation' ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'confirmation' ? 'bg-gray-200' : 'bg-gray-100'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Information */}
            {activeStep === 'customer' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
                
                <form onSubmit={handleCustomerInfoSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          className={`input-field pl-10 ${formErrors.name ? 'border-red-300' : ''}`}
                          placeholder="John Doe"
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className={`input-field pl-10 ${formErrors.email ? 'border-red-300' : ''}`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className={`input-field pl-10 ${formErrors.phone ? 'border-red-300' : ''}`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          className={`input-field pl-10 ${formErrors.address ? 'border-red-300' : ''}`}
                          placeholder="123 Main Street"
                        />
                      </div>
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        className={`input-field ${formErrors.city ? 'border-red-300' : ''}`}
                        placeholder="New York"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                        className={`input-field ${formErrors.country ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="IN">India</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                      {formErrors.country && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.postalCode}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                        className={`input-field ${formErrors.postalCode ? 'border-red-300' : ''}`}
                        placeholder="10001"
                      />
                      {formErrors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors"
                    >
                      <span>Continue to Payment</span>
                      <ChevronsRight className="w-5 h-5 ml-1" />
                    </motion.button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {activeStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                {paymentError && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Payment Error</p>
                      <p className="text-sm">{paymentError}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handlePaymentSubmit}>
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Payment Method *
                    </label>
                    
                    <div className="space-y-3">
                      <div
                        onClick={() => setSelectedMethod('stripe')}
                        className={`flex items-center border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMethod === 'stripe'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                            selectedMethod === 'stripe'
                              ? 'border-primary-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedMethod === 'stripe' && (
                            <div className="w-3 h-3 rounded-full bg-primary-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Credit / Debit Card</p>
                          <p className="text-xs text-gray-500">
                            Secure payment via Stripe
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-800">VISA</span>
                          </div>
                          <div className="w-10 h-6 bg-red-100 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-red-700">MC</span>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedMethod('razorpay')}
                        className={`flex items-center border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMethod === 'razorpay'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                            selectedMethod === 'razorpay'
                              ? 'border-primary-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedMethod === 'razorpay' && (
                            <div className="w-3 h-3 rounded-full bg-primary-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Razorpay</p>
                          <p className="text-xs text-gray-500">
                            India's popular payment gateway
                          </p>
                        </div>
                        <div className="w-16 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-white">Razorpay</span>
                        </div>
                      </div>
                    </div>
                    
                    {formErrors.paymentMethod && (
                      <p className="text-red-500 text-xs mt-2">{formErrors.paymentMethod}</p>
                    )}
                  </div>

                  {/* Card Information (Only show for Stripe) */}
                  {selectedMethod === 'stripe' && (
                    <div className="space-y-6 border-t border-gray-200 pt-6">
                      <h3 className="font-medium text-gray-900">Card Information</h3>
                      
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({
                              ...paymentInfo,
                              cardNumber: formatCardNumber(e.target.value)
                            })}
                            className={`input-field pl-10 ${formErrors.cardNumber ? 'border-red-300' : ''}`}
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>
                        {formErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          For testing: Use "4242 4242 4242 4242" for success, "4000 0000 0000 0002" for decline
                        </p>
                      </div>

                      {/* Card Holder Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({
                            ...paymentInfo,
                            cardName: e.target.value
                          })}
                          className={`input-field ${formErrors.cardName ? 'border-red-300' : ''}`}
                          placeholder="John Doe"
                        />
                        {formErrors.cardName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>
                        )}
                      </div>

                      {/* Expiration Date and CVC */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Month *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                              value={paymentInfo.expMonth}
                              onChange={(e) => setPaymentInfo({
                                ...paymentInfo,
                                expMonth: e.target.value
                              })}
                              className={`input-field pl-9 ${formErrors.expMonth ? 'border-red-300' : ''}`}
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0')
                                return (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          {formErrors.expMonth && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.expMonth}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year *
                          </label>
                          <select
                            value={paymentInfo.expYear}
                            onChange={(e) => setPaymentInfo({
                              ...paymentInfo,
                              expYear: e.target.value
                            })}
                            className={`input-field ${formErrors.expYear ? 'border-red-300' : ''}`}
                          >
                            <option value="">YYYY</option>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = (new Date().getFullYear() + i).toString()
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              )
                            })}
                          </select>
                          {formErrors.expYear && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.expYear}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={paymentInfo.cvc}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if (value.length <= 4) {
                                  setPaymentInfo({
                                    ...paymentInfo,
                                    cvc: value
                                  })
                                }
                              }}
                              className={`input-field pl-9 ${formErrors.cvc ? 'border-red-300' : ''}`}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                          {formErrors.cvc && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.cvc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Razorpay Message */}
                  {selectedMethod === 'razorpay' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        You'll be redirected to Razorpay's secure payment gateway after clicking "Complete Purchase".
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-8 flex flex-col space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors disabled:bg-primary-300"
                    >
                      {isProcessing ? (
                        <>
                          <span className="animate-spin mr-2">&#9696;</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>Complete Purchase</span>
                          <ChevronsRight className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                    >
                      Back to Customer Information
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank you for your purchase!</h2>
                <p className="text-gray-600 mb-6">
                  Your order has been successfully processed.
                </p>
                
                <div className="mb-8 border border-green-200 rounded-lg p-6 bg-green-50 text-left max-w-md mx-auto">
                  <div className="text-sm text-green-800">
                    <div className="flex justify-between mb-3">
                      <span className="font-medium">Order Number:</span>
                      <span className="font-bold">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/courses')}
                    className="btn-primary"
                  >
                    Browse More Courses
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary"
                  >
                    Go to My Learning
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {activeStep !== 'confirmation' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="mb-6 max-h-60 overflow-y-auto space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ${(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold text-primary-700 border-t border-gray-200 pt-3 mt-3">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}