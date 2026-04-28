import api from './api';
import type { ApiResponse, PaginatedData } from '@/types';

export interface ConversationResponse {
  id: number;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatar: string | null;
  otherUserPhone: string | null;
  postId: number | null;
  postTitle: string | null;
  postThumbnail: string | null;
  lastMessage: MessageResponse | null;
  lastMessageContent?: string;
  unreadCount: number;
  createdAt: string;
  lastMessageAt: string | null;
}

export interface MessageResponse {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatar: string | null;
  receiverId?: number;
  receiverName?: string;
  receiverAvatar?: string | null;
  content: string;
  attachmentUrl?: string | null;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'SYSTEM';
  postId?: number;
  postTitle?: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
}

export interface SendMessageRequest {
  receiverId: number;
  content: string;
}

export const messageService = {
  /**
   * Get all conversations for current user
   */
  getConversations: async (): Promise<ConversationResponse[]> => {
    const response = await api.get<ApiResponse<ConversationResponse[]>>('/v1/messages/conversations');
    return response.data.data!;
  },

  /**
   * Get messages with a user
   */
  getMessages: async (otherUserId: number, page: number = 0, size: number = 50): Promise<MessageResponse[]> => {
    const response = await api.get<ApiResponse<MessageResponse[]>>(`/v1/messages/conversations/${otherUserId}/messages`, {
      params: { page, size },
    });
    return response.data.data!;
  },

  /**
   * Get or create conversation with user
   */
  getOrCreateConversation: async (otherUserId: number): Promise<ConversationResponse> => {
    const response = await api.get<ApiResponse<ConversationResponse>>(`/v1/messages/conversations/${otherUserId}`);
    return response.data.data!;
  },

  /**
   * Send a message
   */
  sendMessage: async (data: SendMessageRequest): Promise<MessageResponse> => {
    const response = await api.post<ApiResponse<MessageResponse>>('/v1/messages', data);
    return response.data.data!;
  },

  /**
   * Mark message as read
   */
  markAsRead: async (conversationId: number): Promise<void> => {
    await api.put(`/v1/messages/conversations/${conversationId}/read`);
  },

  /**
   * Mark all messages as read
   */
  markAllAsRead: async (): Promise<void> => {
    await api.put('/v1/messages/read-all');
  },

  /**
   * Get unread conversation count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/v1/messages/unread-count');
    return response.data.data?.count || 0;
  },
};

export default messageService;
