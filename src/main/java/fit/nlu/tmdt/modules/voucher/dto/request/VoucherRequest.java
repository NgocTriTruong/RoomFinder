package fit.nlu.tmdt.modules.voucher.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Request DTO for creating/updating vouchers
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {
    private String code;
    private String name;
    private String description;
    private String discountType; // PERCENTAGE, FIXED_AMOUNT
    private Double discount;
    private Double maxDiscountAmount;
    private Double minOrderAmount;
    private Integer totalQuantity;
    private Integer maxPerUser;
    private LocalDateTime validFrom;
    private LocalDateTime expiresAt;
    private Boolean isActive;
    private Boolean isPublic;
    private Boolean isFeatured;
    private String applicableTypes;
    private Set<Long> applicablePackageIds;
}
