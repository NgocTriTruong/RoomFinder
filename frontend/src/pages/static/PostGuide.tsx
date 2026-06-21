import React from 'react';

export default function PostGuide() {
  const steps = [
    {
      step: '01',
      title: 'Đăng ký tài khoản Chủ cho thuê',
      desc: 'Tạo tài khoản mới trên hệ thống, chọn vai trò là "Chủ cho thuê". Điền đầy đủ thông tin cá nhân và số điện thoại liên lạc.'
    },
    {
      step: '02',
      title: 'Xác thực tài khoản (KYC)',
      desc: 'Để tăng mức độ uy tín và tin cậy cho người thuê, bạn hãy chụp hình và gửi tài liệu xác thực để ban quản trị cấp tích xanh.'
    },
    {
      step: '03',
      title: 'Tạo thông tin phòng trọ',
      desc: 'Vào quản lý nhà trọ, thêm thông tin phòng trọ (Địa chỉ, giá cả, diện tích, tiền điện nước, các tiện ích xung quanh).'
    },
    {
      step: '04',
      title: 'Chọn gói tin và Đăng bài',
      desc: 'Chọn loại tin hiển thị (Tin thường hoặc VIP), thanh toán phí dịch vụ (nếu có) và nhấn Đăng bài. Tin sẽ được duyệt trong vòng 10-30 phút.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-4">
            Hướng dẫn dành cho Chủ nhà
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Quy Trình Đăng Tin Cho Thuê Phòng
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Chi tiết các bước đơn giản giúp tin đăng của bạn nhanh chóng tiếp cận khách hàng tiềm năng.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-6">
          {steps.map((item, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start">
              <div className="text-3xl md:text-4xl font-black text-blue-600/30 font-mono tracking-tight">
                {item.step}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips Box */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 space-y-4">
          <h4 className="font-bold text-blue-900 text-base">
            Mẹo đăng tin hiệu quả cao
          </h4>
          <ul className="list-disc pl-5 text-sm text-blue-800 space-y-2 leading-relaxed">
            <li><strong>Chụp ảnh rõ nét:</strong> Nên có từ 3-5 hình ảnh góc rộng, ánh sáng tốt gồm ảnh toàn cảnh phòng, nhà vệ sinh và khu vực để xe.</li>
            <li><strong>Mô tả chi tiết:</strong> Chỉ rõ khoảng cách đến các trường đại học lớn, trạm xe buýt hoặc siêu thị để thu hút sinh viên.</li>
            <li><strong>Cập nhật trạng thái:</strong> Đánh dấu phòng đã cho thuê ngay khi có khách chốt cọc để tránh bị làm phiền.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
