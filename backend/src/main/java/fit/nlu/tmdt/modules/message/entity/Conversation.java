package fit.nlu.tmdt.modules.message.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.message.entity.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Conversation Entity
 * Lưu thông tin cuộc trò chuyện giữa 2 người
 */
@Entity
@Table(name = "conversations", indexes = {
        @Index(name = "idx_conversation_user1", columnList = "user1_id"),
        @Index(name = "idx_conversation_user2", columnList = "user2_id"),
        @Index(name = "idx_conversation_last_message", columnList = "last_message_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation extends BaseEntity {

    // ==========================================
    // PARTICIPANTS
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;  // Người dùng bình thường

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;  // Chủ trọ

    // ==========================================
    // LAST MESSAGE INFO
    // ==========================================

    @Column(name = "last_message_at")
    private java.time.LocalDateTime lastMessageAt;

    @Column(name = "last_message_preview", length = 200)
    private String lastMessagePreview;

    @Column(name = "last_message_type", length = 20)
    private MessageType lastMessageType;

    // ==========================================
    // UNREAD COUNTS
    // ==========================================

    @Column(name = "unread_count_user1")
    @Builder.Default
    private Integer unreadCountUser1 = 0;

    @Column(name = "unread_count_user2")
    @Builder.Default
    private Integer unreadCountUser2 = 0;

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "user1_hidden")
    @Builder.Default
    private Boolean user1Hidden = false;

    @Column(name = "user2_hidden")
    @Builder.Default
    private Boolean user2Hidden = false;

    @Column(name = "user1_blocked")
    @Builder.Default
    private Boolean user1Blocked = false;

    @Column(name = "user2_blocked")
    @Builder.Default
    private Boolean user2Blocked = false;

    // ==========================================
    // REFERENCE
    // ==========================================

    @Column(name = "post_id")
    private Long postId;  // Phòng liên quan

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Lấy unread count cho một user
     */
    public int getUnreadCountForUser(Long userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            return unreadCountUser1 != null ? unreadCountUser1 : 0;
        }
        if (user2 != null && user2.getId().equals(userId)) {
            return unreadCountUser2 != null ? unreadCountUser2 : 0;
        }
        return 0;
    }

    /**
     * Tăng unread count cho một user
     */
    public void incrementUnreadForUser(Long userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            unreadCountUser1 = (unreadCountUser1 == null ? 0 : unreadCountUser1) + 1;
        } else if (user2 != null && user2.getId().equals(userId)) {
            unreadCountUser2 = (unreadCountUser2 == null ? 0 : unreadCountUser2) + 1;
        }
    }

    /**
     * Reset unread count cho một user
     */
    public void resetUnreadForUser(Long userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            unreadCountUser1 = 0;
        } else if (user2 != null && user2.getId().equals(userId)) {
            unreadCountUser2 = 0;
        }
    }

    /**
     * Kiểm tra user có trong cuộc trò chuyện không
     */
    public boolean hasParticipant(Long userId) {
        return (user1 != null && user1.getId().equals(userId))
                || (user2 != null && user2.getId().equals(userId));
    }

    /**
     * Lấy participant còn lại
     */
    public User getOtherParticipant(Long userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            return user2;
        }
        return user1;
    }

    /**
     * Kiểm tra cuộc trò chuyện có bị ẩn không với user
     */
    public boolean isHiddenForUser(Long userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            return Boolean.TRUE.equals(user1Hidden);
        }
        if (user2 != null && user2.getId().equals(userId)) {
            return Boolean.TRUE.equals(user2Hidden);
        }
        return false;
    }

    /**
     * Kiểm tra cuộc trò chuyện có bị block không
     */
    public boolean isBlockedForUser(Long userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            return Boolean.TRUE.equals(user1Blocked);
        }
        if (user2 != null && user2.getId().equals(userId)) {
            return Boolean.TRUE.equals(user2Blocked);
        }
        return false;
    }

    /**
     * Cập nhật last message
     */
    public void updateLastMessage(String preview, MessageType type) {
        this.lastMessagePreview = preview;
        this.lastMessageType = type;
        this.lastMessageAt = java.time.LocalDateTime.now();
    }
}
