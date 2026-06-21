import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import RoomCard, { RoomCardSkeleton } from '../components/ui/RoomCard';
import postService, { PostSearchParams } from '../services/postService';
import roomService from '../services/roomService';
import { PostResponse, AmenityResponse } from '../types';
import universityService, { UniversityResponse } from '../services/universityService';

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);


  // Filters state
  const [keyword, setKeyword] = useState(() => {
    const q = searchParams.get('q');
    if (q) return q;
    const categoryParam = searchParams.get('category');
    if (categoryParam === 'room') return 'phòng trọ';
    if (categoryParam === 'apartment') return 'căn hộ';
    if (categoryParam === 'house') return 'nhà nguyên căn';
    return '';
  });

  const [priceRange, setPriceRange] = useState(() => {
    const q = searchParams.get('q');
    if (q) {
      const qLower = q.toLowerCase();
      if (qLower.includes('dưới 2 triệu') || qLower.includes('dưới 2tr') || qLower.includes('dưới 2.000.000')) return 'Dưới 2 triệu';
      if (qLower.includes('dưới 4 triệu') || qLower.includes('dưới 4tr') || qLower.includes('dưới 4.000.000')) return '2 - 4 triệu';
      if (qLower.includes('dưới 7 triệu') || qLower.includes('dưới 7tr') || qLower.includes('dưới 7.000.000')) return '4 - 7 triệu';
      if (qLower.includes('trên 7 triệu') || qLower.includes('trên 7tr')) return 'Trên 7 triệu';
    }
    return '';
  });

  const [district, setDistrict] = useState(() => {
    const q = searchParams.get('q');
    if (q) {
      const qLower = q.toLowerCase();
      if (qLower.includes('quận 1') || qLower.includes('q1')) return 'Quận 1';
      if (qLower.includes('quận 5') || qLower.includes('q5')) return 'Quận 5';
      if (qLower.includes('quận 9') || qLower.includes('q9')) return 'Quận 9';
      if (qLower.includes('bình thạnh')) return 'Quận Bình Thạnh';
      if (qLower.includes('gò vấp')) return 'Quận Gò Vấp';
    }
    return '';
  });

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(0);

  // Amenities state
  const [allAmenities, setAllAmenities] = useState<AmenityResponse[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);

  // University filter
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | ''>(() => {
    const nearby = searchParams.get('nearbyUniversityId');
    return nearby ? Number(nearby) : '';
  });
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityResponse | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [uniKeyword, setUniKeyword] = useState('');

  // Debounced values
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedUniKeyword = useDebounce(uniKeyword, 300);

  // Parse URL search parameters on mount or change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setKeyword(q);
      const qLower = q.toLowerCase();

      // 1. Auto-detect Price range from URL query
      if (qLower.includes('dưới 2 triệu') || qLower.includes('dưới 2tr') || qLower.includes('dưới 2.000.000')) {
        setPriceRange('Dưới 2 triệu');
      } else if (qLower.includes('dưới 4 triệu') || qLower.includes('dưới 4tr') || qLower.includes('dưới 4.000.000')) {
        setPriceRange('2 - 4 triệu');
      } else if (qLower.includes('dưới 7 triệu') || qLower.includes('dưới 7tr') || qLower.includes('dưới 7.000.000')) {
        setPriceRange('4 - 7 triệu');
      } else if (qLower.includes('trên 7 triệu') || qLower.includes('trên 7tr')) {
        setPriceRange('Trên 7 triệu');
      }

      // 2. Auto-detect District from URL query
      if (qLower.includes('quận 1') || qLower.includes('q1')) {
        setDistrict('Quận 1');
      } else if (qLower.includes('quận 5') || qLower.includes('q5')) {
        setDistrict('Quận 5');
      } else if (qLower.includes('quận 9') || qLower.includes('q9')) {
        setDistrict('Quận 9');
      } else if (qLower.includes('bình thạnh')) {
        setDistrict('Quận Bình Thạnh');
      } else if (qLower.includes('gò vấp')) {
        setDistrict('Quận Gò Vấp');
      }

      // 3. Auto-detect Amenities from URL query
      if (allAmenities.length > 0) {
        const detectedAmenityIds: number[] = [];
        allAmenities.forEach(amenity => {
          const amenityNameLower = amenity.name.toLowerCase();
          if (qLower.includes(amenityNameLower)) {
            detectedAmenityIds.push(amenity.id);
          } else if (amenityNameLower === 'điều hòa' && (qLower.includes('máy lạnh') || qLower.includes('điều hoá'))) {
            detectedAmenityIds.push(amenity.id);
          }
        });
        if (detectedAmenityIds.length > 0) {
          setSelectedAmenityIds(prev => {
            const merged = [...prev];
            detectedAmenityIds.forEach(id => {
              if (!merged.includes(id)) merged.push(id);
            });
            return merged;
          });
        }
      }
    }

    const nearbyUniId = searchParams.get('nearbyUniversityId');
    if (nearbyUniId) {
      setSelectedUniversityId(Number(nearbyUniId));
    }

    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      if (categoryParam === 'room') {
        setKeyword('phòng trọ');
      } else if (categoryParam === 'apartment') {
        setKeyword('căn hộ');
      } else if (categoryParam === 'house') {
        setKeyword('nhà nguyên căn');
      }
    }
  }, [searchParams, allAmenities]);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await roomService.getAllAmenities();
        setAllAmenities(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tiện nghi:', error);
      }
    };
    fetchAmenities();
  }, []);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await universityService.getAll(undefined, debouncedUniKeyword, district);
        setUniversities(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách trường ĐH:', error);
      }
    };
    fetchUniversities();
  }, [debouncedUniKeyword, district]);

  // Sync selectedUniversity when selectedUniversityId changes
  useEffect(() => {
    if (!selectedUniversityId) {
      setSelectedUniversity(null);
      return;
    }
    const found = universities.find(u => u.id === Number(selectedUniversityId));
    if (found) {
      setSelectedUniversity(found);
    } else {
      universityService.getById(selectedUniversityId)
        .then(data => {
          setSelectedUniversity(data);
          setUniversities(prev => {
            if (!prev.some(u => u.id === data.id)) {
              return [...prev, data];
            }
            return prev;
          });
        })
        .catch(err => console.error('Lỗi khi lấy thông tin chi tiết trường:', err));
    }
  }, [selectedUniversityId, universities]);

  // Reset page to 0 when filters change to ensure correct pagination
  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, priceRange, district, selectedAmenityIds, sortBy, sortDirection, selectedUniversityId, radiusKm]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const params: PostSearchParams & { page: number; size: number; sortBy: string; sortDirection: string } = {
        keyword: debouncedKeyword,
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

      if (selectedAmenityIds.length > 0) {
        params.amenityIds = selectedAmenityIds;
      }

      // Geo search if university is selected
      if (selectedUniversityId) {
        params.nearbyUniversityId = Number(selectedUniversityId);
        if (selectedUniversity) {
          params.latitude = selectedUniversity.latitude;
          params.longitude = selectedUniversity.longitude;
          params.radiusKm = radiusKm;
        }
      }

      const response = await postService.getPublicPosts(params);
      setPosts(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, priceRange, district, selectedAmenityIds, sortBy, sortDirection, page, selectedUniversityId, radiusKm, selectedUniversity]);

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

  const renderPagination = () => {
    const totalPages = Math.ceil(totalElements / 9);
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    // Always include page 1 (index 0)
    pages.push(0);

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i < totalPages - 1; i++) {
        pages.push(i);
      }
    } else {
      // We have more pages than can be shown
      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages - 2, page + 1);

      if (start > 1) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }
    }

    // Always include last page (index totalPages - 1)
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }

    return (
      <div className="mt-10 flex items-center justify-center gap-2">
        <button
          onClick={() => {
            if (page > 0) {
              setPage(page - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={page === 0}
          className="px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Trước
        </button>

        {pages.map((p, idx) => {
          if (p === 'ellipsis-start' || p === 'ellipsis-end') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 select-none">
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === page;

          return (
            <button
              key={pageNum}
              onClick={() => {
                setPage(pageNum);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button
          onClick={() => {
            if (page < totalPages - 1) {
              setPage(page + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={page === totalPages - 1}
          className="px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            {/* Price Filter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900">Khoảng giá</h3>
                {(keyword || priceRange || district || selectedUniversityId || selectedAmenityIds.length > 0) && (
                  <button
                    onClick={() => {
                      setKeyword('');
                      setPriceRange('');
                      setDistrict('');
                      setSelectedUniversityId('');
                      setSelectedAmenityIds([]);
                      setUniKeyword('');
                      setSearchParams({});
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
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

            {/* Amenities Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tiện nghi</h3>
              {allAmenities.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                  {allAmenities.map((amenity) => {
                    const isChecked = selectedAmenityIds.includes(amenity.id);
                    return (
                      <label
                        key={amenity.id}
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] cursor-pointer select-none transition-all ${isChecked
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="sr-only"
                          onChange={() => {
                            if (isChecked) {
                              setSelectedAmenityIds(selectedAmenityIds.filter(id => id !== amenity.id));
                            } else {
                              setSelectedAmenityIds([...selectedAmenityIds, amenity.id]);
                            }
                          }}
                        />
                        <span className="truncate" title={amenity.name}>{amenity.name}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Đang tải tiện nghi...</p>
              )}
            </div>

            {/* University Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Gần trường Đại học</h3>
              <input
                type="text"
                placeholder="Tìm tên trường..."
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border mb-2"
                value={uniKeyword}
                onChange={(e) => setUniKeyword(e.target.value)}
              />
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={selectedUniversityId}
                onChange={(e) => setSelectedUniversityId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Chọn trường đại học</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>
                    {uni.abbreviation ? `[${uni.abbreviation}] ` : ''}{uni.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radius Filter (Only show if university is selected) */}
            {selectedUniversityId && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex justify-between">
                  <span>Bán kính</span>
                  <span className="text-blue-600 font-bold">{radiusKm} km</span>
                </h3>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1km</span>
                  <span>10km</span>
                  <span>20km</span>
                </div>
              </div>
            )}

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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, idx) => (
                <RoomCardSkeleton key={idx} />
              ))}
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

              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
