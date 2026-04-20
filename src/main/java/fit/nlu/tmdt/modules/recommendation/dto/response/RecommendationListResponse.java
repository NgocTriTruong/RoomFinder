package fit.nlu.tmdt.modules.recommendation.dto.response;

import fit.nlu.tmdt.modules.recommendation.entity.enums.RecommendationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * RecommendationListResponse DTO
 * Response cho danh sách recommendations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationListResponse {

    private List<RecommendationResponse> recommendations;
    private int totalCount;
    private int page;
    private int size;
    
    // Stats
    private Map<RecommendationType, Integer> countByType;
    private double averageScore;
    private int newRecommendations;  // Số recommendation mới (chưa xem)
    
    // User's preference match
    private String userPreferenceSummary;
    private Double overallMatchPercentage;
}
