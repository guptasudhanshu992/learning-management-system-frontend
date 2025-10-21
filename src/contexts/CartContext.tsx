import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the CartItem type
export interface CartItem {
  id: string
  title: string
  price: number
  originalPrice?: number
  thumbnail: string
  instructor: string
  quantity: number
}

// Define the CartContextType
interface CartContextType {
  items: CartItem[]
  addToCart: (course: any) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
  subtotal: number
  discount: number
}

// Create the context with a default value
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  total: 0,
  subtotal: 0,
  discount: 0,
})

// Provider props type
interface CartProviderProps {
  children: ReactNode
}

// Create the cart provider
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Load cart from localStorage on initial render
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Calculate total number of items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Calculate subtotal, discount, and total
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = items.reduce(
    (sum, item) =>
      sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  )
  const total = subtotal

  // Add item to cart
  const addToCart = (course: any) => {
    setItems((prevItems) => {
      // Check if the item already exists in the cart
      const existingItem = prevItems.find((item) => item.id === course.id)

      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map((item) =>
          item.id === course.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        // Add new item if it doesn't exist
        return [
          ...prevItems,
          {
            id: course.id,
            title: course.title,
            price: course.price,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            instructor: course.instructor,
            quantity: 1,
          },
        ]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Update quantity of an item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  // Clear the entire cart
  const clearCart = () => {
    setItems([])
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    total,
    subtotal,
    discount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Create a hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}