import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Package,
  AlertTriangle,
  LogOut,
  Search,
  ChevronRight,
  ShieldCheck,
  Tag,
  UserX,
  FileSearch,
  CreditCard,
  History,
  Menu,
  X as CloseIcon,
  ChevronDown,
  User as UserIcon,
  Settings
} from 'lucide-react';
import { createAvatarPlaceholder } from '../../utils/localImage';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

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

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
    { path: '/admin/moderation', icon: <CheckSquare className="w-5 h-5" />, label: 'Duyệt tin' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Quản lý tài khoản' },
    { path: '/admin/kyc', icon: <FileSearch className="w-5 h-5" />, label: 'Xét duyệt KYC' },
    { path: '/admin/blacklist', icon: <UserX className="w-5 h-5" />, label: 'Danh sách đen' },
    { path: '/admin/packages', icon: <Package className="w-5 h-5" />, label: 'Quản lý Gói dịch vụ' },
    { path: '/admin/vouchers', icon: <Tag className="w-5 h-5" />, label: 'Quản lý Voucher' },
    { path: '/admin/reports', icon: <AlertTriangle className="w-5 h-5" />, label: 'Báo cáo vi phạm' },
    { path: '/admin/transactions', icon: <CreditCard className="w-5 h-5" />, label: 'Quản lý Giao dịch' },
    { path: '/admin/audit-logs', icon: <History className="w-5 h-5" />, label: 'Nhật ký hoạt động' },
  ];

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Tổng quan';
    const item = menuItems.find(m => m.path === path);
    return item ? item.label : 'Chi tiết';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-gray-900 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin')}>
            <img src="/logo.png" alt="RoomFinder Logo" className="h-[40px] w-auto object-contain rounded-md" />
            <span className="text-xl font-bold tracking-wide text-white">RoomFinder</span>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true });
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64 min-h-screen min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-gray-500 overflow-hidden">
                <span className="hover:text-blue-600 cursor-pointer hidden sm:inline" onClick={() => navigate('/admin')}>Quản trị</span>
                <ChevronRight className="w-4 h-4 mx-2 hidden sm:inline" />
                <span className="font-medium text-gray-900 truncate">{getBreadcrumb()}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Global Search */}
              <div className="relative hidden md:block w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors"
                  placeholder="Tìm kiếm toàn cục..."
                />
              </div>

              {/* Admin Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-6 border-l border-gray-200 group focus:outline-none"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user?.fullName || 'System Admin'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@roomfinder.vn'}</p>
                  </div>
                  <div className="relative">
                    <img
                      src={createAvatarPlaceholder(user?.fullName || 'System Admin', 100)}
                      alt="Admin Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-400 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tài khoản</p>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/profile')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Thông tin cá nhân
                    </button>
                    <button 
                      onClick={() => navigate('/admin/account-settings')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Cài đặt tài khoản
                    </button>
                    <button 
                      onClick={() => navigate('/admin/settings')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Thiết lập hệ thống
                    </button>
                    <div className="h-px bg-gray-50 my-1 mx-2"></div>
                    <button 
                      onClick={async () => {
                        await logout();
                        navigate('/login', { replace: true });
                      }}
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
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
