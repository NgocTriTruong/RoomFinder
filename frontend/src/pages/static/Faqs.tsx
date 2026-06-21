import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function Faqs() {
  const [activeCategory, setActiveCategory] = useState<'tenant' | 'landlord' | 'payment'>('tenant');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'tenant', name: 'Người tìm phòng' },
    { id: 'landlord', name: 'Chủ cho thuê' },
    { id: 'payment', name: 'Thanh toán & Gói tin' }
  ];

  const faqs: Record<'tenant' | 'landlord' | 'payment', FAQItem[]> = {
    tenant: [
      {
        question: 'Tôi có phải mất phí khi tìm phòng trọ trên RoomFinder không?',
        answer: 'Hoàn toàn không. RoomFinder miễn phí 100% dịch vụ tìm kiếm phòng trọ, lọc thông tin và chat trực tiếp với chủ nhà dành cho người thuê.'
      },
      {
        question: 'Làm thế nào để biết một tin đăng có uy tín hay không?',
        answer: 'Bạn nên ưu tiên chọn các tin đăng có gắn nhãn "Đã xác minh" (Tick xanh). Đây là các phòng trọ đã được đội ngũ RoomFinder kiểm duyệt thông tin thực tế, giấy tờ pháp lý của chủ nhà đầy đủ.'
      },
      {
        question: 'Tôi nên lưu ý những gì trước khi đặt cọc giữ chỗ?',
        answer: 'Tuyệt đối không chuyển tiền cọc khi chưa đến xem phòng trực tiếp. Hãy yêu cầu chủ trọ xuất trình giấy tờ tùy thân, giấy tờ sở hữu căn nhà và làm biên bản đặt cọc có chữ ký rõ ràng của hai bên.'
      }
    ],
    landlord: [
      {
        question: 'Làm thế nào để đăng tin cho thuê trên website?',
        answer: 'Bước 1: Tạo tài khoản với vai trò "Chủ cho thuê". Bước 2: Truy cập trang quản trị cá nhân và chọn "Đăng tin mới". Bước 3: Nhập đầy đủ thông tin phòng, giá thuê, hình ảnh và lưu lại.'
      },
      {
        question: 'Tại sao tin đăng của tôi bị từ chối phê duyệt?',
        answer: 'Tin đăng có thể bị từ chối do hình ảnh mờ/lấy từ mạng, địa chỉ không rõ ràng hoặc giá thuê không khớp thực tế. Vui lòng kiểm tra email thông báo chi tiết từ ban quản trị để sửa lại tin đăng.'
      },
      {
        question: 'Làm thế nào để tin đăng hiển thị ở vị trí đầu trang?',
        answer: 'Bạn có thể nâng cấp tin đăng thông thường lên gói tin VIP (VIP 1, VIP 2, VIP 3) để hiển thị nổi bật ở trang chủ và vị trí ưu tiên trong kết quả tìm kiếm.'
      }
    ],
    payment: [
      {
        question: 'Hệ thống hỗ trợ những phương thức thanh toán nào?',
        answer: 'RoomFinder hỗ trợ thanh toán trực tuyến an toàn thông qua Cổng thanh toán VNPAY (Thẻ ATM nội địa, QR Code ngân hàng, Thẻ quốc tế Visa/Mastercard).'
      },
      {
        question: 'Hóa đơn dịch vụ được xử lý như thế nào?',
        answer: 'Ngay sau khi giao dịch nâng cấp gói tin thành công, hệ thống sẽ gửi biên nhận điện tử chi tiết về email đăng ký của bạn. Bạn cũng có thể xem lại lịch sử giao dịch tại mục Quản lý số dư.'
      }
    ]
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Câu Hỏi Thường Gặp (FAQs)
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về RoomFinder.
          </p>
        </div>

        {/* Categories Tab */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {faqs[activeCategory].map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="transition-colors hover:bg-gray-50/50">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="font-bold text-gray-900 pr-4">{item.question}</span>
                  <span className="text-xl font-bold text-gray-400 flex-shrink-0 w-6 text-center select-none">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
