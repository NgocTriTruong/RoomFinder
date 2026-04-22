package fit.nlu.tmdt.modules.recommendation.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * RecommendationRequest DTO
 * Request để lấy recommendations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {

    // Pagination
    @Min(value = 0, message = "Page must be >= 0")
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1, message = "Size must be >= 1")
    @Max(value = 50, message = "Size must be <= 50")
    @Builder.Default
    private Integer size = 10;

    // Filter types
    private List<String> types;  // RecommendationType names

    // Exclude posts (already seen/favorited)
    @Builder.Default
    private Boolean excludeViewed = true;

    @Builder.Default
    private Boolean excludeFavorited = false;

    // Context
    private Long basedOnPostId;  // Get similar to this post
    
    // Location context
    private Double latitude;
    private Double longitude;
    
    // Budget context
    private Double minBudget;
    private Double maxBudget;
}
