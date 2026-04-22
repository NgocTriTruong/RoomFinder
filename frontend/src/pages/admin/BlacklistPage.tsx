import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserX, UserCheck, Search, Filter, Calendar, Info, Clock, AlertCircle } from 'lucide-react';
import blacklistService, { BlacklistEntry } from '../../services/blacklistService';

export default function BlacklistPage() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BlacklistEntry | null>(null);
  const [removalReason, setRemovalReason] = useState('');

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const fetchBlacklist = async () => {
    try {
      setLoading(true);
      const data = await blacklistService.getAllBlacklist();
      setEntries(data);
    } catch (error) {
      alert('Không thể tải danh sách đen');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (entry: BlacklistEntry) => {
    setSelectedEntry(entry);
    setRemovalReason('');
    setShowRemovalModal(true);
  };

  const handleConfirmRemoval = async () => {
    if (!selectedEntry || !removalReason) return;
    try {
      await blacklistService.removeFromBlacklist(selectedEntry.id, removalReason);
      alert('Đã gỡ người dùng khỏi danh sách đen');
      setShowRemovalModal(false);
      fetchBlacklist();
    } catch (error) {
      alert('Có lỗi xảy ra khi gỡ bỏ');
    }
  };

  const filteredEntries = entries.filter(e => 
    e.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.userPhone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-600" />
            Danh sách đen (Blacklist)
          </h2>
          <p className="text-gray-600 mt-1">Quản lý các tài khoản bị chặn do vi phạm chính sách hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm user..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <UserX className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Đang bị chặn</p>
            <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Chặn tạm thời</p>
            <p className="text-2xl font-bold text-gray-900">{entries.filter(e => !e.isPermanent).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Chặn vĩnh viễn</p>
            <p className="text-2xl font-bold text-gray-900">{entries.filter(e => e.isPermanent).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lý do & Loại</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời hạn</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người thực hiện</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có người dùng nào trong danh sách đen'}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                          <span className="text-sm font-bold text-gray-600">{entry.userFullName[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{entry.userFullName}</div>
                          <div className="text-xs text-gray-500">{entry.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-1 flex items-center gap-1">
                        <Info className="w-3 h-3 text-gray-400" /> {entry.reason}
                      </div>
                      <div className="mt-1">
                        {entry.isPermanent ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold tracking-wider uppercase">Vĩnh viễn</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold tracking-wider uppercase">Tạm thời</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {entry.isPermanent ? 'Không thời hạn' : entry.expiresAt ? new Date(entry.expiresAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Bắt đầu: {new Date(entry.addedAt).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{entry.addedByName || 'Admin'}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">System Administrator</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRemoveClick(entry)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <UserCheck className="w-4 h-4" />
                        Gỡ chặn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Removal Modal */}
      {showRemovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gỡ chặn người dùng</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bạn đang chuẩn bị gỡ chặn cho <strong>{selectedEntry?.userFullName}</strong>. Vui lòng nhập lý do quyết định này.
              </p>
              
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-32 text-sm"
                placeholder="Nhập lý do gỡ chặn..."
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRemovalModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmRemoval}
                  disabled={!removalReason}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận gỡ chặn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
