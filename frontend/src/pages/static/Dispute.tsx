import React from 'react';

export default function Dispute() {
  const steps = [
    {
      title: 'Bước 1: Gửi khiếu nại',
      desc: 'Thành viên liên hệ trực tiếp với bộ phận chăm sóc khách hàng qua Hotline 1900 6868 hoặc gửi email đính kèm bằng chứng về địa chỉ support@roomfinder.vn.'
    },
    {
      title: 'Bước 2: Xác minh thông tin',
      desc: 'Ban quản trị tiếp nhận phản ánh, liên hệ trực tiếp với các bên liên quan (người thuê, chủ trọ) để kiểm tra chứng từ đặt cọc, tin nhắn trao đổi hoặc hiện trạng phòng trọ.'
    },
    {
      title: 'Bước 3: Hòa giải và Phân xử',
      desc: 'RoomFinder đóng vai trò trung gian hỗ trợ thương lượng, hướng tới giải pháp hoàn cọc hoặc đền bù thiệt hại thỏa đáng trên cơ sở bảo vệ quyền lợi hợp pháp của các bên.'
    },
    {
      title: 'Bước 4: Xử lý vi phạm chính sách',
      desc: 'Khóa tài khoản và ẩn vĩnh viễn tin đăng của chủ nhà nếu xác định có dấu hiệu lừa đảo cố ý. Đồng thời lưu trữ thông tin vi phạm làm bằng chứng cung cấp cho cơ quan công an khi có yêu cầu phối hợp.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Quy Trình Giải Quyết Khiếu Nại & Tranh Chấp
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Cơ chế bảo vệ người tiêu dùng và xử lý tranh chấp giao dịch minh bạch, công bằng tại RoomFinder.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            RoomFinder đề cao cơ chế giải quyết mâu thuẫn bằng con đường thương lượng hòa giải. Mọi khiếu nại phát sinh trong quá trình tìm phòng hoặc giao dịch đặt cọc giữ chỗ đều được ban quản trị tiếp nhận và xử lý nhanh chóng trong vòng 48 giờ làm việc.
          </p>

          <div className="space-y-6">
            {steps.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="w-0.5 bg-gray-200 flex-grow my-2" />
                  )}
                </div>
                <div className="space-y-1 pb-4">
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl">
            <div className="space-y-1 text-xs text-gray-600 leading-relaxed">
              <p className="font-bold text-gray-900 text-amber-600">⚠️ Khuyến cáo an toàn giao dịch:</p>
              <p>
                RoomFinder khuyên bạn tuyệt đối không thực hiện bất kỳ giao dịch chuyển tiền nào ngoài cổng thanh toán chính thức của hệ thống khi chưa ký kết hợp đồng giấy hoặc hợp đồng điện tử có giá trị pháp lý rõ ràng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
