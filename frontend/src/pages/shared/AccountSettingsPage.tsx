import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Mọi hoạt động của bạn sẽ bị tạm dừng.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await userService.deactivateAccount();
      // Clear all local auth data forcefully
      localStorage.clear(); 
      alert('Tài khoản của bạn đã được vô hiệu hóa. Bạn sẽ được đăng xuất ngay lập tức.');
      window.location.replace('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi vô hiệu hóa tài khoản.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
        <p className="text-gray-500 mt-1">Quản lý bảo mật và các tùy chọn tài khoản của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Settings Navigation */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-all border border-blue-100">
            <Shield className="w-5 h-5" />
            Bảo mật & Mật khẩu
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all">
            <Bell className="w-5 h-5" />
            Thông báo ứng dụng
          </button>
        </div>

        {/* Right - Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Thay đổi mật khẩu
              </h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
              {success && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm flex items-center gap-3 rounded-r-lg animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {success}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-r-lg animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword.current ? 'text' : 'password'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword.new ? 'text' : 'password'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword.confirm ? 'text' : 'password'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>

          {/* Account Deactivation Section */}
          <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
            <h3 className="font-bold text-red-900 mb-2">Vô hiệu hóa tài khoản</h3>
            <p className="text-sm text-red-700 mb-6">Việc này sẽ tạm dừng mọi hoạt động của bạn trên hệ thống. Bạn có thể kích hoạt lại bất cứ lúc nào.</p>
            <button 
              onClick={handleDeactivate}
              disabled={loading}
              className="px-6 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50"
            >
              Vô hiệu hóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
