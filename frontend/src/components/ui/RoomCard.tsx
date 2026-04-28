import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Maximize, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { PostResponse } from '../../types';
import { createPlaceholderImage } from '../../utils/localImage';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { useAuth } from '../../contexts/AuthContext';
import favoriteService from '../../services/favoriteService';

interface RoomCardProps {
  room: PostResponse;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

export default function RoomCard({ room, isSaved: propIsSaved, onToggleSave }: RoomCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(propIsSaved ?? false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsSaved(propIsSaved ?? false);

    // If not provided as prop, and logged in, check from server
    if (propIsSaved === undefined && isAuthenticated && room.room?.id) {
      favoriteService.isFavorite(room.room.id).then(setIsSaved).catch(() => { });
    }
  }, [propIsSaved, isAuthenticated, room.room?.id]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleSave) {
      onToggleSave(e);
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      const roomId = room.room?.id || room.id;
      console.log('Toggle favorite for room:', roomId); // Debug log

      if (isSaved) {
        await favoriteService.removeFavorite(roomId);
        setIsSaved(false);
      } else {
        await favoriteService.addFavorite(roomId);
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu/bỏ lưu phòng:', error);
      const message = error.response?.data?.message || 'Không thể thực hiện thao tác. Vui lòng thử lại sau.';
      alert(message);
    } finally {
      setSaving(false);
    }
  };
  const thumbnail = resolveMediaUrl(room.room?.thumbnailUrl || room.images?.[0]) || createPlaceholderImage(room.title, 400, 300);

  const amenities = room.room?.amenities?.map(a => a.name) || [];
  const area = room.room?.area || 0;
  const address = room.room?.address || 'Chưa xác định';
  const isVIP = room.isBoosted || false;
  return (
    <div
      className={`relative flex flex-col bg-white rounded-lg overflow-hidden transition-transform hover:-translate-y-1 ${isVIP ? 'shadow-md border border-amber-400' : 'shadow-sm border border-gray-100'
        }`}
    >
      {/* Thumbnail & Badges */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={room.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.src = createPlaceholderImage(room.title, 400, 300);
          }}
        />
        {isVIP && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            VIP
          </div>
        )}
        <button
          onClick={handleToggleSave}
          disabled={saving}
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm disabled:opacity-50"
          aria-label={isSaved ? 'Bỏ lưu phòng' : 'Lưu phòng'}
        >
          <Heart
            className={`w-5 h-5 ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ${saving ? 'animate-pulse' : ''}`}
            fill={isSaved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/room/${room.id}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {room.title}
          </h3>
        </Link>

        <div className="mt-2 text-blue-600 font-bold text-lg">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}/tháng
        </div>

        <div className="mt-3 flex items-center text-gray-600 text-sm space-x-4">
          <div className="flex items-center">
            <Maximize className="w-4 h-4 mr-1 text-gray-400" />
            <span>{area} m²</span>
          </div>
          <div className="flex items-center truncate">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span className="truncate">{address}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-xs text-gray-600 border border-gray-100"
            >
              <Tag className="w-3 h-3 mr-1 text-gray-400" />
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-xs text-gray-600 border border-gray-100">
              +{amenities.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
