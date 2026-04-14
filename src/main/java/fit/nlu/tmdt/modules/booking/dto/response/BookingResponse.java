package fit.nlu.tmdt.modules.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Booking Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private LocalDateTime bookingTime;
    private LocalDateTime endTime;
    private String status;
    private String note;
    private String landlordNote;
    private String confirmationCode;

    // Post info
    private PostSummary post;

    // User info
    private UserSummary user;

    // Landlord info
    private UserSummary landlord;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime completedAt;

    // Post Summary
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostSummary {
        private Long id;
        private String title;
        private String thumbnailUrl;
        private String address;
    }

    // User Summary
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String fullName;
        private String phone;
        private String avatar;
    }
}
