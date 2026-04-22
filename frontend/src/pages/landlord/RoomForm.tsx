import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader2, X, Upload, MapPin, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import api from '../../services/api';
import type { AmenityResponse, CreateRoomRequest } from '../../types';
import { getErrorMessage } from '../../services/api';
import LeafletMap from '../../components/map/LeafletMap';

// Vietnam provinces for dropdown
const VIETNAM_PROVINCES = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Hải Dương', 'Nam Định', 'Thái Bình',
  'Bắc Ninh', 'Hưng Yên', 'Vĩnh Phúc', 'Quảng Ninh', 'Nghệ An', 'Thanh Hóa', 'Hà Tĩnh', 'Ninh Bình',
  'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Lâm Đồng', 'Đắk Lắk', 'Đắk Nông',
  'Gia Lai', 'Kon Tum', 'Quảng Nam', 'Quảng Ngãi', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu',
  'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang', 'Kiên Giang',
  'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang',
  'Lào Cai', 'Yên Bái', 'Thái Nguyên', 'Lạng Sơn', 'Bắc Giang', 'Phú Thọ', 'Điện Biên', 'Lai Châu', 'Sơn La'
];

const ROOM_DIRECTIONS = [
  { value: 'EAST', label: 'Đông' },
  { value: 'WEST', label: 'Tây' },
  { value: 'NORTH', label: 'Bắc' },
  { value: 'SOUTH', label: 'Nam' },
  { value: 'NORTHEAST', label: 'Đông Bắc' },
  { value: 'NORTHWEST', label: 'Tây Bắc' },
  { value: 'SOUTHEAST', label: 'Đông Nam' },
  { value: 'SOUTHWEST', label: 'Tây Nam' },
];

type RoomImageItem = {
  previewUrl: string;
  file?: File;
  isExisting?: boolean;
};

