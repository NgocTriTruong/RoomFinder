import React, { useEffect, useState } from 'react';
import { Loader2, Heart, Search } from 'lucide-react';
import RoomCard from '../../components/ui/RoomCard';
import favoriteService, { FavoriteResponse } from '../../services/favoriteService';
import { Link } from 'react-router-dom';

export default function SavedRoomsPage() {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await favoriteService.getUserFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đã lưu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleSave = async (id: string | number) => {
    try {
      await favoriteService.removeFavorite(id);
      setFavorites(favorites.filter(fav => fav.roomId.toString() !== id.toString()));
    } catch (error) {
      console.error('Lỗi khi bỏ lưu phòng:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Phòng đã lưu</h2>
        <p className="text-gray-600 mt-1">Danh sách các phòng trọ bạn đang quan tâm ({favorites.length})</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <RoomCard 
              key={fav.id} 
              room={fav.room} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có phòng nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-6">Hãy dạo quanh một vòng và lưu lại những căn phòng bạn ưng ý nhé!</p>
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm ngay
          </Link>
        </div>
      )}
    </div>
  );
}
