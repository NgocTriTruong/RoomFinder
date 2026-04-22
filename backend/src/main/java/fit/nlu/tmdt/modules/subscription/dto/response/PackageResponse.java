package fit.nlu.tmdt.modules.subscription.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Package Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageResponse {

    private Long id;
    private String name;
    private String type;
    private String typeDisplayName;
    private String description;

    // Quantity & Duration
    private Integer maxPosts;
    private Integer durationDays;
    private Integer boostDays;

    // Pricing
    private Double price;
    private Double originalPrice;
    private Integer discountPercent;
    private Double discountedPrice;
    private Boolean hasDiscount;

    // Features
    private List<String> features;

    // Status
    private Boolean isActive;
    private Boolean isFeatured;
    private Integer displayOrder;

    // Validity
    private LocalDateTime validFrom;
    private LocalDateTime validTo;

    // Limits
    private Integer maxPurchasePerUser;
}
