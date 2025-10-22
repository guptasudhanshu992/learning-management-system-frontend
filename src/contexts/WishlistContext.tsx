import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WishlistService } from '../services/wishlistService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

// Define the WishlistContextType
interface WishlistContextType {
  wishlist: any[]
  itemCount: number
  refreshWishlistCount: () => void
  addToWishlist: (courseId: string) => Promise<void>
  removeFromWishlist: (courseId: string) => Promise<void>
  isInWishlist: (courseId: string) => Promise<boolean>
  toggleWishlist: (courseId: string) => Promise<void>
}

// Create the context with a default value
const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  itemCount: 0,
  refreshWishlistCount: () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: async () => false,
  toggleWishlist: async () => {},
})

// Provider props type
interface WishlistProviderProps {
  children: ReactNode
}

// Create the wishlist provider
export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [itemCount, setItemCount] = useState(0)
  const [wishlist, setWishlist] = useState<any[]>([])

  // Load wishlist count when user changes
  useEffect(() => {
    if (user) {
      refreshWishlistCount()
      loadWishlistItems()
    } else {
      setItemCount(0)
      setWishlist([])
    }
  }, [user])

  const loadWishlistItems = async () => {
    if (!user) return
    
    try {
      // Note: You may need to implement getWishlistItems in WishlistService
      // For now, we'll keep it as empty array since the service might not have this method
      setWishlist([])
    } catch (error) {
      console.error('Error fetching wishlist items:', error)
    }
  }

  const refreshWishlistCount = async () => {
    if (!user) return
    
    try {
      const response = await WishlistService.getWishlistCount()
      setItemCount(response.count)
    } catch (error) {
      console.error('Error fetching wishlist count:', error)
    }
  }

  const addToWishlist = async (courseId: string) => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return
    }

    try {
      await WishlistService.addToWishlist({ course_id: courseId })
      toast.success('Added to wishlist')
      refreshWishlistCount()
    } catch (error) {
      toast.error('Failed to add to wishlist')
      throw error
    }
  }

  const removeFromWishlist = async (courseId: string) => {
    if (!user) return

    try {
      await WishlistService.removeFromWishlist(courseId)
      toast.success('Removed from wishlist')
      refreshWishlistCount()
    } catch (error) {
      toast.error('Failed to remove from wishlist')
      throw error
    }
  }

  const isInWishlist = async (courseId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await WishlistService.isInWishlist(courseId)
      return response.in_wishlist
    } catch (error) {
      console.error('Error checking wishlist status:', error)
      return false
    }
  }

  const toggleWishlist = async (courseId: string) => {
    if (!user) {
      toast.error('Please login to manage wishlist')
      return
    }

    try {
      const inWishlist = await isInWishlist(courseId)
      if (inWishlist) {
        await removeFromWishlist(courseId)
      } else {
        await addToWishlist(courseId)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const value: WishlistContextType = {
    wishlist,
    itemCount,
    refreshWishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// Export the hook to use the wishlist context
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}