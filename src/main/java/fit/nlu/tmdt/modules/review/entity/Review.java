package fit.nlu.tmdt.modules.review.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

/**
 * Review Entity
 * Lưu thông tin đánh giá phòng trọ
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_post", columnList = "post_id"),
        @Index(name = "idx_review_landlord", columnList = "landlord_id"),
        @Index(name = "idx_review_user", columnList = "user_id"),
        @Index(name = "idx_review_booking", columnList = "booking_id"),
        @Index(name = "idx_review_rating", columnList = "rating"),
        @Index(name = "idx_review_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    // ==========================================
    // PARTIES
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    // ==========================================
    // REVIEW INFO
    // ==========================================

    @Column(nullable = false)
    private Integer rating;  // 1-5 sao

    @Column(columnDefinition = "TEXT")
    private String comment;

    // ==========================================
    // LANDLORD RATING
    // ==========================================

    @Column(name = "landlord_rating")
    private Integer landlordRating;  // Đánh giá riêng cho landlord

    @Column(name = "landlord_comment", columnDefinition = "TEXT")
    private String landlordComment;

    // ==========================================
    // IMAGES (Evidence)
    // ==========================================

    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private java.util.List<String> images = new java.util.ArrayList<>();

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_visible")
    @Builder.Default
    private Boolean isVisible = true;

    @Column(name = "is_approved")
    @Builder.Default
    private Boolean isApproved = true;  // Admin approve

    @Column(name = "approved_by")
    private Long approvedBy;

    // ==========================================
    // INTERACTION
    // ==========================================

    @Column(name = "helpful_count")
    @Builder.Default
    private Integer helpfulCount = 0;

    @Column(name = "report_count")
    @Builder.Default
    private Integer reportCount = 0;

    // ==========================================
    // LANDLORD RESPONSE
    // ==========================================

    @Column(name = "landlord_response", columnDefinition = "TEXT")
    private String landlordResponse;

    @Column(name = "landlord_response_at")
    private java.time.LocalDateTime landlordResponseAt;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra rating hợp lệ (1-5)
     */
    public boolean isValidRating() {
        return rating != null && rating >= 1 && rating <= 5;
    }

    /**
     * Kiểm tra đã có landlord response chưa
     */
    public boolean hasLandlordResponse() {
        return landlordResponse != null && !landlordResponse.isBlank();
    }

    /**
     * Kiểm tra review có thể sửa không
     */
    public boolean isEditable() {
        java.time.LocalDateTime oneDayAgo = java.time.LocalDateTime.now().minusHours(24);
        return getCreatedAt() != null && getCreatedAt().isAfter(oneDayAgo);
    }

    /**
     * Kiểm tra review có thể xóa không
     */
    public boolean isDeletable() {
        return reportCount == null || reportCount < 5;
    }

    /**
     * Tăng lượt helpful
     */
    public void incrementHelpful() {
        this.helpfulCount = (this.helpfulCount == null ? 0 : this.helpfulCount) + 1;
    }

    /**
     * Tăng lượt report
     */
    public void incrementReport() {
        this.reportCount = (this.reportCount == null ? 0 : this.reportCount) + 1;
    }

    /**
     * Landlord phản hồi
     */
    public void respondAsLandlord(String response) {
        this.landlordResponse = response;
        this.landlordResponseAt = java.time.LocalDateTime.now();
    }

    /**
     * Ẩn review
     */
    public void hide() {
        this.isVisible = false;
    }

    /**
     * Hiện review
     */
    public void show() {
        this.isVisible = true;
    }

    /**
     * Phê duyệt review
     */
    public void approve(Long adminId) {
        this.isApproved = true;
        this.approvedBy = adminId;
        this.isVisible = true;
    }

    /**
     * Từ chối review
     */
    public void reject() {
        this.isApproved = false;
        this.isVisible = false;
    }
}
