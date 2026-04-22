package fit.nlu.tmdt.modules.subscription.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Purchase Package Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchasePackageRequest {

    @NotNull(message = "Package ID is required")
    private Long packageId;

    private String voucherCode;

    private String paymentMethod;
}
