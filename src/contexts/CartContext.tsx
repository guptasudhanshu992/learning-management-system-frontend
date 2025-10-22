import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartService } from '../services/cartService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

// Define the CartContextType
interface CartContextType {
  items: any[]
  itemCount: number
  subtotal: number
  discount: number
  refreshCartCount: () => void
  addToCart: (courseId: string) => Promise<void>
  removeFromCart: (courseId: string) => Promise<void>
  isInCart: (courseId: string) => Promise<boolean>
  clearCart: () => Promise<void>
}

// Create the context with a default value
const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  refreshCartCount: () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  isInCart: async () => false,
  clearCart: async () => {},
})

// Provider props type
interface CartProviderProps {
  children: ReactNode
}

// Create the cart provider
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [itemCount, setItemCount] = useState(0)
  const [items, setItems] = useState<any[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)

  // Load cart count when user changes
  useEffect(() => {
    if (user) {
      refreshCartCount()
      loadCartItems()
    } else {
      setItemCount(0)
      setItems([])
      setSubtotal(0)
      setDiscount(0)
    }
  }, [user])

  const loadCartItems = async () => {
    if (!user) return
    
    try {
      // Note: You may need to implement getCartItems in CartService
      // For now, we'll keep it as empty array since the service might not have this method
      setItems([])
      setSubtotal(0)
      setDiscount(0)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const refreshCartCount = async () => {
    if (!user) return
    
    try {
      const response = await CartService.getCartCount()
      setItemCount(response.count)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  const addToCart = async (courseId: string) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    try {
      await CartService.addToCart({ course_id: courseId })
      toast.success('Added to cart')
      refreshCartCount()
    } catch (error) {
      toast.error('Failed to add to cart')
      throw error
    }
  }

  const removeFromCart = async (courseId: string) => {
    if (!user) return

    try {
      await CartService.removeFromCart(courseId)
      toast.success('Removed from cart')
      refreshCartCount()
    } catch (error) {
      toast.error('Failed to remove from cart')
      throw error
    }
  }

  const isInCart = async (courseId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await CartService.isInCart(courseId)
      return response.in_cart
    } catch (error) {
      console.error('Error checking cart status:', error)
      return false
    }
  }

  const clearCart = async () => {
    if (!user) {
      toast.error('Please login to clear cart')
      return
    }

    try {
      // Note: You may need to implement clearCart in CartService
      // For now, we'll just reset the local state
      setItems([])
      setItemCount(0)
      setSubtotal(0)
      setDiscount(0)
      toast.success('Cart cleared successfully')
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  const value: CartContextType = {
    items,
    itemCount,
    subtotal,
    discount,
    refreshCartCount,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Export the hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}