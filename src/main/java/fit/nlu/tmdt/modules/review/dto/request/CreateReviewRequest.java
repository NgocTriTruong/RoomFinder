package fit.nlu.tmdt.modules.review.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

/**
 * Create Review Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {

    private Long bookingId;

    private Long postId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(max = 2000, message = "Comment must be at most 2000 characters")
    private String comment;

    private List<String> images;

    @Min(value = 1, message = "Landlord rating must be at least 1")
    @Max(value = 5, message = "Landlord rating must be at most 5")
    private Integer landlordRating;

    @Size(max = 1000, message = "Landlord comment must be at most 1000 characters")
    private String landlordComment;
}