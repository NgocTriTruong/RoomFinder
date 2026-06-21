import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-16 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/[0.08] bg-[size:20px_20px]" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-6 backdrop-blur-sm">
              Về RoomFinder
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Nền tảng tìm kiếm và cho thuê phòng trọ số 1 Việt Nam
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
              Chúng tôi kết nối hàng triệu người thuê nhà và chủ trọ bằng giải pháp công nghệ hiện đại, mang đến sự tiện lợi, an toàn và minh bạch tuyệt đối.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
                <div className="text-2xl md:text-3xl font-extrabold">10,000+</div>
                <div className="text-xs text-blue-200 mt-1">Tin đăng xác thực</div>
              </div>
              <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
                <div className="text-2xl md:text-3xl font-extrabold">50,000+</div>
                <div className="text-xs text-blue-200 mt-1">Người dùng tin cậy</div>
              </div>
              <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
                <div className="text-2xl md:text-3xl font-extrabold">98%</div>
                <div className="text-xs text-blue-200 mt-1">Tỷ lệ hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pt-2 border-t-4 border-blue-600">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Giải quyết triệt để nỗi lo tìm chỗ ở của thế hệ học sinh, sinh viên và người đi làm tại các đô thị lớn. Chúng tôi tối ưu hóa quy trình thuê phòng bằng cách cung cấp thông tin minh bạch, chính xác và được kiểm duyệt kỹ càng.
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4 text-sm font-semibold text-blue-600">
              Kiến tạo giá trị sống tốt đẹp hơn &rarr;
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pt-2 border-t-4 border-indigo-600">Tầm nhìn chiến lược</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Trở thành hệ sinh thái công nghệ bất động sản cho thuê toàn diện và uy tín hàng đầu khu vực. Tích hợp thanh toán, hỗ trợ pháp lý, hợp đồng điện tử và quản lý phòng trọ thông minh cho cả chủ nhà và khách thuê.
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4 text-sm font-semibold text-indigo-600">
              Chuyển đổi số ngành dịch vụ lưu trú &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tin cậy & Xác thực</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mọi tin đăng trên RoomFinder đều trải qua quy trình xác minh thông tin nghiêm ngặt, hạn chế rủi ro lừa đảo cọc phòng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tận tâm vì khách hàng</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Đội ngũ hỗ trợ 24/7 luôn sẵn sàng đồng hành, tư vấn và hỗ trợ người thuê tìm kiếm phòng ưng ý hoàn toàn miễn phí.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Công nghệ tiên phong</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Áp dụng thuật toán tìm kiếm thông minh, bản đồ định vị, và công nghệ lọc nâng cao giúp tiết kiệm thời gian lên đến 80%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
