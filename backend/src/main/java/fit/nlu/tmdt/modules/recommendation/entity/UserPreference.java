package fit.nlu.tmdt.modules.recommendation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * UserPreference Entity
 * Lưu sở thích và profile của người dùng để phục vụ recommendation
 */
@Entity
@Table(name = "user_preferences", indexes = {
        @Index(name = "idx_preference_user", columnList = "user_id", unique = true),
        @Index(name = "idx_preference_updated", columnList = "updated_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference extends BaseEntity {

    // ==========================================
    // USER
    // ==========================================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    // ==========================================
    // BUDGET PREFERENCES
    // ==========================================

    @Column(name = "min_budget")
    private Double minBudget;  // Giá tối thiểu (VNĐ)

    @Column(name = "max_budget")
    private Double maxBudget;  // Giá tối đa (VNĐ)

    // ==========================================
    // LOCATION PREFERENCES
    // ==========================================

    @Column(name = "preferred_province", length = 100)
    private String preferredProvince;

    @Column(name = "preferred_district", length = 100)
    private String preferredDistrict;

    @Column(name = "preferred_latitude")
    private Double preferredLatitude;

    @Column(name = "preferred_longitude")
    private Double preferredLongitude;

    @Column(name = "max_distance_km")
    @Builder.Default
    private Double maxDistanceKm = 10.0;  // Khoảng cách tối đa (km)

    // ==========================================
    // ROOM PREFERENCES
    // ==========================================

    @Column(name = "min_area")
    private Double minArea;  // Diện tích tối thiểu (m2)

    @Column(name = "max_area")
    private Double maxArea;  // Diện tích tối đa (m2)

    @Column(name = "preferred_floor_min")
    private Integer preferredFloorMin;

    @Column(name = "preferred_floor_max")
    private Integer preferredFloorMax;

    // ==========================================
    // AMENITY PREFERENCES
    // ==========================================

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_preferred_amenities", joinColumns = @JoinColumn(name = "user_preference_id"))
    @Column(name = "amenity_id")
    private java.util.List<Long> preferredAmenityIds;

    // ==========================================
    // LIFESTYLE PREFERENCES
    // ==========================================

    @Column(name = "has_pet")
    private Boolean hasPet;

    @Column(name = "needs_parking")
    private Boolean needsParking;

    @Column(name = "needs_curfew_free")
    private Boolean needsCurfewFree;

    // ==========================================
    // UNIVERSITY INFO (for students)
    // ==========================================

    @Column(name = "university_id")
    private Long universityId;

    @Column(name = "university_name", length = 255)
    private String universityName;

    @Column(name = "university_latitude")
    private Double universityLatitude;

    @Column(name = "university_longitude")
    private Double universityLongitude;

    // ==========================================
    // FEATURE VECTOR (for ML)
    // ==========================================

    @Column(name = "feature_vector", columnDefinition = "TEXT")
    private String featureVector;  // JSON array của features

    @Column(name = "last_calculated_at")
    private LocalDateTime lastCalculatedAt;

    // ==========================================
    // ANALYTICS
    // ==========================================

    @Column(name = "total_favorites")
    @Builder.Default
    private Integer totalFavorites = 0;

    @Column(name = "total_views")
    @Builder.Default
    private Integer totalViews = 0;

    @Column(name = "avg_session_duration_minutes")
    @Builder.Default
    private Integer avgSessionDurationMinutes = 0;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra có vị trí ưu tiên không
     */
    public boolean hasLocationPreference() {
        return preferredLatitude != null && preferredLongitude != null;
    }

    /**
     * Kiểm tra có budget preference không
     */
    public boolean hasBudgetPreference() {
        return minBudget != null || maxBudget != null;
    }

    /**
     * Kiểm tra có area preference không
     */
    public boolean hasAreaPreference() {
        return minArea != null || maxArea != null;
    }

    /**
     * Kiểm tra có amenity preferences không
     */
    public boolean hasAmenityPreference() {
        return preferredAmenityIds != null && !preferredAmenityIds.isEmpty();
    }

    /**
     * Tính score cho độ phù hợp (0.0 - 1.0)
     */
    public double calculateMatchScore(double price, double area, double distance) {
        double score = 0.0;
        int factors = 0;

        // Budget match (40%)
        if (hasBudgetPreference()) {
            if (price >= (minBudget != null ? minBudget : 0) && 
                price <= (maxBudget != null ? maxBudget : Double.MAX_VALUE)) {
                score += 0.4;
            }
            factors++;
        }

        // Area match (20%)
        if (hasAreaPreference()) {
            if (area >= (minArea != null ? minArea : 0) && 
                area <= (maxArea != null ? maxArea : Double.MAX_VALUE)) {
                score += 0.2;
            }
            factors++;
        }

        // Distance match (20%)
        if (hasLocationPreference() && distance != -1) {
            if (distance <= maxDistanceKm) {
                score += 0.2 * (1 - distance / maxDistanceKm);
            }
            factors++;
        }

        return factors > 0 ? score / factors : 0.5;
    }
}
