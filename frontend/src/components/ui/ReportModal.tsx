import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import reportService from '../../services/reportService';
import { getErrorMessage } from '../../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
}

export default function ReportModal({ isOpen, onClose, roomId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;

    try {
      setLoading(true);
      await reportService.createReport({
        targetId: parseInt(roomId),
        targetType: 'POST',
        reason,
        description
      });

      alert('Báo cáo của bạn đã được gửi thành công! Chúng tôi sẽ xem xét trong thời gian sớm nhất.');
      onClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const reasons = [
    'Tin giả / Không đúng thực tế',
    'Lừa đảo tiền cọc',
    'Môi giới trá hình',
    'Phòng đã cho thuê',
    'Khác'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">Báo cáo vi phạm</h3>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Lý do báo cáo
            </label>
            <div className="space-y-3">
              {reasons.map((r) => (
                <label key={r} className="flex items-center">
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value={r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết (Tùy chọn)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cung cấp thêm thông tin để chúng tôi xử lý nhanh hơn..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-3 border resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
