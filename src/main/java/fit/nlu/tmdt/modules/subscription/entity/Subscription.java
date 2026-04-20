package fit.nlu.tmdt.modules.subscription.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.subscription.entity.enums.PackageType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Subscription Entity
 * Lưu thông tin đăng ký gói dịch vụ của landlord
 */
@Entity
@Table(name = "subscriptions", indexes = {
        @Index(name = "idx_subscription_landlord", columnList = "landlord_id"),
        @Index(name = "idx_subscription_status", columnList = "is_active"),
        @Index(name = "idx_subscription_expires", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription extends BaseEntity {

    // ==========================================
    // OWNER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package pkg;

    // ==========================================
    // QUANTITY
    // ==========================================

    @Column(name = "max_posts")
    private Integer maxPosts;  // Số tin tối đa

    @Column(name = "remaining_posts")
    @Builder.Default
    private Integer remainingPosts = 0;

    @Column(name = "used_posts")
    @Builder.Default
    private Integer usedPosts = 0;

    // ==========================================
    // DURATION
    // ==========================================

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    // ==========================================
    // AUTO-RENEW
    // ==========================================

    @Column(name = "auto_renew")
    @Builder.Default
    private Boolean autoRenew = false;

    @Column(name = "next_billing_date")
    private LocalDateTime nextBillingDate;

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
    // PAYMENT REFERENCE
    // ==========================================

    @Column(name = "transaction_id")
    private Long transactionId;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra subscription có đang active không
     */
    public boolean isActive() {
        if (!Boolean.TRUE.equals(isActive)) {
            return false;
        }
        return expiresAt != null && expiresAt.isAfter(LocalDateTime.now());
    }

    /**
     * Kiểm tra subscription đã hết hạn chưa
     */
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    /**
     * Kiểm tra có còn posts không
     */
    public boolean hasRemainingPosts() {
        if (maxPosts == null) {
            return true;  // Unlimited
        }
        return remainingPosts != null && remainingPosts > 0;
    }

    /**
     * Sử dụng 1 post
     */
    public boolean usePost() {
        if (!hasRemainingPosts()) {
            return false;
        }
        if (maxPosts == null) {
            return true;
        }
        if (remainingPosts != null) {
            remainingPosts--;
            usedPosts++;
        }
        return true;
    }

    /**
     * Hoàn lại 1 post (khi post bị từ chối)
     */
    public void refundPost() {
        if (remainingPosts != null && remainingPosts < maxPosts) {
            remainingPosts++;
            usedPosts--;
        }
    }

    /**
     * Tính số ngày còn lại
     */
    public int getRemainingDays() {
        if (expiresAt == null) {
            return Integer.MAX_VALUE;
        }
        long days = java.time.Duration.between(LocalDateTime.now(), expiresAt).toDays();
        return (int) Math.max(0, days);
    }

    /**
     * Kiểm tra sắp hết hạn (trong 3 ngày)
     */
    public boolean isExpiringSoon() {
        return getRemainingDays() <= 3 && getRemainingDays() > 0;
    }

    /**
     * Gia hạn subscription
     */
    public void extend(int days) {
        this.expiresAt = this.expiresAt != null && this.expiresAt.isAfter(LocalDateTime.now())
                ? this.expiresAt.plusDays(days)
                : LocalDateTime.now().plusDays(days);
        this.isActive = true;
    }

    /**
     * Thêm posts
     */
    public void addPosts(int posts) {
        if (this.maxPosts == null) {
            // Unlimited - do nothing
        } else {
            this.maxPosts += posts;
            this.remainingPosts += posts;
        }
    }

    /**
     * Hủy subscription
     */
    public void cancel(String reason) {
        this.isActive = false;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = reason;
    }

    /**
     * Bật auto-renew
     */
    public void enableAutoRenew(LocalDateTime nextBilling) {
        this.autoRenew = true;
        this.nextBillingDate = nextBilling;
    }

    /**
     * Tắt auto-renew
     */
    public void disableAutoRenew() {
        this.autoRenew = false;
        this.nextBillingDate = null;
    }
}
