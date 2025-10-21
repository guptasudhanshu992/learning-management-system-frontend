import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the WishlistItem type
export interface WishlistItem {
  id: string
  title: string
  price: number
  originalPrice?: number
  thumbnail: string
  instructor: string
  rating: number
  students: number
}

// Define the WishlistContextType
interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (course: any) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
}

// Create the context with a default value
const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  clearWishlist: () => {},
  isInWishlist: () => false,
})

// Provider props type
interface WishlistProviderProps {
  children: ReactNode
}

// Create the wishlist provider
export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  // Load wishlist from localStorage on initial render
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  })

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // Add item to wishlist
  const addToWishlist = (course: any) => {
    setWishlist((prevItems) => {
      // Check if the item already exists in the wishlist
      const existingItem = prevItems.find((item) => item.id === course.id)

      if (existingItem) {
        return prevItems
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
            rating: course.rating,
            students: course.students,
          },
        ]
      }
    })
  }

  // Remove item from wishlist
  const removeFromWishlist = (id: string) => {
    setWishlist((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlist([])
  }

  // Check if item is in wishlist
  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id)
  }

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// Create a hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}