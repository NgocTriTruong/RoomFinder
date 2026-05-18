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
  totalPosts?: number;
}

export interface ComprehensiveStats {
  overview: DashboardStats;
  revenue: {
    totalRevenue: number;
    transactionCount: number;
    dailyRevenue: Record<string, number>;
    revenueByType: Record<string, number>;
    successfulTransactions?: number;
    failedTransactions?: number;
    pendingTransactions?: number;
  };
  users: {
    totalUsers: number;
    roleBreakdown: Record<string, number>;
    verifiedUsers?: number;
    unverifiedUsers?: number;
    landlords?: number;
    tenants?: number;
  };
  posts: {
    totalPosts: number;
    statusBreakdown: Record<string, number>;
    approvedPosts?: number;
    pendingPosts?: number;
    rejectedPosts?: number;
    totalViews?: number;
    totalFavorites?: number;
  };
  bookings: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    statusBreakdown: Record<string, number>;
  };
  reviews: {
    totalReviews: number;
    reviewsInPeriod: number;
    averageRating: number;
  };
  reports: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    dismissedReports: number;
  };
}

export interface AdminPackageResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  discountedPrice?: number;
  durationDays: number;
  type: string;
  typeDisplayName?: string;
  maxPosts: number;
  boostDays: number;
  features?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  validFrom?: string;
  validTo?: string;
  maxPurchasePerUser?: number;
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
    const response = await api.get<ApiResponse<DashboardStats>>('/v1/statistics/dashboard');
    return response.data.data!;
  },

  /**
   * Package Management
   */
  getPackages: async (page: number = 0, size: number = 20): Promise<PaginatedData<AdminPackageResponse>> => {
    try {
      // Try admin endpoint first (to see all packages)
      let items: AdminPackageResponse[] = [];
      try {
        const response = await api.get<ApiResponse<any[]>>('/v1/subscriptions/admin/packages');
        items = (response.data.data || []) as AdminPackageResponse[];
      } catch (adminError) {
        // Fallback to public endpoint if admin endpoint is not yet available (e.g., backend not restarted)
        console.warn('Admin packages endpoint failed, falling back to public endpoint', adminError);
        const response = await api.get<ApiResponse<any[]>>('/v1/subscriptions/packages');
        items = (response.data.data || []) as AdminPackageResponse[];
      }

      const start = page * size;
      const content = items.slice(start, start + size);
      const totalElements = items.length;
      return {
        content,
        totalElements,
        totalPages: Math.max(1, Math.ceil(totalElements / size)),
        size,
        number: page,
        first: page === 0,
        last: start + size >= totalElements
      };
    } catch (e) {
      console.error('Failed to fetch packages:', e);
      return {
        content: [],
        totalElements: 0,
        totalPages: 1,
        size,
        number: page,
        first: true,
        last: true
      };
    }
  },

  createPackage: async (data: Partial<AdminPackageResponse>): Promise<AdminPackageResponse> => {
    const response = await api.post<ApiResponse<AdminPackageResponse>>('/v1/subscriptions/admin/packages', data);
    return response.data.data!;
  },

  updatePackage: async (id: number, data: Partial<AdminPackageResponse>): Promise<AdminPackageResponse> => {
    const response = await api.put<ApiResponse<AdminPackageResponse>>(`/v1/subscriptions/admin/packages/${id}`, data);
    return response.data.data!;
  },

  deletePackage: async (id: number): Promise<void> => {
    await api.delete(`/v1/subscriptions/admin/packages/${id}`);
  },

  /**
   * Get comprehensive statistics
   */
  getComprehensiveStats: async (period: string = 'LAST_30_DAYS'): Promise<ComprehensiveStats> => {
    const response = await api.get<ApiResponse<ComprehensiveStats>>('/v1/statistics/comprehensive', {
      params: { period, includeChartData: true }
    });
    return response.data.data!;
  },
};

export default adminService;
