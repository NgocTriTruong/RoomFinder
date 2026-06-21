import React from 'react';

export default function Privacy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mb-4">
            An toàn & Bảo mật
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Chính Sách Bảo Mật Thông Tin
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Chúng tôi cam kết bảo vệ tuyệt đối dữ liệu cá nhân và quyền riêng tư của bạn.
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-sm">
            Chính sách bảo mật này mô tả cách RoomFinder thu thập, sử dụng, lưu trữ và chia sẻ thông tin cá nhân của bạn khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ của chúng tôi.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">1. Thông tin chúng tôi thu thập</h2>
            </div>
            <div className="text-gray-600 leading-relaxed text-sm space-y-2">
              <p>Để cung cấp trải nghiệm tìm kiếm và kết nối tốt nhất, chúng tôi thu thập các loại thông tin sau:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Thông tin tài khoản:</strong> Họ và tên, email, số điện thoại, mật khẩu được mã hóa.</li>
                <li><strong>Thông tin xác thực (KYC):</strong> Ảnh chụp thẻ sinh viên hoặc giấy tờ tùy thân liên quan (chỉ áp dụng khi yêu cầu cấp tick xanh xác thực).</li>
                <li><strong>Dữ liệu tin đăng:</strong> Vị trí phòng trọ, giá tiền, hình ảnh phòng trọ của bạn.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">2. Mục đích sử dụng thông tin</h2>
            </div>
            <div className="text-gray-600 leading-relaxed text-sm space-y-2">
              <p>Dữ liệu cá nhân thu thập được sử dụng duy nhất cho các mục đích:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Duy trì tài khoản và kết nối liên lạc giữa người thuê với chủ trọ.</li>
                <li>Gửi thông báo cập nhật trạng thái tin đăng, lịch hẹn đặt phòng hoặc xác thực tài khoản.</li>
                <li>Phục vụ công tác thanh toán hóa đơn và thống kê số liệu trên hệ thống.</li>
                <li>Phát hiện và ngăn chặn các hành vi gian lận hoặc truy cập trái phép.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">3. Bảo mật thông tin cá nhân</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              RoomFinder áp dụng các tiêu chuẩn công nghệ bảo mật cao cấp (như SSL/TLS mã hóa đường truyền, hashing mật khẩu một chiều bcrypt) để chống mất mát, rò rỉ thông tin cá nhân. Chúng tôi cam kết tuyệt đối không bán, cho thuê hoặc chuyển nhượng thông tin khách hàng cho bất kỳ bên thứ ba nào khi chưa được sự cho phép rõ ràng từ chính khách hàng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
