import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, MapPin, Maximize2, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import type { RoomDetailResponse } from '../../types';
import { getErrorMessage } from '../../services/api';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { createPlaceholderImage } from '../../utils/localImage';

export default function RoomManagementPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const data = await roomService.getMyRooms();
      // Convert RoomResponse[] to RoomDetailResponse[] for display
      // In real implementation, you might want to fetch full details
      const roomsWithDetails: RoomDetailResponse[] = data.map(room => ({
        id: room.id,
        roomNumber: null,
        address: room.address,
        province: null,
        district: null,
        ward: null,
        latitude: room.latitude,
        longitude: room.longitude,
        area: room.area,
        floor: 0,
        maxOccupancy: 0,
        direction: null,
        hasWindows: true,
        hasBalcony: false,
        thumbnailUrl: room.thumbnailUrl || (room.images && room.images.length > 0 ? room.images[0] : null) || null,
        images: room.images || [],
        amenities: room.amenities || [],
        nearbyUniversityId: null,
        nearbyUniversityName: null,
        distanceToUniversity: null,
        nearestBusStation: null,
        isPetFriendly: false,
        isParkingAvailable: false,
        curfew: null,
        rules: null,
        viewCount: 0,
        favoriteCount: 0,
        landlord: room.landlord,
        createdAt: '',
        updatedAt: '',
      }));
      setRooms(roomsWithDetails);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (roomId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    setIsDeleting(roomId);
    try {
      await roomService.deleteRoom(roomId);
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(null);
    }
  };

  const getAmenityIcons = (amenities: { name: string }[]) => {
    return amenities.slice(0, 4).map(a => a.name).join(', ');
  };

  const getRoomImage = (room: RoomDetailResponse) => {
    return resolveMediaUrl(room.thumbnailUrl || (room.images && room.images[0])) || createPlaceholderImage(room.address || 'Phòng');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý phòng</h2>
          <p className="text-gray-600 mt-1">Quản lý danh sách phòng trọ của bạn</p>
        </div>
        <button 
          onClick={() => navigate('/landlord/rooms/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm phòng mới
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {/* Empty State */}
      {rooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phòng nào</h3>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm phòng trọ đầu tiên của bạn</p>
          <button
            onClick={() => navigate('/landlord/rooms/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm phòng mới
          </button>
        </div>
      ) : (
        /* Room Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Room Image */}
              <div className="relative h-48">
                <img
                  src={getRoomImage(room)}
                  alt={room.address}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    const fallback = createPlaceholderImage(room.address || 'Phòng');
                    if (event.currentTarget.src !== fallback) {
                      event.currentTarget.src = fallback;
                    }
                  }}
                />
                {room.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    +{room.images.length - 1} ảnh
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {room.roomNumber && (
                      <span className="text-xs text-gray-500">Phòng {room.roomNumber}</span>
                    )}
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {room.address}
                    </h3>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Maximize2 className="w-4 h-4 mr-1" />
                    {room.area}m²
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {room.maxOccupancy || '-'}
                  </span>
                </div>

                {/* Address Preview */}
                <div className="flex items-start text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{room.address}</span>
                </div>

                {/* Amenities */}
                {room.amenities.length > 0 && (
                  <div className="text-xs text-gray-500 mb-4">
                    <span className="font-medium">Tiện ích: </span>
                    {getAmenityIcons(room.amenities)}
                    {room.amenities.length > 4 && ` +${room.amenities.length - 4} khác`}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <button
                    onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Sửa
                  </button>
                  <button
                    onClick={() => navigate(`/landlord/posts/create?roomId=${room.id}`)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Đăng tin
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    disabled={isDeleting === room.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Xóa phòng"
                  >
                    {isDeleting === room.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room List (Alternative Table View) */}
      {rooms.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phòng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Địa chỉ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Diện tích
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tiện ích
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded object-cover flex-shrink-0"
                          src={getRoomImage(room)}
                          alt=""
                          onError={(event) => {
                            const fallback = createPlaceholderImage(room.address || 'Phòng');
                            if (event.currentTarget.src !== fallback) {
                              event.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {room.roomNumber ? `Phòng ${room.roomNumber}` : `ID: ${room.id}`}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {room.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs line-clamp-2">
                        {room.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.area}m²</div>
                      {room.floor > 0 && (
                        <div className="text-xs text-gray-500">Tầng {room.floor}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs line-clamp-2">
                        {room.amenities.length > 0 
                          ? room.amenities.map(a => a.name).join(', ')
                          : 'Không có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/landlord/posts/create?roomId=${room.id}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Đăng tin"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          disabled={isDeleting === room.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Xóa"
                        >
                          {isDeleting === room.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
