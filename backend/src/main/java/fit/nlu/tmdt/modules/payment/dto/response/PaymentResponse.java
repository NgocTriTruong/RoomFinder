package fit.nlu.tmdt.modules.payment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;

    private String orderId;

    private String orderType;

    private String orderDescription;

    private Double amount;

    private Double originalAmount;

    private Double discountAmount;

    private String voucherCode;

    private String paymentMethod;

    private String paymentUrl;

    private String status;

    private String gatewayTransactionId;

    private String gatewayResponseCode;

    private String gatewayResponseMessage;

    private Long packageId;

    private Long postId;

    private Long boostId;

    private Long subscriptionId;

    private Double refundAmount;

    private String refundReason;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime paidAt;

    private LocalDateTime failedAt;

    private LocalDateTime refundedAt;

    private LocalDateTime expiresAt;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    private UserSummary user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
    }
}
