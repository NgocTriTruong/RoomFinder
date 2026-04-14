package fit.nlu.tmdt.modules.auth.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.enums.OtpType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * OTP Verification Entity
 * Lưu thông tin OTP xác thực
 */
@Entity
@Table(name = "otp_verifications", indexes = {
        @Index(name = "idx_otp_email_type", columnList = "email, otp_type"),
        @Index(name = "idx_otp_expired", columnList = "expired_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 10)
    private String otpCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "otp_type", nullable = false, length = 30)
    private OtpType otpType;

    @Column(name = "max_attempts")
    @Builder.Default
    private Integer maxAttempts = 5;

    @Column(name = "attempts")
    @Builder.Default
    private Integer attempts = 0;

    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "is_used")
    @Builder.Default
    private Boolean isUsed = false;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra OTP có hết hạn chưa
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiredAt);
    }

    /**
     * Kiểm tra OTP có được sử dụng chưa
     */
    public boolean isUsed() {
        return Boolean.TRUE.equals(isUsed);
    }

    /**
     * Kiểm tra OTP có hợp lệ không
     */
    public boolean isValid() {
        return !isExpired() && !isUsed() && attempts < maxAttempts;
    }

    /**
     * Tăng số lần thử
     */
    public void incrementAttempts() {
        this.attempts = (this.attempts == null ? 0 : this.attempts) + 1;
    }

    /**
     * Đánh dấu OTP đã được sử dụng
     */
    public void markAsUsed() {
        this.isUsed = true;
        this.verifiedAt = LocalDateTime.now();
    }

    /**
     * Kiểm tra còn lần thử không
     */
    public boolean hasRemainingAttempts() {
        return attempts < maxAttempts;
    }

    /**
     * Tạo OTP mới với thời hạn 5 phút
     */
    public static OtpVerification create(String email, String otpCode, OtpType type) {
        return OtpVerification.builder()
                .email(email)
                .otpCode(otpCode)
                .otpType(type)
                .maxAttempts(5)
                .attempts(0)
                .expiredAt(LocalDateTime.now().plusMinutes(5))
                .isUsed(false)
                .build();
    }
}
