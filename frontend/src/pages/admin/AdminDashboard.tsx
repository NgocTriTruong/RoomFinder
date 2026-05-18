import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, FileText, UserPlus, AlertOctagon, Loader2, AlertCircle, 
  TrendingUp, TrendingDown, Users, CheckCircle2, XCircle, Clock 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { adminService } from '../../services/adminService';
import type { DashboardStats, ComprehensiveStats } from '../../services/adminService';
import { transactionService } from '../../services/transactionService';
import type { TransactionResponse } from '../../services/transactionService';
import { getErrorMessage } from '../../services/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [comprehensiveStats, setComprehensiveStats] = useState<ComprehensiveStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [compData, transactionsData] = await Promise.all([
        adminService.getComprehensiveStats('LAST_30_DAYS'),
        transactionService.getAllTransactionsForAdmin(0, 10),
      ]);
      setComprehensiveStats(compData);
      setRecentTransactions(transactionsData.content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const stats = comprehensiveStats?.overview;

  const revenueChartData = useMemo(() => {
    const dailyRevenue = comprehensiveStats?.revenue?.dailyRevenue;
    if (!dailyRevenue) return [];
    
    return Object.entries(dailyRevenue).map(([date, value]) => ({
      date: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue: value
    }));
  }, [comprehensiveStats]);

  const userRoleChartData = useMemo(() => {
    const roleBreakdown = comprehensiveStats?.users?.roleBreakdown;
    if (!roleBreakdown) return [];

    const mapping: Record<string, string> = {
      'USER': 'Người tìm trọ',
      'LANDLORD': 'Chủ trọ',
      'ADMIN': 'Quản trị viên'
    };
    return Object.entries(roleBreakdown).map(([role, count]) => ({
      name: mapping[role] || role,
      value: count
    }));
  }, [comprehensiveStats]);

  const ratios = useMemo(() => {
    if (!comprehensiveStats) return null;
    
    const b = comprehensiveStats.bookings || { totalBookings: 0, completedBookings: 0, cancelledBookings: 0 };
    const p = comprehensiveStats.posts || { totalViews: 0, totalFavorites: 0, totalPosts: 0 };
    const r = comprehensiveStats.reviews || { totalReviews: 0 };
    const tx = comprehensiveStats.revenue || { transactionCount: 0, successfulTransactions: 0 };

    // 1. Booking Success Rate = Completed / Total final bookings (completed + cancelled + no show)
    const completedB = b.completedBookings || 0;
    const cancelledB = b.cancelledBookings || 0;
    const finalBookingsCount = completedB + cancelledB;
    const bookingSuccessRate = finalBookingsCount > 0 
      ? Math.round((completedB / finalBookingsCount) * 100 * 10) / 10 
      : 0;

    // 2. Booking Cancellation Rate = Cancelled / Total final bookings
    const bookingCancelRate = finalBookingsCount > 0
      ? Math.round((cancelledB / finalBookingsCount) * 100 * 10) / 10
      : 0;

    // 3. Post Interaction Rate = Bookings / Views
    const totalViews = p.totalViews || 0;
    const totalBookings = b.totalBookings || 0;
    const postInteractionRate = totalViews > 0
      ? Math.round((totalBookings / totalViews) * 100 * 100) / 100
      : 0;

    // 4. Post Engagement (Favorite) Rate = Favorites / Views
    const totalFavorites = p.totalFavorites || 0;
    const postEngagementRate = totalViews > 0
      ? Math.round((totalFavorites / totalViews) * 100 * 100) / 100
      : 0;

    // 5. Transaction Success Rate = Success Transactions / Total Transactions
    const totalTransactions = tx.transactionCount || 0;
    const successfulTx = tx.successfulTransactions || 0;
    const transactionSuccessRate = totalTransactions > 0
      ? Math.round((successfulTx / totalTransactions) * 100 * 10) / 10
      : 0;

    // 6. Review Response Rate = Reviews / Completed Bookings
    const totalReviews = r.totalReviews || 0;
    const reviewResponseRate = completedB > 0
      ? Math.round((totalReviews / completedB) * 100 * 10) / 10
      : 0;

    return {
      bookingSuccessRate,
      bookingCancelRate,
      postInteractionRate,
      postEngagementRate,
      transactionSuccessRate,
      reviewResponseRate,
      raw: {
        finalBookingsCount,
        totalViews,
        totalBookings,
        totalFavorites,
        completedBookings: completedB,
        cancelledB,
        totalReviews,
        totalTransactions,
        successfulTx
      }
    };
  }, [comprehensiveStats]);

  const formatCurrency = (amount: number | undefined | null) => {
    const val = typeof amount === 'number' ? amount : 0;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const formatLastTime = (dateString: string) => {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tổng hợp dữ liệu hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tổng quan</h2>
          <p className="text-gray-500 font-medium mt-1">Chào mừng quay trở lại, đây là hoạt động mới nhất trong 30 ngày qua.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-sm font-bold text-gray-700 flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Hệ thống trực tuyến
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            {stats && stats.revenueGrowth !== 0 && (
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stats.revenueGrowth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stats.revenueGrowth > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(stats.revenueGrowth)}%
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {formatCurrency(stats?.totalRevenue ?? comprehensiveStats?.revenue?.totalRevenue)}
          </p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Từ các gói đăng ký & đẩy tin</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            {stats && stats.newPostsToday > 0 && (
              <div className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                +{stats.newPostsToday} hôm nay
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tin chờ duyệt</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.pendingPosts || 0}</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Cần xử lý trong danh sách duyệt</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            {stats && stats.userGrowth !== 0 && (
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stats.userGrowth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}%
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Người dùng</p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {stats ? new Intl.NumberFormat('vi-VN').format(stats.totalUsers) : '0'}
          </p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Chủ trọ & Người tìm phòng</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <AlertOctagon className="w-6 h-6" />
            </div>
            {stats && stats.pendingReports > 0 && (
              <div className="animate-pulse text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                Khẩn cấp
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Báo cáo vi phạm</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.pendingReports || 0}</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Báo cáo tin đăng không hợp lệ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart - Revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Doanh thu theo ngày</h3>
              <p className="text-sm text-gray-500">Biến động doanh thu trong 30 ngày gần nhất</p>
            </div>
            <div className="flex items-center text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Tăng trưởng ổn định
            </div>
          </div>
          
          <div className="h-80 w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart - Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900">Cơ cấu người dùng</h3>
            <p className="text-sm text-gray-500">Phân loại theo vai trò trên hệ thống</p>
          </div>
          
          <div className="h-64 w-full">
            {userRoleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {userRoleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Đang xử lý dữ liệu...</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {userRoleChartData.map((role, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-600 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {role.name}
                </div>
                <span className="font-bold text-gray-900">{role.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ratios & Analytics Section */}
        {ratios && (
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Chỉ số Hiệu năng & Tỉ lệ chuyển đổi
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Các chỉ số kinh doanh cốt lõi đo lường phễu tương tác và chất lượng vận hành dịch vụ trên sàn TMĐT.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tỉ lệ Tương tác xem tin - đặt lịch */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50/20 to-indigo-50/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Phễu Chuyển đổi (Conversion Funnel)</span>
                    <h4 className="text-base font-bold text-gray-900">Tỉ lệ Đặt lịch / Xem tin</h4>
                    <p className="text-xs text-gray-400 font-medium">Tỉ lệ chuyển đổi lượt xem trọ sang đặt lịch xem</p>
                  </div>
                  <div className="text-2xl font-black text-blue-600 bg-blue-50/50 px-3 py-1 rounded-xl">
                    {ratios.postInteractionRate}%
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(ratios.postInteractionRate * 10, 100)}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-medium">
                    <span>{ratios.raw.totalBookings} Lịch hẹn</span>
                    <span>{ratios.raw.totalViews.toLocaleString('vi-VN')} Lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Tỉ lệ Yêu thích / Xem tin */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-pink-50/20 to-purple-50/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">Độ Hấp dẫn (Engagement Rate)</span>
                    <h4 className="text-base font-bold text-gray-900">Tỉ lệ Yêu thích / Xem tin</h4>
                    <p className="text-xs text-gray-400 font-medium">Tỉ lệ người dùng lưu phòng vào mục yêu thích</p>
                  </div>
                  <div className="text-2xl font-black text-pink-600 bg-pink-50/50 px-3 py-1 rounded-xl">
                    {ratios.postEngagementRate}%
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${Math.min(ratios.postEngagementRate * 10, 100)}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-medium">
                    <span>{ratios.raw.totalFavorites} Yêu thích</span>
                    <span>{ratios.raw.totalViews.toLocaleString('vi-VN')} Lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Tỉ lệ Đặt lịch thành công */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-green-50/20 to-emerald-50/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-green-600 tracking-wider">Vận hành (Fulfillment Rate)</span>
                    <h4 className="text-base font-bold text-gray-900">Tỉ lệ Lịch hẹn Thành công</h4>
                    <p className="text-xs text-gray-400 font-medium">Tỉ lệ buổi xem trọ thành công thực tế</p>
                  </div>
                  <div className="text-2xl font-black text-green-600 bg-green-50/50 px-3 py-1 rounded-xl">
                    {ratios.bookingSuccessRate}%
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${ratios.bookingSuccessRate}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-medium">
                    <span>{ratios.raw.completedBookings} Thành công</span>
                    <span>{ratios.raw.finalBookingsCount} Lịch đã chốt</span>
                  </div>
                </div>
              </div>

              {/* Tỉ lệ Hủy lịch hẹn */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-red-50/20 to-rose-50/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Rủi ro (Churn & Cancel Rate)</span>
                    <h4 className="text-base font-bold text-gray-900">Tỉ lệ Hủy lịch hẹn</h4>
                    <p className="text-xs text-gray-400 font-medium">Tỉ lệ lịch hẹn bị khách/chủ trọ chủ động hủy</p>
                  </div>
                  <div className="text-2xl font-black text-red-600 bg-red-50/50 px-3 py-1 rounded-xl">
                    {ratios.bookingCancelRate}%
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${ratios.bookingCancelRate}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-medium">
                    <span>{ratios.raw.cancelledB} Bị hủy</span>
                    <span>{ratios.raw.finalBookingsCount} Lịch đã chốt</span>
                  </div>
                </div>
              </div>

              {/* Tỉ lệ Phản hồi Đánh giá */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-amber-50/20 to-orange-50/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Đóng góp Cộng đồng (Feedback Rate)</span>
                    <h4 className="text-base font-bold text-gray-900">Tỉ lệ Viết Đánh giá</h4>
                    <p className="text-xs text-gray-400 font-medium">Tỉ lệ người thuê viết review sau khi xem trọ</p>
                  </div>
                  <div className="text-2xl font-black text-amber-600 bg-amber-50/50 px-3 py-1 rounded-xl">
                    {ratios.reviewResponseRate}%
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(ratios.reviewResponseRate, 100)}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-medium">
                    <span>{ratios.raw.totalReviews} Đánh giá</span>
                    <span>{ratios.raw.completedBookings} Lịch thành công</span>
                  </div>
                </div>
              </div>

              {/* Tỉ lệ Thanh toán thành công */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-purple-50/20 to-violet-50/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Thanh toán (Payment Success Rate)</span>
                    <h4 className="text-base font-bold text-gray-900">Tỉ lệ Giao dịch Thành công</h4>
                    <p className="text-xs text-gray-400 font-medium">Tỉ lệ chủ trọ mua gói dịch vụ đẩy tin thành công</p>
                  </div>
                  <div className="text-2xl font-black text-purple-600 bg-purple-50/50 px-3 py-1 rounded-xl">
                    {ratios.transactionSuccessRate}%
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${ratios.transactionSuccessRate}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-medium">
                    <span>{ratios.raw.successfulTx} Thành công</span>
                    <span>{ratios.raw.totalTransactions} Giao dịch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Giao dịch mới nhất</h3>
              <p className="text-sm text-gray-500">Các hoạt động thanh toán gần đây từ chủ trọ</p>
            </div>
            <button 
              onClick={() => navigate('/admin/transactions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-bold px-4 py-2 bg-blue-50 rounded-lg transition-colors"
            >
              Xem tất cả giao dịch
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">
                  <th className="px-6 py-4">Dịch vụ</th>
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Số tiền</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">Chưa có giao dịch nào được ghi nhận</td>
                  </tr>
                ) : (
                  recentTransactions.map((tx, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            tx.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 
                            tx.status === 'FAILED' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{tx.serviceName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">#{tx.transactionRef}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatLastTime(tx.createdAt)}</td>
                      <td className="px-6 py-4 font-black text-gray-900 text-sm">{formatCurrency(tx.amount)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                            tx.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {tx.status === 'SUCCESS' ? 'Thành công' : 
                             tx.status === 'FAILED' ? 'Thất bại' : 'Chờ xử lý'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
