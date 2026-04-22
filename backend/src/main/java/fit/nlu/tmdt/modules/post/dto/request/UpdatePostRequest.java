package fit.nlu.tmdt.modules.post.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Update Post Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePostRequest {

    @Size(min = 20, max = 200, message = "Title must be between 20 and 200 characters")
    private String title;

    @Size(min = 100, max = 5000, message = "Description must be between 100 and 5000 characters")
    private String description;

    @Positive(message = "Price must be positive")
    private Double price;

    private String priceType;

    @PositiveOrZero(message = "Deposit must be zero or positive")
    private Double deposit;

    @Size(min = 3, max = 10, message = "At least 3 images required, maximum 10")
    private List<String> images;

    private String videoUrl;

    private Boolean isAutoRenew;
}
