package fit.nlu.tmdt.modules.media.entity.enums;

/**
 * Media Status Enum
 * Trạng thái của media file
 */
public enum MediaStatus {
    UPLOADING,    // Đang upload
    PROCESSING,   // Đang xử lý (tạo thumbnail, optimize...)
    READY,        // Sẵn sàng sử dụng
    FAILED,       // Upload/xử lý thất bại
    DELETED       // Đã bị xóa
}
