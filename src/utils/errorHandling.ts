/**
 * Standardized Error Handling Utilities
 * Following international standards for error classification and user-friendly messaging
 */

import toast from 'react-hot-toast'

// Error severity levels based on RFC 5424 (Syslog Protocol)
export enum ErrorSeverity {
  EMERGENCY = 0,   // System is unusable
  ALERT = 1,       // Action must be taken immediately
  CRITICAL = 2,    // Critical conditions
  ERROR = 3,       // Error conditions
  WARNING = 4,     // Warning conditions
  NOTICE = 5,      // Normal but significant condition
  INFO = 6,        // Informational messages
  DEBUG = 7        // Debug-level messages
}

// Error categories for better classification
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  SYSTEM = 'system'
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  // Network related
  NETWORK_UNAVAILABLE: 'Unable to connect to our servers. Please check your internet connection.',
  REQUEST_TIMEOUT: 'The request took too long to complete. Please try again.',
  SERVER_UNAVAILABLE: 'Our servers are temporarily unavailable. Please try again in a few moments.',
  
  // Authentication related
  AUTHENTICATION_REQUIRED: 'Please sign in to continue.',
  AUTHENTICATION_FAILED: 'Invalid email or password. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  
  // Authorization related
  ACCESS_DENIED: 'You don\'t have permission to access this resource.',
  INSUFFICIENT_PRIVILEGES: 'You need higher privileges to perform this action.',
  
  // Validation related
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_FORMAT: 'Please ensure all fields are filled out correctly.',
  
  // Not found related
  RESOURCE_NOT_FOUND: 'The requested resource could not be found.',
  PAGE_NOT_FOUND: 'The page you\'re looking for doesn\'t exist.',
  
  // Generic fallbacks
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  OPERATION_FAILED: 'The operation could not be completed. Please try again.',
  TEMPORARY_ISSUE: 'We\'re experiencing temporary issues. Please try again shortly.'
}

// HTTP status code mappings
const HTTP_ERROR_MAP: Record<number, string> = {
  400: ERROR_MESSAGES.VALIDATION_ERROR,
  401: ERROR_MESSAGES.AUTHENTICATION_REQUIRED,
  403: ERROR_MESSAGES.ACCESS_DENIED,
  404: ERROR_MESSAGES.RESOURCE_NOT_FOUND,
  408: ERROR_MESSAGES.REQUEST_TIMEOUT,
  422: ERROR_MESSAGES.VALIDATION_ERROR,
  429: 'Too many requests. Please wait a moment before trying again.',
  500: ERROR_MESSAGES.SERVER_UNAVAILABLE,
  502: ERROR_MESSAGES.SERVER_UNAVAILABLE,
  503: ERROR_MESSAGES.SERVER_UNAVAILABLE,
  504: ERROR_MESSAGES.REQUEST_TIMEOUT
}

/**
 * Standard error structure for consistent error handling
 */
export interface StandardError {
  code: string
  message: string
  category: ErrorCategory
  severity: ErrorSeverity
  userMessage: string
  details?: any
  timestamp: Date
}

/**
 * Parse and standardize API errors
 */
export function parseApiError(error: any): StandardError {
  const timestamp = new Date()
  
  // Network errors (no response)
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error',
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.ERROR,
      userMessage: navigator.onLine ? 
        ERROR_MESSAGES.SERVER_UNAVAILABLE : 
        ERROR_MESSAGES.NETWORK_UNAVAILABLE,
      details: error,
      timestamp
    }
  }

  // HTTP errors (with response)
  const { status, data } = error.response
  const serverMessage = data?.detail || data?.message || data?.error

  return {
    code: `HTTP_${status}`,
    message: serverMessage || `HTTP ${status} Error`,
    category: getCategoryFromStatus(status),
    severity: getSeverityFromStatus(status),
    userMessage: HTTP_ERROR_MAP[status] || ERROR_MESSAGES.UNKNOWN_ERROR,
    details: { status, data },
    timestamp
  }
}

/**
 * Get error category from HTTP status code
 */
function getCategoryFromStatus(status: number): ErrorCategory {
  if (status === 401) return ErrorCategory.AUTHENTICATION
  if (status === 403) return ErrorCategory.AUTHORIZATION
  if (status === 404) return ErrorCategory.NOT_FOUND
  if (status >= 400 && status < 500) return ErrorCategory.CLIENT
  if (status >= 500) return ErrorCategory.SERVER
  return ErrorCategory.SYSTEM
}

