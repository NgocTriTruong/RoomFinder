package fit.nlu.tmdt.modules.auth.entity.enums;

/**
 * User Status Enum
 * Trạng thái của tài khoản người dùng
 */
public enum UserStatus {
    PENDING,    // Chờ xác thực OTP
    ACTIVE,     // Tài khoản hoạt động
    INACTIVE,   // Tài khoản không hoạt động
    LOCKED,     // Tài khoản bị khóa
    DELETED     // Tài khoản đã xóa
}
