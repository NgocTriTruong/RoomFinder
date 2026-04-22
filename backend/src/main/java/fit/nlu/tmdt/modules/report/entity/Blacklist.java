package fit.nlu.tmdt.modules.report.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Blacklist Entity
 * Lưu thông tin danh sách đen
 */
@Entity
@Table(name = "blacklist", indexes = {
        @Index(name = "idx_blacklist_user", columnList = "user_id"),
        @Index(name = "idx_blacklist_expires", columnList = "expires_at"),
        @Index(name = "idx_blacklist_type", columnList = "type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Blacklist extends BaseEntity {

    // ==========================================
    // USER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // INFO
    // ==========================================

    @Column(nullable = false, length = 100)
    private String reason;

    @Column(length = 50)
    private String type;  // SPAMMER, FRAUD, HARASSMENT, etc.

    // ==========================================
    // DURATION
    // ==========================================

    @Column(name = "is_permanent")
    @Builder.Default
    private Boolean isPermanent = false;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // ==========================================
    // HANDLING
    // ==========================================

    @Column(name = "added_by")
    private Long addedBy;

    @Column(name = "removed_by")
    private Long removedBy;

    @Column(name = "removed_at")
    private LocalDateTime removedAt;

    @Column(name = "removal_reason", length = 255)
    private String removalReason;

    // ==========================================
    // REFERENCE
    // ==========================================

    @Column(name = "related_report_id")
    private Long relatedReportId;

    @Column(name = "related_post_id")
    private Long relatedPostId;

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra blacklist có đang active không
     */
    public boolean isActive() {
        if (!Boolean.TRUE.equals(isActive)) {
            return false;
        }
        if (Boolean.TRUE.equals(isPermanent)) {
            return true;
        }
        return expiresAt == null || expiresAt.isAfter(LocalDateTime.now());
    }

    /**
     * Kiểm tra có phải permanent không
     */
    public boolean isPermanent() {
        return Boolean.TRUE.equals(isPermanent);
    }

    /**
     * Kiểm tra đã hết hạn chưa
     */
    public boolean isExpired() {
        if (Boolean.TRUE.equals(isPermanent)) {
            return false;
        }
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    /**
     * Kích hoạt blacklist
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * Vô hiệu hóa blacklist
     */
    public void deactivate(Long removedById, String reason) {
        this.isActive = false;
        this.removedBy = removedById;
        this.removedAt = LocalDateTime.now();
        this.removalReason = reason;
    }

    /**
     * Tạo blacklist tạm thời
     */
    public static Blacklist createTemporary(User user, String reason, int days, Long addedById) {
        return Blacklist.builder()
                .user(user)
                .reason(reason)
                .isPermanent(false)
                .expiresAt(LocalDateTime.now().plusDays(days))
                .addedBy(addedById)
                .isActive(true)
                .build();
    }

    /**
     * Tạo blacklist vĩnh viễn
     */
    public static Blacklist createPermanent(User user, String reason, Long addedById) {
        return Blacklist.builder()
                .user(user)
                .reason(reason)
                .isPermanent(true)
                .expiresAt(null)
                .addedBy(addedById)
                .isActive(true)
                .build();
    }
}
