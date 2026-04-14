package fit.nlu.tmdt.modules.voucher.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Voucher Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {

    private Long id;
    private String code;
    private String name;
    private String description;
    private String discountType;
    private Double discount;
    private Double maxDiscountAmount;
    private Double minOrderAmount;
    private Integer totalQuantity;
    private Integer remainingQuantity;
    private Integer maxPerUser;
    private LocalDateTime validFrom;
    private LocalDateTime expiresAt;
    private Boolean isActive;
    private Boolean isPublic;
    private Boolean isFeatured;
    private String applicableTypes;
}