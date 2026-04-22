import React, { useEffect, useState } from 'react';
import { Calendar, Phone, User, Home, Check, X, Loader2 } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { BookingResponse } from '../../types';

export default function LandlordBookingPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const data = await bookingService.getLandlordBookings(startDate, endDate);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    setActionLoading(id);
    try {
      await bookingService.confirmBooking(id);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CONFIRMED' } : b));
    } catch (error) {
      alert('Xác nhận thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối lịch hẹn này?')) return;
    
    setActionLoading(id);
    try {
      await bookingService.cancelBooking(id, 'Từ chối bởi chủ nhà');
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (error) {
      alert('Từ chối thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Đã xác nhận</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Chờ xác nhận</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Đã hủy</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Đã hoàn thành</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h2>
        <p className="text-gray-600 mt-1">Danh sách khách hàng hẹn xem phòng</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">Chưa có lịch hẹn nào cho tháng này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.user.fullName}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-0.5">
                      <Phone className="w-3 h-3 mr-1" />
                      {booking.user.phone || 'Chưa cung cấp'}
                    </div>
                  </div>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="space-y-3 py-4 border-y border-gray-100">
                <div className="flex items-start">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 line-clamp-2">{booking.post.title}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-700">
                    {new Date(booking.bookingTime).toLocaleString('vi-VN', { 
                      day: '2-digit', month: '2-digit', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {booking.status === 'PENDING' ? (
                  <>
                    <button 
                      onClick={() => handleConfirm(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                      Xác nhận
                    </button>
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                      Từ chối
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors">
                    Xem chi tiết
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
