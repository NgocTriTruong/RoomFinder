package fit.nlu.tmdt.modules.voucher.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Voucher Validation Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherValidationResponse {

    private Boolean isValid;
    private String code;
    private String name;
    private String discountType;
    private Double discount;
    private Double maxDiscountAmount;
    private Double originalAmount;
    private Double discountedAmount;
    private String message;
    private LocalDateTime expiresAt;
    private Boolean isPercentage;
}