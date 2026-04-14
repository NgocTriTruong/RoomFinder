package fit.nlu.tmdt.modules.post.dto.request;

import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Post Search Params - Parameters for filtering posts
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSearchParams {

    private Double minPrice;
    private Double maxPrice;
    private String district;
    private String province;
    private List<Long> amenityIds;
    private Double minArea;
    private Double maxArea;
    private Long nearbyUniversityId;
    private Boolean petFriendly;
    private Boolean parkingAvailable;
    private Integer minRating;
    private String keyword;  // Full-text search
    private PostStatus status;  // Default: APPROVED
    private Boolean isBoosted;
    private String sortBy;  // createdAt, price, viewCount
    private String sortDirection;  // asc, desc
}
