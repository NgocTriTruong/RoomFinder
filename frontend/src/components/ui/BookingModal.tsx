import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, Loader2 } from 'lucide-react';
import bookingService from '../../services/bookingService';
import { getErrorMessage } from '../../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

export default function BookingModal({ isOpen, onClose, roomId }: BookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra ngày không được ở quá khứ
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      alert('Thời gian hẹn phải ở tương lai!');
      return;
    }

    // Kiểm tra phải hẹn trước ít nhất 2 tiếng (khớp với backend mặc định)
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (selectedDateTime < twoHoursLater) {
      alert('Bạn cần đặt lịch hẹn trước ít nhất 2 tiếng.');
      return;
    }

    try {
      setLoading(true);

      // Gửi thời gian dưới dạng chuỗi ISO hoặc định dạng mà Backend LocalDateTime hiểu (YYYY-MM-DDTHH:mm:ss)
      // Sử dụng toISOString() nhưng cần cẩn thận vì nó chuyển về UTC. 
      // Backend của chúng ta dùng LocalDateTime nên tốt nhất là gửi chuỗi gốc "YYYY-MM-DDTHH:mm:ss" 
      // để khớp với múi giờ đã nhập ở Frontend.
      const bookingTime = `${date}T${time}:00`;

      await bookingService.createBooking({
        postId: parseInt(roomId),
        bookingTime,
        guestCount: 1,
        note
      });

      alert('Yêu cầu đặt lịch của bạn đã được gửi thành công!');
      onClose();
      // Reload page to see new booking in list if we are on the bookings page
      if (window.location.pathname.includes('/bookings')) {
        window.location.reload();
      }
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Đặt lịch xem phòng</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" /> Ngày hẹn
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" /> Giờ hẹn
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-600" /> Ghi chú (Tùy chọn)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Tôi muốn xem phòng vào buổi chiều..."
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
