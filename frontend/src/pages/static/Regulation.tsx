import React from 'react';

export default function Regulation() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-4">
            Quy chế vận hành
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Quy Chế Hoạt Động Website RoomFinder
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Quy định chung áp dụng cho toàn bộ thành viên khi giao dịch và tương tác trên nền tảng.
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">1. Nguyên tắc chung</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Sàn giao dịch thương mại điện tử RoomFinder hoạt động dưới sự tuân thủ nghiêm ngặt của Luật Thương mại điện tử Việt Nam. Mọi thành viên tham gia hoạt động trên hệ thống phải tôn trọng quyền lợi của các bên, cung cấp thông tin trung thực, chính xác và tự chịu trách nhiệm trước pháp luật về mọi hành vi của mình.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">2. Quy định về tin đăng và kiểm duyệt</h2>
            </div>
            <div className="text-gray-600 leading-relaxed text-sm space-y-2">
              <p>Mọi tin đăng cho thuê phòng trọ trên RoomFinder bắt buộc phải tuân thủ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Thông tin về địa chỉ, giá thuê, diện tích và tiện ích phải hoàn toàn chính xác theo thực tế.</li>
                <li>Hình ảnh đính kèm phải là hình ảnh thật của phòng trọ, không được sử dụng hình ảnh minh họa giả mạo.</li>
                <li>Nội dung không chứa từ ngữ thô tục, vi phạm pháp luật, thuần phong mỹ tục hoặc xâm phạm lợi ích của bên thứ ba.</li>
                <li>Mọi tin đăng sẽ được đội ngũ kiểm duyệt phê duyệt trước khi hiển thị công khai trên nền tảng.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">3. Quyền và nghĩa vụ của Thành viên</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Quyền lợi:</h3>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>Tạo tài khoản và trải nghiệm tìm kiếm phòng hoàn toàn miễn phí.</li>
                  <li>Sử dụng các dịch vụ liên hệ, chat trực tiếp với chủ nhà thông qua cổng tin nhắn bảo mật.</li>
                  <li>Báo cáo tin đăng sai lệch hoặc có dấu hiệu lừa đảo để ban quản trị xử lý.</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Trách nhiệm:</h3>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>Bảo mật thông tin đăng nhập cá nhân (mật khẩu, tài khoản).</li>
                  <li>Không đăng tin ảo, spam hoặc thực hiện các hành vi gây mất uy tín của sàn.</li>
                  <li>Tự thẩm định thông tin pháp lý của phòng trọ trước khi thực hiện đặt cọc hoặc ký hợp đồng.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">4. Xử lý vi phạm</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Ban quản trị RoomFinder có quyền gỡ bỏ vĩnh viễn các tin đăng vi phạm quy chế hoặc có phản hồi tiêu cực từ người thuê mà không cần báo trước. Tài khoản có hành vi gian lận hoặc lừa đảo cọc sẽ bị khóa vĩnh viễn và chuyển giao thông tin cho cơ quan chức năng xử lý theo quy định của pháp luật.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
