package fit.nlu.tmdt.modules.subscription.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Boost Entity
 * Lưu thông tin đẩy tin của landlord
 */
@Entity
@Table(name = "boosts", indexes = {
        @Index(name = "idx_boost_post", columnList = "post_id"),
        @Index(name = "idx_boost_landlord", columnList = "landlord_id"),
        @Index(name = "idx_boost_active", columnList = "is_active"),
        @Index(name = "idx_boost_expires", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boost extends BaseEntity {

    // ==========================================
    // OWNER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // ==========================================
    // BOOST INFO
    // ==========================================

    @Column(nullable = false)
    private Integer days;  // Số ngày boost

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    // ==========================================
    // PAYMENT
    // ==========================================

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "package_id")
    private Long packageId;  // Package boost used

    // ==========================================
    // PRIORITY
    // ==========================================

    @Column(name = "priority_score")
    @Builder.Default
    private Integer priorityScore = 0;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra boost có đang active không
     */
    public boolean isActive() {
        if (!Boolean.TRUE.equals(isActive)) {
            return false;
        }
        return expiresAt != null && expiresAt.isAfter(LocalDateTime.now());
    }

    /**
     * Kiểm tra boost đã hết hạn chưa
     */
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    /**
     * Kiểm tra boost có bị hủy chưa
     */
    public boolean isCancelled() {
        return cancelledAt != null;
    }

    /**
     * Tính số giờ còn lại
     */
    public long getRemainingHours() {
        if (expiresAt == null) {
            return 0;
        }
        return java.time.Duration.between(LocalDateTime.now(), expiresAt).toHours();
    }

    /**
     * Tính số ngày còn lại
     */
    public int getRemainingDays() {
        if (expiresAt == null) {
            return 0;
        }
        long days = java.time.Duration.between(LocalDateTime.now(), expiresAt).toDays();
        return (int) Math.max(0, days);
    }

    /**
     * Tính priority score (boost càng mới điểm càng cao)
     */
    public void calculatePriorityScore() {
        // Priority = hours_remaining + (days * 24)
        this.priorityScore = (int) (getRemainingHours() + (days * 24));
    }

    /**
     * Hủy boost
     */
    public void cancel(String reason) {
        this.isActive = false;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = reason;
    }

    /**
     * Kích hoạt boost
     */
    public void activate() {
        this.isActive = true;
        this.cancelledAt = null;
    }

    /**
     * Tạo boost mới
     */
    public static Boost create(User landlord, Post post, int days, double price) {
        LocalDateTime now = LocalDateTime.now();
        Boost boost = Boost.builder()
                .landlord(landlord)
                .post(post)
                .days(days)
                .startTime(now)
                .expiresAt(now.plusDays(days))
                .price(price)
                .isActive(true)
                .build();
        boost.calculatePriorityScore();
        return boost;
    }
}
