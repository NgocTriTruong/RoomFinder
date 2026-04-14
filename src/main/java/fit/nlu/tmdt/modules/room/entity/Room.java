package fit.nlu.tmdt.modules.room.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.room.entity.enums.RoomDirection;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Room Entity
 * Lưu thông tin phòng trọ
 */
@Entity
@Table(name = "rooms", indexes = {
        @Index(name = "idx_room_landlord", columnList = "landlord_id"),
        @Index(name = "idx_room_area", columnList = "area"),
        @Index(name = "idx_room_location", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room extends BaseEntity {

    // ==========================================
    // OWNER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    // ==========================================
    // BASIC INFO
    // ==========================================

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(name = "province", length = 100)
    private String province;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "ward", length = 100)
    private String ward;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // ==========================================
    // ROOM DETAILS
    // ==========================================

    @Column(nullable = false)
    private Double area;  // Diện tích (m2)

    @Column(nullable = false)
    private Integer floor;

    @Column(nullable = false)
    private Integer maxOccupancy;  // Số người tối đa

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RoomDirection direction;

    @Column(name = "has_windows")
    @Builder.Default
    private Boolean hasWindows = true;

    @Column(name = "has_balcony")
    @Builder.Default
    private Boolean hasBalcony = false;

    // ==========================================
    // UTILITY
    // ==========================================

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @ElementCollection
    @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "room_amenities",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private List<Amenity> amenities = new ArrayList<>();

    // ==========================================
    // NEARBY INFO
    // ==========================================

    @Column(name = "nearby_university_id")
    private Long nearbyUniversityId;

    @Column(name = "nearby_university_name", length = 255)
    private String nearbyUniversityName;

    @Column(name = "distance_to_university")  // Khoảng cách tính bằng km
    private Double distanceToUniversity;

    @Column(name = "nearest_bus_station")  // Khoảng cách đến bus gần nhất
    private Double nearestBusStation;

    // ==========================================
    // RULES
    // ==========================================

    @Column(name = "is_pet_friendly")
    @Builder.Default
    private Boolean isPetFriendly = false;

    @Column(name = "is_parking_available")
    @Builder.Default
    private Boolean isParkingAvailable = false;

    @Column(name = "curfew")  // Giờ giới ng curfew
    private String curfew;

    @Column(columnDefinition = "TEXT")
    private String rules;

    // ==========================================
    // STATS
    // ==========================================

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "favorite_count")
    @Builder.Default
    private Integer favoriteCount = 0;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Thêm tiện ích vào phòng
     */
    public void addAmenity(Amenity amenity) {
        if (!this.amenities.contains(amenity)) {
            this.amenities.add(amenity);
        }
    }

    /**
     * Xóa tiện ích khỏi phòng
     */
    public void removeAmenity(Amenity amenity) {
        this.amenities.remove(amenity);
    }

    /**
     * Tăng lượt xem
     */
    public void incrementViewCount() {
        this.viewCount = (this.viewCount == null ? 0 : this.viewCount) + 1;
    }

    /**
     * Tăng lượt yêu thích
     */
    public void incrementFavoriteCount() {
        this.favoriteCount = (this.favoriteCount == null ? 0 : this.favoriteCount) + 1;
    }

    /**
     * Giảm lượt yêu thích
     */
    public void decrementFavoriteCount() {
        if (this.favoriteCount != null && this.favoriteCount > 0) {
            this.favoriteCount--;
        }
    }

    /**
     * Lấy địa chỉ đầy đủ
     */
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (ward != null) sb.append(ward).append(", ");
        if (district != null) sb.append(district).append(", ");
        if (province != null) sb.append(province);
        return sb.toString();
    }
}
