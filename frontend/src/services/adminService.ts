import api from './api';
import type { ApiResponse, PaginatedData, UserResponse } from '@/types';

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  pendingPosts: number;
  newPostsToday: number;
  totalUsers: number;
  userGrowth: number;
  pendingReports: number;
  activePackages: number;
}

export interface AdminPackageResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  type: 'POST' | 'BOOST' | 'SUB';
  postLimit: number;
  boostLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  avatar: string | null;
  role: 'USER' | 'LANDLORD' | 'ADMIN';
  status: 'ACTIVE' | 'LOCKED' | 'PENDING';
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminPostResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  viewCount: number;
  favoriteCount: number;
  thumbnailUrl: string | null;
  landlord: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminReportResponse {
  id: number;
  reporter: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  targetType: 'POST' | 'USER';
  targetId: number;
  targetName: string;
  reason: string;
  description: string | null;
  status: 'UNRESOLVED' | 'RESOLVED' | 'IGNORED';
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/v1/admin/dashboard/stats');
    return response.data.data!;
  },

  /**
   * Get all packages (admin)
   */
  getPackages: async (page: number = 0, size: number = 20): Promise<PaginatedData<AdminPackageResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<AdminPackageResponse>>>('/v1/admin/packages', {
      params: { page, size },
    });
    return response.data.data!;
  },

  /**
   * Create a new package
   */
  createPackage: async (data: {
    name: string;
    description: string;
    price: number;
    durationDays: number;
    type: 'POST' | 'BOOST' | 'SUB';
    postLimit: number;
    boostLimit: number;
  }): Promise<AdminPackageResponse> => {
    const response = await api.post<ApiResponse<AdminPackageResponse>>('/v1/admin/packages', data);
    return response.data.data!;
  },

  /**
   * Update a package
   */
  updatePackage: async (id: number, data: Partial<{
    name: string;
    description: string;
    price: number;
    durationDays: number;
    postLimit: number;
    boostLimit: number;
    isActive: boolean;
  }>): Promise<AdminPackageResponse> => {
    const response = await api.put<ApiResponse<AdminPackageResponse>>(`/v1/admin/packages/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete a package
   */
  deletePackage: async (id: number): Promise<void> => {
    await api.delete(`/v1/admin/packages/${id}`);
  },

  /**
   * Get all users (admin)
   */
  getUsers: async (page: number = 0, size: number = 20, role?: string): Promise<PaginatedData<AdminUserResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<AdminUserResponse>>>('/v1/admin/users', {
      params: { page, size, role },
    });
    return response.data.data!;
  },

  /**
   * Update user status (lock/unlock)
   */
  updateUserStatus: async (id: number, status: 'ACTIVE' | 'LOCKED'): Promise<void> => {
    await api.put(`/v1/admin/users/${id}/status`, { status });
  },

  /**
   * Get all posts (admin)
   */
  getPosts: async (page: number = 0, size: number = 20, status?: string): Promise<PaginatedData<AdminPostResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<AdminPostResponse>>>('/v1/admin/posts', {
      params: { page, size, status },
    });
    return response.data.data!;
  },

  /**
   * Approve a post
   */
  approvePost: async (id: number): Promise<void> => {
    await api.put(`/v1/admin/posts/${id}/approve`);
  },

  /**
   * Reject a post
   */
  rejectPost: async (id: number, reason: string): Promise<void> => {
    await api.put(`/v1/admin/posts/${id}/reject`, { reason });
  },

  /**
   * Hide a post
   */
  hidePost: async (id: number): Promise<void> => {
    await api.put(`/v1/admin/posts/${id}/hide`);
  },

  /**
   * Get all reports (admin)
   */
  getReports: async (page: number = 0, size: number = 20, status?: string): Promise<PaginatedData<AdminReportResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<AdminReportResponse>>>('/v1/admin/reports', {
      params: { page, size, status },
    });
    return response.data.data!;
  },

  /**
   * Resolve a report
   */
  resolveReport: async (id: number, action: 'RESOLVED' | 'IGNORED', resolution?: string): Promise<void> => {
    await api.put(`/v1/admin/reports/${id}/resolve`, { action, resolution });
  },
};

export default adminService;
