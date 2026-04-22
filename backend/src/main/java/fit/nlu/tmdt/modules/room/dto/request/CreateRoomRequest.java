package fit.nlu.tmdt.modules.room.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Create Room Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoomRequest {

    @NotBlank(message = "Address is required")
    private String address;

    private String roomNumber;

    private String province;

    private String district;

    private String ward;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be positive")
    private Double area;

    @NotNull(message = "Floor is required")
    private Integer floor;

    @NotNull(message = "Max occupancy is required")
    private Integer maxOccupancy;

    private String direction;

    private Boolean hasWindows;

    private Boolean hasBalcony;

    private String thumbnailUrl;

    private List<String> images;

    private List<Long> amenityIds;

    private Long nearbyUniversityId;

    private String nearbyUniversityName;

    private Double distanceToUniversity;

    private Double nearestBusStation;

    private Boolean isPetFriendly;

    private Boolean isParkingAvailable;

    private String curfew;

    private String rules;
}
