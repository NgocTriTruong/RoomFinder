import React from 'react';

export default function Pricing() {
  const packages = [
    {
      name: 'Tin Thường',
      price: '0 VNĐ',
      period: 'ngày',
      color: 'border-gray-200 bg-white',
      badge: null,
      features: [
        'Hiển thị sau tin VIP',
        'Tối đa 3 hình ảnh phòng',
        'Hỗ trợ duyệt tự động',
        'Đăng tin trong 7 ngày'
      ]
    },
    {
      name: 'VIP 3',
      price: '10,000 VNĐ',
      period: 'ngày',
      color: 'border-blue-200 bg-white ring-1 ring-blue-100',
      badge: 'Phổ biến nhất',
      features: [
        'Hiển thị trên tin thường',
        'Tối đa 6 hình ảnh phòng',
        'Đính kèm số điện thoại nổi bật',
        'Hỗ trợ duyệt nhanh'
      ]
    },
    {
      name: 'VIP 2',
      price: '20,000 VNĐ',
      period: 'ngày',
      color: 'border-purple-200 bg-white ring-1 ring-purple-100',
      badge: 'Được đề xuất',
      features: [
        'Hiển thị vị trí top kết quả tìm kiếm',
        'Không giới hạn hình ảnh phòng',
        'Gắn nhãn VIP màu tím nổi bật',
        'Tự động đẩy tin định kỳ'
      ]
    },
    {
      name: 'VIP Đặc Biệt (VIP 1)',
      price: '50,000 VNĐ',
      period: 'ngày',
      color: 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-400 shadow-md',
      badge: 'Nổi bật nhất',
      features: [
        'Hiển thị Banner lớn tại Trang chủ',
        'Gắn nhãn Gold VIP đặc sắc',
        'Ưu tiên đẩy tin tự động mỗi giờ',
        'Đội ngũ chăm sóc khách hàng VIP hỗ trợ'
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Bảng Giá Dịch Vụ Đăng Tin
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Lựa chọn gói tin phù hợp để tiếp cận hàng ngàn khách thuê có nhu cầu thực tế mỗi ngày.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`border rounded-2xl p-6 relative flex flex-col justify-between transition-all hover:shadow-lg ${pkg.color}`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {pkg.badge}
                </span>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-black text-gray-900">{pkg.price}</span>
                  <span className="text-xs text-gray-400">/ {pkg.period}</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="text-emerald-500 font-bold select-none">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
                  pkg.price === '0 VNĐ'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                Chọn Gói Dịch Vụ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
