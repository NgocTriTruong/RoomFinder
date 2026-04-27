import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AdminPackageResponse } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';

interface PackageFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  durationDays: number;
  type: string;
  maxPosts: number;
  boostDays: number;
  features: string[];
  displayOrder: number;
  isFeatured: boolean;
}

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<AdminPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AdminPackageResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discountPercent: 0,
    durationDays: 30,
    type: 'POST_BASIC',
    maxPosts: 5,
    boostDays: 0,
    features: [],
    displayOrder: 0,
    isFeatured: false,
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getPackages(0, 100);
      setPackages(data.content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg?: AdminPackageResponse) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        originalPrice: pkg.originalPrice || pkg.price,
        discountPercent: pkg.discountPercent || 0,
        durationDays: pkg.durationDays,
        type: pkg.type,
        maxPosts: pkg.maxPosts,
        boostDays: pkg.boostDays,
        features: pkg.features || [],
        displayOrder: pkg.displayOrder || 0,
        isFeatured: pkg.isFeatured || false,
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        discountPercent: 0,
        durationDays: 30,
        type: 'POST_BASIC',
        maxPosts: 5,
        boostDays: 0,
        features: [],
        displayOrder: 0,
        isFeatured: false,
      });
    }
    setNewFeature('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPackage) {
        await adminService.updatePackage(editingPackage.id, formData);
      } else {
        await adminService.createPackage(formData);
      }
      setIsModalOpen(false);
      await fetchPackages();
    } catch (err) {
      alert('Lưu thất bại: ' + getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) return;
    
    setDeleting(id);
    try {
      await adminService.deletePackage(id);
      alert('Xóa gói dịch vụ thành công');
      await fetchPackages();
    } catch (err) {
      alert('Xóa thất bại: ' + getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (pkg: AdminPackageResponse) => {
    try {
      await adminService.updatePackage(pkg.id, {
        name: pkg.name,
        description: pkg.description || '',
        type: pkg.type,
        price: pkg.price,
        originalPrice: pkg.originalPrice || 0,
        durationDays: pkg.durationDays,
        maxPosts: pkg.maxPosts,
        boostDays: pkg.boostDays,
        isActive: !pkg.isActive,
        isFeatured: pkg.isFeatured,
        displayOrder: pkg.displayOrder,
        features: pkg.features || []
      });
      alert(`${pkg.isActive ? 'Tắt' : 'Bật'} gói thành công`);
      await fetchPackages();
    } catch (err) {
      alert('Cập nhật thất bại: ' + getErrorMessage(err));
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPackages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Gói dịch vụ</h2>
          <p className="text-gray-600 mt-1">Cấu hình các gói đăng tin cho chủ trọ</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo gói mới
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Chưa có gói dịch vụ nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((pkg) => (
            <div key={pkg.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${pkg.isFeatured ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200'}`}>
              <div className={`p-4 border-b relative ${pkg.isActive ? (pkg.isFeatured ? 'bg-blue-600 text-white' : 'bg-blue-50 border-blue-100') : 'bg-gray-50 border-gray-200'}`}>
                {pkg.isFeatured && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">
                    Nổi bật
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-bold ${pkg.isActive && pkg.isFeatured ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    pkg.isActive ? (pkg.isFeatured ? 'bg-blue-400/30 text-white border border-white/20' : 'bg-green-100 text-green-700') : 'bg-gray-200 text-gray-600'
                  }`}>
                    {pkg.isActive ? 'Hoạt động' : 'Đã ẩn'}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className={`text-2xl font-extrabold ${pkg.isActive && pkg.isFeatured ? 'text-white' : 'text-blue-600'}`}>
                    {new Intl.NumberFormat('vi-VN').format(pkg.price)}đ
                  </div>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className={`text-xs line-through ${pkg.isActive && pkg.isFeatured ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Intl.NumberFormat('vi-VN').format(pkg.originalPrice)}đ
                    </div>
                  )}
                </div>
                <div className={`text-xs mt-1 ${pkg.isActive && pkg.isFeatured ? 'text-blue-100' : 'text-gray-500'}`}>
                  {pkg.durationDays} ngày
                </div>
              </div>
              
              <div className="p-4 flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Loại:</span>
                  <span className="font-bold text-gray-900">
                    {pkg.typeDisplayName || pkg.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tin đăng:</span>
                  <span className="font-bold text-gray-900">{pkg.maxPosts >= 999 ? 'Không giới hạn' : pkg.maxPosts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ngày Boost:</span>
                  <span className="font-bold text-gray-900">{pkg.boostDays}</span>
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Tính năng:</p>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          {f}
                        </li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-xs text-gray-400 italic">+{pkg.features.length - 3} tính năng khác</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => handleToggleStatus(pkg)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border border-gray-200"
                >
                  {pkg.isActive ? 'Tắt' : 'Bật'}
                </button>
                <button 
                  onClick={() => handleOpenModal(pkg)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border border-gray-200"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(pkg.id)}
                  disabled={deleting === pkg.id}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border border-red-100 disabled:opacity-50"
                >
                  {deleting === pkg.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full my-auto overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPackage ? 'Sửa gói dịch vụ' : 'Tạo gói dịch vụ mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="package-form" className="space-y-4" onSubmit={handleSave}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                    placeholder="VD: Gói Siêu Tốc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                    placeholder="Mô tả gói dịch vụ (không bắt buộc)"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá hiển thị (VNĐ)</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                      placeholder="VD: 150000"
                      value={formData.price || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormData({ ...formData, price: val < 0 ? 0 : val });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (để gạch ngang)</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                      placeholder="VD: 200000"
                      value={formData.originalPrice || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormData({ ...formData, originalPrice: val < 0 ? 0 : val });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại gói</label>
                    <select 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="POST_BASIC">Gói Cơ Bản</option>
                      <option value="POST_STANDARD">Gói Tiêu Chuẩn</option>
                      <option value="POST_PREMIUM">Gói Cao Cấp</option>
                      <option value="BOOST_DAILY">Đẩy tin 1 ngày</option>
                      <option value="BOOST_WEEKLY">Đẩy tin 7 ngày</option>
                      <option value="BOOST_MONTHLY">Đẩy tin 30 ngày</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (ngày)</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                      placeholder="VD: 30"
                      value={formData.durationDays || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormData({ ...formData, durationDays: val < 0 ? 0 : val });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tin</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                      placeholder="VD: 10"
                      value={formData.maxPosts || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormData({ ...formData, maxPosts: val < 0 ? 0 : val });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số ngày Boost</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                      placeholder="VD: 2"
                      value={formData.boostDays || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormData({ ...formData, boostDays: val < 0 ? 0 : val });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                      value={formData.displayOrder || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormData({ ...formData, displayOrder: val < 0 ? 0 : val });
                      }}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <span className="text-sm font-medium text-gray-700">Gói nổi bật</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tính năng đi kèm</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm" 
                      placeholder="Nhập tính năng..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" onClick={addFeature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                      Thêm
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((f, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {f}
                        <button type="button" onClick={() => removeFeature(i)} className="ml-1.5 inline-flex items-center justify-center text-blue-400 hover:text-blue-600 focus:outline-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button 
                form="package-form"
                type="submit" 
                disabled={saving} 
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu gói'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
