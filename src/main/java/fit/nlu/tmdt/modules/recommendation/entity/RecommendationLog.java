package fit.nlu.tmdt.modules.recommendation.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.recommendation.entity.enums.RecommendationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * RecommendationLog Entity
 * Log các recommendation đã hiển thị cho user để track và cải thiện
 */
@Entity
@Table(name = "recommendation_logs", indexes = {
        @Index(name = "idx_log_user", columnList = "user_id"),
        @Index(name = "idx_log_post", columnList = "post_id"),
        @Index(name = "idx_log_type", columnList = "recommendation_type"),
        @Index(name = "idx_log_created", columnList = "created_at"),
        @Index(name = "idx_log_user_type", columnList = "user_id, recommendation_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationLog extends BaseEntity {

    // ==========================================
    // USER & POST
    // ==========================================

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // ==========================================
    // RECOMMENDATION INFO
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation_type", nullable = false, length = 30)
    private RecommendationType type;

    @Column(name = "score")
    private Double score;  // Score từ thuật toán (0.0 - 1.0)

    @Column(name = "rank_position")
    private Integer rankPosition;  // Vị trí trong danh sách gợi ý

    // ==========================================
    // CONTEXT
    // ==========================================

    @Column(name = "reason", length = 255)
    private String reason;  // Lý do gợi ý (VD: "Gần trường ĐH Bách Khoa")

    @Column(name = "based_on_post_id")
    private Long basedOnPostId;  // Post mà recommendation được dựa vào

    // ==========================================
    // FEEDBACK
    // ==========================================

    @Column(name = "was_viewed")
    @Builder.Default
    private Boolean wasViewed = false;

    @Column(name = "viewed_at")
    private LocalDateTime viewedAt;

    @Column(name = "was_clicked")
    @Builder.Default
    private Boolean wasClicked = false;

    @Column(name = "clicked_at")
    private LocalDateTime clickedAt;

    @Column(name = "was_favorited")
    @Builder.Default
    private Boolean wasFavorited = false;

    @Column(name = "favorited_at")
    private LocalDateTime favoritedAt;

    @Column(name = "was_contacted")
    @Builder.Default
    private Boolean wasContacted = false;

    @Column(name = "contacted_at")
    private LocalDateTime contactedAt;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Mark as viewed
     */
    public void markAsViewed() {
        this.wasViewed = true;
        this.viewedAt = LocalDateTime.now();
    }

    /**
     * Mark as clicked
     */
    public void markAsClicked() {
        this.wasClicked = true;
        this.clickedAt = LocalDateTime.now();
        if (!Boolean.TRUE.equals(wasViewed)) {
            markAsViewed();
        }
    }

    /**
     * Mark as favorited
     */
    public void markAsFavorited() {
        this.wasFavorited = true;
        this.favoritedAt = LocalDateTime.now();
        if (!Boolean.TRUE.equals(wasClicked)) {
            markAsClicked();
        }
    }

    /**
     * Mark as contacted
     */
    public void markAsContacted() {
        this.wasContacted = true;
        this.contactedAt = LocalDateTime.now();
        if (!Boolean.TRUE.equals(wasClicked)) {
            markAsClicked();
        }
    }

    /**
     * Tính engagement score
     */
    public double getEngagementScore() {
        double score = 0.0;
        if (Boolean.TRUE.equals(wasViewed)) score += 0.25;
        if (Boolean.TRUE.equals(wasClicked)) score += 0.25;
        if (Boolean.TRUE.equals(wasFavorited)) score += 0.25;
        if (Boolean.TRUE.equals(wasContacted)) score += 0.25;
        return score;
    }
}
