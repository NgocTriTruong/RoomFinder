import api from './api';
import type { ApiResponse, PaginatedData, UserResponse } from '@/types';

export interface AdminUserQuery {
  search?: string;
  role?: string;
  status?: string;
  verificationStatus?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserResponse> => {
    const response = await api.get<ApiResponse<UserResponse>>('/v1/users/profile');
    return response.data.data!;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: any): Promise<UserResponse> => {
    const response = await api.put<ApiResponse<UserResponse>>('/v1/users/profile', data);
    return response.data.data!;
  },

  /**
   * Gửi thông tin KYC
   */
  submitKYC: async (data: any): Promise<UserResponse> => {
    const response = await api.post<ApiResponse<UserResponse>>('/v1/users/kyc', data);
    return response.data.data!;
  },

  /**
   * Xác thực người dùng (dành cho admin)
   */
  verifyUser: async (id: number, data: { status: string, adminNote?: string }): Promise<UserResponse> => {
    const response = await api.post<ApiResponse<UserResponse>>(`/v1/users/admin/verify/${id}`, data);
    return response.data.data!;
  },

  /**
   * Get admin user list
   */
  getAdminUsers: async (params: AdminUserQuery = {}): Promise<PaginatedData<UserResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<UserResponse>>>('/v1/users/admin/all', {
      params,
    });
    return response.data.data!;
  },

  /**
   * Get pending KYC users
   */
  getPendingKycUsers: async (params: Pick<AdminUserQuery, 'page' | 'size' | 'sortBy' | 'sortDirection'> = {}): Promise<PaginatedData<UserResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<UserResponse>>>('/v1/users/admin/pending-kyc', {
      params,
    });
    return response.data.data!;
  },

  /**
   * Update user status
   */
  updateUserStatus: async (id: number, status: string): Promise<UserResponse> => {
    const response = await api.put<ApiResponse<UserResponse>>(`/v1/users/admin/status/${id}`, { status });
    return response.data.data!;
  },

  /**
   * Update user role (admin)
   */
  updateUserRole: async (id: number, role: string): Promise<UserResponse> => {
    const response = await api.put<ApiResponse<UserResponse>>(`/v1/users/admin/role/${id}`, { role });
    return response.data.data!;
  },

  /**
   * Create new admin account (admin)
   */
  createAdmin: async (data: any): Promise<UserResponse> => {
    const response = await api.post<ApiResponse<UserResponse>>('/v1/users/admin/create', data);
    return response.data.data!;
  },

  /**
   * Update any user profile (admin)
   */
  adminUpdateProfile: async (id: number, data: any): Promise<UserResponse> => {
    const response = await api.put<ApiResponse<UserResponse>>(`/v1/users/admin/update/${id}`, data);
    return response.data.data!;
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<{ url: string }>>('/v1/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!.url;
  },

  /**
   * Get public profile by ID
   */
  getPublicProfile: async (id: number | string): Promise<UserResponse> => {
    const response = await api.get<ApiResponse<UserResponse>>(`/v1/users/${id}/public`);
    return response.data.data!;
  },

  /**
   * Thay đổi mật khẩu
   */
  changePassword: async (data: any): Promise<void> => {
    await api.post('/v1/auth/change-password', data);
  },

  /**
   * Vô hiệu hóa tài khoản cá nhân
   */
  deactivateAccount: async (): Promise<void> => {
    await api.post('/v1/users/deactivate');
  },
};

export default userService;
