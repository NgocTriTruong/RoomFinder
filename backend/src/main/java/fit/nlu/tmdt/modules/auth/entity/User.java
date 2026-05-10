package fit.nlu.tmdt.modules.auth.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * User Entity
 * Lưu thông tin người dùng trong hệ thống
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true),
        @Index(name = "idx_user_phone", columnList = "phone"),
        @Index(name = "idx_user_role", columnList = "role"),
        @Index(name = "idx_user_status", columnList = "status"),
        @Index(name = "idx_user_provider", columnList = "provider")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    // ==========================================
    // BASIC INFO
    // ==========================================

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    // ==========================================
    // AUTH INFO
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "verification_status", length = 20)
    @Builder.Default
    private String verificationStatus = "NONE"; // NONE, PENDING, APPROVED, REJECTED

    @Column(name = "front_id_card_url", length = 500)
    private String frontIdCardUrl;

    @Column(name = "back_id_card_url", length = 500)
    private String backIdCardUrl;

    @Column(name = "selfie_url", length = 500)
    private String selfieUrl;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "admin_note", length = 500)
    private String adminNote;

    // ==========================================
    // STUDENT/USER INFO
    // ==========================================

    @Column(name = "university_id")
    private Long universityId;

    @Column(name = "otp_code", length = 6)
    private String otpCode;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    // ==========================================
    // OAUTH INFO
    // ==========================================

    @Column(length = 50)
    private String provider;  // GOOGLE, FACEBOOK, LOCAL

    @Column(name = "provider_id", length = 255)
    private String providerId;

    // ==========================================
    // SECURITY INFO
    // ==========================================

    @Column(name = "failed_login_attempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "lockout_end")
    private LocalDateTime lockoutEnd;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Column(name = "refresh_token", length = 500)
    private String refreshToken;

    // ==========================================
    // PROFILE INFO
    // ==========================================

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 255)
    private String address;

    @Column(name = "bio", length = 1000)
    private String bio;

    // ==========================================
    // LANDLORD SPECIFIC
    // ==========================================

    @Column(name = "landlord_rating")
    @Builder.Default
    private Double landlordRating = 0.0;

    @Column(name = "total_reviews")
    @Builder.Default
    private Integer totalReviews = 0;

    // ==========================================
    // AUDIT INFO
    // ==========================================

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_login_ip", length = 50)
    private String lastLoginIp;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    public boolean isLocked() {
        return lockoutEnd != null && lockoutEnd.isAfter(LocalDateTime.now());
    }

    public boolean isEmailVerified() {
        return Boolean.TRUE.equals(isVerified);
    }

    public boolean isLandlord() {
        return role == UserRole.LANDLORD;
    }

    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }

    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts = (this.failedLoginAttempts == null ? 0 : this.failedLoginAttempts) + 1;
        if (this.failedLoginAttempts >= 5) {
            this.lockoutEnd = LocalDateTime.now().plusMinutes(30);
        }
    }

    public void resetFailedLoginAttempts() {
        this.failedLoginAttempts = 0;
        this.lockoutEnd = null;
    }

    public void recordSuccessfulLogin(String ip) {
        resetFailedLoginAttempts();
        this.lastLoginAt = LocalDateTime.now();
        this.lastLoginIp = ip;
    }
}
