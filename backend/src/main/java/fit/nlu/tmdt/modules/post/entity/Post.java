package fit.nlu.tmdt.modules.post.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.room.entity.Room;
import fit.nlu.tmdt.modules.room.entity.enums.PriceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Post Entity
 * Lưu thông tin tin đăng phòng trọ
 */
@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_post_status", columnList = "status"),
        @Index(name = "idx_post_landlord", columnList = "landlord_id"),
        @Index(name = "idx_post_created", columnList = "created_at"),
        @Index(name = "idx_post_expires", columnList = "expires_at"),
        @Index(name = "idx_post_boosted", columnList = "is_boosted, boosted_until")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post extends BaseEntity {

    // ==========================================
    // OWNER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    // ==========================================
    // CONTENT
    // ==========================================

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ==========================================
    // PRICING
    // ==========================================

    @Column(nullable = false)
    private Double price;

    @Column(name = "deposit_amount")
    private Double deposit;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", nullable = false, length = 20)
    @Builder.Default
    private PriceType priceType = PriceType.MONTHLY;

    // ==========================================
    // STATUS & APPROVAL
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PostStatus status = PostStatus.PENDING;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // ==========================================
    // EXPIRATION
    // ==========================================

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_auto_renew")
    @Builder.Default
    private Boolean isAutoRenew = false;

    // ==========================================
    // BOOST
    // ==========================================

    @Column(name = "is_boosted")
    @Builder.Default
    private Boolean isBoosted = false;

    @Column(name = "boosted_until")
    private LocalDateTime boostedUntil;

    // ==========================================
    // STATS
    // ==========================================

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "favorite_count")
    @Builder.Default
    private Integer favoriteCount = 0;

    @Column(name = "contact_count")
    @Builder.Default
    private Integer contactCount = 0;

    @Column(name = "booking_count")
    @Builder.Default
    private Integer bookingCount = 0;

    // ==========================================
    // IMAGES
    // ==========================================

    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    @OrderColumn(name = "image_order")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    // ==========================================
    // VIDEO (Optional)
    // ==========================================

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "video_thumbnail", length = 500)
    private String videoThumbnail;

    // ==========================================
    // SEO
    // ==========================================

    @Column(name = "meta_title", length = 200)
    private String metaTitle;

    @Column(name = "meta_description", length = 500)
    private String metaDescription;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra post có thể đặt lịch hẹn không
     */
    public boolean isBookable() {
        return status == PostStatus.APPROVED && isActive() && !isExpired();
    }

    /**
     * Kiểm tra post đã hết hạn chưa
     */
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    /**
     * Kiểm tra post đang được boost không
     */
    public boolean isBoostActive() {
        return Boolean.TRUE.equals(isBoosted)
                && boostedUntil != null
                && boostedUntil.isAfter(LocalDateTime.now());
    }

    /**
     * Kiểm tra post có thể chỉnh sửa không
     */
    public boolean isEditable() {
        return status == PostStatus.PENDING || status == PostStatus.REJECTED;
    }

    /**
     * Kiểm tra post có thể boost không
     */
    public boolean canBoost() {
        return status == PostStatus.APPROVED && !isExpired();
    }

    /**
     * Tăng lượt xem
     */
    public void incrementViewCount() {
        this.viewCount = (this.viewCount == null ? 0 : this.viewCount) + 1;
        if (this.room != null) {
            this.room.incrementViewCount();
        }
    }

    /**
     * Tăng lượt yêu thích
     */
    public void incrementFavoriteCount() {
        this.favoriteCount = (this.favoriteCount == null ? 0 : this.favoriteCount) + 1;
    }

    /**
     * Giảm lượt yêu thích
     */
    public void decrementFavoriteCount() {
        if (this.favoriteCount != null && this.favoriteCount > 0) {
            this.favoriteCount--;
        }
    }

    /**
     * Tăng lượt liên hệ
     */
    public void incrementContactCount() {
        this.contactCount = (this.contactCount == null ? 0 : this.contactCount) + 1;
    }

    /**
     * Tăng lượt đặt lịch
     */
    public void incrementBookingCount() {
        this.bookingCount = (this.bookingCount == null ? 0 : this.bookingCount) + 1;
    }

    /**
     * Phê duyệt post
     */
    public void approve(Long adminId) {
        this.status = PostStatus.APPROVED;
        this.approvedBy = adminId;
        this.approvedAt = LocalDateTime.now();
        // Set expiration (default 30 days from now)
        if (this.expiresAt == null) {
            this.expiresAt = LocalDateTime.now().plusDays(30);
        }
    }

    /**
     * Từ chối post
     */
    public void reject(String reason) {
        this.status = PostStatus.REJECTED;
        this.rejectionReason = reason;
    }

    /**
     * Bắt đầu boost
     */
    public void startBoost(LocalDateTime until) {
        this.isBoosted = true;
        this.boostedUntil = until;
    }

    /**
     * Kết thúc boost
     */
    public void endBoost() {
        this.isBoosted = false;
        this.boostedUntil = null;
    }

    /**
     * Gia hạn post
     */
    public void extend(int days) {
        LocalDateTime newExpiry = this.expiresAt != null && this.expiresAt.isAfter(LocalDateTime.now())
                ? this.expiresAt.plusDays(days)
                : LocalDateTime.now().plusDays(days);
        this.expiresAt = newExpiry;

        // If post was expired, set back to approved
        if (this.status == PostStatus.EXPIRED) {
            this.status = PostStatus.APPROVED;
        }
    }
}
