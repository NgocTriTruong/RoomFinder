import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationDropdown() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    isLoadingMore, 
    hasMore, 
    setNotifications, 
    setUnreadCount,
    loadMore 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ... Bell Button ... */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 rounded-full"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Thông báo</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Đọc tất cả
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="p-10 flex justify-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                      onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-gray-900 line-clamp-1">{n.title}</span>
                        {!n.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>}
                      </div>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{n.content}</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))}
                  
                  {isLoadingMore && (
                    <div className="p-4 flex justify-center bg-gray-50/50">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 italic text-sm">
                  Bạn chưa có thông báo nào.
                </div>
              )}
            </div>

            {/* Footer */}
            {hasMore && notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
                <button 
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold disabled:opacity-50"
                >
                  {isLoadingMore ? 'Đang tải...' : 'Xem thêm thông báo cũ'}
                </button>
              </div>
            )}
          </div>
      )}
    </div>
  );
}
