package fit.nlu.tmdt.modules.statistics.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ViewHistory Entity
 * Lưu thông tin lượt xem/liên hệ theo ngày cho landlord dashboard stats
 */
@Entity
@Table(name = "view_history", indexes = {
        @Index(name = "idx_vh_landlord_date", columnList = "landlord_id, view_date"),
        @Index(name = "idx_vh_post_date", columnList = "post_id, view_date"),
        @Index(name = "idx_vh_view_date", columnList = "view_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViewHistory extends BaseEntity {

    // ==========================================
    // LANDLORD (for easy landlord-based queries)
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    // ==========================================
    // POST (optional - for post-specific tracking)
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // ==========================================
    // DATE TRACKING
    // ==========================================

    @Column(name = "view_date", nullable = false)
    private LocalDate viewDate;

    // ==========================================
    // COUNTS (daily aggregates)
    // ==========================================

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "contact_count")
    @Builder.Default
    private Integer contactCount = 0;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Factory method để tạo ViewHistory cho ngày hôm nay
     */
    public static ViewHistory createForToday(User landlord, Post post) {
        return ViewHistory.builder()
                .landlord(landlord)
                .post(post)
                .viewDate(LocalDate.now())
                .viewCount(0)
                .contactCount(0)
                .build();
    }

    /**
     * Factory method để tạo ViewHistory với ngày cụ thể
     */
    public static ViewHistory create(User landlord, Post post, LocalDate date) {
        return ViewHistory.builder()
                .landlord(landlord)
                .post(post)
                .viewDate(date)
                .viewCount(0)
                .contactCount(0)
                .build();
    }

    /**
     * Increment view count
     */
    public void incrementView() {
        this.viewCount = (this.viewCount == null ? 0 : this.viewCount) + 1;
    }

    /**
     * Increment contact count
     */
    public void incrementContact() {
        this.contactCount = (this.contactCount == null ? 0 : this.contactCount) + 1;
    }
}
