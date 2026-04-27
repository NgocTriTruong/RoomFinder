import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar, CheckCircle, XCircle, Search, Copy, Check } from 'lucide-react';
import voucherService, { Voucher, CreateVoucherRequest } from '../../services/voucherService';
import subscriptionService, { PackageResponse } from '../../services/subscriptionService';
import { getErrorMessage } from '../../services/api';

export default function VoucherManagementPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState<CreateVoucherRequest>({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discount: 0,
    maxDiscountAmount: 0,
    minOrderAmount: 0,
    maxPerUser: 1,
    isActive: true,
    isPublic: true,
    isFeatured: false,
    validFrom: '',
    expiresAt: '',
    applicablePackageIds: []
  });

  const filteredVouchers = vouchers.filter(v =>
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchVouchers();
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await subscriptionService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      // Add a timestamp to bypass any potential browser caching
      const data = await voucherService.getAllVouchers();
      console.log('Fetched vouchers:', data);
      setVouchers(data);
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (voucher: Voucher | null = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code,
        name: voucher.name,
        description: voucher.description || '',
        discountType: voucher.discountType as any,
        discount: voucher.discount,
        maxDiscountAmount: voucher.maxDiscountAmount || 0,
        minOrderAmount: voucher.minOrderAmount || 0,
        totalQuantity: voucher.totalQuantity || 0,
        maxPerUser: voucher.maxPerUser || 1,
        isActive: voucher.isActive,
        isPublic: voucher.isPublic,
        isFeatured: voucher.isFeatured,
        validFrom: voucher.validFrom ? voucher.validFrom.slice(0, 16) : '',
        expiresAt: voucher.expiresAt ? voucher.expiresAt.slice(0, 16) : '',
        applicablePackageIds: Array.isArray(voucher.applicablePackageIds) ? voucher.applicablePackageIds : []
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        discountType: 'PERCENTAGE',
        discount: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        totalQuantity: 100,
        maxPerUser: 1,
        isActive: true,
        isPublic: true,
        isFeatured: false,
        validFrom: new Date().toISOString().slice(0, 16),
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
        applicableTypes: '',
        applicablePackageIds: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCopyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Client-side validation
      if (formData.validFrom && formData.expiresAt) {
        if (new Date(formData.validFrom) >= new Date(formData.expiresAt)) {
          alert('Ngày bắt đầu phải trước ngày kết thúc');
          return;
        }
      }

      if (formData.discountType === 'PERCENTAGE' && formData.discount > 100) {
        alert('Mức giảm phần trăm không thể lớn hơn 100%');
        return;
      }

      // Ensure dates are in ISO format (add :00 if missing seconds)
      const formatDateTime = (dt: string) => {
        if (!dt) return undefined;
        if (dt.length === 16) return `${dt}:00`;
        return dt;
      };

      const submitData = {
        ...formData,
        validFrom: formatDateTime(formData.validFrom),
        expiresAt: formatDateTime(formData.expiresAt)
      };

      if (editingVoucher) {
        await voucherService.updateVoucher(editingVoucher.id, submitData);
        alert('Cập nhật voucher thành công');
      } else {
        await voucherService.createVoucher(submitData);
        alert('Tạo voucher thành công');
      }
      setIsModalOpen(false);
      fetchVouchers();
    } catch (error: any) {
      alert(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      try {
        await voucherService.deleteVoucher(id);
        alert('Xóa voucher thành công');
        // Clear list immediately for UX
        setVouchers(prev => prev.filter(v => v.id !== id));
        // Then re-fetch to sync with DB
        await fetchVouchers();
      } catch (error) {
        alert(getErrorMessage(error));
      }
    }
  };

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      // Use explicit mapping to avoid sending internal fields to backend
      const updateData: CreateVoucherRequest = {
        code: voucher.code,
        name: voucher.name,
        description: voucher.description || '',
        discountType: voucher.discountType as any,
        discount: voucher.discount,
        maxDiscountAmount: voucher.maxDiscountAmount,
        minOrderAmount: voucher.minOrderAmount,
        totalQuantity: voucher.totalQuantity,
        maxPerUser: voucher.maxPerUser,
        validFrom: voucher.validFrom,
        expiresAt: voucher.expiresAt,
        isActive: !voucher.isActive,
        isPublic: voucher.isPublic,
        isFeatured: voucher.isFeatured,
        applicableTypes: voucher.applicableTypes,
        applicablePackageIds: voucher.applicablePackageIds || []
      };

      await voucherService.updateVoucher(voucher.id, updateData);
      fetchVouchers();
    } catch (error: any) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h2>
          <p className="text-gray-600 mt-1">Tạo và quản lý các mã giảm giá cho dịch vụ</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã voucher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tạo Voucher mới</span>
            <span className="sm:hidden text-sm">Thêm</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã / Tên</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mức giảm</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy voucher phù hợp' : 'Chưa có voucher nào'}
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                          <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-gray-900 font-mono uppercase">{v.code}</div>
                            <button
                              onClick={() => handleCopyCode(v.code, v.id)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Copy mã"
                            >
                              {copyingId === v.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">{v.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {v.discountType === 'PERCENTAGE' ? `${v.discount}%` : `${new Intl.NumberFormat('vi-VN').format(v.discount)}đ`}
                      </div>
                      {v.maxDiscountAmount && v.discountType === 'PERCENTAGE' && (
                        <div className="text-xs text-gray-500">Tối đa: {new Intl.NumberFormat('vi-VN').format(v.maxDiscountAmount)}đ</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Đã dùng: {v.usedCount}</div>
                      <div className="text-xs text-gray-500">Còn lại: {v.remainingQuantity ?? '∞'} / {v.totalQuantity ?? '∞'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(v)}
                        title={v.isActive ? 'Nhấn để tạm dừng' : 'Nhấn để kích hoạt'}
                      >
                        {v.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold w-fit hover:bg-green-100 transition-colors cursor-pointer">
                            <CheckCircle className="w-3 h-3" /> Hoạt động
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-1 rounded-full text-xs font-bold w-fit hover:bg-gray-100 transition-colors cursor-pointer">
                            <XCircle className="w-3 h-3" /> Tạm dừng
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(v)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="bg-black/50 backdrop-blur-sm fixed inset-0 z-40" onClick={() => setIsModalOpen(false)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingVoucher ? 'Cập nhật Voucher' : 'Tạo Voucher mới'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mã Voucher</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingVoucher}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase font-mono disabled:bg-gray-50"
                        placeholder="VD: GIAMGIA50"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Loại giảm giá</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      >
                        <option value="PERCENTAGE">Phần trăm (%)</option>
                        <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Tên hiển thị</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="VD: Tri ân khách hàng thân thiết"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Giá trị giảm</label>
                      <input
                        type="number"
                        required
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.discount || ''}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setFormData({ ...formData, discount: val < 0 ? 0 : val });
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng tổng</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.totalQuantity || ''}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setFormData({ ...formData, totalQuantity: val < 0 ? 0 : val });
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Đơn tối thiểu (VNĐ)</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.minOrderAmount || ''}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setFormData({ ...formData, minOrderAmount: val < 0 ? 0 : val });
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Giảm tối đa (VNĐ)</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.maxDiscountAmount || ''}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setFormData({ ...formData, maxDiscountAmount: val < 0 ? 0 : val });
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày bắt đầu</label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày kết thúc</label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Lượt dùng / User</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.maxPerUser || ''}
                        onChange={(e) => setFormData({ ...formData, maxPerUser: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Gói dịch vụ áp dụng</label>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                        {packages.map(pkg => (
                          <label key={pkg.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={formData.applicablePackageIds?.includes(pkg.id)}
                              onChange={(e) => {
                                let newIds = [...(formData.applicablePackageIds || [])];
                                if (e.target.checked) {
                                  newIds.push(pkg.id);
                                } else {
                                  newIds = newIds.filter(id => id !== pkg.id);
                                }
                                setFormData({ ...formData, applicablePackageIds: newIds });
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {pkg.name}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {pkg.price.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Kích hoạt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Công khai</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Nổi bật</span>
                    </label>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    >
                      {editingVoucher ? 'Cập nhật ngay' : 'Tạo Voucher'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
