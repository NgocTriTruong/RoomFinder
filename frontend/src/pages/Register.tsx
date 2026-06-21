import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Eye, EyeOff, Loader2, Check, X, User, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/services/api';
import type { RegisterRequest } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user, isInitializing } = useAuth();

  // Form state
  const [role, setRole] = useState<'USER' | 'LANDLORD'>('USER');
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'USER',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const passwordsMatch = formData.password === formData.confirmPassword;

  // Redirect if already authenticated and NOT in OTP step
  useEffect(() => {
    if (isAuthenticated && !isInitializing && !showOtp) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate, showOtp]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  // Handle role selection
  const handleRoleChange = (newRole: 'USER' | 'LANDLORD') => {
    setRole(newRole);
    setFormData((prev) => ({ ...prev, role: newRole }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    if (!passwordsMatch) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Bạn phải đồng ý với điều khoản sử dụng');
      return;
    }

    setIsSubmitting(true);

    try {
      const response: any = await register(formData);
      if (response?.requiresVerification) {
        setShowOtp(true);
      }
      // Redirect is handled by the useEffect above for non-OTP cases
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const { verifyOtp, resendOtp } = useAuth();

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError('Mã OTP phải có 6 chữ số');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      await verifyOtp(formData.email, otpCode);
      navigate('/', { replace: true });
    } catch (err) {
      setOtpError(getErrorMessage(err));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      await resendOtp(formData.email);
      setCountdown(60);
      setOtpError(null);
    } catch (err) {
      setOtpError(getErrorMessage(err));
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
          <Link to="/" className="inline-flex items-center justify-center gap-0 mb-6">
            <img src="/logo.png" alt="RoomFinder Logo" className="h-[50px] w-auto object-contain rounded-md" />
            <span className="text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tạo tài khoản mới</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tham gia cộng đồng của chúng tôi
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* OTP Verification UI */}
        {showOtp ? (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác thực Email</h3>
              <p className="mt-2 text-sm text-gray-600">
                Mã OTP đã được gửi đến <span className="font-semibold text-gray-900">{formData.email}</span>. 
                Vui lòng kiểm tra email của bạn (kể cả hòm thư rác).
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Mã OTP (6 chữ số)
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-4 py-3 text-center text-2xl tracking-[1em] font-bold border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  placeholder="000000"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpCode.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  'Xác thực tài khoản'
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
              >
                {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã OTP'}
              </button>
            </div>

            <button
              onClick={() => setShowOtp(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              Quay lại đăng ký
            </button>
          </div>
        ) : (
          <>
            {/* Role Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bạn là:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('USER')}
                  className={`py-3 px-4 text-sm font-medium rounded-md border transition-all ${
                    role === 'USER'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600 ring-offset-2'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <User className={`w-6 h-6 mb-1 ${role === 'USER' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>Người tìm phòng</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('LANDLORD')}
                  className={`py-3 px-4 text-sm font-medium rounded-md border transition-all ${
                    role === 'LANDLORD'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500 ring-offset-2'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Building2 className={`w-6 h-6 mb-1 ${role === 'LANDLORD' ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span>Chủ cho thuê</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập họ và tên"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập email của bạn"
                  disabled={isSubmitting}
                />
                {role === 'USER' && (
                  <p className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Bắt buộc dùng email sinh viên (ví dụ: @st.hcmuaf.edu.vn)
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập số điện thoại (tùy chọn)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập mật khẩu"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập lại mật khẩu"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">Mật khẩu xác nhận không khớp</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  disabled={isSubmitting}
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Điều khoản sử dụng
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Chính sách bảo mật
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.acceptTerms}
                  className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    role === 'LANDLORD'
                      ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang đăng ký...
                    </>
                  ) : (
                    'Đăng ký'
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
