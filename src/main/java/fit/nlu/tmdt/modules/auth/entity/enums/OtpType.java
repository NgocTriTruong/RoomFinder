package fit.nlu.tmdt.modules.auth.entity.enums;

/**
 * OTP Type Enum
 * Các loại OTP trong hệ thống
 */
public enum OtpType {
    EMAIL_VERIFICATION,  // Xác thực email khi đăng ký
    PASSWORD_RESET,       // Lấy lại mật khẩu
    LOGIN_OTP            // OTP đăng nhập
}
