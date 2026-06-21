import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-0 mb-4">
              <img src="/logo.png" alt="RoomFinder Logo" className="h-[40px] w-auto object-contain rounded-md" />
              <span className="text-lg font-bold text-gray-900">RoomFinder</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Nền tảng tìm kiếm và cho thuê phòng trọ hàng đầu, kết nối người thuê và chủ trọ nhanh chóng, an toàn.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Về chúng tôi</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-blue-600">Giới thiệu</Link></li>
              <li><Link to="/regulation" className="text-sm text-gray-600 hover:text-blue-600">Quy chế hoạt động</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Chính sách bảo mật</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              <li><Link to="/faqs" className="text-sm text-gray-600 hover:text-blue-600">Câu hỏi thường gặp</Link></li>
              <li><Link to="/post-guide" className="text-sm text-gray-600 hover:text-blue-600">Hướng dẫn đăng tin</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-blue-600">Bảng giá dịch vụ</Link></li>
              <li><Link to="/dispute" className="text-sm text-gray-600 hover:text-blue-600">Giải quyết khiếu nại</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Trường Đại học Nông Lâm TP.HCM, Phường Linh Trung, Thành phố Thủ Đức, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">1900 6868</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">support@roomfinder.vn</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} RoomFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
