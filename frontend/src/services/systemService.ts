import api from './api';
import type { ApiResponse } from '@/types';

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  group: string;
  description: string;
  type: 'text' | 'number' | 'checkbox' | 'email';
}

export const systemService = {
  /**
   * Lấy toàn bộ cấu hình hệ thống
   */
  getSettings: async (): Promise<SystemSetting[]> => {
    const response = await api.get<ApiResponse<SystemSetting[]>>('/v1/system/settings');
    return response.data.data!;
  },

  /**
   * Cập nhật nhiều cấu hình cùng lúc
   * @param settings Map key-value các cấu hình cần cập nhật
   */
  updateSettings: async (settings: Record<string, string>): Promise<void> => {
    await api.put<ApiResponse<void>>('/v1/system/settings', settings);
  }
};

export default systemService;
