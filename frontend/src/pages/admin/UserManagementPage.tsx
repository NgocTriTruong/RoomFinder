import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Lock, Search, Unlock, ShieldCheck, UserCircle2 } from 'lucide-react';
import userService from '../../services/userService';
import blacklistService from '../../services/blacklistService';
import type { PaginatedData, UserResponse } from '@/types';
import { createAvatarPlaceholder } from '@/utils/localImage';
import UpdateUserModal from '../../components/admin/UpdateUserModal';
import { Pencil } from 'lucide-react';

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

  // Blacklist Modal State
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [blacklistType, setBlacklistType] = useState<'TEMPORARY' | 'PERMANENT'>('TEMPORARY');
  const [blacklistDays, setBlacklistDays] = useState(30);

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<'USER' | 'LANDLORD' | 'ADMIN'>('USER');

  // Create Admin Modal State
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  
  // Update User Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Admin@123',
    role: 'ADMIN'
  });

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
    if (user.status === 'ACTIVE' || user.status === 'INACTIVE') {
      // Show blacklist modal instead of simple toggle
      setSelectedUser(user);
      setBlacklistReason('');
      setBlacklistType('TEMPORARY');
      setBlacklistDays(30);
      setIsBlacklistModalOpen(true);
      return;
    }

    // Unlock logic
    if (!window.confirm(`Mở khóa tài khoản ${user.fullName}?`)) {
      return;
    }

    setActionLoadingId(user.id);
    setError(null);

    try {
      // Find the active blacklist entry to remove it
      const blacklistEntry = await blacklistService.getAdminUsersBlacklist(user.id);
      if (blacklistEntry) {
        await blacklistService.removeFromBlacklist(blacklistEntry.id, 'Admin mở khóa từ trang quản lý');
      } else {
        // Fallback to simple status update if no blacklist entry found
        await userService.updateUserStatus(user.id, 'ACTIVE');
      }
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể mở khóa tài khoản');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmBlacklist = async () => {
    if (!selectedUser || !blacklistReason) return;
    
    setActionLoadingId(selectedUser.id);
    setIsBlacklistModalOpen(false);
    setError(null);

    try {
      await blacklistService.addToBlacklist({
        userId: selectedUser.id,
        reason: blacklistReason,
        type: blacklistType,
        days: blacklistType === 'TEMPORARY' ? blacklistDays : undefined
      });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể khóa tài khoản');
    } finally {
      setActionLoadingId(null);
      setSelectedUser(null);
    }
  };

  const handleRoleChange = (user: UserResponse) => {
    setSelectedUser(user);
    setTargetRole(user.role as any);
    setIsRoleModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUser) return;
    
    setActionLoadingId(selectedUser.id);
    setIsRoleModalOpen(false);
    setError(null);

    try {
      await userService.updateUserRole(selectedUser.id, targetRole);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể thay đổi vai trò');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userService.createAdmin({
        ...adminFormData,
        confirmPassword: adminFormData.password,
        acceptTerms: true
      });
      setIsCreateAdminModalOpen(false);
      setAdminFormData({
        fullName: '',
        email: '',
        phone: '',
        password: 'Admin@123',
        role: 'ADMIN'
      });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo tài khoản Admin');
    } finally {
      setLoading(false);
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

  const getKycBadge = (user: UserResponse) => {
    // Nếu tài khoản đã xác thực (isVerified = true), hiển thị nhãn KYC
    if (user.isVerified) {
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">KYC</span>;
    }

    // Admin mặc định là đã xác thực
    if (user.role === 'ADMIN') {
      return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Mặc định</span>;
    }

    // Đối với Chủ trọ (LANDLORD) chưa KYC
    if (user.role === 'LANDLORD') {
      switch (user.verificationStatus) {
        case 'PENDING':
          return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Chờ duyệt</span>;
        case 'REJECTED':
          return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Từ chối</span>;
        default:
          return <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">Chưa KYC</span>;
      }
    }

    return <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">Chưa KYC</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-gray-500 mt-1">Quản lý tài khoản Tenant, Landlord và Admin trong hệ thống</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsCreateAdminModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 shadow-sm shadow-blue-100"
          >
            <UserCircle2 className="w-4 h-4" />
            Thêm Admin
          </button>
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
              // Filter will be triggered by useEffect
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
              // Filter will be triggered by useEffect
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Bị khóa</option>
            <option value="INACTIVE">Không hoạt động</option>
          </select>
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
                      {getKycBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleRoleChange(user)}
                          disabled={actionLoadingId === user.id}
                          className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 p-2 rounded-lg transition-colors disabled:opacity-50"
                          title="Thay đổi vai trò"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          disabled={actionLoadingId === user.id}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors disabled:opacity-50"
                          title="Chỉnh sửa thông tin"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoadingId === user.id || user.role === 'ADMIN'}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                        >
                          {user.status === 'LOCKED' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
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

      {/* Blacklist Modal */}
      {isBlacklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Khóa tài khoản người dùng</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bạn đang thực hiện khóa tài khoản <strong>{selectedUser?.fullName}</strong>. Hành động này sẽ đưa người dùng vào danh sách đen.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lý do khóa</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none h-24 text-sm"
                    placeholder="Nhập lý do chi tiết..."
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại khóa</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                      value={blacklistType}
                      onChange={(e) => setBlacklistType(e.target.value as any)}
                    >
                      <option value="TEMPORARY">Tạm thời</option>
                      <option value="PERMANENT">Vĩnh viễn</option>
                    </select>
                  </div>
                  {blacklistType === 'TEMPORARY' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số ngày</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={blacklistDays}
                        onChange={(e) => setBlacklistDays(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setIsBlacklistModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmBlacklist}
                  disabled={!blacklistReason}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận khóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Thay đổi vai trò người dùng</h3>
              <p className="text-sm text-gray-600 mb-6">
                Bạn đang thay đổi vai trò cho tài khoản <strong>{selectedUser?.fullName}</strong>. Hành động này sẽ ảnh hưởng đến quyền truy cập của người dùng.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chọn vai trò mới</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['USER', 'LANDLORD', 'ADMIN'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setTargetRole(role as any)}
                        className={`px-4 py-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          targetRole === role 
                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold' 
                            : 'border-gray-200 hover:border-purple-200 text-gray-600'
                        }`}
                      >
                        <span>
                          {role === 'USER' ? 'Người thuê (Tenant)' : 
                           role === 'LANDLORD' ? 'Chủ trọ (Landlord)' : 'Quản trị viên (Admin)'}
                        </span>
                        {targetRole === role && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setIsRoleModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold shadow-sm"
                >
                  Xác nhận lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {isCreateAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tạo tài khoản Admin</h3>
                <button 
                  onClick={() => setIsCreateAdminModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Nhập tên đầy đủ..."
                    value={adminFormData.fullName}
                    onChange={(e) => setAdminFormData({...adminFormData, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Tên đăng nhập)</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="admin@example.com"
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0987xxxxxx"
                    value={adminFormData.phone}
                    onChange={(e) => setAdminFormData({...adminFormData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu ban đầu</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Xác nhận tạo tài khoản
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Update User Modal */}
      {isUpdateModalOpen && selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            void loadUsers();
          }}
        />
      )}
    </div>
  );
}
