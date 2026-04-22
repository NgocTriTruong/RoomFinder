import api from './api';
import type { ApiResponse, BookingResponse } from '@/types';

export interface CreateBookingRequest {
  postId: number;
  bookingTime: string;
  guestCount: number;
  note?: string;
  voucherCode?: string;
}

export const bookingService = {
  /**
   * Create a new booking/appointment
   */
  createBooking: async (data: CreateBookingRequest): Promise<BookingResponse> => {
    const response = await api.post<ApiResponse<BookingResponse>>('/v1/bookings', data);
    return response.data.data!;
  },

  /**
   * Get current tenant's bookings
   */
  getTenantBookings: async (): Promise<BookingResponse[]> => {
    const response = await api.get<ApiResponse<BookingResponse[]>>('/v1/bookings');
    return response.data.data!;
  },

  /**
   * Get landlord's bookings (Calendar view)
   */
  getLandlordBookings: async (startDate: string, endDate: string): Promise<BookingResponse[]> => {
    const response = await api.get<ApiResponse<BookingResponse[]>>('/v1/bookings/calendar', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },

  /**
   * Confirm booking (landlord)
   */
  confirmBooking: async (id: number | string): Promise<void> => {
    await api.put(`/v1/bookings/${id}/confirm`);
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id: number | string, reason?: string): Promise<void> => {
    await api.put(`/v1/bookings/${id}/cancel`, { reason });
  },

  /**
   * Complete booking (landlord)
   */
  completeBooking: async (id: number | string, note?: string): Promise<void> => {
    await api.put(`/v1/bookings/${id}/complete`, { note });
  },

  /**
   * Mark as no-show (landlord)
   */
  markNoShow: async (id: number | string, reason?: string): Promise<void> => {
    await api.put(`/v1/bookings/${id}/no-show`, { reason });
  },

  /**
   * Get booking details
   */
  getBookingById: async (id: number | string): Promise<BookingResponse> => {
    const response = await api.get<ApiResponse<BookingResponse>>(`/v1/bookings/${id}`);
    return response.data.data!;
  },
};

export default bookingService;
