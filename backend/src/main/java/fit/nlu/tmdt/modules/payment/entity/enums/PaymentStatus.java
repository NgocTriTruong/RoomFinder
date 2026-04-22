package fit.nlu.tmdt.modules.payment.entity.enums;

/**
 * Payment Status Enum
 * Trạng thái thanh toán
 */
public enum PaymentStatus {
    PENDING,     // Đang chờ
    PROCESSING, // Đang xử lý
    SUCCESS,    // Thành công
    FAILED,     // Thất bại
    REFUNDED   // Đã hoàn tiền
}
