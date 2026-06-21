/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, GuestRoute, LandlordRoute, AdminRoute, TenantOrPublicRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import LandlordLayout from './components/layout/LandlordLayout';
import TenantLayout from './components/layout/TenantLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Search from './pages/Search';
import RoomDetail from './pages/RoomDetail';

// Static Pages
import About from './pages/static/About';
import Regulation from './pages/static/Regulation';
import Privacy from './pages/static/Privacy';
import Contact from './pages/static/Contact';
import Faqs from './pages/static/Faqs';
import PostGuide from './pages/static/PostGuide';
import Pricing from './pages/static/Pricing';
import Dispute from './pages/static/Dispute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PaymentResultPage from './pages/PaymentResultPage';
import AuthCallback from './pages/AuthCallback';

// Landlord Pages
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import PostManagementPage from './pages/landlord/PostManagementPage';
import PostCreationForm from './pages/landlord/PostCreationForm';
import SubscriptionPackagesPage from './pages/landlord/SubscriptionPackagesPage';
import TransactionHistoryPage from './pages/landlord/TransactionHistoryPage';
import LandlordBookingPage from './pages/landlord/LandlordBookingPage';
import VerificationPage from './pages/landlord/VerificationPage';
import RoomManagementPage from './pages/landlord/RoomManagementPage';
import RoomForm from './pages/landlord/RoomForm';

// Tenant Pages
import SavedRoomsPage from './pages/tenant/SavedRoomsPage';
import TenantBookingPage from './pages/tenant/TenantBookingPage';
import ChatUI from './pages/tenant/ChatUI';
import Profile from './pages/tenant/Profile';
import LandlordChatPage from './pages/landlord/LandlordChatPage';
import ProfilePage from './pages/shared/ProfilePage';
import AccountSettingsPage from './pages/shared/AccountSettingsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PostModerationPage from './pages/admin/PostModerationPage';
import ReportManagementPage from './pages/admin/ReportManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import KYCManagementPage from './pages/admin/KYCManagementPage';
import BlacklistPage from './pages/admin/BlacklistPage';
import PackageManagementPage from './pages/admin/PackageManagementPage';
import VoucherManagementPage from './pages/admin/VoucherManagementPage';
import TransactionManagementPage from './pages/admin/TransactionManagementPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ============================================ */}
          {/* PUBLIC ROUTES - Accessible by everyone */}
          {/* ============================================ */}
          <Route path="/" element={
            <TenantOrPublicRoute>
              <MainLayout />
            </TenantOrPublicRoute>
          }>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="room/:id" element={<RoomDetail />} />
            <Route path="about" element={<About />} />
            <Route path="regulation" element={<Regulation />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="post-guide" element={<PostGuide />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="dispute" element={<Dispute />} />
          </Route>

          {/* ============================================ */}
          {/* AUTH ROUTES - Only for guests (not logged in) */}
          {/* ============================================ */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/payment/vnpay/return" element={<PaymentResultPage />} />

          {/* ============================================ */}
          {/* LANDLORD ROUTES - Requires LANDLORD or ADMIN role */}
          {/* ============================================ */}
          <Route
            path="/landlord"
            element={
              <LandlordRoute>
                <LandlordLayout />
              </LandlordRoute>
            }
          >
            <Route index element={<LandlordDashboard />} />
            <Route path="room-preview/:id" element={<RoomDetail />} />
            <Route path="posts" element={<PostManagementPage />} />
            <Route path="posts/create" element={<PostCreationForm />} />
            <Route path="posts/edit/:id" element={<PostCreationForm />} />
            <Route path="rooms" element={<RoomManagementPage />} />
            <Route path="rooms/create" element={<RoomForm />} />
            <Route path="rooms/edit/:id" element={<RoomForm />} />
            <Route path="bookings" element={<LandlordBookingPage />} />
            <Route path="messages" element={<LandlordChatPage />} />
            <Route path="packages" element={<SubscriptionPackagesPage />} />
            <Route path="transactions" element={<TransactionHistoryPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<AccountSettingsPage />} />
          </Route>

          {/* ============================================ */}
          {/* TENANT ROUTES - Requires any authenticated user */}
          {/* ============================================ */}
          <Route
            path="/tenant"
            element={
              <ProtectedRoute>
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SavedRoomsPage />} />
            <Route path="saved" element={<SavedRoomsPage />} />
            <Route path="bookings" element={<TenantBookingPage />} />
            <Route path="messages" element={<ChatUI />} />
            <Route path="settings" element={<AccountSettingsPage />} />
          </Route>

          {/* ============================================ */}
          {/* ADMIN ROUTES - Requires ADMIN role */}
          {/* ============================================ */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="moderation" element={<PostModerationPage />} />
            <Route path="reports" element={<ReportManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="kyc" element={<KYCManagementPage />} />
            <Route path="blacklist" element={<BlacklistPage />} />
            <Route path="packages" element={<PackageManagementPage />} />
            <Route path="vouchers" element={<VoucherManagementPage />} />
            <Route path="transactions" element={<TransactionManagementPage />} />
            <Route path="audit-logs" element={<AuditLogPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="account-settings" element={<AccountSettingsPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
          </Route>

          {/* ============================================ */}
          {/* 404 - Page Not Found */}
          {/* ============================================ */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Trang không tìm thấy</p>
                  <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Quay về trang chủ
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
