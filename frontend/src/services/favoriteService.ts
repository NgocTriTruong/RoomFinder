import api from './api';
import type { ApiResponse, PostResponse } from '@/types';

export interface FavoriteResponse {
  id: number;
  roomId: number;
  roomTitle: string;
  roomAddress: string;
  roomImageUrl: string;
  roomPrice: number;
  priceType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  landlordId: number;
  landlordName: string;
  landlordAvatar: string;
  addedAt: string;
}

export const favoriteService = {
  /**
   * Get user's favorites
   */
  getUserFavorites: async (): Promise<FavoriteResponse[]> => {
    const response = await api.get<ApiResponse<FavoriteResponse[]>>('/v1/favorites');
    return response.data.data!;
  },

  /**
   * Add room to favorites
   */
  addFavorite: async (roomId: number | string): Promise<FavoriteResponse> => {
    const response = await api.post<ApiResponse<FavoriteResponse>>(`/v1/favorites/${roomId}`);
    return response.data.data!;
  },

  /**
   * Remove room from favorites
   */
  removeFavorite: async (roomId: number | string): Promise<void> => {
    await api.delete(`/v1/favorites/${roomId}`);
  },

  /**
   * Check if room is favorite
   */
  isFavorite: async (roomId: number | string): Promise<boolean> => {
    const response = await api.get<ApiResponse<{ isFavorite: boolean }>>(`/v1/favorites/check/${roomId}`);
    return response.data.data?.isFavorite || false;
  },
};

export default favoriteService;
