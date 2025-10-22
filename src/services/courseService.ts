import apiClient from './api';
import { Course, CourseFilters, CreateCourseData, UpdateCourseData, PaginatedResponse } from '../types/api';

export class CourseService {
  /**
   * Get all courses with filters and pagination
   */
  static async getCourses(filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> {
    const { data } = await apiClient.get('/courses', {
      params: filters
    });
    return data;
  }

  /**
   * Get a specific course by ID
   */
  static async getCourseById(id: string): Promise<Course> {
    const { data } = await apiClient.get(`/courses/${id}`);
    return data;
  }

  /**
   * Create a new course (admin only)
   */
  static async createCourse(courseData: CreateCourseData): Promise<Course> {
    const { data } = await apiClient.post('/courses', courseData);
    return data;
  }

  /**
   * Update an existing course (admin only)
   */
  static async updateCourse(id: string, courseData: UpdateCourseData): Promise<Course> {
    const { data } = await apiClient.put(`/courses/${id}`, courseData);
    return data;
  }

  /**
   * Delete a course (admin only)
   */
  static async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  }

  /**
   * Get featured courses
   */
  static async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    const { data } = await apiClient.get('/courses', {
      params: { is_featured: true, per_page: limit }
    });
    return data.items || data;
  }

  /**
   * Get courses by category
   */
  static async getCoursesByCategory(categoryId: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<Course>> {
    const { data } = await apiClient.get('/courses', {
      params: { category_id: categoryId, page, per_page }
    });
    return data;
  }

  /**
   * Search courses
   */
  static async searchCourses(query: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<Course>> {
    const { data } = await apiClient.get('/courses', {
      params: { search: query, page, per_page }
    });
    return data;
  }

  /**
   * Get course categories
   */
  static async getCategories(): Promise<Array<{ id: string; name: string; course_count?: number }>> {
    const { data } = await apiClient.get('/categories');
    return data;
  }

  /**
   * Create course category (admin only)
   */
  static async createCategory(name: string): Promise<{ id: string; name: string }> {
    const { data } = await apiClient.post('/categories', { name });
    return data;
  }

  /**
   * Update course category (admin only)
   */
  static async updateCategory(id: string, name: string): Promise<{ id: string; name: string }> {
    const { data } = await apiClient.put(`/categories/${id}`, { name });
    return data;
  }

  /**
   * Delete course category (admin only)
   */
  static async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }

  /**
   * Upload course thumbnail
   */
  static async uploadCourseThumbnail(courseId: string, file: File): Promise<{ thumbnail_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post(`/courses/${courseId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return data;
  }

  /**
   * Get course statistics (admin only)
   */
  static async getCourseStatistics(): Promise<{
    total_courses: number;
    published_courses: number;
    draft_courses: number;
  }> {
    const { data } = await apiClient.get('/courses/stats');
    return data;
  }

  /**
   * Get course enrollment status for current user
   */
  static async getCourseEnrollmentStatus(id: string): Promise<{ enrolled: boolean; enrollment_date?: string }> {
    const { data } = await apiClient.get(`/courses/${id}/enrollment`);
    return data;
  }

  /**
   * Enroll in a course
   */
  static async enrollInCourse(id: string): Promise<{ message: string; enrollment_id: string }> {
    const { data } = await apiClient.post(`/courses/${id}/enroll`, {});
    return data;
  }

  /**
   * Unenroll from a course
   */
  static async unenrollFromCourse(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/courses/${id}/enroll`);
    return data;
  }

  /**
   * Get course reviews
   */
  static async getCourseReviews(courseId: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<{
    id: string;
    rating: number;
    content: string;
    author_name: string;
    created_at: string;
  }>> {
    const { data } = await apiClient.get(`/courses/${courseId}/reviews`, {
      params: { page, per_page }
    });
    return data;
  }

  /**
   * Add course review
   */
  static async addCourseReview(courseId: string, review: { rating: number; comment: string }): Promise<{ message: string }> {
    const { data } = await apiClient.post(`/courses/${courseId}/reviews`, review);
    return data;
  }
}