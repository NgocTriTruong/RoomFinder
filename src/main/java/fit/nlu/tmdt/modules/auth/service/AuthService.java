package fit.nlu.tmdt.modules.auth.service;

import fit.nlu.tmdt.modules.auth.dto.request.*;
import fit.nlu.tmdt.modules.auth.dto.response.AuthResponse;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;

/**
 * Auth Service Interface
 */
public interface AuthService {

    /**
     * Đăng ký tài khoản mới
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Đăng nhập
     */
    AuthResponse login(LoginRequest request);

    /**
     * Refresh token
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Đăng xuất
     */
    void logout(Long userId);

    /**
     * Quên mật khẩu - gửi OTP
     */
    void forgotPassword(ForgotPasswordRequest request);

    /**
     * Reset mật khẩu với OTP
     */
    void resetPassword(ResetPasswordRequest request);

    /**
     * Xác thực email
     */
    void verifyEmail(Long userId, VerifyEmailRequest request);

    /**
     * Gửi lại email xác thực
     */
    void resendVerifyEmail(Long userId);

    /**
     * Đổi mật khẩu
     */
    void changePassword(Long userId, ChangePasswordRequest request);

    /**
     * OAuth2 Login (Google/Facebook)
     */
    AuthResponse oauth2Login(String provider, String providerId, String email, String fullName);
}
