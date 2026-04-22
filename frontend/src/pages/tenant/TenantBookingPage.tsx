import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import type { BookingResponse } from '../../types';
import { Calendar, User, Home, Star, XCircle, Loader2, AlertCircle } from 'lucide-react';
import ReviewModal from '../../components/ui/ReviewModal';
import { getErrorMessage } from '../../services/api';

export default function TenantBookingPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getTenantBookings();
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;
    
    setCancelling(bookingId.toString());
    try {
      await bookingService.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      alert('Không thể hủy lịch hẹn: ' + getErrorMessage(err));
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Đã xác nhận</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Chờ duyệt</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Đã xem</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Đã hủy</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">Bị từ chối</span>;
      default:
        return null;
    }
  };

  const getStatusForReview = (status: string): 'viewed' | 'pending' | 'confirmed' => {
    if (status === 'COMPLETED') return 'viewed';
    if (status === 'CONFIRMED') return 'confirmed';
    return 'pending';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpenReview = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h2>
        <p className="text-gray-600 mt-1">Quản lý các lịch hẹn xem phòng của bạn</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
          <p className="text-gray-500">Hãy đặt lịch xem phòng để quản lý tại đây.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="w-full md:w-48 h-32 flex-shrink-0">
                <img 
                  src={booking.post.images[0] || 'https://via.placeholder.com/200x150?text=No+Image'} 
                  alt={booking.post.title} 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 md:pr-4">
                      {booking.post.title}
                    </h3>
                    <div className="hidden md:block">{getStatusBadge(booking.status)}</div>
                  </div>
                  
                  <div className="md:hidden mb-3">{getStatusBadge(booking.status)}</div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium text-gray-900">{formatDateTime(booking.bookingTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Chủ trọ: <span className="font-medium text-gray-900">{booking.landlord.fullName}</span></span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{booking.post.room.address}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelling === booking.id.toString()}
                      className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancelling === booking.id.toString() ? (
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1.5" />
                      )}
                      Hủy lịch hẹn
                    </button>
                  )}
                  
                  {booking.status === 'COMPLETED' && (
                    <button 
                      onClick={() => handleOpenReview(booking)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-sm"
                    >
                      <Star className="w-4 h-4 mr-1.5" />
                      Viết đánh giá
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        booking={selectedBooking ? {
          id: selectedBooking.id.toString(),
          postId: selectedBooking.post.id,
          roomTitle: selectedBooking.post.title,
        } : null} 
      />
    </div>
  );
}
