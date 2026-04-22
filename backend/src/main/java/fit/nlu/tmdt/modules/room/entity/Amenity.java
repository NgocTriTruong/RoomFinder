package fit.nlu.tmdt.modules.room.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Amenity Entity
 * Lưu thông tin tiện ích của phòng trọ
 */
@Entity
@Table(name = "amenities", indexes = {
        @Index(name = "idx_amenity_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String icon;  // Icon class (e.g., FontAwesome class)

    @Column(length = 255)
    private String image;  // Image URL for amenities

    @Column(length = 20)
    private String category;  // bathroom, bedroom, kitchen, security, etc.

    @Column
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    // Predefined categories
    public static final String CATEGORY_BATHROOM = "bathroom";
    public static final String CATEGORY_BEDROOM = "bedroom";
    public static final String CATEGORY_KITCHEN = "kitchen";
    public static final String CATEGORY_SECURITY = "security";
    public static final String CATEGORY_FURNITURE = "furniture";
    public static final String CATEGORY_OTHER = "other";

    // Common amenities for rooms
    public static Amenity wifi() {
        return Amenity.builder()
                .name("WiFi")
                .icon("fa-wifi")
                .category(CATEGORY_OTHER)
                .displayOrder(1)
                .build();
    }

    public static Amenity airConditioner() {
        return Amenity.builder()
                .name("Điều hòa")
                .icon("fa-snowflake")
                .category(CATEGORY_BEDROOM)
                .displayOrder(2)
                .build();
    }

    public static Amenity parking() {
        return Amenity.builder()
                .name("Chỗ để xe")
                .icon("fa-car")
                .category(CATEGORY_SECURITY)
                .displayOrder(3)
                .build();
    }

    public static Amenity waterHeater() {
        return Amenity.builder()
                .name("Nóng lạnh")
                .icon("fa-shower")
                .category(CATEGORY_BATHROOM)
                .displayOrder(4)
                .build();
    }

    public static Amenity security() {
        return Amenity.builder()
                .name("An ninh")
                .icon("fa-shield-alt")
                .category(CATEGORY_SECURITY)
                .displayOrder(5)
                .build();
    }
}
