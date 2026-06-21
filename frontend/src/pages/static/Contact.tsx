import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Mọi thắc mắc, đóng góp ý kiến hoặc yêu cầu hỗ trợ kỹ thuật, vui lòng gửi tin nhắn cho chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Thông tin liên lạc</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Hotline hỗ trợ</h4>
                  <p className="text-lg font-bold text-gray-900 mt-1">1900 6868</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Email liên hệ</h4>
                  <p className="text-base font-semibold text-gray-900 mt-1">support@roomfinder.vn</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Địa chỉ trụ sở</h4>
                  <p className="text-sm font-medium text-gray-600 mt-1 leading-relaxed">
                    Trường Đại học Nông Lâm TP.HCM, Phường Linh Trung, Thành phố Thủ Đức, TP. Hồ Chí Minh.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Giờ làm việc</h4>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Thứ 2 - Thứ 7: 8:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto font-bold text-2xl">
                    &✓;
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Gửi lời nhắn thành công!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Cảm ơn bạn đã liên hệ. Chúng tôi đã tiếp nhận yêu cầu và sẽ phản hồi qua địa chỉ email của bạn trong vòng 24 giờ tới.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Gửi lời nhắn mới
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Gửi lời nhắn cho chúng tôi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ Email *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                      id="subject"
                      type="text"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Chủ đề bạn muốn liên hệ"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nội dung tin nhắn *</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Nhập nội dung cần hỗ trợ chi tiết tại đây..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Gửi yêu cầu hỗ trợ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
