import api from './api';
import type { ApiResponse, PaginatedData, ReviewResponse } from '@/types';

export const reviewService = {
  /**
   * Get reviews for a specific post
   */
  getReviewsByPost: async (postId: number | string, page: number = 0, size: number = 10): Promise<PaginatedData<ReviewResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<ReviewResponse>>>(`/v1/reviews/post/${postId}`, {
      params: { page, size },
    });
    return response.data.data!;
  },

  /**
   * Create a new review
   */
  createReview: async (data: {
    postId: number;
    bookingId?: number;
    rating: number;
    comment: string;
    images?: string[];
  }): Promise<ReviewResponse> => {
    const response = await api.post<ApiResponse<ReviewResponse>>('/v1/reviews', data);
    return response.data.data!;
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: number | string): Promise<void> => {
    await api.delete(`/v1/reviews/${id}`);
  },

  /**
   * Reply to a review (Landlord only)
   */
  replyToReview: async (id: number | string, response: string): Promise<ReviewResponse> => {
    const apiResponse = await api.put<ApiResponse<ReviewResponse>>(`/v1/reviews/${id}/reply`, { response });
    return apiResponse.data.data!;
  },
};

export default reviewService;
