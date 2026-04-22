package fit.nlu.tmdt.common.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Error Codes for the application
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    // Authentication (AUTH_xxx)
    AUTH_001("AUTH_001", "Invalid credentials", HttpStatus.UNAUTHORIZED),
    AUTH_002("AUTH_002", "Account is locked", HttpStatus.FORBIDDEN),
    AUTH_003("AUTH_003", "Email not verified", HttpStatus.FORBIDDEN),
    AUTH_004("AUTH_004", "Token expired", HttpStatus.UNAUTHORIZED),
    AUTH_005("AUTH_005", "Invalid refresh token", HttpStatus.UNAUTHORIZED),
    // User (USER_xxx)
    USER_001("USER_001", "User not found", HttpStatus.NOT_FOUND),
    USER_002("USER_002", "Email already exists", HttpStatus.CONFLICT),
    USER_003("USER_003", "Invalid password", HttpStatus.BAD_REQUEST),
    USER_004("USER_004", "Cannot delete own account", HttpStatus.BAD_REQUEST),
    USER_005("USER_005", "Phone already exists", HttpStatus.CONFLICT),
    USER_006("USER_006", "User is blacklisted", HttpStatus.FORBIDDEN),

    // Post (POST_xxx)
    POST_001("POST_001", "Post not found", HttpStatus.NOT_FOUND),
    POST_002("POST_002", "No active subscription", HttpStatus.BAD_REQUEST),
    POST_003("POST_003", "Out of posts quota", HttpStatus.BAD_REQUEST),
    POST_004("POST_004", "Room already has active post", HttpStatus.CONFLICT),
    POST_005("POST_005", "Post is not in pending status", HttpStatus.BAD_REQUEST),
    POST_006("POST_006", "Cannot edit approved post", HttpStatus.BAD_REQUEST),
    POST_007("POST_007", "Post is expired", HttpStatus.BAD_REQUEST),
    POST_008("POST_008", "Not authorized to access this post", HttpStatus.FORBIDDEN),
    POST_009("POST_009", "Post is not bookable", HttpStatus.BAD_REQUEST),
    POST_010("POST_010", "Post is not boostable", HttpStatus.BAD_REQUEST),

    // Room (ROOM_xxx)
    ROOM_001("ROOM_001", "Room not found", HttpStatus.NOT_FOUND),
    ROOM_002("ROOM_002", "Not authorized to access this room", HttpStatus.FORBIDDEN),

    // Booking (BOOK_xxx)
    BOOK_001("BOOK_001", "Booking not found", HttpStatus.NOT_FOUND),
    BOOK_002("BOOK_002", "Time slot not available", HttpStatus.CONFLICT),
    BOOK_003("BOOK_003", "Cannot book own post", HttpStatus.BAD_REQUEST),
    BOOK_004("BOOK_004", "Booking deadline passed", HttpStatus.BAD_REQUEST),
    BOOK_005("BOOK_005", "Booking already confirmed", HttpStatus.BAD_REQUEST),
    BOOK_006("BOOK_006", "Booking already cancelled", HttpStatus.BAD_REQUEST),
    BOOK_007("BOOK_007", "Booking is completed", HttpStatus.BAD_REQUEST),
    BOOK_008("BOOK_008", "Not authorized to modify this booking", HttpStatus.FORBIDDEN),
    BOOK_009("BOOK_009", "Cannot cancel within 1 hour", HttpStatus.BAD_REQUEST),

    // Payment (PAY_xxx)
    PAY_001("PAY_001", "Payment failed", HttpStatus.BAD_REQUEST),
    PAY_002("PAY_002", "Transaction not found", HttpStatus.NOT_FOUND),
    PAY_003("PAY_003", "Payment timeout", HttpStatus.BAD_REQUEST),
    PAY_004("PAY_004", "Amount mismatch", HttpStatus.BAD_REQUEST),
    PAY_005("PAY_005", "Invalid payment gateway response", HttpStatus.BAD_REQUEST),
    PAY_006("PAY_006", "Refund not allowed", HttpStatus.BAD_REQUEST),
    PAY_007("PAY_007", "Order already paid", HttpStatus.BAD_REQUEST),

    // Subscription (SUB_xxx)
    SUB_001("SUB_001", "Subscription not found", HttpStatus.NOT_FOUND),
    SUB_002("SUB_002", "No active subscription", HttpStatus.BAD_REQUEST),
    SUB_003("SUB_003", "Package not found", HttpStatus.NOT_FOUND),
    SUB_004("SUB_004", "Package is not available", HttpStatus.BAD_REQUEST),
    SUB_005("SUB_005", "Boost not found", HttpStatus.NOT_FOUND),

    // Voucher (VOU_xxx)
    VOU_001("VOU_001", "Voucher not found", HttpStatus.NOT_FOUND),
    VOU_002("VOU_002", "Voucher is expired", HttpStatus.BAD_REQUEST),
    VOU_003("VOU_003", "Voucher is not active", HttpStatus.BAD_REQUEST),
    VOU_004("VOU_004", "Voucher usage limit reached", HttpStatus.BAD_REQUEST),
    VOU_005("VOU_005", "Minimum order amount not met", HttpStatus.BAD_REQUEST),
    VOU_006("VOU_006", "Voucher not applicable for this package", HttpStatus.BAD_REQUEST),
    VOU_007("VOU_007", "Voucher code already exists", HttpStatus.CONFLICT),

    // Review (REV_xxx)
    REV_001("REV_001", "Review not found", HttpStatus.NOT_FOUND),
    REV_002("REV_002", "Cannot review without completed booking", HttpStatus.BAD_REQUEST),
    REV_003("REV_003", "Already reviewed this booking", HttpStatus.CONFLICT),
    REV_004("REV_004", "Review deadline passed", HttpStatus.BAD_REQUEST),
    REV_005("REV_005", "Not authorized to modify this review", HttpStatus.FORBIDDEN),

    // Message (MSG_xxx)
    MSG_001("MSG_001", "Conversation not found", HttpStatus.NOT_FOUND),
    MSG_002("MSG_002", "Not authorized to access this conversation", HttpStatus.FORBIDDEN),
    MSG_003("MSG_003", "Rate limit exceeded for messages", HttpStatus.TOO_MANY_REQUESTS),

    // Report (RPT_xxx)
    RPT_001("RPT_001", "Report not found", HttpStatus.NOT_FOUND),
    RPT_002("RPT_002", "Cannot report own content", HttpStatus.BAD_REQUEST),
    RPT_003("RPT_003", "Rate limit exceeded for reports", HttpStatus.TOO_MANY_REQUESTS),

    // Favorite (FAV_xxx)
    FAV_001("FAV_001", "Favorite not found", HttpStatus.NOT_FOUND),
    FAV_002("FAV_002", "Already in favorites", HttpStatus.CONFLICT),
    FAV_003("FAV_003", "Not in favorites", HttpStatus.NOT_FOUND),

    // Media (MEDIA_xxx)
    MEDIA_001("MEDIA_001", "Media file not found", HttpStatus.NOT_FOUND),
    MEDIA_002("MEDIA_002", "Failed to upload file", HttpStatus.BAD_REQUEST),
    MEDIA_003("MEDIA_003", "All files failed to upload", HttpStatus.BAD_REQUEST),
    MEDIA_004("MEDIA_004", "File is not ready", HttpStatus.BAD_REQUEST),
    MEDIA_005("MEDIA_005", "File is empty", HttpStatus.BAD_REQUEST),
    MEDIA_006("MEDIA_006", "File type not allowed", HttpStatus.BAD_REQUEST),
    MEDIA_007("MEDIA_007", "File size exceeds limit", HttpStatus.BAD_REQUEST),
    MEDIA_008("MEDIA_008", "Invalid filename", HttpStatus.BAD_REQUEST),
    MEDIA_009("MEDIA_009", "Storage limit exceeded", HttpStatus.BAD_REQUEST),

    // Authorization
    UNAUTHORIZED("UNAUTHORIZED", "Unauthorized access", HttpStatus.UNAUTHORIZED),

    // Validation
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed", HttpStatus.BAD_REQUEST),

    // Generic
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
