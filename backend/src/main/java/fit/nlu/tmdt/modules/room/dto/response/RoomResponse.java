package fit.nlu.tmdt.modules.room.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Room Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {

    private Long id;
    private String roomNumber;
    private String address;
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
    private String nearbyUniversityId;
    private String nearbyUniversityName;
    private Double distanceToUniversity;
    private Double nearestBusStation;
    private Boolean isPetFriendly;
    private Boolean isParkingAvailable;
    private String curfew;
    private String rules;
    private Integer viewCount;
    private Integer favoriteCount;
    private List<AmenityResponse> amenities;
    private LandlordSummary landlord;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AmenityResponse {
        private Long id;
        private String name;
        private String icon;
        private String category;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LandlordSummary {
        private Long id;
        private String fullName;
        private String avatar;
        private String phone;
    }
}
