import api from './api';
import type { ApiResponse, PaginatedData } from '@/types';

export interface CreateReportRequest {
  targetId: number;
  targetType: 'POST' | 'USER' | 'REVIEW';
  type: 'SPAM' | 'FAKE_POST' | 'INAPPROPRIATE' | 'HARASSMENT' | 'FRAUD' | 'OTHER';
  reason: string;
  description?: string;
  evidenceUrl?: string;
  postId?: number;
  bookingId?: number;
}

export interface ReportResponse {
  id: number;
  reporterId: number;
  reporterName: string;
  targetId: number;
  targetType: string;
  type: string;
  reason: string;
  description?: string | null;
  evidenceUrl?: string | null;
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'DISMISSED';
  handledBy?: number | null;
  handledByName?: string | null;
  handledAt?: string | null;
  handledNote?: string | null;
  actionTaken?: string | null;
  postId?: number | null;
  bookingId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminReportQuery {
  page?: number;
  size?: number;
}

export const reportService = {
  /**
   * Create a new report
   */
  createReport: async (data: CreateReportRequest): Promise<ReportResponse> => {
    const response = await api.post<ApiResponse<ReportResponse>>('/v1/reports', data);
    return response.data.data!;
  },

  /**
   * Get reports submitted by current user
   */
  getMyReports: async (): Promise<ReportResponse[]> => {
    const response = await api.get<ApiResponse<ReportResponse[]>>('/v1/reports/my-reports');
    return response.data.data!;
  },

  /**
   * Resolve a report (Admin only)
   */
  resolveReport: async (id: number | string, action: string, note: string): Promise<ReportResponse> => {
    const response = await api.put<ApiResponse<ReportResponse>>(`/v1/reports/${id}/resolve`, { action, note });
    return response.data.data!;
  },

  /**
   * Dismiss a report (Admin only)
   */
  dismissReport: async (id: number | string, note: string): Promise<ReportResponse> => {
    const response = await api.put<ApiResponse<ReportResponse>>(`/v1/reports/${id}/dismiss`, { note });
    return response.data.data!;
  },

  /**
   * Get pending reports for admin
   */
  getPendingReports: async (params: AdminReportQuery = {}): Promise<ReportResponse[]> => {
    const response = await api.get<ApiResponse<ReportResponse[]>>('/v1/reports/admin/pending', { params });
    return response.data.data || [];
  },

  /**
   * Get all reports for admin
   */
  getAllReports: async (params: AdminReportQuery = {}): Promise<ReportResponse[]> => {
    const response = await api.get<ApiResponse<ReportResponse[]>>('/v1/reports/admin/all', { params });
    return response.data.data || [];
  },
};

export default reportService;
