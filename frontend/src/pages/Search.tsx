import React, { useEffect, useState, useCallback } from 'react';
import { Filter, SlidersHorizontal, Loader2, Search as SearchIcon } from 'lucide-react';
import RoomCard from '../components/ui/RoomCard';
import postService, { PostSearchParams } from '../services/postService';
import { PostResponse } from '../types';

export default function Search() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [keyword, setKeyword] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [district, setDistrict] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: PostSearchParams & { page: number; size: number; sortBy: string; sortDirection: string } = {
        keyword,
        page,
        size: 9,
        sortBy,
        sortDirection,
      };

      // Map price range string to values
      if (priceRange === 'Dưới 2 triệu') {
        params.maxPrice = 2000000;
      } else if (priceRange === '2 - 4 triệu') {
        params.minPrice = 2000000;
        params.maxPrice = 4000000;
      } else if (priceRange === '4 - 7 triệu') {
        params.minPrice = 4000000;
        params.maxPrice = 7000000;
      } else if (priceRange === 'Trên 7 triệu') {
        params.minPrice = 7000000;
      }

      if (district) {
        params.location = district;
      }

      const response = await postService.getPublicPosts(params);
      setPosts(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    } finally {
      setLoading(false);
    }
  }, [keyword, priceRange, district, sortBy, sortDirection, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleApplyFilters = () => {
    setPage(0);
    fetchPosts();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'Mới nhất') {
      setSortBy('createdAt');
      setSortDirection('desc');
    } else if (value === 'Giá thấp đến cao') {
      setSortBy('price');
      setSortDirection('asc');
    } else if (value === 'Giá cao xuống thấp') {
      setSortBy('price');
      setSortDirection('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Filter className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
            </div>

            {/* Keyword Search */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Từ khóa</h3>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Quận 1, giá rẻ..."
                  className="w-full pl-9 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Khoảng giá</h3>
              <div className="space-y-2">
                {['Dưới 2 triệu', '2 - 4 triệu', '4 - 7 triệu', 'Trên 7 triệu'].map((range, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === range}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={() => setPriceRange(range)}
                    />
                    <span className="ml-2 text-sm text-gray-600">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* District Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Khu vực</h3>
              <select 
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Tất cả quận/huyện</option>
                <option value="Quận 1">Quận 1</option>
                <option value="Quận 5">Quận 5</option>
                <option value="Quận 9">Quận 9</option>
                <option value="Quận Bình Thạnh">Bình Thạnh</option>
                <option value="Quận Gò Vấp">Gò Vấp</option>
              </select>
            </div>

            <button 
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Tìm thấy {totalElements} kết quả
            </h1>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              <select 
                onChange={handleSortChange}
                className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option>Mới nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao xuống thấp</option>
              </select>
            </div>
          </div>

          {loading && page === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <RoomCard key={post.id} room={post} />
                ))}
              </div>
              
              {posts.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Không tìm thấy kết quả nào phù hợp.</p>
                </div>
              )}

              {totalElements > posts.length && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setPage(page + 1)}
                    disabled={loading}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center mx-auto gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Xem thêm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
