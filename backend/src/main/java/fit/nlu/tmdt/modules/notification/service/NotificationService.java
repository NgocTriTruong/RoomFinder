package fit.nlu.tmdt.modules.notification.service;

import fit.nlu.tmdt.modules.notification.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Notification Service Interface
 */
public interface NotificationService {

    /**
     * Get user's notifications
     */
    List<NotificationResponse> getUserNotifications(Long userId);

    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);

    /**
     * Get unread notifications
     */
    List<NotificationResponse> getUnreadNotifications(Long userId);

    /**
     * Get recent notifications
     */
    List<NotificationResponse> getRecentNotifications(Long userId, int limit);

    /**
     * Mark notification as read
     */
    void markAsRead(Long notificationId, Long userId);

    /**
     * Mark all notifications as read
     */
    int markAllAsRead(Long userId);

    /**
     * Get unread count
     */
    long getUnreadCount(Long userId);

    /**
     * Create notification (internal use)
     */
    void createNotification(fit.nlu.tmdt.modules.notification.entity.Notification notification);

    /**
     * Delete old notifications
     */
    int cleanupOldNotifications(Long userId, int daysOld);

    /**
     * Push real-time notification via WebSocket
     */
    void pushNotification(fit.nlu.tmdt.modules.notification.entity.Notification notification);
}