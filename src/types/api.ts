// API Types for the LMS Backend
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'instructor';
  is_active: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string; // Backend expects username (email)
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor_name?: string;
  category_id?: string;
  category_name?: string;
  price: number;
  is_published: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  chapters_count?: number;
  students_count?: number;
  rating?: number;
}

export interface CourseCreate {
  title: string;
  description: string;
  category_id?: string;
  price: number;
  is_published?: boolean;
  thumbnail_url?: string;
}

export interface CourseFilters {
  page?: number;
  per_page?: number;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  is_published?: boolean;
  sort_by?: 'created_at' | 'price' | 'rating' | 'students_count';
  sort_order?: 'asc' | 'desc';
}

export interface CreateCourseData {
  title: string;
  description: string;
  category_id?: string;
  price: number;
  is_published?: boolean;
  thumbnail_url?: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  category_id?: string;
  price?: number;
  is_published?: boolean;
  thumbnail_url?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name?: string;
  category_id?: string;
  category_name?: string;
  is_published: boolean;
  featured_image?: string;
  slug: string;
  created_at: string;
  updated_at: string;
  comments_count?: number;
}

export interface BlogCreate {
  title: string;
  content: string;
  excerpt: string;
  category_id?: string;
  is_published?: boolean;
  featured_image?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  course_id: string;
  course: Course;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  course_id: string;
  course: Course;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface PaymentIntent {
  client_secret: string;
  amount: number;
  currency: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

// Query parameters for list endpoints
export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  is_published?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}