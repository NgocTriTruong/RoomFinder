package fit.nlu.tmdt.modules.notification.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Notification Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String type;
    private String title;
    private String content;
    private String icon;
    private String color;
    private String actionUrl;
    private String actionType;
    private Long actionId;
    private Boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    private String referenceType;
    private Long referenceId;
    private Long actorId;
    private String actorName;
}