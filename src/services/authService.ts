import api, { handleApiResponse, withLoading } from './api';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../types/api';

export class AuthService {
  // Login user
  static login = withLoading('auth.login', async (credentials: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const authData = handleApiResponse<AuthResponse>(response);
    
    // Store tokens and user data
    localStorage.setItem('access_token', authData.access_token);
    if (authData.refresh_token) {
      localStorage.setItem('refresh_token', authData.refresh_token);
    }
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  });

  // Register new user
  static register = withLoading('auth.register', async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    const authData = handleApiResponse<AuthResponse>(response);
    
    // Store tokens and user data
    localStorage.setItem('access_token', authData.access_token);
    if (authData.refresh_token) {
      localStorage.setItem('refresh_token', authData.refresh_token);
    }
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  });

  // Get current user profile
  static getCurrentUser = withLoading('auth.currentUser', async (): Promise<User> => {
    const response = await api.get('/users/me');
    return handleApiResponse<User>(response);
  });

  // Request password reset
  static requestPasswordReset = withLoading('auth.requestReset', async (email: string): Promise<void> => {
    const response = await api.post('/auth/password-reset', { email });
    handleApiResponse(response);
  });

  // Reset password with token
  static resetPassword = withLoading('auth.resetPassword', async (token: string, newPassword: string): Promise<void> => {
    const response = await api.post('/auth/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
    handleApiResponse(response);
  });

  // Change password (authenticated user)
  static changePassword = withLoading('auth.changePassword', async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await api.put('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    handleApiResponse(response);
  });

  // Update user profile
  static updateProfile = withLoading('auth.updateProfile', async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', userData);
    const updatedUser = handleApiResponse<User>(response);
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  });

  // Logout user
  static logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if available
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  };

  // Refresh access token
  static refreshToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    
    const { access_token } = handleApiResponse<{ access_token: string }>(response);
    localStorage.setItem('access_token', access_token);
    
    return access_token;
  };

  // Check if user is authenticated
  static isAuthenticated = (): boolean => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // Get stored user data
  static getStoredUser = (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  };

  // Get access token
  static getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
  };
}