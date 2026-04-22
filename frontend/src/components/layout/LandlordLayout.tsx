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
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LandlordLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Landlord</span>
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
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Dashboard</h1>
              <div className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Số tin miễn phí còn lại: 2
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.fullName || 'Người dùng'}
                </span>
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
