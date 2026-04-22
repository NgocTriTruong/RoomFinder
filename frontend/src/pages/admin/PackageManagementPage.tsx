import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AdminPackageResponse } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';

interface PackageFormData {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  type: 'POST' | 'BOOST' | 'SUB';
  postLimit: number;
  boostLimit: number;
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
    durationDays: 30,
    type: 'SUB',
    postLimit: 5,
    boostLimit: 0,
  });

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
        durationDays: pkg.durationDays,
        type: pkg.type,
        postLimit: pkg.postLimit,
        boostLimit: pkg.boostLimit,
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        durationDays: 30,
        type: 'SUB',
        postLimit: 5,
        boostLimit: 0,
      });
    }
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
      await fetchPackages();
    } catch (err) {
      alert('Xóa thất bại: ' + getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (pkg: AdminPackageResponse) => {
    try {
      await adminService.updatePackage(pkg.id, { isActive: !pkg.isActive });
      await fetchPackages();
    } catch (err) {
      alert('Cập nhật thất bại: ' + getErrorMessage(err));
    }
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
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className={`p-4 border-b ${pkg.isActive ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {pkg.isActive ? 'Hoạt động' : 'Đã ẩn'}
                  </span>
                </div>
                <div className="mt-2 text-2xl font-extrabold text-blue-600">
                  {new Intl.NumberFormat('vi-VN').format(pkg.price)}đ
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {pkg.durationDays} ngày
                </div>
              </div>
              
              <div className="p-4 flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Loại:</span>
                  <span className="font-bold text-gray-900">
                    {pkg.type === 'SUB' ? 'Đăng ký' : pkg.type === 'POST' ? 'Đăng tin' : 'Đẩy tin'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Số tin cho phép:</span>
                  <span className="font-bold text-gray-900">{pkg.postLimit >= 999 ? 'Không giới hạn' : pkg.postLimit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lượt đẩy VIP:</span>
                  <span className="font-bold text-gray-900">{pkg.boostLimit}</span>
                </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPackage ? 'Sửa gói dịch vụ' : 'Tạo gói dịch vụ mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleSave}>
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
                  placeholder="Mô tả gói dịch vụ"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá tiền (VNĐ)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                  placeholder="VD: 150000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại gói</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'POST' | 'BOOST' | 'SUB' })}
                >
                  <option value="SUB">Đăng ký</option>
                  <option value="POST">Đăng tin</option>
                  <option value="BOOST">Đẩy tin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tin</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                    placeholder="VD: 10"
                    value={formData.postLimit}
                    onChange={(e) => setFormData({ ...formData, postLimit: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lượt đẩy VIP</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                    placeholder="VD: 2"
                    value={formData.boostLimit}
                    onChange={(e) => setFormData({ ...formData, boostLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (ngày)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" 
                  placeholder="VD: 30"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
