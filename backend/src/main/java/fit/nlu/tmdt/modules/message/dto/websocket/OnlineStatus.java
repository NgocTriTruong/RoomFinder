package fit.nlu.tmdt.modules.message.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Online Status DTO
 * Thông báo trạng thái online/offline của user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnlineStatus {

    private Long userId;
    private String userName;
    private String userAvatar;
    private boolean online;
    private String lastSeen;
    private int unreadCount; // Số tin nhắn chưa đọc

    public static OnlineStatus online(Long userId, String userName, String userAvatar, int unreadCount) {
        return OnlineStatus.builder()
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .online(true)
                .unreadCount(unreadCount)
                .build();
    }

    public static OnlineStatus offline(Long userId, String userName, String userAvatar, String lastSeen, int unreadCount) {
        return OnlineStatus.builder()
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .online(false)
                .lastSeen(lastSeen)
                .unreadCount(unreadCount)
                .build();
    }
}
