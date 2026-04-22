import React, { useEffect, useState } from 'react';
import { X, Eye, Heart, Phone, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { postService } from '../../services/postService';
import type { PostStatsResponse } from '../../types';

interface PostStatsModalProps {
  postId: number;
  postTitle: string;
  onClose: () => void;
}

export default function PostStatsModal({ postId, postTitle, onClose }: PostStatsModalProps) {
  const [stats, setStats] = useState<PostStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await postService.getPostStats(postId);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch post stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [postId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Thống kê hiệu quả</h3>
            <p className="text-sm text-gray-500 mt-1 truncate max-w-[400px]">{postTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500 mt-4">Đang tải dữ liệu thống kê...</p>
            </div>
          ) : stats ? (
            <div className="space-y-8">
              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center text-blue-600 mb-2">
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="text-xs font-semibold uppercase">Lượt xem</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.viewCount}</div>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                  <div className="flex items-center text-pink-600 mb-2">
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="text-xs font-semibold uppercase">Quan tâm</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.favoriteCount}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center text-amber-600 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-xs font-semibold uppercase">Liên hệ</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.contactCount}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center text-purple-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-xs font-semibold uppercase">Lịch hẹn</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.bookingCount}</div>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Hiệu quả chuyển đổi
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tỷ lệ xem / đặt hẹn</span>
                      <span className="font-medium text-gray-900">
                        {stats.viewCount > 0 ? ((stats.bookingCount / stats.viewCount) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.viewCount > 0 ? (stats.bookingCount / stats.viewCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tỷ lệ đặt hẹn thành công</span>
                      <span className="font-medium text-gray-900">
                        {stats.bookingCount > 0 ? ((stats.completedBookings / stats.bookingCount) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.bookingCount > 0 ? (stats.completedBookings / stats.bookingCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={onClose}
                  className="bg-gray-900 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy dữ liệu thống kê.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
