package fit.nlu.tmdt.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Landlord Summary - Lightweight landlord info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandlordSummary {

    private Long id;
    private String fullName;
    private String avatar;
    private String phone;
    private Double averageRating;
    private Integer totalReviews;
    private Boolean isVerified;
}
