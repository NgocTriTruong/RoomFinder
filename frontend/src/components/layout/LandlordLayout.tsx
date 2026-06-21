import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  Calendar, 
  CreditCard, 
  History, 
  LogOut,
  Bell,
  User,
  MessageCircle,
  ShieldCheck,
  Home,
  ChevronDown,
  Settings
} from 'lucide-react';
import { createAvatarPlaceholder } from '@/utils/localImage';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import subscriptionService from '@/services/subscriptionService';

export default function LandlordLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [subscription, setSubscription] = React.useState<any>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Click outside listener for profile dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await subscriptionService.getCurrentSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/landlord', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
    { path: '/landlord/rooms', icon: <Home className="w-5 h-5" />, label: 'Quản lý phòng' },
    { path: '/landlord/posts', icon: <List className="w-5 h-5" />, label: 'Quản lý tin đăng' },
    { path: '/landlord/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Lịch hẹn' },
    { path: '/landlord/messages', icon: <MessageCircle className="w-5 h-5" />, label: 'Tin nhắn' },
    { path: '/landlord/packages', icon: <CreditCard className="w-5 h-5" />, label: 'Mua gói dịch vụ' },
    { path: '/landlord/transactions', icon: <History className="w-5 h-5" />, label: 'Lịch sử giao dịch' },
    { path: '/landlord/verification', icon: <ShieldCheck className="w-5 h-5" />, label: 'Xác thực tài khoản' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="RoomFinder Logo" className="h-[40px] w-auto object-contain rounded-md" />
            <span className="text-xl font-bold text-gray-900">RoomFinder</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/landlord'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Không gian chủ trọ</h1>
              <div className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                {subscription ? (
                  <>
                    <span className="font-bold mr-1">{subscription.packageName}:</span> 
                    Còn {subscription.remainingPosts} tin
                  </>
                ) : (
                  `Số tin miễn phí còn lại: 0`
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              {/* Landlord Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-4 border-l border-gray-200 group focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={user?.avatar || createAvatarPlaceholder(user?.fullName || 'Người dùng', 100)}
                      alt="Landlord Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-blue-100 group-hover:border-blue-400 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-left hidden sm:block mr-1">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-none">{user?.fullName || 'Người dùng'}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Chủ trọ</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cá nhân</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/landlord/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Thông tin cá nhân
                    </button>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/landlord/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Cài đặt tài khoản
                    </button>
                    <div className="h-px bg-gray-50 my-1 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
