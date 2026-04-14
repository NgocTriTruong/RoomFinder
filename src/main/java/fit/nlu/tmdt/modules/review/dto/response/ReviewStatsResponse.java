package fit.nlu.tmdt.modules.review.dto.response;

import lombok.*;

import java.util.Map;

/**
 * Review Stats Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatsResponse {

    private Long postId;
    private Long totalReviews;
    private Double averageRating;
    private Map<Integer, Long> ratingDistribution;
    private Long visibleCount;
    private Long hiddenCount;
}