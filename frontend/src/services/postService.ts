import api from './api';
import type {
  ApiResponse,
  PaginatedData,
  PostResponse,
  PostStatsResponse,
  LandlordDashboardStats,
} from '@/types';

export interface PostSearchParams {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  areaMin?: number;
  areaMax?: number;
  location?: string;
  district?: string;
  province?: string;
  ward?: string;
  amenityIds?: number[];
  category?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  nearbyUniversityId?: number;
  petFriendly?: boolean;
  parkingAvailable?: boolean;
  hasBalcony?: boolean;
  hasWindows?: boolean;
}

export interface AdminPostQuery extends PostSearchParams {
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const postService = {
  /**
   * Get all public posts (Search & List)
   */
  getPublicPosts: async (params: PostSearchParams & { page?: number; size?: number; sortBy?: string; sortDirection?: string }): Promise<PaginatedData<PostResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<PostResponse>>>('/v1/posts/public', {
      params,
    });
    return response.data.data!;
  },

  /**
   * Get featured posts for home page
   */
  getFeaturedPosts: async (limit: number = 10): Promise<PostResponse[]> => {
    const response = await api.get<ApiResponse<PostResponse[]>>('/v1/posts/featured', {
      params: { limit },
    });
    return response.data.data!;
  },

  /**
   * Get post details by ID
   */
  getPostById: async (id: number | string): Promise<PostResponse> => {
    const response = await api.get<ApiResponse<PostResponse>>(`/v1/posts/${id}`);
    return response.data.data!;
  },

  /**
   * Get landlord's own posts
   */
  getMyPosts: async (page: number = 0, size: number = 10): Promise<PaginatedData<PostResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<PostResponse>>>('/v1/posts/my', {
      params: { page, size },
    });
    return response.data.data!;
  },

  /**
   * Admin: Get posts for moderation
   */
  getAdminPosts: async (params: AdminPostQuery = {}): Promise<PaginatedData<PostResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<PostResponse>>>('/v1/posts/admin', {
      params,
    });
    return response.data.data!;
  },

  /**
   * Admin: Approve a post
   */
  approvePost: async (id: number | string): Promise<void> => {
    await api.put(`/v1/posts/${id}/approve`);
  },

  /**
   * Admin: Reject a post
   */
  rejectPost: async (id: number | string, reason: string): Promise<void> => {
    await api.put(`/v1/posts/${id}/reject`, { reason });
  },

  /**
   * Create a new post (Landlord only)
   */
  createPost: async (data: any): Promise<PostResponse> => {
    const response = await api.post<ApiResponse<PostResponse>>('/v1/posts', data);
    return response.data.data!;
  },

  /**
   * Update an existing post (Landlord only)
   */
  updatePost: async (id: number | string, data: any): Promise<PostResponse> => {
    const response = await api.put<ApiResponse<PostResponse>>(`/v1/posts/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete a post (Landlord only)
   */
  deletePost: async (id: number | string): Promise<void> => {
    await api.delete(`/v1/posts/${id}`);
  },

  /**
   * Boost a post
   */
  boostPost: async (id: number | string, boostPackageId: number): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/v1/posts/${id}/boost`, null, {
      params: { boostPackageId },
    });
    return response.data.data;
  },

  /**
   * Extend post expiration
   */
  extendPost: async (id: number | string, days: number = 30): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/v1/posts/${id}/extend`, null, {
      params: { days },
    });
    return response.data.data;
  },

  /**
   * Get post statistics
   */
  getPostStats: async (id: number | string): Promise<PostStatsResponse> => {
    const response = await api.get<ApiResponse<PostStatsResponse>>(`/v1/posts/${id}/stats`);
    return response.data.data!;
  },

  /**
   * Get landlord dashboard statistics
   */
  getDashboardStats: async (): Promise<LandlordDashboardStats> => {
    const response = await api.get<ApiResponse<LandlordDashboardStats>>('/v1/posts/landlord/dashboard/stats');
    return response.data.data!;
  },

  /**
   * Record post contact (when user clicks contact buttons)
   */
  recordContact: async (id: number | string): Promise<void> => {
    await api.post(`/v1/posts/${id}/contact`);
  },
};

export default postService;
