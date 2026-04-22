package fit.nlu.tmdt.modules.message.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.message.entity.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Message Entity
 * Lưu thông tin tin nhắn trong cuộc trò chuyện
 */
@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_message_conversation", columnList = "conversation_id"),
        @Index(name = "idx_message_sender", columnList = "sender_id"),
        @Index(name = "idx_message_receiver", columnList = "receiver_id"),
        @Index(name = "idx_message_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message extends BaseEntity {

    // ==========================================
    // CONVERSATION
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    // ==========================================
    // SENDER & RECEIVER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    // ==========================================
    // CONTENT
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MessageType type = MessageType.TEXT;

    @Column(columnDefinition = "TEXT")
    private String content;

    // ==========================================
    // MEDIA (For IMAGE type)
    // ==========================================

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    @Column(name = "media_thumbnail", length = 500)
    private String mediaThumbnail;

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private java.time.LocalDateTime readAt;

    @Column(name = "read_by")
    private Long readBy;

    // ==========================================
    // DELETION
    // ==========================================

    @Column(name = "deleted_by_sender")
    @Builder.Default
    private Boolean deletedBySender = false;

    @Column(name = "deleted_by_receiver")
    @Builder.Default
    private Boolean deletedByReceiver = false;

    // ==========================================
    // REPLY (Optional)
    // ==========================================

    @Column(name = "reply_to_id")
    private Long replyToId;

    // ==========================================
    // SYSTEM MESSAGE INFO
    // ==========================================

    @Column(name = "is_system_message")
    @Builder.Default
    private Boolean isSystemMessage = false;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra tin nhắn đã được đọc chưa
     */
    public boolean isRead() {
        return Boolean.TRUE.equals(isRead);
    }

    /**
     * Kiểm tra người dùng đã đọc tin nhắn chưa
     */
    public boolean isReadBy(Long userId) {
        return isRead() && readBy != null && readBy.equals(userId);
    }

    /**
     * Đánh dấu đã đọc
     */
    public void markAsRead(Long userId) {
        this.isRead = true;
        this.readAt = java.time.LocalDateTime.now();
        this.readBy = userId;
    }

    /**
     * Kiểm tra người dùng có phải là người gửi không
     */
    public boolean isFrom(Long userId) {
        return sender != null && sender.getId().equals(userId);
    }

    /**
     * Kiểm tra người dùng có phải là người nhận không
     */
    public boolean isTo(Long userId) {
        return receiver != null && receiver.getId().equals(userId);
    }

    /**
     * Kiểm tra tin nhắn có bị xóa bởi user chưa
     */
    public boolean isDeletedFor(Long userId) {
        if (isFrom(userId)) {
            return Boolean.TRUE.equals(deletedBySender);
        }
        if (isTo(userId)) {
            return Boolean.TRUE.equals(deletedByReceiver);
        }
        return true;
    }

    /**
     * Xóa tin nhắn cho người dùng
     */
    public void deleteFor(Long userId) {
        if (isFrom(userId)) {
            this.deletedBySender = true;
        }
        if (isTo(userId)) {
            this.deletedByReceiver = true;
        }
    }

    /**
     * Kiểm tra có phải tin nhắn hệ thống không
     */
    public boolean isSystemMessage() {
        return Boolean.TRUE.equals(isSystemMessage) || type == MessageType.SYSTEM;
    }

    /**
     * Kiểm tra có phải tin nhắn hình ảnh không
     */
    public boolean isImageMessage() {
        return type == MessageType.IMAGE;
    }

    /**
     * Tạo tin nhắn hệ thống
     */
    public static Message createSystemMessage(Conversation conversation, String content) {
        return Message.builder()
                .conversation(conversation)
                .sender(conversation.getUser1())
                .receiver(conversation.getUser2())
                .type(MessageType.SYSTEM)
                .content(content)
                .isSystemMessage(true)
                .build();
    }
}
