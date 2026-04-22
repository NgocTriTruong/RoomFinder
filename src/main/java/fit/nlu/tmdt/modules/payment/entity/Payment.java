package fit.nlu.tmdt.modules.payment.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Payment Entity (VNPay Response)
 * Luu thong tin phan hoi tu VNPay
 */
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_transaction", columnList = "transaction_id"),
        @Index(name = "idx_payment_vnp_txnref", columnList = "vnp_txn_ref"),
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
    // VNPAY RESPONSE FIELDS
    // ==========================================

    @Column(name = "vnp_txn_ref", length = 100)
    private String vnpTxnRef;

    @Column(name = "vnp_transaction_no", length = 100)
    private String vnpTransactionNo;

    @Column(name = "vnp_order_info", length = 255)
    private String vnpOrderInfo;

    @Column(name = "vnp_response_code", length = 10)
    private String vnpResponseCode;

    @Column(name = "vnp_transaction_status", length = 10)
    private String vnpTransactionStatus;

    @Column(name = "vnp_bank_code", length = 20)
    private String vnpBankCode;

    @Column(name = "vnp_bank_tran_no", length = 100)
    private String vnpBankTranNo;

    @Column(name = "vnp_card_type", length = 20)
    private String vnpCardType;

    @Column(name = "vnp_pay_date", length = 20)
    private String vnpPayDate;

    // ==========================================
    // AMOUNT
    // ==========================================

    @Column(name = "vnp_amount", precision = 20)
    private Long vnpAmount;

    @Column(name = "vnp_fee", precision = 20)
    private Long vnpFee;

    // ==========================================
    // ADDITIONAL INFO
    // ==========================================

    @Column(name = "vnp_secure_hash", length = 255)
    private String vnpSecureHash;

    @Column(name = "vnp_secure_hash_type", length = 20)
    private String vnpSecureHashType;

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
        return "00".equals(vnpTransactionStatus);
    }

    /**
     * Kiểm tra payment thất bại
     */
    public boolean isFailed() {
        return vnpTransactionStatus != null && !vnpTransactionStatus.equals("00");
    }

    /**
     * Đánh dấu đã xử lý
     */
    public void markProcessed(Long processedById) {
        this.isProcessed = true;
        this.processedAt = LocalDateTime.now();
        this.processedBy = processedById;
    }

    public Double getAmountAsDouble() {
        if (vnpAmount == null) {
            return 0.0;
        }
        return vnpAmount / 100.0;
    }

    public Double getFeeAsDouble() {
        if (vnpFee == null) {
            return 0.0;
        }
        return vnpFee / 100.0;
    }

    public LocalDateTime getPayDateAsDateTime() {
        if (vnpPayDate == null || vnpPayDate.length() != 14) {
            return null;
        }
        try {
            return LocalDateTime.parse(
                    vnpPayDate,
                    java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
            );
        } catch (Exception e) {
            return null;
        }
    }
}
