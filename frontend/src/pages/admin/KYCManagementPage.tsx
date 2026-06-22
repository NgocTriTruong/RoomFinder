import React, { useCallback, useEffect, useState } from 'react';
import { Check, Clock, Eye, Loader2, Phone, ShieldCheck, User, X } from 'lucide-react';
import userService from '../../services/userService';
import type { PaginatedData, UserResponse } from '@/types';
import { createAvatarPlaceholder, createPlaceholderImage } from '@/utils/localImage';
import { resolveMediaUrl } from '@/utils/mediaUrl';

const PAGE_SIZE = 10;

export default function KYCManagementPage() {
  const [pendingUsersPage, setPendingUsersPage] = useState<PaginatedData<UserResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchPendingKYC = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getPendingKycUsers({
        page,
        size: PAGE_SIZE,
        sortBy: 'createdAt',
        sortDirection: 'asc',
      });
      setPendingUsersPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách chờ xác thực');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchPendingKYC();
  }, [fetchPendingKYC]);

  const handleVerify = async (userId: number, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(true);
    setError(null);

    try {
      await userService.verifyUser(userId, { status, adminNote });
      setSelectedUser(null);
      setAdminNote('');
      await fetchPendingKYC();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingUsers = pendingUsersPage?.content ?? [];
  const totalPages = pendingUsersPage?.totalPages ?? 0;
  const currentPage = pendingUsersPage?.number ?? 0;
  const totalElements = pendingUsersPage?.totalElements ?? 0;
  const startItem = totalElements === 0 ? 0 : currentPage * (pendingUsersPage?.size ?? PAGE_SIZE) + 1;
  const endItem = totalElements === 0 ? 0 : startItem + pendingUsers.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            Xét duyệt danh tính (KYC)
          </h2>
          <p className="text-gray-600 mt-1">Phê duyệt hồ sơ xác thực của các chủ trọ mới tham gia</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chủ trọ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-10 h-10 text-gray-300" />
                      <p className="text-lg font-medium">Không có hồ sơ nào đang chờ duyệt</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={u.avatar || createAvatarPlaceholder(u.fullName, 100)}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 mr-3"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-sm font-bold text-gray-900">{u.fullName}</span>
                          <div className="text-xs text-gray-500 mt-0.5">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <User className="w-3 h-3" /> {u.email}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {u.phone || 'Chưa có SĐT'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">CHỜ DUYỆT</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
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
              disabled={currentPage <= 0 || loading}
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
            >
              <span className="sr-only">Previous</span>
              <span>‹</span>
            </button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-50 text-blue-600 rounded-md font-medium text-sm">
              {currentPage + 1}
            </button>
            <button
              className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage >= totalPages - 1 || loading || totalPages === 0}
              onClick={() => setPage(prev => prev + 1)}
            >
              <span className="sr-only">Next</span>
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết hồ sơ xác thực: {selectedUser.fullName}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 font-medium">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Thông tin cá nhân</p>
                  <p className="text-lg">Họ tên: <span className="font-bold">{selectedUser.fullName}</span></p>
                  <p>Email: {selectedUser.email}</p>
                  <p>Số điện thoại: {selectedUser.phone || 'Chưa có'}</p>
                  <p>Địa chỉ: {selectedUser.address || 'N/A'}</p>
                  <p>Ngày tạo: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Ghi chú từ Admin (nếu từ chối)</p>
                  <textarea
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="Lý do từ chối hoặc lưu ý cho chủ trọ..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Hình ảnh đối chiếu</p>
                {/* Row 1: Front and Back CCCD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 text-center">Mặt trước CCCD</p>
                    <img
                      src={resolveMediaUrl(selectedUser.frontIdCardUrl) || createPlaceholderImage('CCCD mặt trước', 400, 240)}
                      className="w-full aspect-video object-cover rounded-xl border border-gray-200 shadow-sm"
                      alt="Front"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 text-center">Mặt sau CCCD</p>
                    <img
                      src={resolveMediaUrl(selectedUser.backIdCardUrl) || createPlaceholderImage('CCCD mặt sau', 400, 240)}
                      className="w-full aspect-video object-cover rounded-xl border border-gray-200 shadow-sm"
                      alt="Back"
                    />
                  </div>
                </div>

                {/* Row 2: Selfie and Business License side-by-side */}
                <div className={`grid grid-cols-1 ${selectedUser.role === 'LANDLORD' ? 'md:grid-cols-2' : 'max-w-md mx-auto w-full'} gap-4 mt-6`}>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 text-center">Ảnh chân dung</p>
                    <img
                      src={resolveMediaUrl(selectedUser.selfieUrl) || createPlaceholderImage('Ảnh chân dung', 400, 400)}
                      className="w-full aspect-video object-cover rounded-xl border border-gray-200 shadow-sm"
                      alt="Selfie"
                    />
                  </div>
                  {selectedUser.role === 'LANDLORD' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-600 text-center">Giấy phép kinh doanh / sở hữu trọ</p>
                      {selectedUser.businessLicenseUrl ? (
                        <img
                          src={resolveMediaUrl(selectedUser.businessLicenseUrl)}
                          className="w-full aspect-video object-cover rounded-xl border border-gray-200 shadow-sm"
                          alt="Business License"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                          Chưa tải lên giấy phép
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50">
              <button
                onClick={() => handleVerify(selectedUser.id, 'REJECTED')}
                disabled={actionLoading}
                className="flex-1 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <X className="w-5 h-5" /> Từ chối hồ sơ
              </button>
              <button
                onClick={() => handleVerify(selectedUser.id, 'APPROVED')}
                disabled={actionLoading}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
              >
                <Check className="w-5 h-5" /> Phê duyệt ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
