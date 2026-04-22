import api from './api';
import type { ApiResponse, PaginatedData } from '@/types';

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedId?: number;
  relatedType?: string;
  createdAt: string;
}

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  getNotifications: async (page: number = 0, size: number = 20): Promise<PaginatedData<NotificationResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<NotificationResponse>>>('/v1/notifications', {
      params: { page, size },
    });
    return response.data.data!;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: number | string): Promise<void> => {
    await api.put(`/v1/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await api.put('/v1/notifications/read-all');
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<number>>('/v1/notifications/unread-count');
    return response.data.data!;
  },
};

export default notificationService;
