package fit.nlu.tmdt.modules.message.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Typing Indicator DTO
 * Thông báo user đang nhắn tin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicator {

    private Long conversationId;
    private Long senderId;
    private Long receiverId;
    private String senderName;
    private boolean isTyping;
    private LocalDateTime timestamp;

    public static TypingIndicator startTyping(Long conversationId, Long senderId, Long receiverId, String senderName) {
        return TypingIndicator.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .receiverId(receiverId)
                .senderName(senderName)
                .isTyping(true)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static TypingIndicator stopTyping(Long conversationId, Long senderId) {
        return TypingIndicator.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .isTyping(false)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
