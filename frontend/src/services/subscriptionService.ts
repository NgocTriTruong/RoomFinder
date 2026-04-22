import api from './api';
import type { ApiResponse } from '@/types';

export interface PackageResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  type: 'POST' | 'BOOST' | 'SUB';
  typeDisplayName?: string;
  maxPosts?: number | null;
  boostDays?: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  discountedPrice?: number | null;
  hasDiscount?: boolean;
  features?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
}

export const subscriptionService = {
  /**
   * Get available packages
   */
  getAvailablePackages: async (type?: string): Promise<PackageResponse[]> => {
    const response = await api.get<ApiResponse<PackageResponse[]>>('/v1/subscriptions/packages', {
      params: { type },
    });
    return response.data.data!;
  },

  /**
   * Boost a post
   */
  boostPost: async (postId: number, packageId: number): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(`/v1/subscriptions/boost/${postId}`, null, {
      params: { packageId },
    });
    return response.data.data;
  },

  /**
   * Get current subscription
   */
  getCurrentSubscription: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/v1/subscriptions/current');
    return response.data.data;
  },
};

export default subscriptionService;
