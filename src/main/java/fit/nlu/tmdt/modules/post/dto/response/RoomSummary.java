package fit.nlu.tmdt.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Room Summary - Lightweight room info for post listing
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomSummary {

    private Long id;
    private Double area;
    private Integer floor;
    private Integer maxOccupancy;
    private String direction;
    private String thumbnailUrl;
    private String address;
    private String district;
    private String province;
    private Double latitude;
    private Double longitude;
    private String nearbyUniversityName;
    private Double distanceToUniversity;
    private Boolean hasParking;
    private Boolean hasBalcony;
    private List<AmenitySimple> amenities;
}
