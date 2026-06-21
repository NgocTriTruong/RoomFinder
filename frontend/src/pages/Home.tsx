import React, { useEffect, useState } from 'react';
import { Search, MapPin, Loader2, Home as HomeIcon, Building2, Warehouse, BedDouble, Car, Wifi, Wind, Tv, Waves, Dumbbell, Mic, ShieldCheck, PhoneCall, Sparkles, Gift, Info, Target, Award, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoomCard, { RoomCardSkeleton } from '../components/ui/RoomCard';
import postService from '../services/postService';
import type { PostResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import universityService, { UniversityResponse } from '../services/universityService';
import { createPlaceholderImage } from '../utils/localImage';
import VoiceSearchModal from '../components/ui/VoiceSearchModal';

const CATEGORIES = [
  { icon: HomeIcon, label: 'Phòng trọ', value: 'room' },
  { icon: Building2, label: 'Căn hộ', value: 'apartment' },
  { icon: Warehouse, label: 'Nhà nguyên căn', value: 'house' },
];


export default function Home() {
  const navigate = useNavigate();
  const [vipRooms, setVipRooms] = useState<PostResponse[]>([]);
  const [suggestedRooms, setSuggestedRooms] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mostViewedRooms, setMostViewedRooms] = useState<PostResponse[]>([]);
  
  // Voice search state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  
  // University personalization
  const { user } = useAuth();
  const [userUniversity, setUserUniversity] = useState<UniversityResponse | null>(null);
  const [universityRooms, setUniversityRooms] = useState<PostResponse[]>([]);

  // Video player state
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log(err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallel data fetching
        const [featured, publicPosts, topViewed] = await Promise.all([
          postService.getFeaturedPosts(8),
          postService.getPublicPosts({ page: 0, size: 8 }),
          postService.getPublicPosts({ page: 0, size: 8, sortBy: 'viewCount', sortDirection: 'desc' })
        ]);

        setVipRooms(featured);
        setSuggestedRooms(publicPosts.content);
        setMostViewedRooms(topViewed.content);

        // Fetch university data if user is a student
        if (user?.universityId) {
          try {
            const uni = await universityService.getById(user.universityId);
            setUserUniversity(uni);
            
            const nearby = await postService.getPublicPosts({
              page: 0,
              size: 4,
              latitude: uni.latitude,
              longitude: uni.longitude,
              radiusKm: 5
            });
            setUniversityRooms(nearby.content);
          } catch (err) {
            console.error('Lỗi khi lấy dữ liệu trường học:', err);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.universityId]);

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
                    className="block w-full pl-11 pr-12 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="Tìm theo địa điểm, tên phòng..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsVoiceOpen(true)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors p-2"
                    title="Tìm kiếm bằng giọng nói"
                  >
                    <Mic className="h-5 w-5 text-blue-500 animate-pulse" />
                  </button>
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
            <VoiceSearchModal 
              isOpen={isVoiceOpen} 
              onClose={() => setIsVoiceOpen(false)} 
              onResult={(text) => {
                setSearchQuery(text);
                const params = new URLSearchParams();
                params.append('q', text);
                navigate(`/search?${params.toString()}`);
              }} 
            />
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

      {/* University Suggestions (Only for students) */}
      {user?.universityId && (loading || (userUniversity && universityRooms.length > 0)) && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">Dành cho bạn</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Phòng gần trường {userUniversity ? (userUniversity.abbreviation || userUniversity.name) : '...'}</h2>
              </div>
              <p className="text-gray-600">Những phòng trọ nằm trong bán kính 5km quanh trường của bạn</p>
            </div>
            {userUniversity && (
              <button 
                onClick={() => navigate(`/search?nearbyUniversityId=${userUniversity.id}`)} 
                className="hidden md:flex bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 font-medium items-center gap-1 transition-colors"
              >
                Xem thêm
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)
            ) : (
              universityRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Suggested Rooms Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Gần bạn</span>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gợi ý cho bạn</h2>
            </div>
            <p className="text-gray-500">Các phòng trọ được đề xuất tối ưu theo vị trí và trường học của bạn</p>
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : suggestedRooms.length > 0 ? (
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : vipRooms.length > 0 ? (
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
      

      {/* Most Viewed Rooms Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.664A1 1 0 005.5 6.32c-.524.558-1.012 1.325-1.34 2.204-.33.887-.46 1.82-.46 2.636 0 2.91 2.027 5.45 4.587 6.583a1 1 0 00.723.004c2.56-1.133 4.587-3.673 4.587-6.583 0-.816-.13-1.749-.46-2.636-.328-.879-.816-1.646-1.34-2.204a1 1 0 00-1.69.814c.003.45-.017.906-.07 1.357a9.32 9.32 0 01-.39 1.748 23.485 23.485 0 01-.412-2.012 31.088 31.088 0 00-.397-2.092c-.12-.546-.223-1.024-.306-1.413a8.612 8.612 0 01-.107-.564c-.03-.19-.05-.362-.063-.517.563.38.87.81 1.168 1.249.296.436.599.88 1.175 1.142a1 1 0 001.443-1.033c-.055-.405-.056-.886-.052-1.452.006-.888.04-2.02.42-3.04.194-.523.44-1.046.776-1.475.337-.429.719-.74 1.066-.972a1 1 0 00.384-1.45zm-9.013 11.816c.005-.007.01-.013.015-.019l.007-.012c.002-.003.004-.006.006-.009.006-.01.01-.018.013-.025.006-.01.008-.013.008-.013.008-.012.014-.022.02-.032.006-.01.01-.016.013-.022a.633.633 0 00.014-.022c.017-.028.03-.048.043-.07a13.6 13.6 0 00.39-1.747c.053-.45.073-.908.07-1.357a1 1 0 011.69-.814c.524.558 1.012 1.325 1.34 2.204.33.887.46 1.82.46 2.636 0 2.91-2.027 5.45-4.587 6.583a1 1 0 01-.723.004c-2.56-1.133-4.587-3.673-4.587-6.583 0-.816.13-1.749.46-2.636.328-.879.816-1.646 1.34-2.204a1 1 0 011.689.814c-.003.45.017.906.07 1.357a9.32 9.32 0 00.39 1.748c.013.021.026.042.043.07l.014.022c.003.006.007.012.013.022.006.01.012.02.02.032 0 0 .002.004.008.013.003.007.007.015.013.025.002.003.004.006.006.009l.007.012c.005.006.01.012.015.019z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Phòng xem nhiều nhất</h2>
            </div>
            <p className="text-gray-500">Những bài viết đang thu hút sự quan tâm lớn từ cộng đồng</p>
          </div>
          <button 
            onClick={() => navigate('/search?sortBy=viewCount&sortDirection=desc')} 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-transform hover:translate-x-1"
          >
            Xem tất cả 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : mostViewedRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostViewedRooms.map((room) => (
              <div key={room.id} className="relative group">
                <RoomCard room={room} />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 z-10 shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {room.viewCount?.toLocaleString() || 0}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Đang tải dữ liệu xu hướng...</p>
          </div>
        )}
      </section>

      {/* RF Activities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Giải Pháp Đột Phá
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            Các Hoạt Động Cốt Lõi Tại RoomFinder
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Nâng tầm trải nghiệm tìm kiếm nhà trọ bằng việc áp dụng tối đa các giải pháp công nghệ thời gian thực, đảm bảo quyền lợi và sự minh bạch cao nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              num: '01',
              color: 'text-blue-600',
              title: 'Xác Thực Tích Xanh KYC',
              description: 'Chủ nhà và phòng trọ được xác minh danh tính thông qua đối chiếu căn cước công dân và sổ hồng/hợp đồng sở hữu hợp pháp. RoomFinder tiến hành thẩm định thực tế để gắn nhãn tích xanh, giúp giảm thiểu 100% rủi ro lừa đảo cọc ảo của sinh viên và người thuê trọ.'
            },
            {
              num: '02',
              color: 'text-indigo-600',
              title: 'Gọi điện & Chat Realtime',
              description: 'Ứng dụng giải pháp WebRTC đàm thoại trực tiếp thời gian thực ngay trên giao diện web hoàn toàn miễn phí. Người thuê có thể kết nối âm thanh HD chất lượng cao, đàm thoại thảo luận giá cả và thống nhất lịch xem phòng với chủ nhà mà không cần qua app trung gian.'
            },
            {
              num: '03',
              color: 'text-purple-600',
              title: 'Tìm Kiếm AI & Giọng Nói',
              description: 'Tích hợp trợ lý ảo thông minh giúp bạn tìm kiếm phòng trọ bằng giọng nói tiện lợi. Chỉ cần đọc tên trường học hoặc khu vực bạn mong muốn, hệ thống sẽ tự động quét bản đồ số và đề xuất phòng trọ chất lượng tốt nhất trong phạm vi bán kính 5km.'
            },
            {
              num: '04',
              color: 'text-emerald-600',
              title: 'Hỗ Trợ Tài Chính Độc Quyền',
              description: 'RoomFinder kết hợp với các đối tác ngân hàng uy tín mang tới gói bảo lãnh đặt cọc và hỗ trợ trả góp tiền thuê phòng lãi suất cực thấp cho sinh viên nghèo. Đi kèm là hàng ngàn voucher giảm trực tiếp tiền thuê tháng đầu tiên lên tới 20%.'
            }
          ].map((act, idx) => {
            return (
              <div 
                key={idx}
                className="group p-2 transition-all duration-300"
              >
                <div className={`text-4xl font-black ${act.color} opacity-40 group-hover:opacity-100 transition-opacity mb-4 font-mono`}>
                  {act.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {act.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {act.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Narrative and Details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Về Chúng Tôi
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Hành Trình Xây Dựng Cổng Kết Nối Phòng Trọ Lớn Nhất Việt Nam
            </h3>
            
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                RoomFinder khởi đầu từ một dự án tình nguyện của nhóm cựu sinh viên công nghệ, những người thấu hiểu sâu sắc nỗi ám ảnh của sinh viên ngoại tỉnh mỗi mùa nhập học: từ việc lạc đường, ép giá, gặp cò mồi lừa đảo, cho tới những điều kiện sống tồi tàn không đúng như quảng cáo.
              </p>
              <p>
                Chúng tôi quyết định áp dụng công nghệ số để xây dựng một cổng thông tin phòng trọ hoàn toàn minh bạch. Nơi người thuê được cung cấp đầy đủ thông tin chuẩn xác về giá cả, hình ảnh/video thực tế, và được giao tiếp trực tiếp với chủ trọ chính chủ mà không phải chịu bất kỳ khoản chi phí hoa hồng nào.
              </p>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border-l-2 border-blue-600 pl-4">
                <div className="text-2xl font-bold text-blue-600">5 Phút</div>
                <div className="text-xs text-gray-500 mt-1">Thời gian trung bình kết nối thành công và tìm thấy phòng ưng ý.</div>
              </div>
              <div className="border-l-2 border-indigo-600 pl-4">
                <div className="text-2xl font-bold text-indigo-600">100%</div>
                <div className="text-xs text-gray-500 mt-1">Chủ trọ đều được kiểm tra giấy tờ pháp lý kỹ càng.</div>
              </div>
              <div className="border-l-2 border-emerald-600 pl-4">
                <div className="text-2xl font-bold text-emerald-600">50K+</div>
                <div className="text-xs text-gray-500 mt-1">Thành viên hoạt động sôi nổi và đánh giá tin đăng mỗi ngày.</div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Tầm Nhìn Hướng Tới Tương Lai</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Không chỉ dừng lại ở vai trò đăng tin, RoomFinder hướng đến mục tiêu số hóa toàn bộ thủ tục đặt cọc, làm hợp đồng điện tử và hỗ trợ thanh toán hóa đơn điện nước định kỳ chỉ trên một nền tảng duy nhất.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Cam Kết Minh Bạch Về Giá</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Chúng tôi cam kết hoàn tiền 100% phí cọc nếu thông tin phòng trọ thực tế sai lệch so với tin đăng đã được RoomFinder xác thực.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Representation */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-150 group">
              <img 
                src="/about_us_room.png" 
                alt="Không gian phòng trọ sinh viên tiện nghi" 
                className="w-full h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 flex flex-col justify-end text-white">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">RoomFinder Spaces</span>
                <h4 className="text-xl font-bold mb-2">Phòng Trọ Đầy Đủ Tiện Nghi & An Ninh</h4>
                <p className="text-slate-200 text-xs leading-relaxed">
                  Hàng ngàn căn hộ dịch vụ và phòng trọ sinh viên chất lượng cao đang chờ đón bạn khám phá trên hệ thống RoomFinder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Walkthrough Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Trải Nghiệm Thực Tế
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            Video Tham Quan Phòng Thực Tế
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Khám phá không gian sống sinh động, chân thực và chi tiết trước khi đặt lịch xem trực tiếp.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 aspect-video group bg-slate-900">
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-a-living-room-and-kitchen-40141-large.mp4"
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
          />
          
          {/* Custom controls overlay */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-white/95 text-blue-600 hover:bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform"
                title={isPlaying ? "Tạm dừng" : "Phát video"}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <button
                onClick={toggleMute}
                className="w-16 h-16 bg-white/95 text-slate-800 hover:bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform"
                title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Quick status bar/badge */}
          <div className="absolute bottom-4 left-6 text-white text-xs bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
            {isPlaying ? "Đang phát • Video thực tế từ RoomFinder" : "Đã tạm dừng • Nhấn để phát"}
          </div>
        </div>
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

    </div>
  );
}
