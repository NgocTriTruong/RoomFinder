package fit.nlu.tmdt.modules.recommendation.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * UpdatePreferenceRequest DTO
 * Request để cập nhật user preferences
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePreferenceRequest {

    // Budget
    @Positive(message = "Min budget must be positive")
    private Double minBudget;

    @Positive(message = "Max budget must be positive")
    private Double maxBudget;

    // Location
    @Size(max = 100, message = "Province must be <= 100 chars")
    private String preferredProvince;

    @Size(max = 100, message = "District must be <= 100 chars")
    private String preferredDistrict;

    private Double preferredLatitude;

    private Double preferredLongitude;

    @Positive(message = "Max distance must be positive")
    @Max(value = 100, message = "Max distance must be <= 100 km")
    @Builder.Default
    private Double maxDistanceKm = 10.0;

    // Area
    @Positive(message = "Min area must be positive")
    private Double minArea;

    @Positive(message = "Max area must be positive")
    private Double maxArea;

    // Floor
    @Min(value = 0, message = "Min floor must be >= 0")
    private Integer preferredFloorMin;

    @Min(value = 0, message = "Max floor must be >= 0")
    private Integer preferredFloorMax;

    // Amenities
    private List<Long> preferredAmenityIds;

    // Lifestyle
    private Boolean hasPet;

    private Boolean needsParking;

    private Boolean needsCurfewFree;

    // University
    private Long universityId;

    @Size(max = 255, message = "University name must be <= 255 chars")
    private String universityName;

    private Double universityLatitude;

    private Double universityLongitude;
}
