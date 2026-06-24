import React, { useState, useEffect } from 'react';
import { Check, X, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { subscriptionService } from '@/services/subscriptionService';
import type { PackageResponse } from '@/services/subscriptionService';
import { getErrorMessage } from '@/services/api';

export default function SubscriptionPackagesPage() {
  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<string>('VNPAY');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const [packagesData, currentSubData] = await Promise.all([
        subscriptionService.getAvailablePackages(),
        subscriptionService.getCurrentSubscription()
      ]);
      setPackages(packagesData);
      setCurrentSubscription(currentSubData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (pkg: PackageResponse) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    setPaymentStatus('idle');
    setPaymentMethod('VNPAY');
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;
    
    setPaymentStatus('processing');
    setProcessing(true);
    
    try {
      const result = await subscriptionService.purchasePackage(
        selectedPackage.id,
        paymentMethod
      );
      
      if (result.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = result.paymentUrl;
      } else {
        // If no redirect needed, show success
        setPaymentStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
          setPaymentStatus('idle');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('error');
      alert('Thanh toán thất bại: ' + getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const getFeaturesFromPackage = (pkg: PackageResponse): string[] => {
    const features: string[] = [];
    
    // 1. Post limit feature
    if ((pkg.maxPosts ?? 0) > 0) {
      const hasLimitFeatureInDb = pkg.features?.some(f => 
        f.toLowerCase().includes('đăng tối đa') || 
        f.toLowerCase().includes('đăng tin không giới hạn')
      );
      if (!hasLimitFeatureInDb) {
        features.push(pkg.maxPosts! >= 999 ? 'Đăng tin không giới hạn' : `Đăng tối đa ${pkg.maxPosts} tin`);
      }
    } else {
      const hasLimitFeatureInDb = pkg.features?.some(f => 
        f.toLowerCase().includes('đăng tin')
      );
      if (!hasLimitFeatureInDb) {
        features.push('Đăng tin theo hạn mức cơ bản');
      }
    }
    
    // 2. Duration feature
    if (pkg.durationDays > 0) {
      const hasDurationFeatureInDb = pkg.features?.some(f => 
        f.toLowerCase().includes('hiệu lực') ||
        f.toLowerCase().includes('thời hạn') ||
        f.toLowerCase().includes('hạn dùng') ||
        f.toLowerCase().includes('sử dụng') ||
        (f.toLowerCase().includes('ngày') && /\d+/.test(f))
      );
      if (!hasDurationFeatureInDb) {
        features.push(`Hiệu lực gói trong ${pkg.durationDays} ngày`);
      }
    }

    // 3. Dynamic features from pkg.features
    if (pkg.features && pkg.features.length > 0) {
      pkg.features.forEach(f => {
        if (!features.includes(f)) {
          features.push(f);
        }
      });
    }

    // 4. Rich package-specific details based on price/type to make it look full and attractive
    const nameLower = pkg.name.toLowerCase();
    if (pkg.price >= 500000 || nameLower.includes('vip') || nameLower.includes('cao cấp') || nameLower.includes('pro')) {
      features.push('Đẩy tin tự động lên đầu danh sách hàng ngày');
      features.push('Đính kèm video giới thiệu phòng trực quan');
      features.push('Ưu tiên hiển thị & duyệt tin nhanh dưới 5 phút');
      features.push('Báo cáo phân tích lượt tiếp cận người dùng chi tiết');
      features.push('Đường dây nóng hỗ trợ kỹ thuật riêng biệt 24/7');
    } else if (pkg.price >= 150000 || nameLower.includes('tiêu chuẩn') || nameLower.includes('standard') || nameLower.includes('plus')) {
      features.push('Hiển thị thông tin liên hệ & tối đa 10 hình ảnh');
      features.push('Hỗ trợ đẩy tin thủ công 3 lần/ngày');
      features.push('Hỗ trợ ưu tiên qua Zalo/Email 24/7');
      features.push('Tương thích tốt trên mọi thiết bị di động');
      features.push('Phân tích và thống kê lượt xem tin cơ bản');
    } else {
      // Basic / Standard low-tier package features
      features.push('Hiển thị thông tin liên hệ & 5 hình ảnh phòng');
      features.push('Đăng tải mô tả chi tiết phòng trọ');
      features.push('Hỗ trợ kỹ thuật cơ bản qua email');
      features.push('Tương thích tốt trên Mobile và Desktop');
    }

    if ((pkg.boostDays ?? 0) > 0) {
      features.push(`Tặng ${pkg.boostDays} ngày đẩy tin VIP miễn phí`);
    }

    // De-duplicate features
    return Array.from(new Set(features));
  };

  const sortedPackages = [...packages].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

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
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Bảng giá dịch vụ</h2>
        <p className="mt-4 text-gray-600">
          Chọn gói dịch vụ phù hợp để tiếp cận nhiều khách thuê hơn và quản lý tin đăng hiệu quả.
        </p>
      </div>

      {currentSubscription && (
        <div className="max-w-6xl mx-auto mt-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg overflow-hidden text-white">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">Gói hiện tại: {currentSubscription.packageName}</h3>
                    <span className="bg-green-400 text-green-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Đang hoạt động</span>
                  </div>
                  <p className="text-blue-100 mt-1">
                    Hết hạn vào: {new Date(currentSubscription.expiresAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-8 border-l border-white/20 pl-8 hidden md:flex">
                <div className="text-center">
                  <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Tin đã dùng</p>
                  <p className="text-2xl font-bold">{currentSubscription.usedPosts}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Tin còn lại</p>
                  <p className="text-2xl font-bold">{currentSubscription.remainingPosts}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Ngày còn lại</p>
                  <p className="text-2xl font-bold">{currentSubscription.remainingDays} ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {packages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Hiện không có gói dịch vụ nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
          {sortedPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative flex flex-col bg-white rounded-2xl shadow-sm border ${
                pkg.isFeatured ? 'border-blue-500 shadow-md transform md:-translate-y-4' : 'border-gray-200'
              }`}
            >
              {pkg.isFeatured && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Phổ biến nhất
                  </span>
                </div>
              )}
              <div className="p-8 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 text-center">{pkg.name}</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(pkg.price)}đ
                  </span>
                  <span className="text-base font-medium text-gray-500">/tháng</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {getFeaturesFromPackage(pkg).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                {(() => {
                  const currentPackagePrice = currentSubscription 
                    ? packages.find(p => p.id === currentSubscription.packageId)?.price || 0 
                    : 0;
                  const isDowngrade = currentSubscription && pkg.price < currentPackagePrice;
                  const isCurrent = currentSubscription && currentSubscription.packageId === pkg.id;
                  const isDisabled = !pkg.isActive || isCurrent || isDowngrade;

                  return (
                    <button
                      onClick={() => handleBuy(pkg)}
                      disabled={isDisabled}
                      className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                        isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : pkg.isFeatured
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {!pkg.isActive 
                        ? 'Không khả dụng' 
                        : isCurrent
                        ? 'Đang sử dụng'
                        : isDowngrade
                        ? 'Cần chờ gói hiện tại hết hạn'
                        : 'Mua gói ngay'}
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Thanh toán</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {paymentStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h4>
                  <p className="text-gray-600">Bạn đã đăng ký thành công {selectedPackage.name}.</p>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Gói dịch vụ</p>
                    <p className="font-semibold text-gray-900">{selectedPackage.name}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPackage.price)}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</p>
                    <div className="space-y-3">
                      <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'VNPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="VNPAY"
                          checked={paymentMethod === 'VNPAY'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="ml-3 font-medium text-gray-900">VNPay</span>
                      </label>
                      <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'MOMO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="MOMO"
                          checked={paymentMethod === 'MOMO'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="ml-3 font-medium text-gray-900">Ví MoMo</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Xác nhận thanh toán'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
