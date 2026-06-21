import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Menu, User, Home, LogOut, Settings, Heart, Calendar, PlusCircle, Mic } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import VoiceSearchModal from '../ui/VoiceSearchModal';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState(searchParams.get('q') || '');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    setHeaderSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={user?.role === 'ADMIN' ? "/admin" : "/"} className="flex items-center gap-0">
              <img src="/logo.png" alt="RoomFinder Logo" className="h-[44px] w-auto object-contain rounded-md" />
              <span className="text-xl font-bold text-gray-900">RoomFinder</span>
            </Link>
          </div>

          {/* Quick Search (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const params = new URLSearchParams();
                    if (headerSearchQuery) params.append('q', headerSearchQuery);
                    navigate(`/search?${params.toString()}`);
                  }
                }}
                className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors"
                placeholder="Tìm kiếm phòng trọ, khu vực..."
              />
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                title="Tìm kiếm bằng giọng nói"
              >
                <Mic className="h-4 w-4 text-blue-500 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors px-2"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/register"
                  className="border border-amber-500 text-amber-500 hover:bg-amber-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                   Trở thành chủ trọ
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {user?.role === 'LANDLORD' && (
                  <Link
                    to="/landlord/posts/create"
                    className="hidden lg:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Đăng tin mới
                  </Link>
                )}

                <NotificationDropdown />

                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        user?.fullName.charAt(0)
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block pr-1">{user?.fullName.split(' ').pop()}</span>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <Link 
                          to={user?.role === 'ADMIN' ? "/admin" : (user?.role === 'LANDLORD' ? "/landlord" : "/tenant")} 
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-400" />
                          Trang {user?.role === 'ADMIN' ? 'quản trị' : (user?.role === 'LANDLORD' ? 'quản lý' : 'cá nhân')}
                        </Link>
                        
                        <Link to="/tenant/settings" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                          <Settings className="w-4 h-4 mr-3 text-gray-400" />
                          Cài đặt tài khoản
                        </Link>

                        {user?.role !== 'ADMIN' && (
                          <Link to="/tenant/saved" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                            <Heart className="w-4 h-4 mr-3 text-gray-400" />
                            Phòng đã lưu
                          </Link>
                        )}

                        <Link 
                          to={user?.role === 'ADMIN' ? "/admin/moderation" : (user?.role === 'LANDLORD' ? "/landlord/bookings" : "/tenant/bookings")} 
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                          {user?.role === 'ADMIN' ? 'Danh sách duyệt tin' : 'Lịch hẹn đặt chỗ'}
                        </Link>

                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-400" />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-3">
             {isAuthenticated && <NotificationDropdown />}
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onResult={(text) => {
          setHeaderSearchQuery(text);
          const params = new URLSearchParams();
          params.append('q', text);
          navigate(`/search?${params.toString()}`);
        }}
      />
    </header>
  );
}
