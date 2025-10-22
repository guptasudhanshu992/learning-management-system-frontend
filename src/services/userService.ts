import apiClient from './api';
import { User, PaginatedResponse } from '../types/api';

export interface UserFilters {
  page?: number;
  per_page?: number;
  search?: string;
  role?: 'admin' | 'user';
  is_active?: boolean;
  sort_by?: 'created_at' | 'full_name' | 'email';
  sort_order?: 'asc' | 'desc';
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'user';
  is_active?: boolean;
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  role?: 'admin' | 'user';
  is_active?: boolean;
  password?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export class UserService {
  /**
   * Get all users with filters and pagination (admin only)
   */
  static async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get('/users', {
      params: filters
    });
    return data;
  }

  /**
   * Get a specific user by ID (admin only)
   */
  static async getUserById(id: string): Promise<User> {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get('/users/me');
    return data;
  }

  /**
   * Update current user profile
   */
  static async updateProfile(profileData: UpdateProfileData): Promise<User> {
    const { data } = await apiClient.put('/users/me', profileData);
    return data;
  }

  /**
   * Change user password
   */
  static async changePassword(passwordData: ChangePasswordData): Promise<{ message: string }> {
    const { data } = await apiClient.post('/users/change-password', passwordData);
    return data;
  }

  /**
   * Create a new user (admin only)
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    const { data } = await apiClient.post('/users', userData);
    return data;
  }

  /**
   * Update an existing user (admin only)
   */
  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const { data } = await apiClient.put(`/users/${id}`, userData);
    return data;
  }

  /**
   * Delete a user (admin only)
   */
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  /**
   * Activate/Deactivate user (admin only)
   */
  static async toggleUserStatus(id: string, is_active: boolean): Promise<User> {
    const { data } = await apiClient.patch(`/users/${id}/status`, { is_active });
    return data;
  }

  /**
   * Get user statistics (admin only)
   */
  static async getUserStatistics(): Promise<{
    total_users: number;
    active_users: number;
    inactive_users: number;
    admin_users: number;
    regular_users: number;
    recent_registrations: User[];
  }> {
    const { data } = await apiClient.get('/users/stats');
    return data;
  }

  /**
   * Bulk update users (admin only)
   */
  static async bulkUpdateUsers(updates: Array<{ id: string; data: Partial<UpdateUserData> }>): Promise<{ updated_count: number }> {
    const { data } = await apiClient.patch('/users/bulk-update', { updates });
    return data;
  }

  /**
   * Export users data (admin only)
   */
  static async exportUsers(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get('/users/export', {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return data;
  }

  /**
   * Get user's enrolled courses
   */
  static async getUserEnrolledCourses(userId?: string): Promise<any[]> {
    const endpoint = userId ? `/users/${userId}/courses` : '/users/me/courses';
    const { data } = await apiClient.get(endpoint);
    return data;
  }

  /**
   * Get user's purchase history
   */
  static async getUserPurchaseHistory(userId?: string): Promise<any[]> {
    const endpoint = userId ? `/users/${userId}/purchases` : '/users/me/purchases';
    const { data } = await apiClient.get(endpoint);
    return data;
  }

  /**
   * Search users (admin only)
   */
  static async searchUsers(query: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get('/users', {
      params: { search: query, page, per_page }
    });
    return data;
  }

  /**
   * Reset user password (admin only)
   */
  static async resetUserPassword(id: string, new_password: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(`/users/${id}/reset-password`, { new_password });
    return data;
  }

  /**
   * Send user invitation email (admin only)
   */
  static async sendUserInvitation(email: string, role: 'admin' | 'user' = 'user'): Promise<{ message: string }> {
    const { data } = await apiClient.post('/users/invite', { email, role });
    return data;
  }
}