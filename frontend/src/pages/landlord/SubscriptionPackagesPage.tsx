import React, { useState, useEffect } from 'react';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import type { PackageResponse } from '../../services/subscriptionService';
import { transactionService } from '../../services/transactionService';
import { getErrorMessage } from '../../services/api';

export default function SubscriptionPackagesPage() {
  const [packages, setPackages] = useState<PackageResponse[]>([]);
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
      const data = await subscriptionService.getAvailablePackages();
      setPackages(data);
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
      const result = await transactionService.createSubscriptionPayment(
        selectedPackage.id,
        paymentMethod,
        selectedPackage.price
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
    const features = [...(pkg.features || [])];
    if ((pkg.maxPosts ?? 0) > 0) {
      features.push(pkg.maxPosts! >= 999 ? 'Đăng tin không giới hạn' : `Đăng tối đa ${pkg.maxPosts} tin`);
    }
    if ((pkg.boostDays ?? 0) > 0) {
      features.push(`Tặng ${pkg.boostDays} ngày đẩy tin VIP`);
    }
    if (pkg.durationDays > 0) {
      features.push(`Hiệu lực ${pkg.durationDays} ngày`);
    }
    if (pkg.type === 'SUB') {
      features.push('Hỗ trợ ưu tiên');
    }
    return Array.from(new Set(features));
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
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Bảng giá dịch vụ</h2>
        <p className="mt-4 text-gray-600">
          Chọn gói dịch vụ phù hợp để tiếp cận nhiều khách thuê hơn và quản lý tin đăng hiệu quả.
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Hiện không có gói dịch vụ nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className={`relative flex flex-col bg-white rounded-2xl shadow-sm border ${
                index === 1 ? 'border-blue-500 shadow-md transform md:-translate-y-4' : 'border-gray-200'
              }`}
            >
              {index === 1 && (
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
                <button
                  onClick={() => handleBuy(pkg)}
                  disabled={!pkg.isActive}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                    !pkg.isActive
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : index === 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {pkg.isActive ? 'Mua gói ngay' : 'Không khả dụng'}
                </button>
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
