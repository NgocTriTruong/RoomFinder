import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, User as UserIcon, Phone, Mail, MapPin, GraduationCap, Info, Calendar } from 'lucide-react';
import userService from '../../services/userService';
import { getErrorMessage } from '../../services/api';
import type { UserResponse } from '@/types';

interface UpdateUserModalProps {
  user: UserResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateUserModal({ user, onClose, onSuccess }: UpdateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    bio: user.bio || '',
    address: user.address || '',
    dateOfBirth: user.dateOfBirth || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert empty strings to null for optional fields
      const submitData = {
        ...formData,
        phone: formData.phone.trim() || null,
        bio: formData.bio.trim() || null,
        address: formData.address.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
      };

      console.log('Sending update request for user', user.id, 'with data:', submitData);

      await userService.adminUpdateProfile(user.id, submitData);
      onSuccess();
      onClose();
    } catch (err: any) {
      const serverMessage = getErrorMessage(err);
      setError(serverMessage === 'An unexpected error occurred' 
        ? 'Máy chủ không phản hồi hoặc dữ liệu không hợp lệ. Vui lòng kiểm tra lại số điện thoại hoặc các thông tin khác.' 
        : serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa tài khoản</h3>
              <p className="text-xs text-gray-500 font-medium">ID: #{user.id} • {user.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700">
              <Info className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                placeholder="Nhập họ tên đầy đủ..."
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Số điện thoại
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                placeholder="0987xxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email (Không thể thay đổi)
              </label>
              <input
                disabled
                type="email"
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                value={user.email}
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Địa chỉ
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                placeholder="Số nhà, tên đường..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Ngày sinh
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            {/* Bio (Full width) */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Giới thiệu ngắn</label>
              <textarea
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900 resize-none h-24"
                placeholder="Mô tả về người dùng này..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Cập nhật thông tin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
