package fit.nlu.tmdt.modules.voucher.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

/**
 * Apply Voucher Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyVoucherRequest {

    @NotBlank(message = "Voucher code is required")
    private String code;

    @NotNull(message = "Order amount is required")
    private Double orderAmount;

    private Long packageId;

    private String packageType;

    private List<Long> applicablePackageIds;
}