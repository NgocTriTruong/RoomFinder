package fit.nlu.tmdt.modules.message.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Conversation Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {

    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private String otherUserPhone;
    private Long postId;
    private String postTitle;
    private String postThumbnail;
    private MessageResponse lastMessage;
    private Integer unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
}
