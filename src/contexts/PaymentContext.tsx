import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define payment types
export interface PaymentMethodProps {
  type: 'stripe' | 'razorpay'
  cardNumber?: string
  expMonth?: string
  expYear?: string
  cvc?: string
  name?: string
}

interface OrderDetails {
  items: any[]
  total: number
  couponCode?: string
  discount: number
  shipping: number
  tax: number
  finalAmount: number
}

// Define the PaymentContextType
interface PaymentContextType {
  isProcessing: boolean
  paymentError: string | null
  paymentSuccess: boolean
  selectedMethod: 'stripe' | 'razorpay' | null
  setSelectedMethod: (method: 'stripe' | 'razorpay' | null) => void
  processStripePayment: (paymentDetails: PaymentMethodProps, orderDetails: OrderDetails) => Promise<boolean>
  processRazorpayPayment: (orderDetails: OrderDetails) => Promise<boolean>
  resetPaymentState: () => void
}

// Create the context with a default value
const PaymentContext = createContext<PaymentContextType>({
  isProcessing: false,
  paymentError: null,
  paymentSuccess: false,
  selectedMethod: null,
  setSelectedMethod: () => {},
  processStripePayment: async () => false,
  processRazorpayPayment: async () => false,
  resetPaymentState: () => {},
})

// Provider props type
interface PaymentProviderProps {
  children: ReactNode
}

// Create the payment provider
export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'razorpay' | null>(null)

  // Reset payment state
  const resetPaymentState = () => {
    setIsProcessing(false)
    setPaymentError(null)
    setPaymentSuccess(false)
    setSelectedMethod(null)
  }

  // Process payment with Stripe
  const processStripePayment = async (
    paymentDetails: PaymentMethodProps,
    orderDetails: OrderDetails
  ): Promise<boolean> => {
    setIsProcessing(true)
    setPaymentError(null)
    setPaymentSuccess(false)

    try {
      // In a real application, this would make an API call to your backend,
      // which would then communicate with Stripe's API
      
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validate payment details (simplified example)
      const { cardNumber, expMonth, expYear, cvc } = paymentDetails
      
      if (!cardNumber || !expMonth || !expYear || !cvc) {
        throw new Error('Please provide all required card details')
      }

      // Simple validation (would be handled by Stripe in a real app)
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Invalid card number')
      }

      if (cvc.length < 3) {
        throw new Error('Invalid CVC')
      }

      // Simulate successful payment
      console.log('Processing Stripe payment:', { paymentDetails, orderDetails })
      
      // For demo purposes: Reject payment for specific test numbers
      if (cardNumber.replace(/\s/g, '') === '4000000000000002') {
        throw new Error('Your card has been declined')
      }

      // Payment successful
      setPaymentSuccess(true)
      setIsProcessing(false)
      return true
    } catch (error: any) {
      setPaymentError(error.message || 'Payment failed')
      setIsProcessing(false)
      return false
    }
  }

  // Process payment with Razorpay
  const processRazorpayPayment = async (orderDetails: OrderDetails): Promise<boolean> => {
    setIsProcessing(true)
    setPaymentError(null)
    setPaymentSuccess(false)

    try {
      // In a real application, this would make an API call to your backend,
      // which would then communicate with Razorpay's API

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate the Razorpay popup
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // This would be your actual Razorpay key
        amount: Math.round(orderDetails.finalAmount * 100), // Amount in paise
        currency: 'INR',
        name: 'Learning Management System',
        description: 'Purchase of courses',
        image: 'https://your-logo-url.com',
        handler: function () {
          // This would be called on successful payment
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Your Address',
        },
        theme: {
          color: '#6366f1',
        },
      }

      console.log('Processing Razorpay payment with options:', options)

      // Simulate successful payment
      setPaymentSuccess(true)
      setIsProcessing(false)
      return true
    } catch (error: any) {
      setPaymentError(error.message || 'Razorpay payment failed')
      setIsProcessing(false)
      return false
    }
  }

  const value = {
    isProcessing,
    paymentError,
    paymentSuccess,
    selectedMethod,
    setSelectedMethod,
    processStripePayment,
    processRazorpayPayment,
    resetPaymentState,
  }

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
}

// Create a hook to use the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}