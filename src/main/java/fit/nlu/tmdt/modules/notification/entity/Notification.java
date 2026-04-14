package fit.nlu.tmdt.modules.notification.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Notification Entity
 * Lưu thông tin thông báo cho user
 */
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_user", columnList = "user_id"),
        @Index(name = "idx_notification_type", columnList = "type"),
        @Index(name = "idx_notification_read", columnList = "is_read"),
        @Index(name = "idx_notification_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    // ==========================================
    // USER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // TYPE & CONTENT
    // ==========================================

    @Column(nullable = false, length = 50)
    private String type;  // BOOKING, REVIEW, MESSAGE, PAYMENT, SYSTEM, POST

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // ==========================================
    // ICON & COLOR
    // ==========================================

    @Column(length = 50)
    private String icon;  // FontAwesome class

    @Column(length = 20)
    private String color;  // primary, success, warning, danger

    // ==========================================
    // ACTION
    // ==========================================

    @Column(name = "action_url", length = 255)
    private String actionUrl;

    @Column(name = "action_type", length = 50)
    private String actionType;  // VIEW_POST, VIEW_BOOKING, VIEW_MESSAGE

    @Column(name = "action_id")
    private Long actionId;

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    // ==========================================
    // DELIVERY
    // ==========================================

    @Column(name = "is_pushed")
    @Builder.Default
    private Boolean isPushed = false;

    @Column(name = "pushed_at")
    private LocalDateTime pushedAt;

    @Column(name = "is_email_sent")
    @Builder.Default
    private Boolean isEmailSent = false;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    // ==========================================
    // REFERENCE
    // ==========================================

    @Column(name = "reference_type", length = 50)
    private String referenceType;  // POST, BOOKING, MESSAGE, PAYMENT

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "actor_id")
    private Long actorId;  // User thực hiện action

    @Column(name = "actor_name", length = 100)
    private String actorName;

    // ==========================================
    // NOTIFICATION TYPES
    // ==========================================

    public static final String TYPE_BOOKING = "BOOKING";
    public static final String TYPE_REVIEW = "REVIEW";
    public static final String TYPE_MESSAGE = "MESSAGE";
    public static final String TYPE_PAYMENT = "PAYMENT";
    public static final String TYPE_POST = "POST";
    public static final String TYPE_SYSTEM = "SYSTEM";
    public static final String TYPE_PROMOTION = "PROMOTION";

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra thông báo đã đọc chưa
     */
    public boolean isRead() {
        return Boolean.TRUE.equals(isRead);
    }

    /**
     * Kiểm tra thông báo chưa đọc
     */
    public boolean isUnread() {
        return !isRead();
    }

    /**
     * Đánh dấu đã đọc
     */
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }

    /**
     * Đánh dấu đã push notification
     */
    public void markAsPushed() {
        this.isPushed = true;
        this.pushedAt = LocalDateTime.now();
    }

    /**
     * Đánh dấu đã gửi email
     */
    public void markEmailSent() {
        this.isEmailSent = true;
        this.emailSentAt = LocalDateTime.now();
    }

    /**
     * Factory method cho booking notification
     */
    public static Notification forBooking(User user, String title, String content, Long bookingId) {
        return Notification.builder()
                .user(user)
                .type(TYPE_BOOKING)
                .title(title)
                .content(content)
                .icon("fa-calendar-check")
                .color("primary")
                .actionType("VIEW_BOOKING")
                .actionId(bookingId)
                .referenceType(TYPE_BOOKING)
                .referenceId(bookingId)
                .build();
    }

    /**
     * Factory method cho message notification
     */
    public static Notification forMessage(User user, String title, String content, Long messageId, Long actorId, String actorName) {
        return Notification.builder()
                .user(user)
                .type(TYPE_MESSAGE)
                .title(title)
                .content(content)
                .icon("fa-comment")
                .color("info")
                .actionType("VIEW_MESSAGE")
                .actionId(messageId)
                .referenceType(TYPE_MESSAGE)
                .referenceId(messageId)
                .actorId(actorId)
                .actorName(actorName)
                .build();
    }

    /**
     * Factory method cho payment notification
     */
    public static Notification forPayment(User user, String title, String content, Long transactionId) {
        return Notification.builder()
                .user(user)
                .type(TYPE_PAYMENT)
                .title(title)
                .content(content)
                .icon("fa-credit-card")
                .color("success")
                .actionType("VIEW_PAYMENT")
                .actionId(transactionId)
                .referenceType(TYPE_PAYMENT)
                .referenceId(transactionId)
                .build();
    }

    /**
     * Factory method cho post notification
     */
    public static Notification forPost(User user, String title, String content, Long postId) {
        return Notification.builder()
                .user(user)
                .type(TYPE_POST)
                .title(title)
                .content(content)
                .icon("fa-home")
                .color("primary")
                .actionType("VIEW_POST")
                .actionId(postId)
                .referenceType(TYPE_POST)
                .referenceId(postId)
                .build();
    }

    /**
     * Factory method cho system notification
     */
    public static Notification forSystem(User user, String title, String content) {
        return Notification.builder()
                .user(user)
                .type(TYPE_SYSTEM)
                .title(title)
                .content(content)
                .icon("fa-bell")
                .color("warning")
                .build();
    }
}
