import React, { useEffect, useState } from 'react';
import { Calendar, Phone, User, Home, Check, X, Loader2, Clock, History, AlertCircle, Ban } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { BookingResponse } from '../../types';

type BookingTab = 'PENDING' | 'UPCOMING' | 'HISTORY';

export default function LandlordBookingPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<BookingTab>('PENDING');
  const [editingBooking, setEditingBooking] = useState<BookingResponse | null>(null);
  const [editDateTime, setEditDateTime] = useState('');
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAllLandlordBookings();
      console.log('Landlord Bookings Data:', data);
      setBookings(data || []);
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
      fetchBookings();
    } catch (error) {
      alert('Xác nhận thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: number) => {
    const reason = window.prompt('Nhập lý do từ chối/hủy:');
    if (reason === null) return;
    
    setActionLoading(id);
    try {
      await bookingService.cancelBooking(id, reason || 'Từ chối bởi chủ nhà');
      fetchBookings();
    } catch (error) {
      alert('Hủy thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: number) => {
    if (!window.confirm('Xác nhận lịch hẹn đã hoàn thành?')) return;
    
    setActionLoading(id);
    try {
      await bookingService.completeBooking(id, 'Đã xem phòng');
      fetchBookings();
    } catch (error) {
      alert('Thao tác thất bại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNoShow = async (id: number) => {
    const reason = prompt('Nhập lý do (ví dụ: khách không đến, chủ trọ bận đột xuất...):');
    if (reason === null) return;
    
    try {
      setActionLoading(id);
      await bookingService.markNoShow(id, reason || 'Không thực hiện được cuộc hẹn');
      fetchBookings();
    } catch (error) {
      alert('Thao tác thất bại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (booking: BookingResponse) => {
    setEditingBooking(booking);
    setEditDateTime(booking.bookingTime.substring(0, 16)); // Format for datetime-local input
    setEditNote(booking.note || '');
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;
    
    try {
      setActionLoading(editingBooking.id);
      await bookingService.updateBooking(editingBooking.id, {
        bookingTime: editDateTime,
        note: editNote
      });
      setEditingBooking(null);
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại thời gian (phải trước ít nhất 2 tiếng).');
    } finally {
      setActionLoading(null);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    switch (activeTab) {
      case 'PENDING':
        return bookings.filter(b => b.status === 'PENDING');
      case 'UPCOMING':
        return bookings.filter(b => 
          b.status === 'CONFIRMED' && new Date(b.bookingTime) >= now
        );
      case 'HISTORY':
        return bookings.filter(b => 
          ['COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'].includes(b.status) ||
          (b.status === 'CONFIRMED' && new Date(b.bookingTime) < now)
        );
      default:
        return bookings;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
            <Check className="w-3.5 h-3.5" />
            Đã xác nhận
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Chờ xác nhận
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200">
            <X className="w-3.5 h-3.5" />
            Đã hủy
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
            <Check className="w-3.5 h-3.5" />
            Đã hoàn thành
          </div>
        );
      case 'NO_SHOW':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
            <Ban className="w-3.5 h-3.5" />
            Hủy / Vắng mặt
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
            <Ban className="w-3.5 h-3.5" />
            Đã từ chối
          </div>
        );
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-200">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải danh sách lịch hẹn...</p>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h2>
          <p className="text-gray-600 mt-1">Quản lý các yêu cầu xem phòng từ khách hàng</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <History className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl w-full max-w-2xl">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex-[1.2] flex items-center justify-center gap-3 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'PENDING' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="whitespace-nowrap">Đang chờ xác nhận</span>
          {bookings.filter(b => b.status === 'PENDING').length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-black">
              {bookings.filter(b => b.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'UPCOMING' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="whitespace-nowrap">Lịch hẹn sắp tới</span>
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-[0.8] flex items-center justify-center gap-3 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'HISTORY' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span className="whitespace-nowrap">Lịch sử</span>
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Calendar className="w-8 h-8" />
          </div>
          <p className="text-gray-500 font-medium">Không có lịch hẹn nào trong mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={booking.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user.fullName)}&background=random`} 
                      alt={booking.user.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-50"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.user.fullName}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-1" />
                        {booking.user.phone || 'Chưa có SĐT'}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="space-y-3 py-4 border-y border-gray-50">
                  <div className="flex items-start">
                    <Home className="w-4 h-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium leading-relaxed">{booking.post?.title || 'Tin đăng đã bị xóa'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm font-bold text-blue-700">
                      {new Date(booking.bookingTime).toLocaleString('vi-VN', { 
                        weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {booking.note && (
                    <div className="flex items-start p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                      <AlertCircle className="w-3.5 h-3.5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p>"{booking.note}"</p>
                    </div>
                  )}
                  {booking.landlordNote && (
                    <div className={`mt-3 p-4 rounded-xl border ${
                      booking.status === 'CANCELLED' || booking.status === 'REJECTED' 
                        ? 'bg-red-50 border-red-100' 
                        : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className={`w-4 h-4 ${
                          booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'text-red-500' : 'text-slate-400'
                        }`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${
                          booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          Lý do kết thúc
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${
                        booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'text-red-700' : 'text-slate-600'
                      }`}>
                        {booking.landlordNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                {booking.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleEditClick(booking)}
                      className="px-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleConfirm(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />}
                      Xác nhận
                    </button>
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1.5" />}
                      Từ chối
                    </button>
                  </>
                )}
                {booking.status === 'CONFIRMED' && (
                  <>
                    <button 
                      onClick={() => handleEditClick(booking)}
                      className="px-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleComplete(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Hoàn thành
                    </button>
                    <button 
                      onClick={() => handleNoShow(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4 mr-1.5" />
                      Hủy/Vắng mặt
                    </button>
                  </>
                )}
                {['COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'].includes(booking.status) && (
                  <div className="w-full flex items-center justify-center h-10 text-xs font-medium text-gray-400 italic">
                    Lịch hẹn đã kết thúc
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa lịch hẹn</h3>
              <button onClick={() => setEditingBooking(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian hẹn mới</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={editDateTime}
                  onChange={(e) => setEditDateTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú / Thay đổi</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
                  placeholder="Lý do thay đổi lịch hoặc lời nhắn gửi khách..."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setEditingBooking(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={actionLoading !== null}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {actionLoading !== null ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
