import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

// ============================================
// Types
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

// ============================================
// Loading Spinner Component
// ============================================

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// ============================================
// Protected Route Component
// ============================================

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // Show loading spinner ONLY during initial auth check
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if user is authenticated but trying to access login/register
  if (!requireAuth && isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'LANDLORD') {
      return <Navigate to="/landlord" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role as UserRole)) {
      // User doesn't have the required role
      console.warn(
        `Access denied. Required roles: ${allowedRoles.join(', ')}. User role: ${user.role}`
      );

      // Redirect based on user role
      if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      }
      if (user.role === 'LANDLORD') {
        return <Navigate to="/landlord" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // User is authorized
  return <>{children}</>;
}

// ============================================
// Admin Route Component (convenience wrapper)
// ============================================

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['ADMIN']}>{children}</ProtectedRoute>;
}

// ============================================
// Landlord Route Component (convenience wrapper)
// ============================================

export function LandlordRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['LANDLORD', 'ADMIN']}>{children}</ProtectedRoute>
  );
}

// ============================================
// User Route Component (convenience wrapper)
// ============================================

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['USER', 'LANDLORD', 'ADMIN']}>{children}</ProtectedRoute>
  );
}

// ============================================
// Guest Route Component (for login/register pages)
// ============================================

export function GuestRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>;
}

// ============================================
// Tenant or Public Route Component 
// Blocks Admin/Landlord from viewing public tenant space
// ============================================

export function TenantOrPublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'LANDLORD') {
      return <Navigate to="/landlord" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
