import api from './api';
import type { ApiResponse, PaginatedData } from '@/types';

export interface TransactionResponse {
  id: string;
  type: 'PACKAGE' | 'BOOST' | 'POST' | 'REFUND';
  serviceName: string;
  amount: number;
  paymentMethod: 'VNPAY' | 'MOMO' | 'WALLET' | 'BANK_TRANSFER';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  transactionRef: string;
  description: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface PaymentApiResponse {
  id: number;
  orderId: string;
  orderType: string;
  orderDescription: string | null;
  amount: number;
  paymentMethod: string;
  paymentUrl: string | null;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  createdAt: string;
}

const mapOrderType = (orderType: string): TransactionResponse['type'] => {
  switch (orderType) {
    case 'PACKAGE_PURCHASE':
      return 'PACKAGE';
    case 'BOOST_PURCHASE':
      return 'BOOST';
    case 'POST_PURCHASE':
      return 'POST';
    case 'REFUND':
      return 'REFUND';
    default:
      return 'PACKAGE';
  }
};

const mapPayment = (payment: PaymentApiResponse): TransactionResponse => ({
  id: String(payment.id),
  type: mapOrderType(payment.orderType),
  serviceName: payment.orderDescription || payment.orderType,
  amount: payment.amount,
  paymentMethod: (payment.paymentMethod || 'VNPAY') as TransactionResponse['paymentMethod'],
  status: payment.status,
  transactionRef: payment.orderId,
  description: payment.orderDescription,
  createdAt: payment.createdAt,
  completedAt: payment.paidAt,
});

const transactionService = {
  getTransactions: async (page: number = 0, size: number = 20): Promise<PaginatedData<TransactionResponse>> => {
    const response = await api.get<ApiResponse<PaymentApiResponse[]>>('/v1/payments/history');
    const items = (response.data?.data || []).map(mapPayment);
    const start = page * size;
    const content = items.slice(start, start + size);
    const totalElements = items.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));

    return {
      content,
      number: page,
      size,
      totalElements,
      totalPages,
      first: page === 0,
      last: start + size >= totalElements,
    } as PaginatedData<TransactionResponse>;
  },

  getTransactionById: async (id: string): Promise<TransactionResponse> => {
    const response = await api.get<ApiResponse<PaymentApiResponse>>(`/v1/payments/${id}`);
    return mapPayment(response.data.data!);
  },

  createSubscriptionPayment: async (
    packageId: number,
    paymentMethod: string,
    amount: number
  ): Promise<{ paymentUrl: string; transactionId: string }> => {
    const createResponse = await api.post<ApiResponse<PaymentApiResponse>>('/v1/payments/create-order', {
      amount,
      orderType: 'PACKAGE_PURCHASE',
      paymentMethod,
      packageId,
    });

    const payment = createResponse.data.data!;
    const paymentUrlResponse = await api.get<ApiResponse<string>>(`/v1/payments/${payment.id}/url`);

    return {
      paymentUrl: paymentUrlResponse.data.data || '',
      transactionId: String(payment.id),
    };
  },

  processVnpayReturn: async (queryString: string): Promise<TransactionResponse> => {
    const suffix = queryString.startsWith('?') ? queryString : `?${queryString}`;
    const response = await api.get<ApiResponse<PaymentApiResponse>>(`/v1/payments/vnpay/return${suffix}`);
    return mapPayment(response.data.data!);
  },

  getAllTransactionsForAdmin: async (page: number = 0, size: number = 20): Promise<PaginatedData<TransactionResponse>> => {
    try {
      const response = await api.get<ApiResponse<PaymentApiResponse[]>>('/v1/payments/admin/all');
      const items = (response.data?.data || []).map(mapPayment);

      // Sort by date descending
      items.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      const start = page * size;
      const content = items.slice(start, start + size);
      const totalElements = items.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));

      return {
        content,
        number: page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: start + size >= totalElements,
      } as PaginatedData<TransactionResponse>;
    } catch (e) {
      console.error('Error fetching admin transactions:', e);
      return {
        content: [],
        number: page,
        size,
        totalElements: 0,
        totalPages: 1,
        first: true,
        last: true,
      };
    }
  },
};

export default transactionService;
export { transactionService };

