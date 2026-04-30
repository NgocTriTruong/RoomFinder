package fit.nlu.tmdt.modules.notification.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.notification.dto.response.NotificationResponse;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Notification Controller
 */
@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notification", description = "Notification Management APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get user's notifications")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser Long userId) {

        log.info("Get notifications for user: {}, page: {}, size: {}", userId, page, size);
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(notifications.getContent()));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @CurrentUser Long userId) {

        log.info("Mark notification as read: id={}, userId={}", id, userId);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllAsRead(
            @CurrentUser Long userId) {

        log.info("Mark all notifications as read for user: {}", userId);
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @CurrentUser Long userId) {

        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}