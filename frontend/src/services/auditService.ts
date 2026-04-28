import api from './api';
import type { ApiResponse, PaginatedData, UserResponse } from '@/types';

export interface AuditLogResponse {
  id: number;
  admin: UserResponse;
  action: string;
  actionDisplayName: string;
  targetType: string;
  targetTypeDisplayName: string;
  targetId: number | null;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata: string | null;
  createdAt: string;
}

export interface AuditLogQuery {
  adminId?: number;
  action?: string;
  target?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const auditService = {
  /**
   * Get audit logs for admin
   */
  getLogs: async (params: AuditLogQuery = {}): Promise<PaginatedData<AuditLogResponse>> => {
    const response = await api.get<ApiResponse<PaginatedData<AuditLogResponse>>>('/v1/audit-logs', {
      params,
    });
    return response.data.data!;
  },
};

export default auditService;
