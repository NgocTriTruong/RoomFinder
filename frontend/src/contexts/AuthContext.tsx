import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authService, authStorage } from '@/services/authService';
import type { UserResponse, LoginRequest, RegisterRequest } from '@/types';

// ============================================
// Types
// ============================================

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authStorage.getUser();
        const isAuthenticated = authStorage.isAuthenticated();

        if (storedUser && isAuthenticated) {
          // We have data in localStorage, but let's NOT show it yet.
          // We wait for the server to confirm if the token is still valid.
          try {
            const freshUser = await authService.getCurrentUser();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (err: any) {
            console.error('Session verification failed:', err);
            // If server says 401 or any error happens during init,
            // we treat it as an invalid/stale session for safety.
            authStorage.clearAuth();
            setUser(null);
          }
        } else {
          // No valid storage data, ensure state is clean
          authStorage.clearAuth();
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for global unauthorized events (e.g. from api.ts interceptor)
    const handleUnauthorized = () => {
      authStorage.clearAuth();
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      // Save auth data to localStorage
      authStorage.saveAuth(response);

      // Update state
      setUser(response.user);

      console.log('Login successful:', response.user.fullName);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);

      // Save auth data to localStorage
      authStorage.saveAuth(response);

      // Update state
      setUser(response.user);

      console.log('Registration successful:', response.user.fullName);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      // Call logout API
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      // Clear local storage regardless of API result
      authStorage.clearAuth();
      setUser(null);
      setIsLoading(false);
      console.log('Logout successful');
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!authStorage.isAuthenticated()) return;

    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (err) {
      console.error('Failed to refresh user:', err);
      // If refresh fails, user might be logged out on server
      if (authStorage.isAuthenticated()) {
        // Keep trying to use cached data
      }
    }
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// ============================================
// Protected Route Hook (alternative to component)
// ============================================

export function useProtectedRoute(requiredRoles?: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAuthorized = () => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  return {
    isAuthenticated,
    isLoading,
    isAuthorized: isAuthorized(),
    user,
  };
}

export default AuthContext;
