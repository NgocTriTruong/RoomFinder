import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Maximize, Tag, Phone, Heart, Share2, ArrowLeft, Calendar, Star, Loader2, MessageSquare } from 'lucide-react';
import ReportModal from '../components/ui/ReportModal';
import BookingModal from '../components/ui/BookingModal';
import ReviewModal from '../components/ui/ReviewModal';
import RoomCard from '../components/ui/RoomCard';
import LeafletMap from '@/components/map/LeafletMap';
import postService from '../services/postService';
import reviewService from '../services/reviewService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import { PostResponse, ReviewResponse } from '../types';
import { createAvatarPlaceholder, createPlaceholderImage } from '../utils/localImage';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { Check, XCircle } from 'lucide-react';
import { getErrorMessage } from '@/services/api';
import favoriteService from '../services/favoriteService';

const renderDescription = (text: string | null | undefined) => {
  if (!text) {
    return <p className="text-gray-500 italic">Không có mô tả chi tiết cho phòng này.</p>;
  }
  
  return text.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }
    
    // Check if line starts and ends with ** or *
    const isBoldHeader = (trimmed.startsWith('**') && trimmed.endsWith('**')) || (trimmed.startsWith('*') && trimmed.endsWith('*'));
    
    if (isBoldHeader) {
      const cleanLine = trimmed.replace(/^\*\*|\*\*$/g, '').replace(/^\*|\*$/g, '');
      return (
        <h3 key={index} className="font-semibold text-gray-900 text-base mt-4 mb-2">
          {cleanLine}
        </h3>
      );
    }
    
    // Process inline asterisks
    let formattedLine: React.ReactNode = line;
    if (line.includes('**') || line.includes('*')) {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      formattedLine = parts.map((part, pIdx) => {
        if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
          const cleanPart = part.replace(/^\*\*|\*\*$/g, '').replace(/^\*|\*$/g, '');
          return <strong key={pIdx} className="font-semibold text-gray-900">{cleanPart}</strong>;
        }
        return part;
      });
    }
    
    return (
      <p key={index} className="text-gray-600 leading-relaxed mb-1">
        {formattedLine}
      </p>
    );
  });
};

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [room, setRoom] = useState<PostResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
  
  // State for reviews from within product detail
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userCompletedBooking, setUserCompletedBooking] = useState<any | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const [similarRooms, setSimilarRooms] = useState<PostResponse[]>([]);

  const isAdmin = user?.role === 'ADMIN';
  const isLandlordPreview = window.location.pathname.includes('/landlord/room-preview');
  const isPending = room?.status === 'PENDING';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const roomData = await postService.getPostById(id);
        setRoom(roomData);

        const reviewData = await reviewService.getReviewsByPost(id);
        setReviews(reviewData || []);

        if (isAuthenticated && roomData.room?.id) {
          const savedStatus = await favoriteService.isFavorite(roomData.room.id);
          setIsSaved(savedStatus);
        }

        // Fetch similar rooms based on district from address
        const address = roomData.room?.address;
        let district: string | undefined = undefined;
        if (address) {
          const parts = address.split(',');
          if (parts.length >= 2) {
            district = parts[parts.length - 2].trim();
          }
        }

        try {
          const similarData = await postService.getPublicPosts({
            location: district,
            page: 0,
            size: 5,
          });
          const filtered = (similarData.content || [])
            .filter((p: PostResponse) => p.id.toString() !== id.toString())
            .slice(0, 4);

          if (filtered.length === 0) {
            const fallbackData = await postService.getPublicPosts({
              page: 0,
              size: 5,
            });
            const fallbackFiltered = (fallbackData.content || [])
              .filter((p: PostResponse) => p.id.toString() !== id.toString())
              .slice(0, 4);
            setSimilarRooms(fallbackFiltered);
          } else {
            setSimilarRooms(filtered);
          }
        } catch (err) {
          console.error('Failed to fetch similar rooms:', err);
        }
        
        // Logic to detect if user can write a review directly from here
        if (isAuthenticated && user?.id && id) {
          // 1. Check if already reviewed
          const alreadyReviewed = (reviewData || []).some((r: any) => r.userId === user.id);
          setHasUserReviewed(alreadyReviewed);
          
          if (!alreadyReviewed) {
             // 2. Check for completed bookings
             try {
               const myBookings = await bookingService.getTenantBookings();
               const match = myBookings.find((b: any) => 
                 b.post.id.toString() === id.toString() && b.status === 'COMPLETED'
               );
               if (match) {
                 setUserCompletedBooking(match);
               }
             } catch (err) {
               console.error("Failed check bookings", err);
             }
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, user?.id]);

  const handleApprove = async () => {
    if (!id || !window.confirm('Bạn có chắc muốn duyệt tin này không?')) return;

    setIsActionLoading(true);
    setActionError(null);
    try {
      await postService.approvePost(id);
      // Refresh data
      const roomData = await postService.getPostById(id);
      setRoom(roomData);
      alert('Duyệt tin thành công!');
      navigate('/admin/moderation');
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    const reason = window.prompt('Nhập lý do từ chối:');
    if (!reason?.trim()) return;

    setIsActionLoading(true);
    setActionError(null);
    try {
      await postService.rejectPost(id, reason.trim());
      // Refresh data
      const roomData = await postService.getPostById(id);
      setRoom(roomData);
      alert('Đã từ chối tin đăng!');
      navigate('/admin/moderation');
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

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

  const rawImages: string[] = (room.images && room.images.length > 0)
    ? room.images
    : (room.room?.images && room.room.images.length > 0)
      ? room.room.images
      : [room.room?.thumbnailUrl || room.images?.[0]].filter((img): img is string => !!img);
  const allImages = Array.from(new Set(rawImages));

  const thumbnail = allImages.length > 0
    ? resolveMediaUrl(allImages[0])
    : createPlaceholderImage(room.title, 800, 600);

  const currentImage = allImages.length > 0 && activeImageIndex < allImages.length
    ? resolveMediaUrl(allImages[activeImageIndex])
    : thumbnail;

  const rawAmenities = room.room?.amenities || [];
  const amenities = Array.from(new Map(rawAmenities.map(item => [item.id, item])).values());
  const landlordAvatar = room.landlord?.avatar || createAvatarPlaceholder(room.landlord?.fullName || 'User', 128);
  const roomLocation = room.room?.latitude && room.room?.longitude
    ? { lat: room.room.latitude, lng: room.room.longitude }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isAdmin ? (
        <Link to="/admin/moderation" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách duyệt
        </Link>
      ) : isLandlordPreview ? (
        <Link to="/landlord" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại tổng quan
        </Link>
      ) : (
        <Link to="/search" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại tìm kiếm
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            {/* Media Tabs (Image / Video) */}
            {room.videoUrl && (
              <div className="flex border-b border-gray-100 bg-gray-50 p-1.5 rounded-t-lg">
                <button
                  onClick={() => setActiveMediaType('image')}
                  className={`flex-1 py-2 text-center rounded-md font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${activeMediaType === 'image' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Hình ảnh ({allImages.length})
                </button>
                <button
                  onClick={() => setActiveMediaType('video')}
                  className={`flex-1 py-2 text-center rounded-md font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${activeMediaType === 'video' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Video thực tế phòng
                </button>
              </div>
            )}

            {/* Media Display Area */}
            <div className="relative h-96 bg-gray-900 overflow-hidden group">
              {activeMediaType === 'video' && room.videoUrl ? (
                <video
                  src={resolveMediaUrl(room.videoUrl)}
                  poster={resolveMediaUrl(room.videoThumbnail || thumbnail)}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <img
                    src={currentImage}
                    alt={`${room.title} - Ảnh ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src = createPlaceholderImage(room.title, 800, 600);
                    }}
                  />
                  {/* Left Arrow */}
                  {allImages.length > 1 && (
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  {/* Right Arrow */}
                  {allImages.length > 1 && (
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  {/* Image Counter Indicator */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2.5 py-1 rounded-md text-xs font-semibold z-10 shadow-sm">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </>
              )}

              {room.isBoosted && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md font-bold shadow-md z-10">
                  VIP
                </div>
              )}
            </div>

            {/* Thumbnails Row below media area */}
            {activeMediaType === 'image' && allImages.length > 1 && (
              <div className="flex gap-2 p-4 border-b border-gray-100 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${activeImageIndex === idx ? 'border-blue-600 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img
                      src={resolveMediaUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = createPlaceholderImage(room.title, 100, 80);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{room.title}</h1>
                {!isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!isAuthenticated) {
                          navigate('/login', { state: { from: `/room/${id}` } });
                          return;
                        }
                        try {
                          const roomId = room.room?.id;
                          if (!roomId) return;

                          if (isSaved) {
                            await favoriteService.removeFavorite(roomId);
                            setIsSaved(false);
                          } else {
                            await favoriteService.addFavorite(roomId);
                            setIsSaved(true);
                          }
                        } catch (error: any) {
                          console.error('Lỗi khi cập nhật yêu thích:', error);
                          const message = error.response?.data?.message || 'Không thể thực hiện quy trình lưu phòng.';
                          alert(message);
                        }
                      }}
                      className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-red-50' : 'bg-gray-50'
                        }`}
                      aria-label={isSaved ? 'Bỏ yêu thích' : 'Yêu thích'}
                    >
                      <Heart
                        className={`w-6 h-6 ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-full transition-colors">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                )}
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
                  {amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-md bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      {amenity.name}
                    </span>
                  ))}
                  {(!amenities || amenities.length === 0) && <p className="text-gray-500 text-sm italic">Không có tiện ích đi kèm</p>}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả chi tiết</h2>
                <div className="text-gray-600">
                  {renderDescription(room.description)}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Star className="w-6 h-6 mr-2 text-yellow-400 fill-yellow-400" />
                    Đánh giá từ khách hàng ({reviews.length})
                  </h2>
                  
                  {/* Render Review button right here if user qualified and hasn't reviewed yet */}
                  {!hasUserReviewed && userCompletedBooking && (
                    <button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="flex items-center gap-2 bg-amber-50 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-amber-200"
                    >
                      <Star className="w-4 h-4 fill-current" /> Viết đánh giá ngay
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {reviews && reviews.length > 0 ? (
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
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-1">Chưa có đánh giá nào cho phòng này</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Bạn cần đặt lịch và **hoàn thành việc xem phòng** để có thể viết đánh giá.
                        Điều này giúp đảm bảo mọi nhận xét đều là người thật việc thật!
                      </p>
                      {userCompletedBooking && !hasUserReviewed && (
                         <button 
                            onClick={() => setIsReviewModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-sm transition-colors"
                         >
                            <Star className="w-5 h-5" /> Viết đánh giá ngay
                         </button>
                      )}
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
                <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                  {room.landlord?.fullName || 'Người dùng hệ thống'}
                  {room.landlord?.isVerified && (
                    <span className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full p-0.5" title="Chủ trọ đã xác thực KYC">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-gray-500 font-medium">Chủ trọ</p>
                  {room.landlord?.isVerified && (
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold border border-blue-100 flex items-center gap-0.5">
                      Đã KYC
                    </span>
                  )}
                </div>
                {room.landlord?.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-xs font-medium text-gray-700">{room.landlord.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {isAdmin ? (
              <div className="space-y-4">
                {isPending ? (
                  <>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800 font-medium">Tin này đang chờ duyệt</p>
                    </div>

                    {actionError && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-600 mb-4">
                        {actionError}
                      </div>
                    )}

                    <button
                      onClick={handleApprove}
                      disabled={isActionLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      {isActionLoading ? 'Đang xử lý...' : 'Duyệt tin đăng'}
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={isActionLoading}
                      className="w-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Từ chối tin
                    </button>
                  </>
                ) : (
                  <div className={`p-4 rounded-lg text-center font-bold ${room.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {room.status === 'APPROVED' ? 'TIN ĐÃ ĐƯỢC DUYỆT' : `TIN ĐÃ BỊ TỪ CHỐI${room.rejectionReason ? `: ${room.rejectionReason}` : ''}`}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center uppercase tracking-wider font-semibold">Chế độ kiểm duyệt</p>
                </div>
              </div>
            ) : isLandlordPreview ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium text-center">Chế độ xem trước của chủ trọ</p>
                </div>
                <button
                  onClick={() => navigate(`/landlord/posts/edit/${id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Tag className="w-5 h-5 mr-2" />
                  Chỉnh sửa bài đăng
                </button>
              </div>
            ) : (
              <>
                {isAuthenticated && !user?.isVerified && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs mb-4 leading-relaxed space-y-1 animate-pulse">
                    <p className="font-bold flex items-center gap-1 text-red-700">
                      <XCircle className="w-4 h-4 text-red-500" /> Tài khoản chưa xác thực KYC
                    </p>
                    <p>
                      Vui lòng đăng nhập bằng <strong className="font-bold">Google Email Sinh viên (.edu.vn)</strong> hoặc cập nhật CCCD tại trang xác thực tài khoản để mở khóa các tính năng: Đặt lịch, Chat, Gọi điện và Chatbot.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: `/room/${id}` } });
                      return;
                    }
                    if (!user?.isVerified) {
                      alert('Yêu cầu xác thực (KYC):\n\nTính năng ĐẶT LỊCH XEM PHÒNG chỉ dành cho tài khoản Sinh viên đã KYC.\n\nVui lòng sử dụng Google Email Sinh viên để tự động KYC!');
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
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/room/${id}` } });
                        return;
                      }
                      if (!user?.isVerified) {
                        alert('Yêu cầu xác thực (KYC):\n\nTính năng GỌI ĐIỆN LIÊN HỆ chỉ dành cho tài khoản Sinh viên đã KYC.\n\nVui lòng sử dụng Google Email Sinh viên để tự động KYC!');
                        return;
                      }
                      if (id) postService.recordContact(id).catch(console.error);
                      window.location.href = `tel:${room.landlord?.phone || ''}`;
                    }}
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 rounded-lg font-medium flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Gọi điện
                  </button>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/room/${id}` } });
                        return;
                      }
                      if (!user?.isVerified) {
                        alert('Yêu cầu xác thực (KYC):\n\nTính năng NHẮN TIN LIÊN HỆ chỉ dành cho tài khoản Sinh viên đã KYC.\n\nVui lòng sử dụng Google Email Sinh viên để tự động KYC!');
                        return;
                      }
                      if (id) postService.recordContact(id).catch(console.error);
                      navigate(`/tenant/messages?receiverId=${room.landlord?.id}`);
                    }}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg font-medium transition-colors flex justify-center items-center cursor-pointer"
                  >
                    Nhắn tin
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/room/${id}` } });
                        return;
                      }
                      if (!user?.isVerified) {
                        alert('Yêu cầu xác thực (KYC):\n\nTính năng BÁO CÁO TIN ĐĂNG chỉ dành cho tài khoản Sinh viên đã KYC.');
                        return;
                      }
                      setIsReportModalOpen(true);
                    }}
                    className="w-full text-red-500 hover:text-red-600 text-sm font-medium transition-colors text-center cursor-pointer"
                  >
                    Báo cáo tin đăng không hợp lệ
                  </button>
                </div>
              </>
            )}
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
      
      {room && userCompletedBooking && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          booking={{
            id: userCompletedBooking.id.toString(),
            postId: room.id,
            roomTitle: room.title
          }}
          onSuccess={() => {
             // Refresh the data after review
             window.location.reload();
          }}
        />
      )}

      {/* Similar Rooms Section */}
      {similarRooms.length > 0 && (
        <div className="mt-12 pt-10 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Phòng trọ tương tự khu vực
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarRooms.map((item) => (
              <RoomCard key={item.id} room={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
