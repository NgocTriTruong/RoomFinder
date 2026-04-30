package fit.nlu.tmdt.modules.notification.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.notification.dto.response.NotificationResponse;
import fit.nlu.tmdt.modules.notification.entity.Notification;
import fit.nlu.tmdt.modules.notification.repository.NotificationRepository;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Notification Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findUnreadByUserId(userId);
        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getRecentNotifications(Long userId, int limit) {
        List<Notification> notifications = notificationRepository.findRecentByUserId(userId, limit);
        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByIdAndDeletedAtIsNull(notificationId)
                .orElseThrow(() -> new BusinessException("NOTI_001", "Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new BusinessException("NOTI_002", "Not authorized to access this notification");
        }

        notification.markAsRead();
        notificationRepository.save(notification);
        log.info("Marked notification as read: id={}", notificationId);
    }

    @Override
    public int markAllAsRead(Long userId) {
        int count = notificationRepository.markAllAsReadByUserId(userId);
        log.info("Marked {} notifications as read for user: {}", count, userId);
        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadAndDeletedAtIsNull(userId, false);
    }

    @Override
    public void createNotification(Notification notification) {
        notificationRepository.save(notification);
        log.info("Created notification: type={}, userId={}", notification.getType(), notification.getUser().getId());
        
        // Push real-time notification
        try {
            pushNotification(notification);
        } catch (Exception e) {
            log.error("Failed to push real-time notification: {}", e.getMessage());
        }
    }

    @Override
    public void pushNotification(Notification notification) {
        if (notification == null || notification.getUser() == null) return;
        
        NotificationResponse response = toResponse(notification);
        String destination = "/queue/notifications";
        
        // Send to /user/{username}/queue/notifications
        // Note: Spring Security's Principal username is used by messagingTemplate.convertAndSendToUser
        // In our case, we should ensure the user is identifiable by their email or username
        String username = notification.getUser().getEmail(); // Or whatever is used as Principal
        
        messagingTemplate.convertAndSendToUser(
                username,
                destination,
                response
        );
        
        log.info("Pushed real-time notification to user: {} at destination: {}", username, destination);
    }

    @Override
    public int cleanupOldNotifications(Long userId, int daysOld) {
        LocalDateTime before = LocalDateTime.now().minusDays(daysOld);
        int count = notificationRepository.deleteOldNotifications(userId, before);
        log.info("Cleaned up {} old notifications for user: {}", count, userId);
        return count;
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .content(notification.getContent())
                .icon(notification.getIcon())
                .color(notification.getColor())
                .actionUrl(notification.getActionUrl())
                .actionType(notification.getActionType())
                .actionId(notification.getActionId())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .referenceType(notification.getReferenceType())
                .referenceId(notification.getReferenceId())
                .actorId(notification.getActorId())
                .actorName(notification.getActorName())
                .build();
    }
}