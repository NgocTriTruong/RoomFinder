import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { getErrorMessage } from '../../services/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string | number;
    postId?: number;
    roomTitle?: string;
  } | null;
  onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, booking, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get postId from booking - may need to extract from booking data
      const postId = booking.postId || extractPostId(booking);
      
      await reviewService.createReview({
        postId,
        bookingId: typeof booking.id === 'string' ? parseInt(booking.id) : booking.id,
        rating,
        comment,
      });

      alert('Cảm ơn bạn đã đánh giá!');
      setRating(0);
      setComment('');
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const extractPostId = (booking: ReviewModalProps['booking']): number => {
    // Extract postId from booking data if available
    if (booking && typeof booking === 'object') {
      if ('postId' in booking && booking.postId) {
        return Number(booking.postId);
      }
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Viết đánh giá</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Bạn đánh giá phòng này thế nào?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét chi tiết
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ, chủ nhà, tiện ích..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border resize-none"
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={rating === 0 || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi đánh giá'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
