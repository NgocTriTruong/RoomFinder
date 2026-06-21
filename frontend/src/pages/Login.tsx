import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/services/api';
import { authService } from '@/services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    login, 
    googleLogin, 
    signInWithGoogle, 
    signInWithFacebook, 
    isAuthenticated, 
    isInitializing, 
    error: authError, 
    clearError 
  } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real Google Sign-in State
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(
    localStorage.getItem('google_client_id') || '1043828945899-p8b7r5g7b3o4q3s2q4t3t4u3v3v3w3x.apps.googleusercontent.com'
  );
  const [tempClientId, setTempClientId] = useState(
    localStorage.getItem('google_client_id') || '1043828945899-p8b7r5g7b3o4q3s2q4t3t4u3v3v3w3x.apps.googleusercontent.com'
  );
  const [showConfig, setShowConfig] = useState(false);

  // Load Google Client library dynamically
  useEffect(() => {
    if (document.getElementById('google-gsi-client')) {
      setGoogleScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleScriptLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Handle successful Google credentials
  const handleGoogleCredentialResponse = async (response: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = response.credential;
      // Decode JWT locally
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      const email = payload.email;
      const fullName = payload.name || 'Google User';

      // Submit to context googleLogin
      await googleLogin(email, fullName);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize and Render button when script or clientID changes
  useEffect(() => {
    if (!googleScriptLoaded || !(window as any).google) return;

    try {
      (window as any).google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
      });

      const btnContainer = document.getElementById('real-google-btn-container');
      if (btnContainer) {
        // Clear previous render if any
        btnContainer.innerHTML = '';
        (window as any).google.accounts.id.renderButton(btnContainer, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 360,
        });
      }
    } catch (err) {
      console.error('Error rendering Google button:', err);
    }
  }, [googleScriptLoaded, googleClientId]);

  const handleSaveClientId = () => {
    if (!tempClientId.trim()) {
      alert('Vui lòng nhập Google Client ID hợp lệ');
      return;
    }
    localStorage.setItem('google_client_id', tempClientId.trim());
    setGoogleClientId(tempClientId.trim());
    alert('Cập nhật Client ID thành công! Nút Google sẽ tải lại ngay bây giờ.');
    setShowConfig(false);
  };

  // Dev Sim Modal State
  const [showDevSimModal, setShowDevSimModal] = useState(false);
  const [devEmail, setDevEmail] = useState('');
  const [devName, setDevName] = useState('');

  const handleDevSimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devEmail.trim()) {
      alert('Vui lòng nhập Email');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const name = devName.trim() || 'Sinh viên Giả lập';
      await googleLogin(devEmail.trim(), name);
      setShowDevSimModal(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isInitializing && user) {
      const from = (location.state as { from?: Location })?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Default redirect based on role
        if (user.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (user.role === 'LANDLORD') {
          navigate('/landlord', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isAuthenticated, isInitializing, user, navigate, location]);

  // Clear error when email changes
  useEffect(() => {
    if (error) {
      setError(null);
      clearError();
    }
  }, [email]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      // Redirect is handled by the useEffect above
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading ONLY during initial authentication check
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-sm text-gray-600">
            Chào mừng bạn quay trở lại
          </p>
        </div>

        {/* Error Message */}
        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex flex-col gap-2">
            <span>{error || authError}</span>
            {(error?.includes('vô hiệu hóa') || authError?.includes('vô hiệu hóa')) && (
              <button
                onClick={async () => {
                  try {
                    setIsSubmitting(true);
                    await authService.reactivate({ email, password });
                    setError('Tài khoản đã được kích hoạt lại. Vui lòng đăng nhập.');
                    // Tự động điền lại mật khẩu nếu cần, hoặc để người dùng bấm Đăng nhập
                  } catch (err) {
                    setError(getErrorMessage(err));
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="text-blue-600 font-bold hover:underline text-left"
              >
                Kích hoạt lại ngay
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập email của bạn"
                disabled={isSubmitting}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập mật khẩu"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-6 flex flex-col items-center justify-center space-y-3">
            {/* Google Login Button via Supabase */}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer hover:border-gray-400"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập bằng Google (Supabase)</span>
            </button>

            {/* Facebook Login Button via Supabase */}
            <button
              type="button"
              onClick={signInWithFacebook}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-[#1877F2] hover:bg-[#166FE5] transition-all cursor-pointer hover:shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Đăng nhập bằng Facebook (Supabase)</span>
            </button>

            <div className="w-full border-t border-gray-200 my-1"></div>

            <div className="w-full flex justify-center py-1" id="real-google-btn-container"></div>
            
            {/* Elegant collapsible Google configuration panel */}
            <div className="w-full text-center space-y-2">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                ⚙️ Cấu hình Google Client ID riêng / Giả lập Đăng nhập
              </button>
              
              {showConfig && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-left space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Way 1: Real OAuth */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Cách 1: Sử dụng Google Client ID thật</h5>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Để đăng nhập bằng tài khoản Google thật, hãy nhập <strong>Google Client ID</strong> của bạn dưới đây:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập Google Client ID của bạn..."
                        value={tempClientId}
                        onChange={(e) => setTempClientId(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleSaveClientId}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>

                  {/* Way 2: Dev Simulation */}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Cách 2: Giả lập Đăng nhập nhanh (Không cần Client ID)</h5>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Tránh lỗi Google 401 blocker, bạn có thể tự điền bất kỳ Email Google nào của bạn để đăng nhập kiểm thử hệ thống (Email đuôi <code>.edu.vn</code> tự động nhận KYC sinh viên).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDevSimModal(true);
                        setShowConfig(false);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer shadow-sm"
                    >
                      🚀 Mở hộp thoại Giả lập Đăng nhập Google
                    </button>
                  </div>

                  <div className="text-[10px] text-gray-400 leading-normal border-t border-gray-100 pt-2">
                    * Lưu ý: Đảm bảo cấu hình URL gốc <code>http://localhost:3000</code> trong mục <strong>Authorized JavaScript origins</strong> tại Google Cloud Console của bạn khi dùng cách 1.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Dev Simulation Modal */}
      {showDevSimModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span>🚀 Hộp thoại Giả lập Đăng nhập Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDevSimModal(false)}
                className="text-gray-400 hover:text-gray-600 font-medium text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleDevSimSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nhập Email Google của bạn
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: sv@student.hcmute.edu.vn hoặc cá nhân"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nhập Họ và tên
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên hiển thị"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                />
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 leading-relaxed">
                <p className="font-bold">💡 Mẹo kiểm thử KYC:</p>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>Sử dụng email có đuôi <strong>.edu.vn</strong> để tự động nhận <strong>Tích Xanh KYC</strong> sinh viên.</li>
                  <li>Sử dụng email đuôi thường (như @gmail.com) để thử tài khoản thường chưa KYC.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDevSimModal(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Đang đăng nhập...' : 'Xác nhận Đăng nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
