package fit.nlu.tmdt.modules.payment.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {

    @NotNull(message = "Amount is required")
    @Min(value = 1000, message = "Minimum amount is 1000 VND")
    private Double amount;

    @NotBlank(message = "Order type is required")
    private String orderType;  // PACKAGE_PURCHASE, BOOST_PURCHASE, SUBSCRIPTION_RENEW

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;  // VNPAY, MOMO, ZALOPAY

    private String orderDescription;

    private Long packageId;

    private Long subscriptionId;

    private Long boostId;

    private Long postId;

    private String voucherCode;

    private String bankCode;
}
