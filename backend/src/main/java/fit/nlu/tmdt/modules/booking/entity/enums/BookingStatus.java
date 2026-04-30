package fit.nlu.tmdt.modules.booking.entity.enums;

/**
 * Booking Status Enum
 * Trạng thái của lịch hẹn xem phòng
 */
public enum BookingStatus {
    PENDING,      // Chờ xác nhận
    CONFIRMED,    // Đã xác nhận
    COMPLETED,    // Hoàn thành
    CANCELLED,    // Đã hủy
    REJECTED,     // Đã từ chối
    NO_SHOW       // Không đến
}
