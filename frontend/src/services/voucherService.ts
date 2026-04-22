import api from './api';
import { ApiResponse, VoucherResponse } from '../types/index';

export type Voucher = VoucherResponse;

export interface CreateVoucherRequest {
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  totalQuantity?: number;
  maxPerUser?: number;
  validFrom?: string;
  expiresAt?: string;
  isActive?: boolean;
  isPublic?: boolean;
  isFeatured?: boolean;
  applicableTypes?: string;
}

const voucherService = {
  getAllVouchers: async (): Promise<Voucher[]> => {
    const response = await api.get<ApiResponse<Voucher[]>>('/v1/vouchers/admin/all');
    return response.data.data || [];
  },

  getAvailableVouchers: async (): Promise<Voucher[]> => {
    const response = await api.get<ApiResponse<Voucher[]>>('/v1/vouchers/available');
    return response.data.data || [];
  },

  createVoucher: async (data: CreateVoucherRequest): Promise<Voucher> => {
    const response = await api.post<ApiResponse<Voucher>>('/v1/vouchers/admin', data);
    return response.data.data!;
  },

  updateVoucher: async (id: number, data: CreateVoucherRequest): Promise<Voucher> => {
    const response = await api.put<ApiResponse<Voucher>>(`/v1/vouchers/admin/${id}`, data);
    return response.data.data!;
  },

  deleteVoucher: async (id: number): Promise<void> => {
    await api.delete(`/v1/vouchers/admin/${id}`);
  },

  validateVoucher: async (code: string, amount: number): Promise<any> => {
    const response = await api.get('/v1/vouchers/validate', {
      params: { code, orderAmount: amount }
    });
    return response.data.data;
  }
};

export default voucherService;
