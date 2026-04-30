import React, { useState } from 'react';
import { X, AlertTriangle, Loader2, Camera, Trash2, Image as ImageIcon } from 'lucide-react';
import reportService from '../../services/reportService';
import mediaService from '../../services/mediaService';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;

    try {
      setLoading(true);
      
      let finalEvidenceUrl = undefined;
      
      // 1. Upload file if selected
      if (selectedFile) {
        setUploading(true);
        try {
          const mediaResponse = await mediaService.uploadFile(selectedFile, 'REPORT');
          finalEvidenceUrl = mediaResponse.fileUrl;
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          alert('Không thể tải ảnh lên. Vui lòng thử lại hoặc gửi báo cáo không kèm ảnh.');
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      // 2. Submit report
      await reportService.createReport({
        targetId: parseInt(roomId),
        targetType: 'POST',
        reason,
        description,
        evidenceUrls: finalEvidenceUrl ? [finalEvidenceUrl] : undefined
      });

      alert('Báo cáo của bạn đã được gửi thành công! Chúng tôi sẽ xem xét trong thời gian sớm nhất.');
      onClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh không được vượt quá 5MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bằng chứng hình ảnh (Tùy chọn)
            </label>
            
            {previewUrl ? (
              <div className="relative inline-block group">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full max-h-48 object-cover rounded-lg border-2 border-red-100"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Bấm để tải ảnh bằng chứng (Tối đa 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
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
              disabled={loading || uploading}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(loading || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading ? 'Đang tải ảnh...' : loading ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
