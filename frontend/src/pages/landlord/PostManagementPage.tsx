import React, { useEffect, useState } from 'react';
import { Plus, Eye, MessageCircle, Edit, Trash2, RefreshCw, ArrowUpCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/postService';
import type { PostResponse } from '../../types';
import PostStatsModal from '../../components/landlord/PostStatsModal';
import BoostExtendModal from '../../components/landlord/BoostExtendModal';
import { createPlaceholderImage } from '../../utils/localImage';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function PostManagementPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedPostStats, setSelectedPostStats] = useState<{ id: number; title: string } | null>(null);
  const [boostExtendModal, setBoostExtendModal] = useState<{ id: number; title: string; tab: 'boost' | 'extend' } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getMyPosts();
      setPosts(data.content);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) return;
    
    setIsDeleting(postId);
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      alert('Xóa bài đăng thất bại. Vui lòng thử lại.');
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Đang hiển thị</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Chờ duyệt</span>;
      case 'EXPIRED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Hết hạn</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Bị từ chối</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý tin đăng</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách phòng trọ bạn đang cho thuê</p>
        </div>
        <button 
          onClick={() => navigate('/landlord/posts/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Đăng tin mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng trọ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thống kê
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Bạn chưa có tin đăng nào. <button onClick={() => navigate('/landlord/posts/create')} className="text-blue-600 font-medium">Đăng ngay!</button>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative">
                          <img 
                            className="h-16 w-16 rounded object-cover" 
                            src={resolveMediaUrl(post.room?.thumbnailUrl || post.images[0]) || createPlaceholderImage(post.title, 200, 200)} 
                            alt="" 
                            referrerPolicy="no-referrer" 
                            onError={(event) => {
                              event.currentTarget.src = createPlaceholderImage(post.title, 200, 200);
                            }}
                          />
                          {post.isBoosted && (
                            <div className="absolute -top-2 -left-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                              VIP
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={post.title}>
                            {post.title}
                          </div>
                          <div className="text-sm text-blue-600 font-semibold mt-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price)}/tháng
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedPostStats({ id: post.id, title: post.title })}
                        className="flex flex-col space-y-1 group text-left"
                      >
                        <div className="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-400" />
                          {post.viewCount} lượt xem
                        </div>
                        <div className="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-400" />
                          {post.favoriteCount} quan tâm
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {!post.isBoosted && post.status === 'APPROVED' && (
                          <button 
                            onClick={() => setBoostExtendModal({ id: post.id, title: post.title, tab: 'boost' })}
                            className="text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 p-2 rounded-md transition-colors" 
                            title="Đẩy tin VIP"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>
                        )}
                        {post.status === 'EXPIRED' && (
                          <button 
                            onClick={() => setBoostExtendModal({ id: post.id, title: post.title, tab: 'extend' })}
                            className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors" 
                            title="Gia hạn"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/landlord/posts/edit/${post.id}`)}
                          className="text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 p-2 rounded-md transition-colors" 
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                          className="text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2 rounded-md transition-colors disabled:opacity-50" 
                          title="Xóa"
                        >
                          {isDeleting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPostStats && (
        <PostStatsModal 
          postId={selectedPostStats.id}
          postTitle={selectedPostStats.title}
          onClose={() => setSelectedPostStats(null)}
        />
      )}

      {boostExtendModal && (
        <BoostExtendModal 
          postId={boostExtendModal.id}
          postTitle={boostExtendModal.title}
          initialTab={boostExtendModal.tab}
          onClose={() => setBoostExtendModal(null)}
          onSuccess={fetchPosts}
        />
      )}
    </div>
  );
}
