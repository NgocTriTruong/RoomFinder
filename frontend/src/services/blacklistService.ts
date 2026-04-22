import api from './api';
import { ApiResponse } from '../types/index';

export interface BlacklistEntry {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  reason: string;
  type: string;
  isPermanent: boolean;
  expiresAt?: string;
  addedBy: number;
  addedByName: string;
  addedAt: string;
  removedBy?: number;
  removedByName?: string;
  removedAt?: string;
  removalReason?: string;
  isActive: boolean;
}

export interface CreateBlacklistRequest {
  userId: number;
  reason: string;
  type: string; // PERMANENT, TEMPORARY
  days?: number;
}

const blacklistService = {
  getAllBlacklist: async (): Promise<BlacklistEntry[]> => {
    const response = await api.get<ApiResponse<BlacklistEntry[]>>('/v1/blacklist');
    return response.data.data || [];
  },

  addToBlacklist: async (data: CreateBlacklistRequest): Promise<BlacklistEntry> => {
    const response = await api.post<ApiResponse<BlacklistEntry>>('/v1/blacklist', data);
    return response.data.data!;
  },

  removeFromBlacklist: async (id: number, reason: string): Promise<BlacklistEntry> => {
    const response = await api.delete<ApiResponse<BlacklistEntry>>(`/v1/blacklist/${id}`, { data: { reason } });
    return response.data.data!;
  },

  checkBlacklist: async (userId: number): Promise<boolean> => {
    const response = await api.get<ApiResponse<{ isBlacklisted: boolean }>>(`/v1/blacklist/check/${userId}`);
    return response.data.data?.isBlacklisted || false;
  },

  getStats: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/v1/blacklist/stats');
    return response.data.data;
  }
};

export default blacklistService;