export default function RoomForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState<CreateRoomRequest>({
    address: '',
    province: '',
    district: '',
    ward: '',
    latitude: 0,
    longitude: 0,
    area: 0,
    floor: 1,
    maxOccupancy: 2,
    images: [],
  });

  // Amenities state
  const [allAmenities, setAllAmenities] = useState<AmenityResponse[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);

  // Image state
  const [imageItems, setImageItems] = useState<RoomImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load amenities on mount
  useEffect(() => {
    loadAmenities();
  }, []);

  // Load room data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadRoom(parseInt(id));
    } else {
      setIsLoading(false);
    }
  }, [isEditMode, id]);

  const loadAmenities = async () => {
    try {
      const data = await roomService.getAllAmenities();
      setAllAmenities(data);
    } catch (err) {
      console.error('Failed to load amenities:', err);
    }
  };

  const loadRoom = async (roomId: number) => {
    try {
      const room = await roomService.getRoomById(roomId);
      setFormData({
        roomNumber: room.roomNumber || undefined,
        address: room.address,
        province: room.province || '',
        district: room.district || '',
        ward: room.ward || '',
        latitude: room.latitude,
        longitude: room.longitude,
        area: room.area,
        floor: room.floor,
        maxOccupancy: room.maxOccupancy,
        direction: room.direction || undefined,
        hasWindows: room.hasWindows,
        hasBalcony: room.hasBalcony,
        images: room.images,
        nearbyUniversityId: room.nearbyUniversityId || undefined,
        nearbyUniversityName: room.nearbyUniversityName || undefined,
        distanceToUniversity: room.distanceToUniversity || undefined,
        nearestBusStation: room.nearestBusStation || undefined,
        isPetFriendly: room.isPetFriendly,
        isParkingAvailable: room.isParkingAvailable,
        curfew: room.curfew || undefined,
        rules: room.rules || undefined,
      });
      setImageItems(room.images.map((url) => ({ previewUrl: url, isExisting: true })));
      setSelectedAmenityIds(room.amenities.map(a => a.id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value,
    }));

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

    const newItems = validFiles.map((file) => ({
      previewUrl: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setImageItems(prev => [...prev, ...newItems]);
    setIsUploading(false);
  }, []);

  const removeImage = (index: number) => {
    setImageItems(prev => {
      const next = [...prev];
      const removed = next[index];
      if (removed?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      next.splice(index, 1);
      return next;
    });
  };

  const uploadRoomImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) {
      return [];
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('category', 'ROOM_IMAGE');

    const response = await api.post('/v1/media/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploaded = response.data?.data || [];
    return uploaded
      .map((item: { fileUrl?: string | null }) => item.fileUrl)
      .filter((url: string | null | undefined): url is string => Boolean(url));
  };

  const getLocationFromAddress = async () => {
    const fullAddress = [formData.address, formData.ward, formData.district, formData.province]
      .filter(Boolean)
      .join(', ');
      
    if (!fullAddress) {
      setError('Vui lòng nhập địa chỉ trước khi tự động lấy tọa độ.');
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          latitude: parseFloat(data[0].lat), 
          longitude: parseFloat(data[0].lon) 
        }));
        setError(null);
      } else {
        setError('Không tìm thấy tọa độ. Vui lòng tự nhấp vào bản đồ bên dưới để chọn.');
      }
    } catch (err) {
      setError('Lỗi kết nối khi lấy tọa độ.');
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.province) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'Diện tích phải lớn hơn 0';
    }

    if (!formData.maxOccupancy || formData.maxOccupancy <= 0) {
      newErrors.maxOccupancy = 'Số người tối đa phải lớn hơn 0';
    }

    if (imageItems.length === 0) {
      newErrors.images = 'Vui lòng tải lên ít nhất 1 hình ảnh';
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
      const existingImageUrls = imageItems
        .filter(item => item.isExisting || !item.file)
        .map(item => item.previewUrl)
        .filter(url => !url.startsWith('blob:'));

      const newFiles = imageItems
        .filter(item => item.file)
        .map(item => item.file as File);

      const uploadedImageUrls = newFiles.length > 0 ? await uploadRoomImages(newFiles) : [];
      const finalImages = [...existingImageUrls, ...uploadedImageUrls];

      const submitData = {
        ...formData,
        amenityIds: selectedAmenityIds,
        images: finalImages,
        thumbnailUrl: finalImages[0] || formData.thumbnailUrl,
      };

      if (isEditMode && id) {
        await roomService.updateRoom(parseInt(id), submitData);
      } else {
        await roomService.createRoom(submitData);
      }

      navigate('/landlord/rooms', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Group amenities by category
  const amenitiesByCategory = allAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, AmenityResponse[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/landlord/rooms')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
        </h2>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Thông tin cơ bản</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber || ''}
                onChange={handleInputChange}
                placeholder="VD: P.101, A1-01"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tầng</label>
              <input
                type="number"
                name="floor"
                value={formData.floor || 1}
                onChange={handleInputChange}
                min="1"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diện tích (m²) *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area || ''}
                onChange={handleInputChange}
                placeholder="VD: 25"
                min="1"
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số người tối đa *
              </label>
              <input
                type="number"
                name="maxOccupancy"
                value={formData.maxOccupancy || ''}
                onChange={handleInputChange}
                placeholder="VD: 2"
                min="1"
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.maxOccupancy ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maxOccupancy && <p className="text-red-500 text-sm mt-1">{errors.maxOccupancy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hướng phòng</label>
              <select
                name="direction"
                value={formData.direction || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Chọn hướng</option>
                {ROOM_DIRECTIONS.map(dir => (
                  <option key={dir.value} value={dir.value}>{dir.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasWindows"
                    checked={formData.hasWindows || false}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Có cửa sổ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasBalcony"
                    checked={formData.hasBalcony || false}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Có ban công</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPetFriendly"
                    checked={formData.isPetFriendly || false}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Cho phép nuôi pet</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isParkingAvailable"
                    checked={formData.isParkingAvailable || false}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Có chỗ để xe</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-900">Địa chỉ</h3>
            <button
              type="button"
              onClick={getLocationFromAddress}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Tự động lấy tọa độ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố *
              </label>
              <select
                name="province"
                value={formData.province || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.province ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {VIETNAM_PROVINCES.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
              <input
                type="text"
                name="district"
                value={formData.district || ''}
                onChange={handleInputChange}
                placeholder="VD: Quận Cầu Giấy"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
              <input
                type="text"
                name="ward"
                value={formData.ward || ''}
                onChange={handleInputChange}
                placeholder="VD: Phường Dịch Vọng"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ chi tiết *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Số nhà, tên đường..."
                className={`w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Latitude)</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude || ''}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Longitude)</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude || ''}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Bản đồ chọn vị trí (Nhấp vào bản đồ để thả ghim)</p>
            <LeafletMap 
              center={{ 
                lat: formData.latitude && formData.latitude !== 0 ? formData.latitude : 21.0285, 
                lng: formData.longitude && formData.longitude !== 0 ? formData.longitude : 105.8542 
              }}
              marker={(formData.latitude && formData.longitude && formData.latitude !== 0) ? { lat: formData.latitude, lng: formData.longitude } : undefined}
              height="350px"
              zoom={13}
              onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
            />
            <p className="text-xs text-gray-500 mt-2">Dữ liệu bản đồ được cung cấp miễn phí bởi OpenStreetMap (Nominatim API).</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Tiện ích</h3>
          
          {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize">{category}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.map((amenity) => {
                  const isSelected = selectedAmenityIds.includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 border-2 border-blue-500' 
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="sr-only"
                      />
                      <span className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                        {isSelected && <Check className="w-4 h-4 inline mr-1" />}
                        {amenity.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          
          {allAmenities.length === 0 && (
            <p className="text-gray-500 text-sm">Đang tải tiện ích...</p>
          )}
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Hình ảnh *
          </h3>

          {/* Image Previews */}
          {imageItems.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
              {imageItems.map((item, index) => (
                <div key={index} className="relative group">
                  <img
                    src={item.previewUrl}
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
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors block ${
              errors.images ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
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
            Đã tải lên: {imageItems.length} ảnh
          </p>
        </div>

        {/* Rules */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Quy định (tùy chọn)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ giới ng curfew</label>
              <input
                type="text"
                name="curfew"
                value={formData.curfew || ''}
                onChange={handleInputChange}
                placeholder="VD: 22:00"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội quy phòng trọ</label>
              <textarea
                name="rules"
                value={formData.rules || ''}
                onChange={handleInputChange}
                rows={4}
                placeholder="VD:&#10;- Không hút thuốc trong phòng&#10;- Giữ yên lặng sau 22h&#10;- Không nuôi động vật lớn..."
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
          </div>
        </div>

        {/* Nearby Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Thông tin lân cận (tùy chọn)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trường đại học gần nhất</label>
              <input
                type="text"
                name="nearbyUniversityName"
                value={formData.nearbyUniversityName || ''}
                onChange={handleInputChange}
                placeholder="VD: Đại học Quốc gia Hà Nội"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách đến trường (km)</label>
              <input
                type="number"
                name="distanceToUniversity"
                value={formData.distanceToUniversity || ''}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                placeholder="VD: 1.5"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách đến bus gần nhất (m)</label>
              <input
                type="number"
                name="nearestBusStation"
                value={formData.nearestBusStation || ''}
                onChange={handleInputChange}
                min="0"
                placeholder="VD: 200"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/landlord/rooms')}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              isEditMode ? 'Cập nhật' : 'Tạo phòng'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
