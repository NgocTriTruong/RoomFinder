package fit.nlu.tmdt.modules.message.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * WebSocket Chat Message DTO
 * Message được truyền qua WebSocket STOMP
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    public enum MessageType {
        CHAT,       // Tin nhắn chat thông thường
        TYPING,     // Typing indicator
        READ,       // Đánh dấu đã đọc
        ONLINE,     // User online status
        OFFLINE,   // User offline status
        DELIVERED,  // Đánh dấu đã gửi thành công
        ERROR       // Error message
    }

    // Message type
    private MessageType type;

    // Conversation info
    private Long conversationId;
    private Long senderId;
    private Long receiverId;

    // Message content
    private Long messageId;       // ID của message (null khi gửi, có giá trị khi server trả về)
    private String content;
    private String attachmentUrl;
    private Long postId;

    // Sender info (để hiển thị)
    private String senderName;
    private String senderAvatar;
    
    // Receiver info (để hiển thị)
    private String receiverName;
    private String receiverAvatar;

    // Timestamps
    private LocalDateTime timestamp;
    private LocalDateTime readAt;

    // Status
    private boolean isRead;
    private boolean isDelivered;

    // Error info (nếu có lỗi)
    private String errorCode;
    private String errorMessage;

    // Factory methods
    public static ChatMessage createChatMessage(Long conversationId, Long senderId, Long receiverId,
                                                 String content, String attachmentUrl, Long postId,
                                                 String senderName, String senderAvatar) {
        return ChatMessage.builder()
                .type(MessageType.CHAT)
                .conversationId(conversationId)
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .attachmentUrl(attachmentUrl)
                .postId(postId)
                .senderName(senderName)
                .senderAvatar(senderAvatar)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .isDelivered(false)
                .build();
    }

    public static ChatMessage typing(Long conversationId, Long senderId, Long receiverId, boolean isTyping) {
        return ChatMessage.builder()
                .type(isTyping ? MessageType.TYPING : MessageType.CHAT)
                .conversationId(conversationId)
                .senderId(senderId)
                .receiverId(receiverId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ChatMessage readReceipt(Long conversationId, Long messageId, Long readerId) {
        return ChatMessage.builder()
                .type(MessageType.READ)
                .conversationId(conversationId)
                .messageId(messageId)
                .senderId(readerId)
                .timestamp(LocalDateTime.now())
                .isRead(true)
                .build();
    }

    public static ChatMessage onlineStatus(Long userId, boolean isOnline) {
        return ChatMessage.builder()
                .type(isOnline ? MessageType.ONLINE : MessageType.OFFLINE)
                .senderId(userId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ChatMessage delivered(Long conversationId, Long messageId, Long senderId) {
        return ChatMessage.builder()
                .type(MessageType.DELIVERED)
                .conversationId(conversationId)
                .messageId(messageId)
                .senderId(senderId)
                .timestamp(LocalDateTime.now())
                .isDelivered(true)
                .build();
    }

    public static ChatMessage error(String errorCode, String errorMessage) {
        return ChatMessage.builder()
                .type(MessageType.ERROR)
                .errorCode(errorCode)
                .errorMessage(errorMessage)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
