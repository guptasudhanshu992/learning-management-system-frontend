import apiClient from './api';
import { WishlistItem, Course, PaginatedResponse } from '../types/api';

export interface AddToWishlistData {
  course_id: string;
}

export class WishlistService {
  /**
   * Get current user's wishlist
   */
  static async getWishlist(page: number = 1, per_page: number = 10): Promise<PaginatedResponse<WishlistItem>> {
    const { data } = await apiClient.get('/wishlist', {
      params: { page, per_page }
    });
    return data;
  }

  /**
   * Add course to wishlist
   */
  static async addToWishlist(wishlistData: AddToWishlistData): Promise<{ message: string; item: WishlistItem }> {
    const { data } = await apiClient.post('/wishlist/add', wishlistData);
    return data;
  }

  /**
   * Remove course from wishlist
   */
  static async removeFromWishlist(courseId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/wishlist/remove/${courseId}`);
    return data;
  }

  /**
   * Clear all items from wishlist
   */
  static async clearWishlist(): Promise<{ message: string }> {
    const { data } = await apiClient.delete('/wishlist/clear');
    return data;
  }

  /**
   * Get wishlist item count
   */
  static async getWishlistCount(): Promise<{ count: number }> {
    const { data } = await apiClient.get('/wishlist/count');
    return data;
  }

  /**
   * Check if course is in wishlist
   */
  static async isInWishlist(courseId: string): Promise<{ in_wishlist: boolean }> {
    const { data } = await apiClient.get(`/wishlist/check/${courseId}`);
    return data;
  }

  /**
   * Get wishlist with detailed course information
   */
  static async getWishlistDetails(page: number = 1, per_page: number = 10): Promise<{
    items: Array<WishlistItem & { course: Course }>;
    total_items: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    const { data } = await apiClient.get('/wishlist/details', {
      params: { page, per_page }
    });
    return data;
  }

  /**
   * Move item to cart
   */
  static async moveToCart(courseId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post('/wishlist/move-to-cart', { course_id: courseId });
    return data;
  }

  /**
   * Move multiple items to cart
   */
  static async moveMultipleToCart(courseIds: string[]): Promise<{ 
    message: string; 
    moved_count: number;
    failed_items?: Array<{ course_id: string; reason: string }>;
  }> {
    const { data } = await apiClient.post('/wishlist/move-multiple-to-cart', { course_ids: courseIds });
    return data;
  }

  /**
   * Get wishlist recommendations
   */
  static async getWishlistRecommendations(): Promise<Course[]> {
    const { data } = await apiClient.get('/wishlist/recommendations');
    return data;
  }

  /**
   * Share wishlist (generate shareable link)
   */
  static async shareWishlist(): Promise<{ share_url: string; expires_at: string }> {
    const { data } = await apiClient.post('/wishlist/share');
    return data;
  }

  /**
   * Get shared wishlist by token
   */
  static async getSharedWishlist(token: string): Promise<{
    owner_name: string;
    items: Array<WishlistItem & { course: Course }>;
    created_at: string;
  }> {
    const { data } = await apiClient.get(`/wishlist/shared/${token}`);
    return data;
  }

  /**
   * Get wishlist statistics
   */
  static async getWishlistStats(): Promise<{
    total_items: number;
    categories: Array<{ name: string; count: number }>;
    price_range: { min: number; max: number; average: number };
    most_wishlisted_course?: Course;
  }> {
    const { data } = await apiClient.get('/wishlist/stats');
    return data;
  }

  /**
   * Export wishlist
   */
  static async exportWishlist(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get('/wishlist/export', {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Search wishlist items
   */
  static async searchWishlist(query: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<WishlistItem>> {
    const { data } = await apiClient.get('/wishlist', {
      params: { search: query, page, per_page }
    });
    return data;
  }

  /**
   * Filter wishlist by category
   */
  static async filterWishlistByCategory(categoryId: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<WishlistItem>> {
    const { data } = await apiClient.get('/wishlist', {
      params: { category_id: categoryId, page, per_page }
    });
    return data;
  }

  /**
   * Get recently added wishlist items
   */
  static async getRecentWishlistItems(limit: number = 5): Promise<Array<WishlistItem & { course: Course }>> {
    const { data } = await apiClient.get('/wishlist/recent', {
      params: { limit }
    });
    return data;
  }
}