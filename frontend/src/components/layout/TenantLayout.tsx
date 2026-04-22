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
  Loader2
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { NotificationResponse } from '../../services/notificationService';
import { createAvatarPlaceholder } from '../../utils/localImage';
import { authStorage } from '../../services/authService';
import { getErrorMessage } from '../../services/api';

export default function TenantLayout() {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const currentUser = authStorage.getUser();

  const menuItems = [
    { path: '/tenant/saved', icon: <Heart className="w-5 h-5" />, label: 'Phòng đã lưu' },
    { path: '/tenant/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Lịch hẹn của tôi' },
    { path: '/tenant/messages', icon: <MessageCircle className="w-5 h-5" />, label: 'Tin nhắn' },
    { path: '/tenant/settings', icon: <Settings className="w-5 h-5" />, label: 'Cài đặt tài khoản' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isNotifOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isNotifOpen]);

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const data = await notificationService.getNotifications(0, 20);
      setNotifications(data.content);
    } catch (error) {
      console.error('Failed to fetch notifications:', getErrorMessage(error));
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', getErrorMessage(error));
    }
  };

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
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Tenant</span>
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
            onClick={() => navigate('/login')}
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
              {/* Notification Dropdown */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors bg-gray-50 rounded-full"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">Thông báo</h3>
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Đánh dấu đã đọc
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifs ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          Không có thông báo nào
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                                {notif.title}
                              </h4>
                              {!notif.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{notif.message}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{formatNotificationTime(notif.createdAt)}</span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-gray-100">
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pl-4 border-l border-gray-200 cursor-pointer">
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
