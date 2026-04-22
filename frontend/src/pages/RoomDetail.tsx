import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Maximize, Tag, Phone, Heart, Share2, ArrowLeft, Calendar, Star, Loader2, MessageSquare } from 'lucide-react';
import ReportModal from '../components/ui/ReportModal';
import BookingModal from '../components/ui/BookingModal';
import LeafletMap from '@/components/map/LeafletMap';
import postService from '../services/postService';
import reviewService from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import { PostResponse, ReviewResponse } from '../types';
import { createAvatarPlaceholder, createPlaceholderImage } from '../utils/localImage';
import { resolveMediaUrl } from '../utils/mediaUrl';

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState<PostResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const roomData = await postService.getPostById(id);
        setRoom(roomData);
        
        const reviewData = await reviewService.getReviewsByPost(id);
        setReviews(reviewData.content);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy phòng</h2>
        <p className="text-gray-600 mb-6">Phòng bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/search" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
          Quay lại tìm kiếm
        </Link>
      </div>
    );
  }

  const thumbnail = resolveMediaUrl(room.room?.thumbnailUrl || room.images?.[0]) || createPlaceholderImage(room.title, 800, 600);
  const amenities = room.room?.amenities || [];
  const landlordAvatar = room.landlord?.avatar || createAvatarPlaceholder(room.landlord?.fullName || 'User', 128);
  const roomLocation = room.room?.latitude && room.room?.longitude
    ? { lat: room.room.latitude, lng: room.room.longitude }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/search" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Quay lại tìm kiếm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="relative h-96">
              <img
                src={thumbnail}
                alt={room.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.src = createPlaceholderImage(room.title, 800, 600);
                }}
              />
              {room.isBoosted && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md font-bold shadow-md">
                  VIP
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{room.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/room/${id}` } });
                        return;
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-full transition-colors"
                    aria-label="Yêu thích"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-full transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>{room.room?.address || 'Chưa xác định địa chỉ'}</span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Vị trí trên bản đồ</h2>
                {roomLocation ? (
                  <LeafletMap
                    center={roomLocation}
                    marker={roomLocation}
                    height="360px"
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                    Chưa có tọa độ để hiển thị bản đồ.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mức giá</p>
                  <p className="font-bold text-blue-600 text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price || 0)}/tháng
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Diện tích</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <Maximize className="w-4 h-4 mr-1 text-gray-400" />
                    {room.room?.area || 0} m²
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tình trạng</p>
                  <p className="font-semibold text-green-600">
                    {room.status === 'APPROVED' ? 'Còn trống' : 'Ngưng nhận khách'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lượt xem</p>
                  <p className="font-semibold text-gray-900">{room.viewCount || 0}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiện ích</h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-md bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      {amenity.name}
                    </span>
                  ))}
                  {amenities.length === 0 && <p className="text-gray-500 text-sm italic">Không có tiện ích đi kèm</p>}
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả chi tiết</h2>
                <div className="text-gray-600 space-y-4 leading-relaxed whitespace-pre-line">
                  {room.description || 'Không có mô tả chi tiết cho phòng này.'}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Star className="w-6 h-6 mr-2 text-yellow-400 fill-yellow-400" />
                    Đánh giá từ khách hàng ({reviews.length})
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden mr-3">
                              {review.userAvatar ? (
                                <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                              ) : (
                                review.userName.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.userName}</p>
                              <div className="flex text-yellow-400 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        {review.landlordResponse && (
                          <div className="mt-4 ml-6 p-4 bg-white rounded border-l-4 border-blue-400">
                            <p className="text-xs font-bold text-blue-600 mb-1">Chủ trọ phản hồi:</p>
                            <p className="text-sm text-gray-600 italic">{review.landlordResponse}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 italic">Chưa có đánh giá nào cho phòng này.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
            
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl mr-4 overflow-hidden">
                <img src={landlordAvatar} alt="Landlord Avatar" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{room.landlord?.fullName || 'Người dùng hệ thống'}</p>
                <p className="text-sm text-gray-500">Chủ trọ</p>
                {room.landlord?.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-xs font-medium text-gray-700">{room.landlord.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: `/room/${id}` } });
                  return;
                }
                setIsBookingModalOpen(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center mb-3 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Đặt lịch xem phòng
            </button>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <a href={`tel:${room.landlord?.phone || ''}`} className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                Gọi điện
              </a>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: `/room/${id}` } });
                    return;
                  }
                  navigate(`/tenant/messages?receiverId=${room.landlord?.id}`);
                }}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
              >
                Nhắn tin
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="w-full text-red-500 hover:text-red-600 text-sm font-medium transition-colors text-center"
              >
                Báo cáo tin đăng không hợp lệ
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        roomId={room.id.toString()}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        roomId={room.id.toString()}
      />
    </div>
  );
}
