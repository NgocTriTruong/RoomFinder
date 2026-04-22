package fit.nlu.tmdt.modules.payment.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Payment entity for persisted gateway responses.
 */
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_transaction", columnList = "transaction_id"),
        @Index(name = "idx_payment_external_order_id", columnList = "external_order_id"),
        @Index(name = "idx_payment_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    // ==========================================
    // TRANSACTION
    // ==========================================

    @Column(name = "transaction_id", nullable = false)
    private Long transactionId;

    // ==========================================
    // GATEWAY RESPONSE FIELDS
    // ==========================================

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "external_order_id", length = 100)
    private String externalOrderId;

    @Column(name = "external_transaction_id", length = 100)
    private String externalTransactionId;

    @Column(name = "payer_id", length = 100)
    private String payerId;

    @Column(name = "payer_email", length = 255)
    private String payerEmail;

    @Column(name = "gateway_order_info", length = 255)
    private String gatewayOrderInfo;

    @Column(name = "response_code", length = 20)
    private String responseCode;

    @Column(name = "transaction_status", length = 30)
    private String transactionStatus;

    @Column(name = "response_message", length = 255)
    private String responseMessage;

    // ==========================================
    // AMOUNT
    // ==========================================

    @Column(name = "amount")
    private Double amount;

    @Column(name = "currency", length = 10)
    private String currency;

    // ==========================================
    // ADDITIONAL INFO
    // ==========================================

    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;

    // ==========================================
    // STATUS
    // ==========================================

    @Column(name = "is_processed")
    @Builder.Default
    private Boolean isProcessed = false;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "processed_by")
    private Long processedBy;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra payment đã được xử lý chưa
     */
    public boolean isProcessed() {
        return Boolean.TRUE.equals(isProcessed);
    }

    /**
     * Kiểm tra payment thành công
     */
    public boolean isSuccess() {
        return "COMPLETED".equalsIgnoreCase(transactionStatus);
    }

    /**
     * Kiểm tra payment thất bại
     */
    public boolean isFailed() {
        return transactionStatus != null
                && !"COMPLETED".equalsIgnoreCase(transactionStatus);
    }

    /**
     * Đánh dấu đã xử lý
     */
    public void markProcessed(Long processedById) {
        this.isProcessed = true;
        this.processedAt = LocalDateTime.now();
        this.processedBy = processedById;
    }

}
