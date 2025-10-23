import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Extend the config interface to include custom properties
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
  _retry?: boolean;
  suppressToasts?: boolean; // Flag to suppress error toasts
}

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration for performance monitoring
    const config = response.config as CustomAxiosRequestConfig;
    if (config.metadata?.startTime) {
      const duration = new Date().getTime() - config.metadata.startTime.getTime();
      if (duration > 3000) {
        console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const suppressToasts = originalRequest?.suppressToasts || false;

    // Handle network errors
    if (!error.response) {
      if (!suppressToasts) {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }

    const { status } = error.response;
    const responseData = error.response.data as any;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        // Bad request - show specific error message
        if (!suppressToasts) {
          const errorMessage = responseData?.detail || 'Invalid request';
          toast.error(errorMessage);
        }
        break;
        
      case 401:
        // Unauthorized - handle token expiry
        if (originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
                refresh_token: refreshToken,
              });
              
              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);
              
              // Retry the original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
              }
              return api.request(originalRequest);
            } catch (refreshError) {
              // Refresh failed - redirect to login
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              toast.error('Session expired. Please log in again.');
              window.location.href = '/auth/login';
            }
          } else {
            // No refresh token - redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            toast.error('Please log in to continue.');
            window.location.href = '/auth/login';
          }
        }
        break;
        
      case 403:
        if (!suppressToasts) {
          toast.error('You do not have permission to perform this action.');
        }
        break;
        
      case 404:
        if (!suppressToasts) {
          toast.error('The requested resource was not found.');
        }
        break;
        
      case 409:
        if (!suppressToasts) {
          const conflictMessage = responseData?.detail || 'Conflict occurred';
          toast.error(conflictMessage);
        }
        break;
        
      case 422:
        if (!suppressToasts) {
          // Validation error
          const validationErrors = responseData?.detail;
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: any) => {
              toast.error(`${err.loc?.join(' ')}: ${err.msg}`);
            });
          } else {
            toast.error(validationErrors || 'Validation error');
          }
        }
        break;
        
      case 429:
        if (!suppressToasts) {
          toast.error('Too many requests. Please try again later.');
        }
        break;
        
      case 500:
        if (!suppressToasts) {
          toast.error('Internal server error. Please try again later.');
        }
        break;
        
      default:
        if (!suppressToasts) {
          toast.error('An unexpected error occurred.');
        }
    }

    return Promise.reject(error);
  }
);

// Utility function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Create an API instance with suppressed toasts for data loading operations
export const apiSilent = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the same request interceptor to the silent API
apiSilent.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for performance monitoring
    config.metadata = {
      startTime: new Date()
    };
    
    // Always suppress toasts for this instance
    config.suppressToasts = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same response interceptor but with toasts suppressed
apiSilent.interceptors.response.use(
  (response) => {
    // Performance monitoring
    const config = response.config as CustomAxiosRequestConfig;
    if (config.metadata?.startTime) {
      const duration = new Date().getTime() - config.metadata.startTime.getTime();
      if (duration > 3000) {
        console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Handle 401 errors for token refresh (same as main API)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          // Retry the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiSilent.request(originalRequest);
        } catch (refreshError) {
          // Refresh failed - redirect to login (but don't show toast)
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
      } else {
        // No refresh token - redirect to login (but don't show toast)
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    
    // For all other errors, just reject silently (no toasts)
    return Promise.reject(error);
  }
);

// Utility function to handle API errors
export const handleApiError = (error: any): never => {
  if (error.response?.data?.detail) {
    throw new Error(error.response.data.detail);
  }
  throw new Error(error.message || 'An unexpected error occurred');
};

// Helper function to build query parameters
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// Loading state manager
class LoadingManager {
  private static loadingStates = new Map<string, boolean>();
  private static listeners = new Set<(loadingStates: Map<string, boolean>) => void>();

  static setLoading(key: string, isLoading: boolean) {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners();
  }

  static isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  static subscribe(listener: (loadingStates: Map<string, boolean>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener(new Map(this.loadingStates)));
  }
}

// HOF to add loading state to API calls
export const withLoading = <T extends any[], R>(
  key: string,
  apiCall: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    LoadingManager.setLoading(key, true);
    try {
      const result = await apiCall(...args);
      return result;
    } finally {
      LoadingManager.setLoading(key, false);
    }
  };
};

export { api, LoadingManager };
export default api;