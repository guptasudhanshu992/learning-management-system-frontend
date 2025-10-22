import { useState, useEffect } from 'react';
import { LoadingManager } from '../services/api';

/**
 * Hook to manage loading states for API calls
 * @returns Object with loading state and setter function
 */
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalLoadingStates, setGlobalLoadingStates] = useState(new Map<string, boolean>());

  useEffect(() => {
    // Subscribe to global loading states
    const unsubscribe = LoadingManager.subscribe((loadingStates) => {
      setGlobalLoadingStates(new Map(loadingStates));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Get loading state for specific key
  const getLoadingState = (loadingKey: string): boolean => {
    return globalLoadingStates.get(loadingKey) || false;
  };

  // Check if any loading state is active
  const isAnyLoading = (): boolean => {
    return Array.from(globalLoadingStates.values()).some(Boolean);
  };

  // Get all active loading keys
  const getActiveLoadingKeys = (): string[] => {
    return Array.from(globalLoadingStates.entries())
      .filter(([, isLoading]) => isLoading)
      .map(([key]) => key);
  };

  return {
    // Local loading state (for manual control)
    isLoading,
    setLoading: setIsLoading,
    
    // Global loading states (managed by LoadingManager)
    getLoadingState,
    isAnyLoading: isAnyLoading(),
    activeLoadingKeys: getActiveLoadingKeys(),
    
    // Specific loading states for common operations
    isAuthLoading: getLoadingState('auth.login') || 
                   getLoadingState('auth.register') || 
                   getLoadingState('auth.currentUser'),
    
    isUserLoading: getLoadingState('users.list') || 
                   getLoadingState('users.create') || 
                   getLoadingState('users.update') || 
                   getLoadingState('users.delete'),
    
    isCourseLoading: getLoadingState('courses.list') || 
                     getLoadingState('courses.create') || 
                     getLoadingState('courses.update') || 
                     getLoadingState('courses.delete'),
    
    isBlogLoading: getLoadingState('blogs.list') || 
                   getLoadingState('blogs.create') || 
                   getLoadingState('blogs.update') || 
                   getLoadingState('blogs.delete'),
    
    isCartLoading: getLoadingState('cart.add') || 
                   getLoadingState('cart.remove') || 
                   getLoadingState('cart.list'),
    
    isPaymentLoading: getLoadingState('payment.process') || 
                      getLoadingState('payment.intent'),
  };
}

/**
 * Hook for async operations with loading state management
 * @param asyncFn - Async function to execute
 * @returns Object with execute function, loading state, error, and data
 */
export function useAsync<T, P extends any[] = []>(
  asyncFn: (...args: P) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (...args: P): Promise<T | void> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    }
  };
}

/**
 * Hook for debounced async operations
 * @param asyncFn - Async function to execute
 * @param delay - Delay in milliseconds
 * @returns Object with execute function, loading state, error, and data
 */
export function useDebouncedAsync<T, P extends any[] = []>(
  asyncFn: (...args: P) => Promise<T>,
  delay: number = 300
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (...args: P): Promise<T | void> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);
      
      const timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFn(...args);
          setData(result);
          setIsLoading(false);
          resolve(result);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('An error occurred');
          setError(error);
          setIsLoading(false);
          reject(error);
        }
      }, delay);

      // Cleanup function
      return () => clearTimeout(timeoutId);
    });
  };

  return {
    execute,
    isLoading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    }
  };
}

/**
 * Hook for handling pagination with loading states
 */
export function usePagination(initialPage: number = 1, initialPerPage: number = 10) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(total / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setPage(prev => prev - 1);
    }
  };

  const reset = () => {
    setPage(initialPage);
    setTotal(0);
  };

  return {
    page,
    perPage,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    isLoading,
    setPage: goToPage,
    setPerPage,
    setTotal,
    setIsLoading,
    nextPage,
    prevPage,
    reset,
    // Helper to get query parameters for API calls
    getQueryParams: () => ({ page, per_page: perPage }),
  };
}