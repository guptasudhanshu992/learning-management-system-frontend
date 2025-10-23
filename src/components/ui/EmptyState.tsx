import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
    loading?: boolean
  }
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div className="text-6xl mb-4 opacity-50">
          {icon}
        </div>
      )}
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {/* Action Button */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          disabled={action.loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {action.loading && (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          )}
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}

// Specialized empty state components for common use cases
export const CoursesEmptyState: React.FC<{ onRetry?: () => void; loading?: boolean }> = ({ onRetry, loading }) => (
  <EmptyState
    title="No Courses Available"
    description="We couldn't find any courses at the moment. This could be due to no courses being published yet, or a temporary issue with loading content."
    icon="📚"
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry,
      loading
    } : undefined}
  />
)

export const FeaturedCoursesEmptyState: React.FC<{ onRetry?: () => void; loading?: boolean }> = ({ onRetry, loading }) => (
  <EmptyState
    title="No Featured Courses"
    description="Featured courses will appear here when available. Check back later for highlighted content from our catalog."
    icon="⭐"
    action={onRetry ? {
      label: "Refresh",
      onClick: onRetry,
      loading
    } : undefined}
    className="py-8"
  />
)

export const BlogsEmptyState: React.FC<{ onRetry?: () => void; loading?: boolean }> = ({ onRetry, loading }) => (
  <EmptyState
    title="No Blog Posts Found"
    description="No blog posts are available at the moment. Our team is working on bringing you fresh content regularly."
    icon="📝"
    action={onRetry ? {
      label: "Refresh",
      onClick: onRetry,
      loading
    } : undefined}
    className="py-8"
  />
)

export const SearchEmptyState: React.FC<{ query: string; onClear: () => void }> = ({ query, onClear }) => (
  <EmptyState
    title="No Results Found"
    description={`We couldn't find any results for "${query}". Try adjusting your search terms or browse our available content.`}
    icon="🔍"
    action={{
      label: "Clear Search",
      onClick: onClear
    }}
  />
)

export const CartEmptyState: React.FC<{ onBrowseCourses: () => void }> = ({ onBrowseCourses }) => (
  <EmptyState
    title="Your Cart is Empty"
    description="Discover amazing courses and add them to your cart to get started with your learning journey."
    icon="🛒"
    action={{
      label: "Browse Courses",
      onClick: onBrowseCourses
    }}
  />
)

export const WishlistEmptyState: React.FC<{ onBrowseCourses: () => void }> = ({ onBrowseCourses }) => (
  <EmptyState
    title="Your Wishlist is Empty"
    description="Save courses you're interested in to your wishlist for easy access later."
    icon="❤️"
    action={{
      label: "Explore Courses",
      onClick: onBrowseCourses
    }}
  />
)