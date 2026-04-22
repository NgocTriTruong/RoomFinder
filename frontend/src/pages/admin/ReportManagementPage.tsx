import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, ShieldBan, UserX, Eye, Clock, Check, X } from 'lucide-react';
import reportService, { type ReportResponse } from '../../services/reportService';

type FilterTab = 'pending' | 'all';

export default function ReportManagementPage() {
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = filter === 'pending'
        ? await reportService.getPendingReports({ page: 0, size: 50 })
        : await reportService.getAllReports({ page: 0, size: 50 });
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const handleResolve = async (report: ReportResponse) => {
    const action = report.targetType === 'POST' ? 'REMOVE_POST' : 'BLACKLIST_USER';
    const note = window.prompt(
      action === 'REMOVE_POST'
        ? 'Nhập ghi chú cho việc gỡ tin:'
        : 'Nhập ghi chú cho việc khóa người dùng:'
    );

    if (note == null) {
      return;
    }

    setActionLoadingId(report.id);
    setError(null);

    try {
      await reportService.resolveReport(report.id, action, note.trim());
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xử lý báo cáo');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDismiss = async (report: ReportResponse) => {
    const note = window.prompt('Nhập lý do bỏ qua báo cáo:');
    if (note == null) {
      return;
    }

    setActionLoadingId(report.id);
    setError(null);

    try {
      await reportService.dismissReport(report.id, note.trim());
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể bỏ qua báo cáo');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PROCESSING':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Chưa xử lý</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đã xử lý</span>;
      case 'DISMISSED':
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Đã bỏ qua</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo vi phạm</h2>
          <p className="text-gray-600 mt-1">Quản lý và xử lý các báo cáo từ người dùng</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Tất cả báo cáo
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
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
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người báo cáo</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lý do</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đối tượng bị báo cáo</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
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
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không có báo cáo nào phù hợp.
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const isOpen = report.status === 'PENDING' || report.status === 'PROCESSING';
                  return (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.reporterName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-red-600 font-medium">
                          <AlertTriangle className="w-4 h-4 mr-1.5" />
                          {report.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={`${report.targetType} #${report.targetId}`}>
                          {report.targetType} #{report.targetId}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 uppercase">
                          Loại: {report.targetType === 'POST' ? 'Tin đăng' : report.targetType === 'USER' ? 'Người dùng' : report.targetType === 'LANDLORD' ? 'Chủ trọ' : 'Đánh giá'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isOpen ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleResolve(report)}
                              disabled={actionLoadingId === report.id}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors disabled:opacity-60"
                              title={report.targetType === 'POST' ? 'Gỡ tin đăng' : 'Khóa người dùng'}
                            >
                              {report.targetType === 'POST' ? <ShieldBan className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDismiss(report)}
                              disabled={actionLoadingId === report.id}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-colors disabled:opacity-60"
                              title="Bỏ qua"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2 text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{report.handledByName || 'Đã xử lý'}</span>
                          </div>
                        )}
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
            Tổng số <span className="font-medium">{reports.length}</span> báo cáo
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Dữ liệu lấy trực tiếp từ backend
          </div>
        </div>
      </div>
    </div>
  );
}
