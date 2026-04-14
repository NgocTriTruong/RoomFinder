package fit.nlu.tmdt.modules.favorite.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * RoomHistory Entity
 * Lưu thông tin lịch sử xem phòng của user
 */
@Entity
@Table(name = "room_history", indexes = {
        @Index(name = "idx_history_user", columnList = "user_id"),
        @Index(name = "idx_history_post", columnList = "post_id"),
        @Index(name = "idx_history_viewed_at", columnList = "viewed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomHistory extends BaseEntity {

    // ==========================================
    // USER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // POST (Link to post for easy querying)
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // ==========================================
    // INFO
    // ==========================================

    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Factory method để tạo history
     */
    public static RoomHistory create(User user, Post post) {
        return RoomHistory.builder()
                .user(user)
                .post(post)
                .viewedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Kiểm tra có phải của user này không
     */
    public boolean isOwnedBy(Long userId) {
        return user != null && user.getId().equals(userId);
    }

    /**
     * Cập nhật thời gian xem
     */
    public void updateViewTime() {
        this.viewedAt = LocalDateTime.now();
    }
}
