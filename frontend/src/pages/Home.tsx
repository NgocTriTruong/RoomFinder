import React, { useEffect, useState } from 'react';
import { Search, MapPin, Loader2, Home as HomeIcon, Building2, Warehouse, BedDouble, Car, Wifi, Wind, Tv, Waves, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoomCard from '../components/ui/RoomCard';
import postService from '../services/postService';
import type { PostResponse } from '../types';
import { createPlaceholderImage } from '../utils/localImage';

const CATEGORIES = [
  { icon: HomeIcon, label: 'Phòng trọ', value: 'room' },
  { icon: Building2, label: 'Căn hộ', value: 'apartment' },
  { icon: Warehouse, label: 'Nhà nguyên căn', value: 'house' },
];

const POPULAR_LOCATIONS = [
  { name: 'Quận 1', count: 1250 },
  { name: 'Quận 3', count: 890 },
  { name: 'Quận 5', count: 756 },
  { name: 'Bình Thạnh', count: 623 },
  { name: 'Tân Bình', count: 534 },
  { name: 'Gò Vấp', count: 412 },
];

const QUICK_FILTERS = [
  { icon: Wifi, label: 'Wifi miễn phí' },
  { icon: Wind, label: 'Điều hòa' },
  { icon: Tv, label: 'TV' },
  { icon: Waves, label: 'Bể bơi' },
  { icon: Car, label: 'Chỗ để xe' },
  { icon: Dumbbell, label: 'Gym' },
];

export default function Home() {
  const navigate = useNavigate();
  const [vipRooms, setVipRooms] = useState<PostResponse[]>([]);
  const [suggestedRooms, setSuggestedRooms] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featured = await postService.getFeaturedPosts(8);
        setVipRooms(featured);

        const publicPosts = await postService.getPublicPosts({ page: 0, size: 8 });
        setSuggestedRooms(publicPosts.content);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (value: string) => {
    setSelectedCategory(selectedCategory === value ? null : value);
    navigate(`/search?category=${value}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Tìm phòng trọ ưng ý
              <span className="block text-cyan-300">nhanh chóng & dễ dàng</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Hàng ngàn phòng trọ, căn hộ dịch vụ đang chờ bạn khám phá tại TP.HCM
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="Tìm theo địa điểm, tên phòng..."
                  />
                </div>
                <div className="w-full md:w-48 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select className="block w-full pl-11 pr-4 py-4 text-gray-900 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none cursor-pointer transition-all">
                    <option value="">Tất cả khu vực</option>
                    <option value="q1">Quận 1</option>
                    <option value="q3">Quận 3</option>
                    <option value="q5">Quận 5</option>
                    <option value="bt">Bình Thạnh</option>
                    <option value="tb">Tân Bình</option>
                    <option value="gv">Gò Vấp</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: '10,000+', label: 'Phòng trọ' },
              { value: '5,000+', label: 'Người dùng' },
              { value: '3,000+', label: 'Chủ nhà' },
              { value: '98%', label: 'Hài lòng' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full -mt-6 relative z-10">
        <div className="flex gap-4 justify-center flex-wrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_FILTERS.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.label}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* VIP Rooms Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">VIP</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Phòng nổi bật</h2>
            </div>
            <p className="text-gray-500">Phòng trọ chất lượng cao được chủ nhà đăng tin VIP</p>
          </div>
          <button 
            onClick={() => navigate('/search?filter=vip')} 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {vipRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">Chưa có phòng VIP nào</p>
          </div>
        )}
      </section>

      {/* Popular Locations */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Địa điểm phổ biến</h2>
          <p className="text-gray-500">Khám phá các khu vực được quan tâm nhiều nhất</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_LOCATIONS.map((location) => (
            <button
              key={location.name}
              onClick={() => navigate(`/search?location=${encodeURIComponent(location.name)}`)}
              className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <MapPin className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-900">{location.name}</div>
              <div className="text-sm text-gray-500">{location.count.toLocaleString()} phòng</div>
            </button>
          ))}
        </div>
      </section>

      {/* Suggested Rooms Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gợi ý cho bạn</h2>
            <p className="text-gray-500 mt-1">Dựa trên xu hướng và tìm kiếm phổ biến</p>
          </div>
          <button 
            onClick={() => navigate('/search')} 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {suggestedRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">Chưa có phòng nào được đăng</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bạn có phòng trọ cho thuê?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng tin miễn phí và tiếp cận hàng ngàn người đang tìm phòng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/landlord/posts/create')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng tin ngay
            </button>
            <button
              onClick={() => navigate('/landlord/dashboard')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">TMDT Thuê Trọ</h3>
              <p className="text-sm">Nền tảng kết nối người thuê trọ với chủ nhà uy tín</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">An toàn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Chủ nhà</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Đăng tin</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quản lý phòng</a></li>
                <li><a href="#" className="hover:text-white transition-colors"> Gói dịch vụ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@tmdt.vn</li>
                <li>Hotline: 1900 1234</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2026 TMDT Thuê Trọ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
