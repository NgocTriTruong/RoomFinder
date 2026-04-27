import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, EyeOff, Trash2, Eye, ChevronLeft, ChevronRight, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { postService } from '@/services/postService';
import { getErrorMessage } from '@/services/api';
import type { PaginatedData, PostResponse, PostStatus } from '@/types';
import { createPlaceholderImage } from '@/utils/localImage';
import { resolveMediaUrl } from '@/utils/mediaUrl';
import PostModerationDetail from '@/components/admin/PostModerationDetail';

type FilterTab = 'pending' | 'all';

const PAGE_SIZE = 10;

const statusMeta: Record<PostStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-700',
  },
  APPROVED: {
    label: 'Đã duyệt',
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Bị từ chối',
    className: 'bg-red-100 text-red-700',
  },
  EXPIRED: {
    label: 'Hết hạn',
    className: 'bg-gray-100 text-gray-700',
  },
};

const getSafeStatusMeta = (status: string) => {
  const normalized = status as PostStatus;
  return statusMeta[normalized] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-700',
  };
};

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function PostModerationPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [pageData, setPageData] = useState<PaginatedData<PostResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await postService.getAdminPosts({
        page,
        size: PAGE_SIZE,
        status: filter === 'pending' ? 'PENDING' : undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setPageData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handleFilterChange = (nextFilter: FilterTab) => {
    setFilter(nextFilter);
    setPage(0);
  };

  const handleApprove = async (postId: number) => {
    if (!window.confirm('Bạn có chắc muốn duyệt tin này không?')) {
      return;
    }

    setActionLoadingId(postId);
    setError(null);

    try {
      await postService.approvePost(postId);
      await loadPosts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (postId: number) => {
    const reason = window.prompt('Nhập lý do từ chối:');
    if (!reason?.trim()) {
      return;
    }

    setActionLoadingId(postId);
    setError(null);

    try {
      await postService.rejectPost(postId, reason.trim());
      await loadPosts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const meta = getSafeStatusMeta(status);
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${meta.className}`}>
        {meta.label}
      </span>
    );
  };

  const posts = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;
  const currentPage = pageData?.number ?? 0;
  const totalElements = pageData?.totalElements ?? 0;
  const startItem = totalElements === 0 ? 0 : currentPage * (pageData?.size ?? PAGE_SIZE) + 1;
  const endItem = totalElements === 0 ? 0 : startItem + posts.length - 1;

  if (selectedPostId) {
    return (
      <PostModerationDetail 
        postId={selectedPostId} 
        onBack={() => setSelectedPostId(null)}
        onActionComplete={() => {
          setSelectedPostId(null);
          void loadPosts();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Duyệt tin đăng</h2>
          <p className="text-gray-600 mt-1">Quản lý và kiểm duyệt các bài đăng từ chủ trọ</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Tất cả bài đăng
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tin đăng
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Chủ trọ
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tải tin đăng...</span>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500">
                    Không có tin đăng nào phù hợp.
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const thumbnail = resolveMediaUrl(post.images?.[0]) || createPlaceholderImage(post.title, 100, 100);
                  const isPending = post.status === 'PENDING';

                  return (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-16 rounded object-cover bg-gray-100"
                            src={thumbnail}
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            onError={(event) => {
                              event.currentTarget.src = createPlaceholderImage(post.title, 100, 100);
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={post.title}>
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ID: {post.id}</div>
                            <div className="text-xs text-gray-500 mt-1">{post.room.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{post.landlord.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedPostId(post.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{startItem}</span> đến{' '}
            <span className="font-medium">{endItem}</span> trong số{' '}
            <span className="font-medium">{totalElements}</span> kết quả
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 border border-gray-200 rounded-md text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage <= 0 || isLoading}
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-50 text-blue-600 rounded-md font-medium text-sm">
              {currentPage + 1}
            </button>
            <button
              className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage >= totalPages - 1 || isLoading || totalPages === 0}
              onClick={() => setPage(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
