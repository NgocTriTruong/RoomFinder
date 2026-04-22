package fit.nlu.tmdt.modules.report.entity.enums;

/**
 * Report Status Enum
 * Trạng thái của báo cáo vi phạm
 */
public enum ReportStatus {
    PENDING,      // Chờ xử lý
    PROCESSING,  // Đang xử lý
    RESOLVED,    // Đã giải quyết
    DISMISSED    // Bác bỏ
}
