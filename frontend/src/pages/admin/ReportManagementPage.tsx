import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, ShieldBan, UserX, Eye, Clock, Check, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import reportService, { type ReportResponse } from '../../services/reportService';

type FilterTab = 'pending' | 'all';

export default function ReportManagementPage() {
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(null);
  const [handleNote, setHandleNote] = useState('');

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

  const handleResolve = async (report: ReportResponse, note: string) => {
    const action = report.targetType === 'POST' ? 'REMOVE_POST' : 'BLACKLIST_USER';
    
    if (!note.trim()) {
      alert('Vui lòng nhập ghi chú xử lý');
      return;
    }

    setActionLoadingId(report.id);
    setError(null);

    try {
      await reportService.resolveReport(report.id, action, note.trim());
      alert('Đã xử lý báo cáo thành công');
      setSelectedReport(null);
      setHandleNote('');
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xử lý báo cáo');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDismiss = async (report: ReportResponse, note: string) => {
    if (!note.trim()) {
      alert('Vui lòng nhập lý do bỏ qua');
      return;
    }

    setActionLoadingId(report.id);
    setError(null);

    try {
      await reportService.dismissReport(report.id, note.trim());
      alert('Đã bỏ qua báo cáo');
      setSelectedReport(null);
      setHandleNote('');
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
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {report.targetType === 'POST' ? 'Tin đăng' : report.targetType === 'USER' ? 'Người dùng' : report.targetType === 'LANDLORD' ? 'Chủ trọ' : 'Đánh giá'}
                            </span>
                            <span className="text-xs text-gray-500">#{report.targetId}</span>
                            {report.targetType === 'POST' && (
                              <a 
                                href={`/room/${report.targetId}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Xem nội dung tin đăng"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          {report.evidenceUrl && (
                            <button 
                              onClick={() => window.open(report.evidenceUrl, '_blank')}
                              className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-1"
                            >
                              <ImageIcon className="w-3 h-3" />
                              Xem bằng chứng
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setHandleNote(report.handledNote || '');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </button>
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
      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Chi tiết báo cáo vi phạm</h3>
                <p className="text-sm text-gray-500 mt-1">Mã báo cáo: #{selectedReport.id}</p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Người báo cáo</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedReport.reporterName}</p>
                    <p className="text-xs text-gray-500">{new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loại vi phạm</label>
                    <div className="flex items-center text-red-600 font-bold mt-1">
                      <AlertTriangle className="w-4 h-4 mr-1.5" />
                      {selectedReport.reason}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đối tượng bị báo cáo</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-900 font-medium">
                        {selectedReport.targetType === 'POST' ? 'Tin đăng' : 'Người dùng'} #{selectedReport.targetId}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</label>
                    <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mô tả chi tiết từ người dùng</label>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed italic">
                  "{selectedReport.description || 'Không có mô tả chi tiết.'}"
                </p>
              </div>

              {/* Evidence Section */}
              {selectedReport.evidenceUrl && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Hình ảnh bằng chứng</label>
                  <div className="relative group">
                    <img 
                      src={selectedReport.evidenceUrl} 
                      alt="Bằng chứng" 
                      className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-white cursor-zoom-in"
                      onClick={() => window.open(selectedReport.evidenceUrl, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <p className="text-white font-medium">Bấm để phóng to</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Section for PENDING reports */}
              {(selectedReport.status === 'PENDING' || selectedReport.status === 'PROCESSING') && (
                <div className="pt-6 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Xử lý báo cáo</label>
                  <textarea
                    rows={3}
                    value={handleNote}
                    onChange={(e) => setHandleNote(e.target.value)}
                    placeholder="Nhập ghi chú xử lý hoặc lý do gỡ tin/bỏ qua..."
                    className="w-full border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-4 border text-sm transition-all"
                  ></textarea>
                </div>
              )}

              {/* History Section for handled reports */}
              {selectedReport.status !== 'PENDING' && selectedReport.status !== 'PROCESSING' && (
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Lịch sử xử lý</label>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedReport.handledByName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">{selectedReport.handledByName || 'Admin'}</p>
                        <p className="text-xs text-blue-600">{new Date(selectedReport.handledAt).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-blue-800 bg-white p-3 rounded-lg border border-blue-100">
                      <strong>Ghi chú:</strong> {selectedReport.handledNote || 'Không có ghi chú'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {(selectedReport.status === 'PENDING' || selectedReport.status === 'PROCESSING') && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => handleDismiss(selectedReport, handleNote)}
                  disabled={!!actionLoadingId}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  Bỏ qua báo cáo
                </button>
                <button
                  onClick={() => handleResolve(selectedReport, handleNote)}
                  disabled={!!actionLoadingId}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {selectedReport.targetType === 'POST' ? <ShieldBan className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                  {selectedReport.targetType === 'POST' ? 'Gỡ tin vi phạm' : 'Khóa tài khoản'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
