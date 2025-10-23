import apiClient, { apiSilent } from './api';
import { Blog, BlogCreate, PaginatedResponse } from '../types/api';

export interface BlogFilters {
  page?: number;
  per_page?: number;
  category_id?: string;
  search?: string;
  is_published?: boolean;
  sort_by?: 'created_at' | 'title' | 'comments_count';
  sort_order?: 'asc' | 'desc';
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  excerpt?: string;
  category_id?: string;
  is_published?: boolean;
  featured_image?: string;
}

export class BlogService {
  /**
   * Get all blogs with filters and pagination
   */
  static async getBlogs(filters: BlogFilters = {}): Promise<PaginatedResponse<Blog>> {
    const { data } = await apiSilent.get('/blogs', {
      params: filters
    });
    return data;
  }

  /**
   * Get a specific blog by ID
   */
  static async getBlogById(id: string): Promise<Blog> {
    const { data } = await apiSilent.get(`/blogs/${id}`);
    return data;
  }

  /**
   * Get a blog by slug
   */
  static async getBlogBySlug(slug: string): Promise<Blog> {
    const { data } = await apiSilent.get(`/blogs/slug/${slug}`);
    return data;
  }

  /**
   * Create a new blog post (admin only)
   */
  static async createBlog(blogData: BlogCreate): Promise<Blog> {
    const { data } = await apiClient.post('/blogs', blogData);
    return data;
  }

  /**
   * Update an existing blog post (admin only)
   */
  static async updateBlog(id: string, blogData: UpdateBlogData): Promise<Blog> {
    const { data } = await apiClient.put(`/blogs/${id}`, blogData);
    return data;
  }

  /**
   * Delete a blog post (admin only)
   */
  static async deleteBlog(id: string): Promise<void> {
    await apiClient.delete(`/blogs/${id}`);
  }

  /**
   * Get featured blogs
   */
  static async getFeaturedBlogs(limit: number = 6): Promise<Blog[]> {
    const { data } = await apiSilent.get('/blogs/featured', {
      params: { limit }
    });
    return data;
  }

  /**
   * Get recent blogs
   */
  static async getRecentBlogs(limit: number = 10): Promise<Blog[]> {
    const { data } = await apiSilent.get('/blogs', {
      params: { 
        per_page: limit, 
        sort_by: 'created_at', 
        sort_order: 'desc',
        is_published: true
      }
    });
    return data.items || data;
  }

  /**
   * Get blogs by category
   */
  static async getBlogsByCategory(categoryId: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<Blog>> {
    const { data } = await apiSilent.get('/blogs', {
      params: { category_id: categoryId, page, per_page, is_published: true }
    });
    return data;
  }

  /**
   * Search blogs
   */
  static async searchBlogs(query: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<Blog>> {
    const { data } = await apiSilent.get('/blogs', {
      params: { search: query, page, per_page, is_published: true }
    });
    return data;
  }

  /**
   * Upload blog featured image
   */
  static async uploadBlogImage(blogId: string, file: File): Promise<{ image_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post(`/blogs/${blogId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return data;
  }

  /**
   * Get blog categories
   */
  static async getBlogCategories(): Promise<Array<{ id: string; name: string; blog_count?: number }>> {
    const { data } = await apiSilent.get('/blog-categories');
    return data;
  }

  /**
   * Create blog category (admin only)
   */
  static async createBlogCategory(name: string): Promise<{ id: string; name: string }> {
    const { data } = await apiClient.post('/blog-categories', { name });
    return data;
  }

  /**
   * Update blog category (admin only)
   */
  static async updateBlogCategory(id: string, name: string): Promise<{ id: string; name: string }> {
    const { data } = await apiClient.put(`/blog-categories/${id}`, { name });
    return data;
  }

  /**
   * Delete blog category (admin only)
   */
  static async deleteBlogCategory(id: string): Promise<void> {
    await apiClient.delete(`/blog-categories/${id}`);
  }

  /**
   * Get blog statistics (admin only)
   */
  static async getBlogStatistics(): Promise<{
    total_blogs: number;
    published_blogs: number;
    draft_blogs: number;
    total_comments: number;
  }> {
    const { data } = await apiClient.get('/blogs/stats');
    return data;
  }

  /**
   * Get blog comments
   */
  static async getBlogComments(blogId: string, page: number = 1, per_page: number = 10): Promise<PaginatedResponse<{
    id: string;
    content: string;
    author_name: string;
    created_at: string;
  }>> {
    const { data } = await apiClient.get(`/blogs/${blogId}/comments`, {
      params: { page, per_page }
    });
    return data;
  }

  /**
   * Add blog comment
   */
  static async addBlogComment(blogId: string, comment: { content: string }): Promise<{ message: string }> {
    const { data } = await apiClient.post(`/blogs/${blogId}/comments`, comment);
    return data;
  }

  /**
   * Delete blog comment (admin only)
   */
  static async deleteBlogComment(blogId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/blogs/${blogId}/comments/${commentId}`);
  }
}