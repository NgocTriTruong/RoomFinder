import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, UserPlus, AlertOctagon, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { DashboardStats } from '../../services/adminService';
import { transactionService } from '../../services/transactionService';
import type { TransactionResponse } from '../../services/transactionService';
import { getErrorMessage } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      const [statsData, transactionsData] = await Promise.all([
        adminService.getDashboardStats(),
        transactionService.getTransactions(0, 5),
      ]);
      setStats(statsData);
      setRecentTransactions(transactionsData.content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>
        <p className="text-gray-600 mt-1">Báo cáo hiệu suất và hoạt động mới nhất</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats ? formatCurrency(stats.totalRevenue) : '0đ'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {stats && stats.revenueGrowth !== 0 && (
            <div className="mt-4 text-sm">
              <span className={stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}%
              </span>
              <span className="text-gray-500 ml-2">so với tháng trước</span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tin chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.pendingPosts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          {stats && stats.newPostsToday > 0 && (
            <div className="mt-4 text-sm">
              <span className="text-red-500 font-medium">+{stats.newPostsToday}</span>
              <span className="text-gray-500 ml-2">tin mới hôm nay</span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Người dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats ? new Intl.NumberFormat('vi-VN').format(stats.totalUsers) : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          {stats && stats.userGrowth !== 0 && (
            <div className="mt-4 text-sm">
              <span className={stats.userGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}%
              </span>
              <span className="text-gray-500 ml-2">so với tháng trước</span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Báo cáo chưa xử lý</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.pendingReports || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
          </div>
          {stats && stats.pendingReports > 0 && (
            <div className="mt-4 text-sm">
              <span className="text-red-600 font-medium">Cần xử lý gấp</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ doanh thu</h3>
          <div className="h-72 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-gray-500 font-medium">Biểu đồ doanh thu</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Giao dịch mới nhất</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</button>
          </div>
          <div className="space-y-6">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có giao dịch nào</p>
            ) : (
              recentTransactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 
                      tx.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{tx.serviceName}</p>
                      <p className="text-xs text-gray-500">{formatLastTime(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className={`text-xs font-medium ${
                      tx.status === 'SUCCESS' ? 'text-green-600' : 
                      tx.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {tx.status === 'SUCCESS' ? 'Thành công' : 
                       tx.status === 'FAILED' ? 'Thất bại' : 'Đang xử lý'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
