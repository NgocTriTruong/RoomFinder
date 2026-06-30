import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  MessageCircle, 
  Settings, 
  LogOut,
  Bell,
  User,
  Check,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { NotificationResponse } from '../../services/notificationService';
import { createAvatarPlaceholder } from '../../utils/localImage';
import { getErrorMessage } from '../../services/api';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../contexts/AuthContext';

export default function TenantLayout() {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/tenant/profile', icon: <User className="w-5 h-5" />, label: 'Thông tin cá nhân' },
    { path: '/tenant/saved', icon: <Heart className="w-5 h-5" />, label: 'Phòng đã lưu' },
    { path: '/tenant/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Lịch hẹn của tôi' },
    { path: '/tenant/messages', icon: <MessageCircle className="w-5 h-5" />, label: 'Tin nhắn' },
    { path: '/tenant/settings', icon: <Settings className="w-5 h-5" />, label: 'Cài đặt tài khoản' },
    { path: '/tenant/verification', icon: <ShieldCheck className="w-5 h-5" />, label: 'Xác thực tài khoản' },
  ];

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="RoomFinder Logo" className="h-[40px] w-auto object-contain rounded-md" />
            <span className="text-xl font-bold text-gray-900">RoomFinder</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen pb-16 md:pb-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800">Không gian người thuê</h1>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <div 
                onClick={() => navigate('/tenant/profile')}
                className="flex items-center gap-2 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <img 
                  src={currentUser?.avatar || createAvatarPlaceholder(currentUser?.fullName || 'User', 100)} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentUser?.fullName || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center z-20 pb-safe">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 px-2 w-full ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
