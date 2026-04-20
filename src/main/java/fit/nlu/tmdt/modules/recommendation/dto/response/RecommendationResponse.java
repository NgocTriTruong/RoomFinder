package fit.nlu.tmdt.modules.recommendation.dto.response;

import fit.nlu.tmdt.modules.post.dto.response.PostResponse;
import fit.nlu.tmdt.modules.recommendation.entity.enums.RecommendationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * RecommendationResponse DTO
 * Response cho một recommendation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {

    private Long id;
    private Long postId;  // Extracted for easy access
    private PostResponse post;
    private RecommendationType type;
    private String typeDescription;
    private Double score;
    private String reason;
    private Integer rank;
    private LocalDateTime recommendedAt;
    
    // Additional info
    private Double matchPercentage;  // 0-100%
    private String matchDetails;  // Chi tiết về sự phù hợp
}
