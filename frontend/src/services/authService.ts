import api, { ApiError } from './api';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from '@/types';

// ============================================
// Auth Service - API Calls
// ============================================

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/v1/auth/login', credentials);
    return response.data.data!;
  },

  /**
   * Register a new user account
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/v1/auth/register', data);
    const authData = response.data.data!;
    
    // Only save tokens if verification is not required
    if (!authData.requiresVerification) {
      authStorage.saveAuth(authData);
    }
    
    return authData;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/v1/auth/refresh', {
      refreshToken,
    });
    return response.data.data!;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/v1/auth/logout');
    } catch (error) {
      // Ignore logout errors
      console.log('Logout API call failed, proceeding with local logout');
    }
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await api.post('/v1/auth/change-password', data);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/v1/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await api.post('/v1/auth/reset-password', data);
  },

  /**
   * Verify email with OTP
   */
  verifyOtp: async (email: string, otpCode: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/v1/auth/verify-otp', { email, otpCode });
    const authData = response.data.data!;
    authStorage.saveAuth(authData);
    return authData;
  },

  /**
   * Resend verification OTP
   */
  resendOtp: async (email: string): Promise<void> => {
    await api.post('/v1/auth/resend-otp', null, { params: { email } });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<ApiResponse<UserResponse>>('/v1/users/profile');
    return response.data.data!;
  },

  /**
   * OAuth2 Login (Google/Facebook)
   */
  oauth2Login: async (provider: 'google' | 'facebook', code: string): Promise<AuthResponse> => {
    const response = await api.get<ApiResponse<AuthResponse>>(`/v1/auth/oauth2/${provider}`, {
      params: { code },
    });
    return response.data.data!;
  },

  /**
   * Reactivate deactivated account
   */
  reactivate: async (credentials: LoginRequest): Promise<void> => {
    await api.post('/v1/auth/reactivate', credentials);
  },
};

// ============================================
// Auth Storage Helpers
// ============================================

export const authStorage = {
  /**
   * Save auth data to localStorage
   */
  saveAuth: (authData: AuthResponse): void => {
    if (authData.accessToken) localStorage.setItem('accessToken', authData.accessToken);
    if (authData.refreshToken) localStorage.setItem('refreshToken', authData.refreshToken);
    if (authData.user) localStorage.setItem('user', JSON.stringify(authData.user));
  },

  /**
   * Get user from localStorage
   */
  getUser: (): UserResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Clear all auth data
   */
  clearAuth: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Check if user has a specific role
   */
  hasRole: (role: string): boolean => {
    const user = authStorage.getUser();
    return user?.role === role;
  },

  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    return authStorage.hasRole('ADMIN');
  },

  /**
   * Check if user is landlord
   */
  isLandlord: (): boolean => {
    return authStorage.hasRole('LANDLORD');
  },

  /**
   * Check if user is regular user
   */
  isUser: (): boolean => {
    return authStorage.hasRole('USER');
  },
};

export default authService;
