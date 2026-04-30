import React, { useEffect, useState, useMemo } from 'react';
import { Users, Eye, MessageCircle, TrendingUp, Loader2, CreditCard, BarChart3, Star, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { postService } from '../../services/postService';
import type { LandlordDashboardStats } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function LandlordDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<LandlordDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'views' | 'cost'>('views');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await postService.getDashboardStats();
        console.log('Dashboard Stats Data:', data);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const chartData = useMemo(() => {
    if (!stats?.recentActivity) return [];
    return stats.recentActivity.map(day => ({
      name: new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' }),
      value: chartType === 'views' ? day.views : day.serviceCost,
      originalDate: day.date
    }));
  }, [stats, chartType]);

  const formatValue = (val: number) => {
    if (chartType === 'cost') {
      return formatCurrency(val);
    }
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tổng quan</h2>
          <p className="text-gray-600 mt-1">Chào mừng bạn trở lại, {user?.fullName}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Dữ liệu thời gian thực
        </div>
      </div>

      {/* Stats Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Chi phí dịch vụ</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats?.totalServiceCost || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-400 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lượt xem tin</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalViews?.toLocaleString() || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Từ {stats?.activePosts || 0} bài đăng đang hoạt động
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lượt liên hệ khách</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalContacts?.toLocaleString() || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Gọi điện & Nhắn tin
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lịch hẹn mới</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.pendingBookings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-purple-600 font-medium">{stats?.totalBookings || 0}</span>
            <span className="text-gray-400 ml-1">tổng số lịch hẹn</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Hoạt động 7 ngày qua</h3>
            <select 
              className="text-sm border-gray-200 rounded-lg focus:ring-blue-500"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'views' | 'cost')}
            >
              <option value="views">Lượt xem</option>
              <option value="cost">Chi phí</option>
            </select>
          </div>
          <div className="h-72 w-full mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} minWidth={0}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => chartType === 'cost' ? `${val / 1000}k` : val}
                    width={40}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px',
                      fontSize: '12px'
                    }}
                    formatter={(val: number) => [formatValue(val), chartType === 'views' ? 'Lượt xem' : 'Chi phí']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={chartType === 'views' ? '#3b82f6' : '#f59e0b'} 
                    radius={[4, 4, 0, 0]} 
                    barSize={32}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartType === 'views' ? '#3b82f6' : '#f59e0b'}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">Chưa có dữ liệu hoạt động</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tin đăng hiệu quả nhất</h3>
          <div className="space-y-4">
            {stats?.topPosts && stats.topPosts.length > 0 ? (
              stats.topPosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/landlord/room-preview/${post.id}`)}
                  className="group p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600">{post.title}</h4>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.contacts}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {post.bookings} booking
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm">
                Chưa có dữ liệu bài đăng
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/landlord/posts')}
            className="w-full mt-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            Xem tất cả bài đăng
          </button>
        </div>
      </div>
    </div>
  );
}
