import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Lock, Search, Unlock, ShieldCheck, UserCircle2 } from 'lucide-react';
import userService from '../../services/userService';
import type { PaginatedData, UserResponse } from '@/types';
import { createAvatarPlaceholder } from '@/utils/localImage';

const PAGE_SIZE = 10;

export default function UserManagementPage() {
  const [usersPage, setUsersPage] = useState<PaginatedData<UserResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'LANDLORD' | 'ADMIN'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'LOCKED' | 'INACTIVE'>('all');
  const [page, setPage] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getAdminUsers({
        search: search.trim() || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        size: PAGE_SIZE,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setUsersPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search, statusFilter]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleFilterChange = () => {
    setPage(0);
    void loadUsers();
  };

  const handleToggleStatus = async (user: UserResponse) => {
    const nextStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    const confirmMessage =
      nextStatus === 'LOCKED'
        ? `Khóa tài khoản ${user.fullName}?`
        : `Mở khóa tài khoản ${user.fullName}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setActionLoadingId(user.id);
    setError(null);

    try {
      await userService.updateUserStatus(user.id, nextStatus);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái tài khoản');
    } finally {
      setActionLoadingId(null);
    }
  };

  const users = usersPage?.content ?? [];
  const totalPages = usersPage?.totalPages ?? 0;
  const currentPage = usersPage?.number ?? 0;
  const totalElements = usersPage?.totalElements ?? 0;
  const startItem = totalElements === 0 ? 0 : currentPage * (usersPage?.size ?? PAGE_SIZE) + 1;
  const endItem = totalElements === 0 ? 0 : startItem + users.length - 1;

  const getRoleBadge = (role: string) => {
    if (role === 'LANDLORD') {
      return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium">Chủ trọ</span>;
    }
    if (role === 'ADMIN') {
      return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">Quản trị</span>;
    }
    return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">Người thuê</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Hoạt động</span>;
    }
    if (status === 'LOCKED') {
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Bị khóa</span>;
    }
    return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Không hoạt động</span>;
  };

  const getKycBadge = (verificationStatus?: string) => {
    if (verificationStatus === 'APPROVED') {
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đã KYC</span>;
    }
    if (verificationStatus === 'PENDING') {
      return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Chờ KYC</span>;
    }
    if (verificationStatus === 'REJECTED') {
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Từ chối KYC</span>;
    }
    return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Chưa KYC</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
          <p className="text-gray-600 mt-1">Quản lý tài khoản Tenant, Landlord và Admin trong hệ thống</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(0);
                  void loadUsers();
                }
              }}
              placeholder="Tìm theo tên, email, SĐT..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-72"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as typeof roleFilter);
              setPage(0);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="USER">Người thuê</option>
            <option value="LANDLORD">Chủ trọ</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(0);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Bị khóa</option>
            <option value="INACTIVE">Không hoạt động</option>
          </select>
          <button
            onClick={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Lọc
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
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
                  Người dùng
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  KYC
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tải người dùng...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500">
                    Không có người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          src={user.avatar || createAvatarPlaceholder(user.fullName, 100)}
                          alt={user.fullName}
                          referrerPolicy="no-referrer"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500 mt-0.5">{user.email}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{user.phone || 'Chưa cập nhật SĐT'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getKycBadge(user.verificationStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoadingId === user.id || user.role === 'ADMIN'}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                        >
                          {user.status === 'LOCKED' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-400" title="ID người dùng">
                          <UserCircle2 className="w-4 h-4" />
                        </div>
                      </div>
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
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-50 text-blue-600 rounded-md font-medium text-sm">
              {currentPage + 1}
            </button>
            <button
              className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage >= totalPages - 1 || loading || totalPages === 0}
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