/**
 * Get error severity from HTTP status code
 */
function getSeverityFromStatus(status: number): ErrorSeverity {
  if (status >= 500) return ErrorSeverity.ERROR
  if (status >= 400) return ErrorSeverity.WARNING
  return ErrorSeverity.INFO
}

/**
 * Log errors to console with proper formatting
 */
export function logError(error: StandardError, context?: string): void {
  const prefix = context ? `[${context}]` : '[Error]'
  const logLevel = error.severity <= ErrorSeverity.ERROR ? 'error' : 
                  error.severity === ErrorSeverity.WARNING ? 'warn' : 'info'
  
  console[logLevel](`${prefix} ${error.code}: ${error.message}`, {
    category: error.category,
    severity: ErrorSeverity[error.severity],
    timestamp: error.timestamp.toISOString(),
    details: error.details
  })
}

/**
 * Handle errors gracefully - log to console, show user-friendly message
 */
export function handleError(error: any, options: {
  context?: string
  showToast?: boolean
  fallbackMessage?: string
} = {}): StandardError {
  const { context, showToast = false, fallbackMessage } = options
  const standardError = parseApiError(error)
  
  // Always log errors for debugging
  logError(standardError, context)
  
  // Show user-friendly toast message only for critical operations
  if (showToast) {
    const message = fallbackMessage || standardError.userMessage
    
    if (standardError.severity <= ErrorSeverity.ERROR) {
      toast.error(message)
    } else if (standardError.severity === ErrorSeverity.WARNING) {
      toast(message, { icon: '⚠️' })
    }
  }
  
  return standardError
}

/**
 * Handle data loading errors silently (for non-critical operations)
 */
export function handleDataLoadError(error: any, context: string): StandardError {
  return handleError(error, { 
    context, 
    showToast: false // Don't show toast for data loading errors
  })
}

/**
 * Handle user action errors with toast notifications
 */
export function handleActionError(error: any, context: string, customMessage?: string): StandardError {
  return handleError(error, { 
    context, 
    showToast: true,
    fallbackMessage: customMessage
  })
}

/**
 * Check if error is a network/connectivity issue
 */
export function isNetworkError(error: any): boolean {
  return !error.response || 
         error.code === 'NETWORK_ERROR' || 
         error.message?.toLowerCase().includes('network')
}

/**
 * Check if error indicates empty/no data (not really an error)
 */
export function isEmptyDataResponse(error: any): boolean {
  return error.response?.status === 404 || 
         error.response?.data?.detail?.includes('not found')
}

/**
 * Create empty state configurations for different content types
 */
export interface EmptyStateConfig {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: string
}

export const EMPTY_STATE_CONFIGS: Record<string, EmptyStateConfig> = {
  courses: {
    title: 'No Courses Found',
    description: 'We couldn\'t find any courses at the moment. Please try again later or browse other sections.',
    icon: '📚'
  },
  featuredCourses: {
    title: 'No Featured Courses',
    description: 'Featured courses will appear here when available.',
    icon: '⭐'
  },
  blogs: {
    title: 'No Blog Posts Found',
    description: 'No blog posts are available at the moment. Check back later for new content.',
    icon: '📝'
  },
  searchResults: {
    title: 'No Results Found',
    description: 'We couldn\'t find anything matching your search. Try adjusting your search terms.',
    icon: '🔍'
  },
  cart: {
    title: 'Your Cart is Empty',
    description: 'Browse our courses and add them to your cart to get started.',
    icon: '🛒'
  },
  wishlist: {
    title: 'Your Wishlist is Empty',
    description: 'Save courses you\'re interested in to your wishlist for later.',
    icon: '❤️'
  }
}

/**
 * Generate retry configuration for failed operations
 */
export interface RetryConfig {
  maxAttempts: number
  delay: number
  backoff: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoff: 2
}

/**
 * Retry async operations with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === config.maxAttempts) {
        break
      }
      
      // Don't retry for client errors (4xx) except 408, 429
      const errorWithResponse = error as any
      if (errorWithResponse.response?.status >= 400 && 
          errorWithResponse.response?.status < 500 && 
          errorWithResponse.response?.status !== 408 && 
          errorWithResponse.response?.status !== 429) {
        break
      }
      
      // Exponential backoff
      const delay = config.delay * Math.pow(config.backoff, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}