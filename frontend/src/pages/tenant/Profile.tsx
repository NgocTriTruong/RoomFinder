import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Loader2 } from 'lucide-react';
import userService from '../../services/userService';
import { UserResponse } from '../../types';
import { getErrorMessage } from '../../services/api';
import { createAvatarPlaceholder } from '../../utils/localImage';

export default function Profile() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    bio: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setUser(data);
        setFormData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          address: data.address || '',
          bio: data.bio || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cá nhân:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const avatarUrl = await userService.uploadAvatar(file);
      setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 h-32 relative"></div>
        <div className="px-6 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-8 gap-4">
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg overflow-hidden">
                <img 
                  src={user?.avatar || createAvatarPlaceholder(user?.fullName || 'User', 128)} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-5 h-5 text-gray-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={saving} />
              </label>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-gray-500 font-medium">{user?.role === 'LANDLORD' ? 'Chủ trọ' : 'Người thuê'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" /> Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-gray-50 border-gray-200 rounded-lg text-gray-500 p-2.5 border cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Giới thiệu bản thân</label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border resize-none"
                placeholder="Viết một vài dòng giới thiệu về bạn..."
              ></textarea>
            </div>

            <div className="md:col-span-2 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
