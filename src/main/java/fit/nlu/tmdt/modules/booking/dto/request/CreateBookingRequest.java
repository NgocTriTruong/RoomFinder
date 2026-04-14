package fit.nlu.tmdt.modules.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Create Booking Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "Post ID is required")
    private Long postId;

    @NotNull(message = "Booking time is required")
    private LocalDateTime bookingTime;

    private String note;
}
