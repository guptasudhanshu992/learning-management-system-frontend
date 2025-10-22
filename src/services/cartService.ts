import apiClient from './api';
import { CartItem, Course } from '../types/api';

export interface CartSummary {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  discount_amount?: number;
  final_amount: number;
}

export interface AddToCartData {
  course_id: string;
}

export class CartService {
  /**
   * Get current user's cart
   */
  static async getCart(): Promise<CartSummary> {
    const { data } = await apiClient.get('/cart');
    return data;
  }

  /**
   * Add course to cart
   */
  static async addToCart(cartData: AddToCartData): Promise<{ message: string; item: CartItem }> {
    const { data } = await apiClient.post('/cart/add', cartData);
    return data;
  }

  /**
   * Remove course from cart
   */
  static async removeFromCart(courseId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/cart/remove/${courseId}`);
    return data;
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(): Promise<{ message: string }> {
    const { data } = await apiClient.delete('/cart/clear');
    return data;
  }

  /**
   * Get cart item count
   */
  static async getCartCount(): Promise<{ count: number }> {
    const { data } = await apiClient.get('/cart/count');
    return data;
  }

  /**
   * Check if course is in cart
   */
  static async isInCart(courseId: string): Promise<{ in_cart: boolean }> {
    const { data } = await apiClient.get(`/cart/check/${courseId}`);
    return data;
  }

  /**
   * Apply discount coupon
   */
  static async applyCoupon(couponCode: string): Promise<{
    message: string;
    discount_amount: number;
    final_amount: number;
  }> {
    const { data } = await apiClient.post('/cart/apply-coupon', { coupon_code: couponCode });
    return data;
  }

  /**
   * Remove applied coupon
   */
  static async removeCoupon(): Promise<{ message: string; final_amount: number }> {
    const { data } = await apiClient.delete('/cart/remove-coupon');
    return data;
  }

  /**
   * Get cart with detailed course information
   */
  static async getCartDetails(): Promise<{
    items: Array<CartItem & { course: Course }>;
    total_items: number;
    total_amount: number;
    discount_amount?: number;
    final_amount: number;
    applied_coupon?: {
      code: string;
      discount_type: 'percentage' | 'fixed';
      discount_value: number;
    };
  }> {
    const { data } = await apiClient.get('/cart/details');
    return data;
  }

  /**
   * Validate cart before checkout
   */
  static async validateCart(): Promise<{
    valid: boolean;
    issues?: Array<{
      course_id: string;
      issue: string;
      message: string;
    }>;
  }> {
    const { data } = await apiClient.get('/cart/validate');
    return data;
  }

  /**
   * Get recommended courses based on cart items
   */
  static async getRecommendedCourses(): Promise<Course[]> {
    const { data } = await apiClient.get('/cart/recommendations');
    return data;
  }

  /**
   * Save cart for later (guest to registered user migration)
   */
  static async saveCartForLater(): Promise<{ message: string }> {
    const { data } = await apiClient.post('/cart/save-for-later');
    return data;
  }

  /**
   * Restore saved cart
   */
  static async restoreSavedCart(): Promise<{ message: string; items_restored: number }> {
    const { data } = await apiClient.post('/cart/restore-saved');
    return data;
  }

  /**
   * Get cart history (previous carts)
   */
  static async getCartHistory(): Promise<Array<{
    id: string;
    items_count: number;
    total_amount: number;
    created_at: string;
    status: 'abandoned' | 'purchased' | 'saved';
  }>> {
    const { data } = await apiClient.get('/cart/history');
    return data;
  }

  /**
   * Move item to wishlist
   */
  static async moveToWishlist(courseId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post('/cart/move-to-wishlist', { course_id: courseId });
    return data;
  }
}