import React, { useEffect, useState } from 'react';
import { MapPin, Maximize, Tag, Phone, ArrowLeft, Star, Loader2, Check, XCircle, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import { postService } from '@/services/postService';
import reviewService from '@/services/reviewService';
import { getErrorMessage } from '@/services/api';
import type { PostResponse, ReviewResponse } from '@/types';
import { createAvatarPlaceholder, createPlaceholderImage } from '@/utils/localImage';
import { resolveMediaUrl } from '@/utils/mediaUrl';
import LeafletMap from '@/components/map/LeafletMap';

interface PostModerationDetailProps {
  postId: number;
  onBack: () => void;
  onActionComplete: () => void;
}

export default function PostModerationDetail({ postId, onBack, onActionComplete }: PostModerationDetailProps) {
  const [room, setRoom] = useState<PostResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roomData = await postService.getPostById(postId);
        setRoom(roomData);
        
        const reviewData = await reviewService.getReviewsByPost(postId);
        setReviews(reviewData || []);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleApprove = async () => {
    if (!window.confirm('Bạn có chắc muốn duyệt tin này không?')) return;
    
    setIsActionLoading(true);
    setActionError(null);
    try {
      await postService.approvePost(postId);
      alert('Duyệt tin thành công!');
      onActionComplete();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Nhập lý do từ chối:');
    if (!reason?.trim()) return;

    setIsActionLoading(true);
    setActionError(null);
    try {
      await postService.rejectPost(postId, reason.trim());
      alert('Đã từ chối tin đăng!');
      onActionComplete();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Đang tải chi tiết tin đăng...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
        <h2 className="text-xl font-bold text-gray-800">Không tìm thấy tin đăng</h2>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline font-medium">Quay lại danh sách</button>
      </div>
    );
  }

  const thumbnail = resolveMediaUrl(room.room?.thumbnailUrl || room.images?.[0]) || createPlaceholderImage(room.title, 800, 600);
  const amenities = room.room?.amenities || [];
  const landlordAvatar = resolveMediaUrl(room.landlord?.avatar) || createAvatarPlaceholder(room.landlord?.fullName || 'User', 128);
  const hasCoordinates = typeof room.room?.latitude === 'number' && typeof room.room?.longitude === 'number';
  const roomLocation = hasCoordinates ? { lat: room.room.latitude, lng: room.room.longitude } : null;
  const isPending = room.status === 'PENDING';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button onClick={onBack} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group">
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách duyệt
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="relative h-96">
              <img
                src={thumbnail}
                alt={room.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {room.isBoosted && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md font-bold shadow-md">
                  VIP
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{room.title}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>{room.room?.address || 'Chưa xác định địa chỉ'}</span>
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
                  <p className="text-sm text-gray-500 mb-1">Trạng thái tin</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                    room.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                    room.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {room.status === 'PENDING' ? 'CHỜ DUYỆT' : room.status === 'APPROVED' ? 'ĐÃ DUYỆT' : 'BỊ TỪ CHỐI'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lượt xem</p>
                  <p className="font-semibold text-gray-900">{room.viewCount || 0}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Vị trí trên bản đồ</h2>
                {roomLocation ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <LeafletMap center={roomLocation} marker={roomLocation} height="300px" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500 text-center">
                    Chưa có tọa độ bản đồ.
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tiện ích</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities?.map((amenity, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 text-sm">
                      <Tag className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {amenity.name}
                    </span>
                  ))}
                  {(!amenities || amenities.length === 0) && <p className="text-gray-500 text-sm italic">Không có tiện ích</p>}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Mô tả chi tiết</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                  {room.description || 'Không có mô tả.'}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
              Đánh giá từ khách hàng ({reviews.length})
            </h2>
            
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden mr-2 text-xs">
                          {review.userAvatar ? (
                            <img src={resolveMediaUrl(review.userAvatar) || ''} alt={review.userName} className="w-full h-full object-cover" />
                          ) : (
                            review.userName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.userName}</p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 italic text-sm">Chưa có đánh giá nào.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Moderation Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-24">
            <h3 className="text-md font-bold text-gray-900 mb-6 uppercase tracking-wider">Thông tin chủ trọ</h3>
            
            <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl mr-4 overflow-hidden border border-gray-200">
                <img src={landlordAvatar} alt="Avatar" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{room.landlord?.fullName || 'N/A'}</p>
                <p className="text-xs text-gray-500">Chủ trọ</p>
                <div className="flex items-center mt-1 text-green-600 text-xs font-medium">
                  <Phone className="w-3 h-3 mr-1" />
                  {room.landlord?.phone || 'Chưa cung cấp SĐT'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-bold text-gray-900 mb-4 uppercase tracking-wider">Quyết định kiểm duyệt</h3>
              
              {isPending ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                      Tin đăng này đang chờ được phê duyệt để hiển thị công khai trên hệ thống.
                    </p>
                  </div>

                  {actionError && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-600">
                      {actionError}
                    </div>
                  )}

                  <div className="pt-2 space-y-3">
                    <button
                      onClick={handleApprove}
                      disabled={isActionLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-green-100 disabled:opacity-50"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      {isActionLoading ? 'Đang xử lý...' : 'Phê duyệt tin'}
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={isActionLoading}
                      className="w-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Từ chối tin này
                    </button>
                  </div>
                </>
              ) : (
                <div className={`p-6 rounded-xl text-center border-2 flex flex-col items-center ${
                  room.status === 'APPROVED' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {room.status === 'APPROVED' ? (
                    <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                  ) : (
                    <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
                  )}
                  <p className="text-xs font-bold uppercase mb-1 tracking-wider">Trạng thái hiện tại</p>
                  <p className="text-xl font-black">
                    {room.status === 'APPROVED' ? 'ĐÃ PHÊ DUYỆT' : 'ĐÃ TỪ CHỐI'}
                  </p>
                  {room.rejectionReason && (
                    <div className="mt-4 w-full text-left p-3 bg-white/50 rounded-lg border border-red-100">
                      <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Lý do từ chối:</p>
                      <p className="text-xs font-medium italic">{room.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Chế độ Admin - Kiểm duyệt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
