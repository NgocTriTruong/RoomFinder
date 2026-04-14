package fit.nlu.tmdt.modules.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Update Room Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoomRequest {

    private String address;

    private String roomNumber;

    private String province;

    private String district;

    private String ward;

    private Double latitude;

    private Double longitude;

    private Double area;

    private Integer floor;

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
