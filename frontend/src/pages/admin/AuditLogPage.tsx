import React, { useCallback, useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  History, 
  Search, 
  Clock,
  Shield,
  AlertCircle,
  RefreshCw,
  ClipboardList
} from 'lucide-react';
import auditService, { type AuditLogResponse } from '../../services/auditService';
import { CheckCircle2 } from 'lucide-react';
import type { PaginatedData } from '@/types';
import { createAvatarPlaceholder } from '@/utils/localImage';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PAGE_SIZE = 20;

const AUDIT_ACTIONS = {
  CREATE: 'Tạo mới',
  UPDATE: 'Cập nhật',
  DELETE: 'Xóa',
  APPROVE: 'Phê duyệt',
  REJECT: 'Từ chối',
  LOCK: 'Khóa',
  UNLOCK: 'Mở khóa',
};

const AUDIT_TARGETS = {
  USER: 'Người dùng',
  POST: 'Bài đăng',
  VOUCHER: 'Voucher',
  PACKAGE: 'Gói cước',
  SUBSCRIPTION: 'Đăng ký',
  REPORT: 'Báo cáo',
  KYC: 'Xác thực KYC',
};

export default function AuditLogPage() {
  const [logsPage, setLogsPage] = useState<PaginatedData<AuditLogResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  
  // Filters
  const [actionFilter, setActionFilter] = useState<string>('');
  const [targetFilter, setTargetFilter] = useState<string>('');
  const [adminIdSearch, setAdminIdSearch] = useState<string>('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await auditService.getLogs({
        page,
        size: PAGE_SIZE,
        action: actionFilter || undefined,
        target: targetFilter || undefined,
        adminId: adminIdSearch ? parseInt(adminIdSearch) : undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setLogsPage(data);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải nhật ký hoạt động');
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, targetFilter, adminIdSearch]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const logs = logsPage?.content ?? [];
  const totalPages = logsPage?.totalPages ?? 0;
  const currentPage = logsPage?.number ?? 0;
  const totalElements = logsPage?.totalElements ?? 0;
  const startItem = totalElements === 0 ? 0 : currentPage * (logsPage?.size ?? PAGE_SIZE) + 1;
  const endItem = totalElements === 0 ? 0 : startItem + logs.length - 1;

  const getActionBadge = (action: string, displayName: string) => {
    let colorClass = 'bg-gray-100 text-gray-700';
    
    if (action === 'CREATE' || action === 'APPROVE' || action === 'UNLOCK') {
      colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    } else if (action === 'DELETE' || action === 'REJECT' || action === 'LOCK') {
      colorClass = 'bg-rose-50 text-rose-700 border-rose-100';
    } else if (action === 'UPDATE') {
      colorClass = 'bg-blue-50 text-blue-700 border-blue-100';
    }

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
        {displayName || action}
      </span>
    );
  };

  const getTargetBadge = (target: string, displayName: string) => {
    return (
      <span className="flex items-center gap-1.5 text-sm text-gray-700 font-semibold">
        <Shield className="w-3.5 h-3.5 text-blue-500" />
        {displayName || target}
      </span>
    );
  };

  const formatMetadata = (metadata: string | null) => {
    if (!metadata) return null;
    try {
      const parsed = JSON.parse(metadata);
      return (
        <div className="mt-2 group">
          <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto max-w-xs font-mono text-gray-600 max-h-24 scrollbar-hide">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>
      );
    } catch {
      return <span className="text-[10px] text-gray-400 block mt-1 italic truncate max-w-xs">{metadata}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <History className="w-6 h-6 text-white" />
            </div>
            Audit Log
          </h2>
          <p className="text-gray-500 mt-1 font-medium">Hệ thống truy vết hoạt động quản trị bảo mật</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Cập nhật lần cuối: {format(new Date(), 'HH:mm:ss')}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="md:col-span-1 lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Tìm kiếm Admin</label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Nhập Admin ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              value={adminIdSearch}
              onChange={(e) => setAdminIdSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Hành động</label>
          <select
            className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer text-sm font-medium"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả hành động</option>
            {Object.entries(AUDIT_ACTIONS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Đối tượng</label>
          <select
            className="w-full px-3 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer text-sm font-medium"
            value={targetFilter}
            onChange={(e) => {
              setTargetFilter(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả đối tượng</option>
            {Object.entries(AUDIT_TARGETS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => void loadLogs()}
          disabled={loading}
          className="h-[42px] px-6 bg-gray-900 text-white rounded-xl hover:bg-black active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-gray-200"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Làm mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="p-2 bg-rose-100 rounded-full">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-rose-800">Yêu cầu không thành công</h3>
            <p className="text-sm text-rose-600 mt-0.5">{error}</p>
          </div>
          <button 
            onClick={() => void loadLogs()}
            className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Người thực hiện</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Đối tượng</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nội dung</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-bold">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : !loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <ClipboardList className="w-10 h-10 text-gray-200" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-bold text-lg">Không có nhật ký hoạt động</p>
                        <p className="text-gray-500 text-sm">Hệ thống chưa ghi nhận bất kỳ thao tác nào phù hợp với bộ lọc hiện tại.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/20 transition-all duration-200 group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {format(new Date(log.createdAt), 'dd MMM, yyyy', { locale: vi })}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {format(new Date(log.createdAt), 'HH:mm:ss')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            className="h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
                            src={log.admin?.avatar || createAvatarPlaceholder(log.admin?.fullName || 'Admin', 64)}
                            alt={log.admin?.fullName || 'Admin'}
                          />
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{log.admin?.fullName || 'Admin'}</div>
                          <div className="text-[10px] text-gray-400 font-medium font-mono uppercase">ADMIN ID: {log.admin?.id || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getActionBadge(log.action, log.actionDisplayName)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        {getTargetBadge(log.targetType, log.targetTypeDisplayName)}
                        {log.targetId && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 w-fit">
                            ID: {log.targetId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-2xl">
                        <p className="text-sm text-gray-600 font-medium leading-relaxed" title={log.description}>
                          {log.description}
                        </p>
                        {formatMetadata(log.metadata)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50/50 px-8 py-5 flex items-center justify-between border-t border-gray-100">
          <div className="hidden sm:block text-sm font-bold text-gray-500">
            Đang xem <span className="text-gray-900">{startItem}-{endItem}</span> trên <span className="text-gray-900">{totalElements}</span> bản ghi
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              disabled={currentPage <= 0 || loading}
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </button>
            <div className="flex items-center px-6 bg-gray-900 text-white rounded-xl font-black text-sm shadow-lg shadow-gray-200">
              {currentPage + 1} / {Math.max(1, totalPages)}
            </div>
            <button
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              disabled={currentPage >= totalPages - 1 || loading || totalPages === 0}
              onClick={() => setPage(prev => prev + 1)}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
