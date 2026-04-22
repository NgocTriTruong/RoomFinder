import React, { useEffect, useState } from 'react';
import { X, ArrowUpCircle, Clock, Check, Loader2, Sparkles } from 'lucide-react';
import { subscriptionService, type PackageResponse } from '../../services/subscriptionService';
import { postService } from '../../services/postService';

interface BoostExtendModalProps {
  postId: number;
  postTitle: string;
  initialTab?: 'boost' | 'extend';
  onClose: () => void;
  onSuccess: () => void;
}

export default function BoostExtendModal({ postId, postTitle, initialTab = 'boost', onClose, onSuccess }: BoostExtendModalProps) {
  const [activeTab, setActiveTab] = useState<'boost' | 'extend'>(initialTab);
  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [extendDays, setExtendDays] = useState(30);

  useEffect(() => {
    if (activeTab === 'boost') {
      fetchPackages();
    }
  }, [activeTab]);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const data = await subscriptionService.getAvailablePackages('BOOST');
      setPackages(data);
      if (data.length > 0) setSelectedPackageId(data[0].id);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoost = async () => {
    if (!selectedPackageId) return;
    setIsSubmitting(true);
    try {
      await subscriptionService.boostPost(postId, selectedPackageId);
      onSuccess();
      onClose();
    } catch (error) {
      alert('Đẩy tin thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExtend = async () => {
    setIsSubmitting(true);
    try {
      await postService.extendPost(postId, extendDays);
      onSuccess();
      onClose();
    } catch (error) {
      alert('Gia hạn thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Nâng cấp bài đăng</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('boost')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'boost' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Đẩy tin VIP
          </button>
          <button 
            onClick={() => setActiveTab('extend')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'extend' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            Gia hạn tin
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded border border-gray-100">
            Đang thực hiện cho: <span className="font-semibold text-gray-900">{postTitle}</span>
          </p>

          {activeTab === 'boost' ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : packages.length === 0 ? (
                <p className="text-center py-8 text-gray-500">Không có gói dịch vụ nào khả dụng.</p>
              ) : (
                <div className="grid gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`relative flex flex-col p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPackageId === pkg.id 
                          ? 'border-blue-600 bg-blue-50/30' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      {selectedPackageId === pkg.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900">{pkg.name}</span>
                        <span className="text-blue-600 font-bold">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{pkg.description}</p>
                      <div className="mt-2 inline-flex items-center text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase">
                        Hiệu lực {pkg.durationDays} ngày
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleBoost}
                disabled={isSubmitting || !selectedPackageId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-6 shadow-lg shadow-blue-200"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Xác nhận đẩy tin ngay
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Chọn thời gian gia hạn</label>
                <div className="grid grid-cols-3 gap-3">
                  {[15, 30, 60].map((days) => (
                    <button
                      key={days}
                      onClick={() => setExtendDays(days)}
                      className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                        extendDays === days ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-400'
                      }`}
                    >
                      {days} ngày
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Lưu ý:</strong> Việc gia hạn sẽ cộng thêm thời gian vào ngày hết hạn hiện tại của bài đăng. 
                  Chi phí sẽ được tính dựa trên biểu giá hiện hành.
                </p>
              </div>

              <button
                onClick={handleExtend}
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-gray-200"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Gia hạn ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
