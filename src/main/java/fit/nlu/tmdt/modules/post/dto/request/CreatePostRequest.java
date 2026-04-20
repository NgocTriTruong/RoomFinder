package fit.nlu.tmdt.modules.post.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Create Post Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank(message = "Title is required")
    @Size(min = 20, max = 200, message = "Title must be between 20 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 100, max = 5000, message = "Description must be between 100 and 5000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Price type is required")
    private String priceType;  // MONTHLY, QUARTERLY, YEARLY

    @PositiveOrZero(message = "Deposit must be zero or positive")
    private Double deposit;

    @Size(min = 3, max = 10, message = "At least 3 images required, maximum 10")
    @Size(max = 10, message = "Maximum 10 images allowed")
    private List<String> images;

    private String videoUrl;

    @Min(value = 1, message = "At least 1 day duration required")
    @Max(value = 90, message = "Maximum 90 days duration")
    private Integer durationDays;
}
