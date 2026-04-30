import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Upload, ArrowLeft, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { postService } from '../../services/postService';
import api from '../../services/api';
import type { RoomResponse, AmenityResponse, CreatePostRequest } from '../../types';
import { getErrorMessage } from '../../services/api';
import { resolveMediaUrl } from '../../utils/mediaUrl';

const createFallbackRoomImage = (label: string) => {
  const safeLabel = label.replace(/[<>&"]/g, '').slice(0, 24) || 'Phòng';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="20" fill="url(#g)"/>
      <rect x="72" y="100" width="256" height="140" rx="18" fill="#f8fafc" opacity="0.95"/>
      <rect x="102" y="128" width="70" height="92" rx="8" fill="#bfdbfe"/>
      <rect x="194" y="128" width="110" height="16" rx="8" fill="#94a3b8"/>
      <rect x="194" y="158" width="82" height="16" rx="8" fill="#cbd5e1"/>
      <rect x="194" y="188" width="94" height="16" rx="8" fill="#cbd5e1"/>
      <text x="72" y="300" font-family="Arial, sans-serif" font-size="22" fill="#475569">${safeLabel}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function PostCreationForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // State for rooms
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // State for form
  const [formData, setFormData] = useState<CreatePostRequest>({
    roomId: 0,
    title: '',
    description: '',
    price: 0,
    priceType: 'MONTHLY',
    deposit: 0,
    images: [],
    videoUrl: '',
    durationDays: 30,
  });

  // State for amenities
  const [amenities, setAmenities] = useState<AmenityResponse[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);

  // State for image upload
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // State for UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freePostsRemaining, setFreePostsRemaining] = useState(2);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
    loadAmenities();
    loadFreePostsRemaining();
  }, []);

  // Update form when room is selected
  useEffect(() => {
    if (selectedRoomId) {
      setFormData(prev => ({ ...prev, roomId: selectedRoomId }));
    }
  }, [selectedRoomId]);

  const loadRooms = async () => {
    try {
      const data = await roomService.getMyRooms();
      setRooms(data);
      if (data.length > 0) {
        setSelectedRoomId(data[0].id);
      }
    } catch (err) {
      setError('Không thể tải danh sách phòng: ' + getErrorMessage(err));
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const loadAmenities = async () => {
    try {
      const data = await roomService.getAllAmenities();
      setAmenities(data);
    } catch (err) {
      console.error('Failed to load amenities:', err);
    }
  };

  const uploadPostImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) {
      return [];
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('category', 'POST_IMAGE');

    const response = await api.post('/v1/media/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploaded = response.data?.data || [];
    return uploaded
      .map((item: { fileUrl?: string | null; thumbnailUrl?: string | null }) => item.fileUrl || item.thumbnailUrl)
      .filter((url: string | null | undefined): url is string => Boolean(url));
  };

  const loadFreePostsRemaining = async () => {
    try {
      const posts = await postService.getMyPosts(0, 1);
      const freeQuota = 2;
      setFreePostsRemaining(Math.max(0, freeQuota - posts.totalElements));
    } catch (err) {
      console.error('Failed to load post quota:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'deposit' || name === 'roomId' || name === 'durationDays'
        ? parseFloat(value) || 0
        : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAmenityToggle = (amenityId: number) => {
    setSelectedAmenityIds(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Chỉ chấp nhận file hình ảnh');
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB');
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    const previewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...previewUrls]);

    uploadPostImages(validFiles)
      .then((uploadedUrls) => {
        setUploadedImages(prev => [...prev, ...uploadedUrls]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
      })
      .catch((err) => {
        console.error('Failed to upload post images:', err);
        setError('Không thể tải ảnh lên. Vui lòng thử lại.');
        setImagePreviewUrls(prev => prev.filter(url => !previewUrls.includes(url)));
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, []);

  const removeImage = (index: number) => {
    setImagePreviewUrls(prev => {
      const next = [...prev];
      const removed = next[index];
      if (removed?.startsWith('blob:')) {
        URL.revokeObjectURL(removed);
      }
      next.splice(index, 1);
      return next;
    });
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedRoomId) {
      newErrors.roomId = 'Vui lòng chọn phòng';
    }

    if (!formData.title || formData.title.length < 20) {
      newErrors.title = 'Tiêu đề phải có ít nhất 20 ký tự';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
    }

    if (!formData.description || formData.description.length < 100) {
      newErrors.description = 'Mô tả phải có ít nhất 100 ký tự';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Mô tả không được vượt quá 5000 ký tự';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá thuê phải lớn hơn 0';
    }

    if (!formData.priceType) {
      newErrors.priceType = 'Vui lòng chọn loại giá';
    }

    if (formData.deposit && formData.deposit < 0) {
      newErrors.deposit = 'Tiền đặt cọc không được nhỏ hơn 0';
    }

    if (uploadedImages.length < 3) {
      newErrors.images = 'Vui lòng tải lên ít nhất 3 hình ảnh';
    }

    if (formData.durationDays && (formData.durationDays < 1 || formData.durationDays > 90)) {
      newErrors.durationDays = 'Thời hạn phải từ 1 đến 90 ngày';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      setError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: CreatePostRequest = {
        ...formData,
        roomId: selectedRoomId!,
        images: uploadedImages,
      };

      if (isEditMode && id) {
        await postService.updatePost(parseInt(id), submitData);
      } else {
        await postService.createPost(submitData);
      }

      navigate('/landlord/posts', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/landlord/posts')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Chỉnh sửa tin đăng' : 'Đăng tin mới'}
        </h2>
      </div>

      {/* Free Posts Alert */}
      {!isEditMode && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Thông báo</h3>
            <p className="text-sm text-blue-700 mt-1">
              Bạn đang sử dụng tin đăng miễn phí (còn {freePostsRemaining} tin). 
              Nếu vượt giới hạn, vui lòng nâng cấp gói dịch vụ để tiếp tục đăng tin.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Room Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Chọn phòng *
          </h3>
          
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Đang tải danh sách phòng...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Bạn chưa có phòng nào.</p>
              <button
                type="button"
                onClick={() => navigate('/landlord/rooms/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo phòng mới
              </button>
            </div>
          ) : (
            <select
              value={selectedRoomId || ''}
              onChange={(e) => setSelectedRoomId(parseInt(e.target.value))}
              className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${
                errors.roomId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.address} - {room.area}m²
                </option>
              ))}
            </select>
          )}
          {errors.roomId && <p className="text-red-500 text-sm mt-1">{errors.roomId}</p>}
          
          {/* Selected Room Preview */}
          {selectedRoom && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-4">
                <img
                  src={resolveMediaUrl(selectedRoom.thumbnailUrl || selectedRoom.images[0]) || createFallbackRoomImage(selectedRoom.address)}
                  alt="Room"
                  className="w-24 h-24 object-cover rounded"
                  onError={(event) => {
                    event.currentTarget.src = createFallbackRoomImage(selectedRoom.address);
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedRoom.address}</p>
                  <p className="text-sm text-gray-600">Diện tích: {selectedRoom.area}m²</p>
                  <p className="text-sm text-gray-600">
                    Tiện ích: {selectedRoom.amenities.map(a => a.name).join(', ') || 'Không có'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Thông tin cơ bản</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề tin đăng * <span className="text-xs text-gray-500">(20-200 ký tự)</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="VD: Phòng trọ cao cấp, nội thất đầy đủ, gần trường đại học..."
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/200 ký tự
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả * <span className="text-xs text-gray-500">(100-5000 ký tự)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Mô tả chi tiết về phòng trọ: vị trí, nội thất, tiện ích xung quanh, đặc điểm nổi bật..."
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/5000 ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá cho thuê (VNĐ) *</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="VD: 3000000"
                min="0"
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại giá *</label>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleInputChange}
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.priceType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="MONTHLY">Theo tháng</option>
                <option value="QUARTERLY">Theo quý</option>
                <option value="YEARLY">Theo năm</option>
              </select>
              {errors.priceType && <p className="text-red-500 text-sm mt-1">{errors.priceType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiền đặt cọc (VNĐ)</label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit || ''}
                onChange={handleInputChange}
                placeholder="VD: 3000000"
                min="0"
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.deposit ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời hạn đăng <span className="text-xs text-gray-500">(1-90 ngày)</span>
              </label>
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays || 30}
                onChange={handleInputChange}
                min="1"
                max="90"
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.durationDays ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.durationDays && <p className="text-red-500 text-sm mt-1">{errors.durationDays}</p>}
            </div>
          </div>
        </div>

        {/* Address (from selected room) */}
        {selectedRoom && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Địa chỉ</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900">{selectedRoom.address}</p>
              <p className="text-sm text-gray-600 mt-1">
                Tọa độ: {selectedRoom.latitude}, {selectedRoom.longitude}
              </p>
            </div>
          </div>
        )}

        {/* Amenities */}
        {selectedRoom && amenities.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Tiện ích</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenities.map((amenity) => {
                const isInRoom = selectedRoom.amenities.some(a => a.id === amenity.id);
                const isSelected = selectedAmenityIds.includes(amenity.id);
                return (
                  <label
                    key={amenity.id}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                      isInRoom ? 'bg-green-50' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isInRoom || isSelected}
                      onChange={() => !isInRoom && handleAmenityToggle(amenity.id)}
                      disabled={isInRoom}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${isInRoom ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                      {amenity.name}
                      {isInRoom && ' ✓'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Hình ảnh * <span className="text-xs text-gray-500">(Tối thiểu 3 ảnh)</span>
          </h3>

          {/* Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 rounded-b-lg">
                      Ảnh bìa
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          <label
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
              errors.images ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm text-gray-600">Đang tải lên...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Kéo thả ảnh vào đây hoặc click để tải lên</p>
                <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG. Tối đa 5MB/ảnh.</p>
              </>
            )}
          </label>
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Đã tải lên: {imagePreviewUrls.length} ảnh (tối thiểu 3 ảnh)
          </p>
        </div>

        {/* Video URL */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Video (tùy chọn)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Video</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
            {formData.videoUrl && getYoutubeId(formData.videoUrl) && (
              <div className="mt-4 aspect-video rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYoutubeId(formData.videoUrl)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Hỗ trợ link YouTube để hiển thị xem trước video trực tiếp.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/landlord/posts')}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingRooms}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              isEditMode ? 'Cập nhật tin' : 'Đăng tin'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
