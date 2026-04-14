package fit.nlu.tmdt.modules.subscription.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.subscription.entity.enums.PackageType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Package Entity
 * Lưu thông tin gói dịch vụ
 */
@Entity
@Table(name = "packages", indexes = {
        @Index(name = "idx_package_type", columnList = "type"),
        @Index(name = "idx_package_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Package extends BaseEntity {

    // ==========================================
    // BASIC INFO
    // ==========================================

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PackageType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ==========================================
    // QUANTITY & DURATION
    // ==========================================

    @Column(name = "max_posts")
    private Integer maxPosts;  // Số lượng tin đăng (null = unlimited)

    @Column(name = "duration_days")
    private Integer durationDays;  // Thời hạn gói

    @Column(name = "boost_days")  // Số ngày boost (cho gói boost)
    private Integer boostDays;

    // ==========================================
    // PRICING
    // ==========================================

    @Column(nullable = false)
    private Double price;

    @Column(name = "original_price")
    private Double originalPrice;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    // ==========================================
    // FEATURES
    // ==========================================

    @ElementCollection
    @CollectionTable(name = "package_features", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "feature", length = 255)
    @Builder.Default
    private List<String> features = new ArrayList<>();

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    // ==========================================
    // VALIDITY
    // ==========================================

    @Column(name = "valid_from")
    private java.time.LocalDateTime validFrom;

    @Column(name = "valid_to")
    private java.time.LocalDateTime validTo;

    // ==========================================
    // LIMITS
    // ==========================================

    @Column(name = "max_purchase_per_user")
    @Builder.Default
    private Integer maxPurchasePerUser = 0;  // 0 = unlimited

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra gói có đang active không
     */
    public boolean isActive() {
        if (!Boolean.TRUE.equals(isActive)) {
            return false;
        }

        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        if (validFrom != null && now.isBefore(validFrom)) {
            return false;
        }

        if (validTo != null && now.isAfter(validTo)) {
            return false;
        }

        return true;
    }

    /**
     * Kiểm tra có phải gói boost không
     */
    public boolean isBoostPackage() {
        return type != null && type.isBoostPackage();
    }

    /**
     * Kiểm tra có phải gói đăng tin không
     */
    public boolean isPostPackage() {
        return type != null && type.isPostPackage();
    }

    /**
     * Kiểm tra có đang giảm giá không
     */
    public boolean hasDiscount() {
        return discountPercent != null && discountPercent > 0;
    }

    /**
     * Tính giá sau giảm
     */
    public Double getDiscountedPrice() {
        if (!hasDiscount()) {
            return price;
        }
        return price * (100 - discountPercent) / 100;
    }

    /**
     * Kiểm tra còn hiệu lực không
     */
    public boolean isValid() {
        return isActive() && isValidNow();
    }

    /**
     * Kiểm tra thời gian hiện tại có trong khoảng valid không
     */
    public boolean isValidNow() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        if (validFrom != null && now.isBefore(validFrom)) {
            return false;
        }

        if (validTo != null && now.isAfter(validTo)) {
            return false;
        }

        return true;
    }
}
