import React, { useEffect, useState } from 'react';
import { Users, Eye, MessageCircle, TrendingUp, Loader2 } from 'lucide-react';
import { postService } from '../../services/postService';
import type { LandlordDashboardStats } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<LandlordDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await postService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan</h2>
        <p className="text-gray-600 mt-1">Chào mừng bạn trở lại, {user?.fullName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng tin đăng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalPosts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-blue-600 font-medium">{stats?.activePosts || 0}</span>
            <span className="text-gray-500 ml-2">tin đang hoạt động</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lượt xem tin</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalViews?.toLocaleString() || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Tổng lượt truy cập tất cả các tin
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lịch hẹn mới</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.pendingBookings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-purple-600 font-medium">Chờ xác nhận</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalBookings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Các lịch đã ghi nhận
          </div>
        </div>
      </div>

      {/* Activity visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Biểu đồ hoạt động 7 ngày qua</h3>
        <div className="h-64 flex items-end justify-around gap-2 px-4 pb-4">
          {stats?.recentActivity.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div 
                className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-200 transition-all duration-300"
                style={{ 
                  height: `${Math.max(5, (day.views / (Math.max(...stats.recentActivity.map(d => d.views)) || 1)) * 100)}%` 
                }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {day.views} lượt xem
                </div>
              </div>
              <span className="text-[10px] text-gray-400 rotate-45 sm:rotate-0 mt-2">
                {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
