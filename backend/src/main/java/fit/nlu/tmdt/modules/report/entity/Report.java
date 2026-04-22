package fit.nlu.tmdt.modules.report.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.report.entity.enums.ReportStatus;
import fit.nlu.tmdt.modules.report.entity.enums.ReportType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Report Entity
 * Lưu thông tin báo cáo vi phạm
 */
@Entity
@Table(name = "reports", indexes = {
        @Index(name = "idx_report_reporter", columnList = "reporter_id"),
        @Index(name = "idx_report_target", columnList = "target_id"),
        @Index(name = "idx_report_type", columnList = "type"),
        @Index(name = "idx_report_status", columnList = "status"),
        @Index(name = "idx_report_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report extends BaseEntity {

    // ==========================================
    // REPORTER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    // ==========================================
    // TARGET
    // ==========================================

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;  // POST, USER, LANDLORD, REVIEW

    // ==========================================
    // REPORT INFO
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "evidence_url", length = 500)
    private String evidenceUrl;

    // ==========================================
    // STATUS
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    // ==========================================
    // HANDLING
    // ==========================================

    @Column(name = "handled_by")
    private Long handledBy;

    @Column(name = "handled_at")
    private java.time.LocalDateTime handledAt;

    @Column(name = "handled_note", columnDefinition = "TEXT")
    private String handledNote;

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;  // WARN_LANDLORD, REMOVE_POST, BLACKLIST_USER

    // ==========================================
    // REFERENCE
    // ==========================================

    @Column(name = "post_id")
    private Long postId;  // Tin đăng liên quan

    @Column(name = "booking_id")
    private Long bookingId;  // Lịch hẹn liên quan

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra report đang chờ xử lý
     */
    public boolean isPending() {
        return status == ReportStatus.PENDING;
    }

    /**
     * Kiểm tra report đang được xử lý
     */
    public boolean isProcessing() {
        return status == ReportStatus.PROCESSING;
    }

    /**
     * Kiểm tra report đã được giải quyết
     */
    public boolean isResolved() {
        return status == ReportStatus.RESOLVED;
    }

    /**
     * Bắt đầu xử lý report
     */
    public void startProcessing(Long adminId) {
        this.status = ReportStatus.PROCESSING;
        this.handledBy = adminId;
        this.handledAt = java.time.LocalDateTime.now();
    }

    /**
     * Giải quyết report
     */
    public void resolve(String note, String action) {
        this.status = ReportStatus.RESOLVED;
        this.handledNote = note;
        this.actionTaken = action;
    }

    /**
     * Bác bỏ report
     */
    public void dismiss(String note) {
        this.status = ReportStatus.DISMISSED;
        this.handledNote = note;
    }

    /**
     * Kiểm tra có phải report về post không
     */
    public boolean isPostReport() {
        return "POST".equals(targetType);
    }

    /**
     * Kiểm tra có phải report về user không
     */
    public boolean isUserReport() {
        return "USER".equals(targetType) || "LANDLORD".equals(targetType);
    }

    /**
     * Kiểm tra có phải report về review không
     */
    public boolean isReviewReport() {
        return "REVIEW".equals(targetType);
    }
}
