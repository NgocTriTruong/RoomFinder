import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Base URL - defaults to localhost for development
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  // If the frontend is built but runs on a non-localhost domain, resolve dynamically
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Check if the current frontend is running with a custom port (e.g., development/staging on IP)
    if (window.location.port) {
      return `${window.location.protocol}//${window.location.hostname}:8080/api`;
    }
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
  withCredentials: false, // Disable credentials for token-based auth
});

// ============================================
// Request Interceptor - Attach Token
// ============================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor - Handle Errors
// ============================================

api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log detailed error for debugging
    if (import.meta.env.DEV) {
      const errorData = error.response?.data as any;
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${error.response?.status} | Message: ${errorData?.message || error.message}`);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      const errorData = error.response?.data as { message?: string };

      // Check if it's a token expiration message or generally unauthorized
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken && !originalRequest._retry && !originalRequest.url?.includes('/v1/auth/refresh')) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
            refreshToken,
          }, {
            headers: {
              'Bypass-Tunnel-Reminder': 'true'
            }
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth:unauthorized'));
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token or already retried, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error - please try again later');
    }

    return Promise.reject(error);
  }
);

// ============================================
// Error Helper Functions
// ============================================

export interface ApiError {
  message: string;
  errorCode?: string;
  validationErrors?: Record<string, string>;
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const getValidationErrors = (error: unknown): Record<string, string> | null => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.validationErrors || null;
  }
  return null;
};

export default api;
