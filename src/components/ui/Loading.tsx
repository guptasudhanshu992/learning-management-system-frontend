import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <span className={`text-sm ${variantClasses[variant]}`}>
          {text}
        </span>
      )}
    </div>
  );
}

interface ButtonSpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function ButtonSpinner({ size = 'sm', className = '' }: ButtonSpinnerProps) {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${spinnerSize} ${className}`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function RefreshButton({ 
  onRefresh, 
  isRefreshing, 
  className = '',
  size = 'md' 
}: RefreshButtonProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className={`
        inline-flex items-center justify-center p-2 rounded-md 
        text-gray-500 hover:text-gray-700 hover:bg-gray-100
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={iconSize}
      >
        <RefreshCw className="w-full h-full" />
      </motion.div>
    </button>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

interface CardSkeletonProps {
  lines?: number;
  showImage?: boolean;
}

export function CardSkeleton({ lines = 3, showImage = false }: CardSkeletonProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      {showImage && (
        <Skeleton variant="rectangular" className="w-full h-48 mb-4" />
      )}
      <div className="space-y-3">
        <Skeleton className="w-3/4 h-6" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} 
          />
        ))}
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Processing...', 
  className = '' 
}: LoadingOverlayProps) {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        fixed inset-0 bg-black bg-opacity-50 
        flex items-center justify-center z-50
        ${className}
      `}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 shadow-xl"
      >
        <LoadingSpinner size="lg" text={message} />
      </motion.div>
    </motion.div>
  );
}