package fit.nlu.tmdt.modules.payment.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.payment.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Transaction Entity
 * Lưu thông tin giao dịch thanh toán
 */
@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_transaction_user", columnList = "user_id"),
        @Index(name = "idx_transaction_status", columnList = "status"),
        @Index(name = "idx_transaction_created", columnList = "created_at"),
        @Index(name = "idx_transaction_order_id", columnList = "order_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction extends BaseEntity {

    // ==========================================
    // USER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // ORDER INFO
    // ==========================================

    @Column(name = "order_id", nullable = false, unique = true, length = 50)
    private String orderId;

    @Column(name = "order_type", nullable = false, length = 50)
    private String orderType;  // PACKAGE_PURCHASE, BOOST_PURCHASE, SUBSCRIPTION_RENEW

    @Column(name = "order_description", length = 255)
    private String orderDescription;

    // ==========================================
    // AMOUNT
    // ==========================================

    @Column(nullable = false)
    private Double amount;

    @Column(name = "original_amount")
    private Double originalAmount;

    @Column(name = "discount_amount")
    @Builder.Default
    private Double discountAmount = 0.0;

    @Column(name = "voucher_code", length = 20)
    private String voucherCode;

    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;  // PAYPAL, MOMO, ZALOPAY

    // ==========================================
    // PAYMENT GATEWAY INFO
    // ==========================================

    @Column(name = "payment_url", length = 500)
    private String paymentUrl;

    @Column(name = "gateway_transaction_id", length = 100)
    private String gatewayTransactionId;

    @Column(name = "gateway_response_code", length = 20)
    private String gatewayResponseCode;

    @Column(name = "gateway_response_message", length = 255)
    private String gatewayResponseMessage;

    // ==========================================
    // STATUS
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "failed_at")
    private LocalDateTime failedAt;

    @Column(name = "failed_reason", length = 255)
    private String failedReason;

    // ==========================================
    // TIMEOUT
    // ==========================================

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    // ==========================================
    // REFERENCE
    // ==========================================

    @Column(name = "package_id")
    private Long packageId;

    @Column(name = "subscription_id")
    private Long subscriptionId;

    @Column(name = "boost_id")
    private Long boostId;

    @Column(name = "post_id")
    private Long postId;

    // ==========================================
    // REFUND
    // ==========================================

    @Column(name = "refund_amount")
    private Double refundAmount;

    @Column(name = "refund_reason", length = 255)
    private String refundReason;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @Column(name = "refunded_by")
    private Long refundedBy;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra transaction đang chờ thanh toán
     */
    public boolean isPending() {
        return status == PaymentStatus.PENDING;
    }

    /**
     * Kiểm tra transaction đã thanh toán thành công
     */
    public boolean isSuccess() {
        return status == PaymentStatus.SUCCESS;
    }

    /**
     * Kiểm tra transaction đã hết hạn chưa
     */
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    /**
     * Kiểm tra có thể thanh toán không
     */
    public boolean canPay() {
        return isPending() && !isExpired();
    }

    /**
     * Đánh dấu đang xử lý
     */
    public void markProcessing() {
        this.status = PaymentStatus.PROCESSING;
    }

    /**
     * Đánh dấu thanh toán thành công
     */
    public void markSuccess(String gatewayTxnId) {
        this.status = PaymentStatus.SUCCESS;
        this.paidAt = LocalDateTime.now();
        this.gatewayTransactionId = gatewayTxnId;
    }

    /**
     * Đánh dấu thanh toán thất bại
     */
    public void markFailed(String reason) {
        this.status = PaymentStatus.FAILED;
        this.failedAt = LocalDateTime.now();
        this.failedReason = reason;
    }

    /**
     * Đánh dấu đã hoàn tiền
     */
    public void markRefunded(double amount, String reason, Long adminId) {
        this.status = PaymentStatus.REFUNDED;
        this.refundAmount = amount;
        this.refundReason = reason;
        this.refundedAt = LocalDateTime.now();
        this.refundedBy = adminId;
    }

    /**
     * Tạo order ID
     */
    public static String generateOrderId() {
        return "ORD-" + java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
        ) + "-" + String.format("%04d", (int) (Math.random() * 10000));
    }

    /**
     * Tính thời gian timeout (15 phút)
     */
    public static LocalDateTime calculateExpiry() {
        return LocalDateTime.now().plusMinutes(15);
    }
}
