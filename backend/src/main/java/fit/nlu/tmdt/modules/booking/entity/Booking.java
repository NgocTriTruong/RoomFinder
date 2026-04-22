package fit.nlu.tmdt.modules.booking.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Booking Entity
 * Lưu thông tin lịch hẹn xem phòng
 */
@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_user", columnList = "user_id"),
        @Index(name = "idx_booking_landlord", columnList = "landlord_id"),
        @Index(name = "idx_booking_post", columnList = "post_id"),
        @Index(name = "idx_booking_time", columnList = "booking_time"),
        @Index(name = "idx_booking_status", columnList = "status"),
        @Index(name = "idx_booking_unique", columnList = "post_id, booking_time", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    // ==========================================
    // PARTIES
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // ==========================================
    // BOOKING INFO
    // ==========================================

    @Column(name = "booking_time", nullable = false)
    private LocalDateTime bookingTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(length = 255)
    private String note;  // Ghi chú từ user

    @Column(name = "landlord_note", length = 255)  // Ghi chú từ landlord
    private String landlordNote;

    // ==========================================
    // STATUS
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "status_changed_at")
    private LocalDateTime statusChangedAt;

    @Column(name = "status_changed_by")
    private Long statusChangedBy;

    // ==========================================
    // CONFIRMATION
    // ==========================================

    @Column(name = "confirmation_code", length = 20)
    private String confirmationCode;  // Mã xác nhận khi đặt

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    // ==========================================
    // CANCELLATION
    // ==========================================

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "cancelled_by")
    private Long cancelledBy;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // ==========================================
    // COMPLETION
    // ==========================================

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "completion_note", columnDefinition = "TEXT")
    private String completionNote;

    // ==========================================
    // NO-SHOW
    // ==========================================

    @Column(name = "no_show_reason", columnDefinition = "TEXT")
    private String noShowReason;

    @Column(name = "marked_no_show_at")
    private LocalDateTime markedNoShowAt;

    // ==========================================
    // REMINDER
    // ==========================================

    @Column(name = "reminder_sent_at")
    private LocalDateTime reminderSentAt;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra booking có ở trạng thái PENDING không
     */
    public boolean isPending() {
        return status == BookingStatus.PENDING;
    }

    /**
     * Kiểm tra booking đã được xác nhận chưa
     */
    public boolean isConfirmed() {
        return status == BookingStatus.CONFIRMED;
    }

    /**
     * Kiểm tra booking đã hoàn thành chưa
     */
    public boolean isCompleted() {
        return status == BookingStatus.COMPLETED;
    }

    /**
     * Kiểm tra booking đã bị hủy chưa
     */
    public boolean isCancelled() {
        return status == BookingStatus.CANCELLED;
    }

    /**
     * Kiểm tra có thể hủy không (trước 1 giờ)
     */
    public boolean canCancel() {
        if (isCancelled() || isCompleted()) {
            return false;
        }
        // Có thể hủy nếu còn > 1 giờ
        return bookingTime.isAfter(LocalDateTime.now().plusHours(1));
    }

    /**
     * Kiểm tra có thể xác nhận không
     */
    public boolean canConfirm() {
        return isPending() && bookingTime.isAfter(LocalDateTime.now());
    }

    /**
     * Kiểm tra đã quá thời gian chưa
     */
    public boolean isPast() {
        return bookingTime.isBefore(LocalDateTime.now());
    }

    /**
     * Xác nhận booking
     */
    public void confirm(Long confirmedById) {
        this.status = BookingStatus.CONFIRMED;
        this.statusChangedAt = LocalDateTime.now();
        this.statusChangedBy = confirmedById;
        this.confirmedAt = LocalDateTime.now();
    }

    /**
     * Hủy booking
     */
    public void cancel(String reason, Long cancelledById) {
        this.status = BookingStatus.CANCELLED;
        this.statusChangedAt = LocalDateTime.now();
        this.statusChangedBy = cancelledById;
        this.cancellationReason = reason;
        this.cancelledAt = LocalDateTime.now();
    }

    /**
     * Hoàn thành booking
     */
    public void complete(String note) {
        this.status = BookingStatus.COMPLETED;
        this.statusChangedAt = LocalDateTime.now();
        this.completedAt = LocalDateTime.now();
        this.completionNote = note;
    }

    /**
     * Đánh dấu không đến
     */
    public void markNoShow(String reason) {
        this.status = BookingStatus.NO_SHOW;
        this.statusChangedAt = LocalDateTime.now();
        this.noShowReason = reason;
        this.markedNoShowAt = LocalDateTime.now();
    }

    /**
     * Kiểm tra reminder đã được gửi chưa
     */
    public boolean isReminderSent() {
        return reminderSentAt != null;
    }

    /**
     * Đánh dấu đã gửi reminder
     */
    public void markReminderSent() {
        this.reminderSentAt = LocalDateTime.now();
    }

    /**
     * Tạo mã xác nhận
     */
    public static String generateConfirmationCode() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
}
