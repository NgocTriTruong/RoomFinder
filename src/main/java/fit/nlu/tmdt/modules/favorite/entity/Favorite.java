package fit.nlu.tmdt.modules.favorite.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.room.entity.Room;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Favorite Entity
 * Lưu thông tin phòng yêu thích của user
 */
@Entity
@Table(name = "favorites", indexes = {
        @Index(name = "idx_favorite_user", columnList = "user_id"),
        @Index(name = "idx_favorite_room", columnList = "room_id"),
        @Index(name = "idx_favorite_created", columnList = "created_at"),
        @Index(name = "idx_favorite_user_room", columnList = "user_id, room_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite extends BaseEntity {

    // ==========================================
    // USER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // ROOM
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    // ==========================================
    // INFO
    // ==========================================

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Factory method để tạo favorite
     */
    public static Favorite create(User user, Room room) {
        return Favorite.builder()
                .user(user)
                .room(room)
                .createdAt(LocalDateTime.now())
                .build();
    }

    /**
     * Kiểm tra có phải của user này không
     */
    public boolean isOwnedBy(Long userId) {
        return user != null && user.getId().equals(userId);
    }
}
