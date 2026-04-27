package fit.nlu.tmdt.modules.payment.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest;
import fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse;
import fit.nlu.tmdt.modules.payment.entity.Payment;
import fit.nlu.tmdt.modules.payment.entity.Transaction;
import fit.nlu.tmdt.modules.payment.gateway.VNPayGateway;
import fit.nlu.tmdt.modules.payment.repository.PaymentRepository;
import fit.nlu.tmdt.modules.payment.repository.TransactionRepository;
import fit.nlu.tmdt.modules.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final VNPayGateway vnPayGateway;

    @Override
    @Transactional
    public PaymentResponse createOrder(Long userId, CreatePaymentRequest request) {
        log.info("Creating payment order for user: {}, orderType: {}", userId, request.getOrderType());

        User user = findUserById(userId);

        Double originalAmount = request.getAmount();
        Double discountAmount = 0.0;
        Double finalAmount = originalAmount - discountAmount;

        String orderId = Transaction.generateOrderId();

        Transaction transaction = Transaction.builder()
                .user(user)
                .orderId(orderId)
                .orderType(request.getOrderType())
                .orderDescription(buildOrderDescription(request))
                .amount(finalAmount)
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .voucherCode(request.getVoucherCode())
                .paymentMethod(request.getPaymentMethod())
                .packageId(request.getPackageId())
                .postId(request.getPostId())
                .boostId(request.getBoostId())
                .expiresAt(Transaction.calculateExpiry())
                .build();

        transaction = transactionRepository.save(transaction);
        log.info("Transaction created: {}", transaction.getOrderId());

        return mapToPaymentResponse(transaction);
    }

    @Override
    @Transactional
    public String getPaymentUrl(Long transactionId, Long userId, HttpServletRequest servletRequest) {
        log.info("Getting payment URL for transaction: {}, user: {}", transactionId, userId);

        Transaction transaction = findTransactionById(transactionId);
        validateTransactionOwner(transaction, userId);

        if (!transaction.canPay()) {
            if (transaction.isExpired()) {
                throw new BusinessException(ErrorCode.PAY_003.getCode(), ErrorCode.PAY_003.getMessage());
            }
            throw new BusinessException(ErrorCode.PAY_007.getCode(), ErrorCode.PAY_007.getMessage());
        }

        String ipAddr = vnPayGateway.getClientIp(servletRequest);
        String orderInfo = transaction.getOrderDescription() != null
                ? transaction.getOrderDescription()
                : "Thanh toan don hang " + transaction.getOrderId();

        String paymentUrl = vnPayGateway.buildPaymentUrl(
                transaction.getOrderId(),
                transaction.getAmount(),
                orderInfo,
                null,
                ipAddr
        );

        transaction.setPaymentUrl(paymentUrl);
        transactionRepository.save(transaction);

        return paymentUrl;
    }

    @Override
    @Transactional
    public void processVnpayIpn(HttpServletRequest request) {
        Map<String, String> params = vnPayGateway.extractParams(request);
        processGatewayCallback(params, true);
    }

    @Override
    @Transactional
    public PaymentResponse processVnpayReturn(HttpServletRequest request) {
        Map<String, String> params = vnPayGateway.extractParams(request);
        String orderId = params.get("vnp_TxnRef");

        log.info("Processing VNPay return for order: {}", orderId);

        if (!vnPayGateway.verifySignature(params)) {
            log.error("Invalid VNPay signature on return for order: {}", orderId);
            throw new BusinessException(ErrorCode.PAY_005.getCode(), ErrorCode.PAY_005.getMessage());
        }

        Transaction transaction = processGatewayCallback(params, false);
        return mapToPaymentResponse(transaction);
    }

    @Override
    public PaymentResponse getTransaction(Long transactionId, Long userId) {
        Transaction transaction = findTransactionById(transactionId);
        validateTransactionOwner(transaction, userId);
        return mapToPaymentResponse(transaction);
    }

    @Override
    public List<PaymentResponse> getPaymentHistory(Long userId) {
        findUserById(userId);
        return transactionRepository.findPaymentHistoryByUser(userId)
                .stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .sorted(java.util.Comparator.comparing(Transaction::getCreatedAt, java.util.Comparator.nullsLast(java.util.Comparator.reverseOrder())))
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001.getCode(), ErrorCode.USER_001.getMessage()));
    }

    private Transaction findTransactionById(Long transactionId) {
        return transactionRepository.findByIdAndDeletedAtIsNull(transactionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage()));
    }

    private void validateTransactionOwner(Transaction transaction, Long userId) {
        if (!transaction.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage());
        }
    }

    private String buildOrderDescription(CreatePaymentRequest request) {
        if (request.getOrderDescription() != null && !request.getOrderDescription().isBlank()) {
            return request.getOrderDescription();
        }
        return switch (request.getOrderType()) {
            case "PACKAGE_PURCHASE" -> "Mua goi dang tin";
            case "BOOST_PURCHASE" -> "Mua luot day tin";
            case "SUBSCRIPTION_RENEW" -> "Gia han goi dang ky";
            default -> "Thanh toan don hang";
        };
    }

    private Transaction processGatewayCallback(Map<String, String> params, boolean fromIpn) {
        String orderId = params.get("vnp_TxnRef");
        String vnpTxnRef = params.get("vnp_TxnRef");

        if (!vnPayGateway.verifySignature(params)) {
            throw new BusinessException(ErrorCode.PAY_005.getCode(), ErrorCode.PAY_005.getMessage());
        }

        Transaction transaction = transactionRepository.findByOrderIdAndDeletedAtIsNull(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage()));

        if (paymentRepository.existsByVnpTxnRefAndIsProcessedTrue(vnpTxnRef)) {
            log.info("VNPay callback already processed for txnRef: {} ({})", vnpTxnRef, fromIpn ? "ipn" : "return");
            return transaction;
        }

        Long vnpAmount = Long.parseLong(params.getOrDefault("vnp_Amount", "0"));
        Long expectedAmount = (long) (transaction.getAmount() * 100);
        if (!vnpAmount.equals(expectedAmount)) {
            log.error("Amount mismatch for order: {}. Expected: {}, Got: {}", orderId, expectedAmount, vnpAmount);
            throw new BusinessException(ErrorCode.PAY_004.getCode(), ErrorCode.PAY_004.getMessage());
        }

        Payment payment = Payment.builder()
                .transactionId(transaction.getId())
                .vnpTxnRef(vnpTxnRef)
                .vnpTransactionNo(params.get("vnp_TransactionNo"))
                .vnpOrderInfo(params.get("vnp_OrderInfo"))
                .vnpResponseCode(params.get("vnp_ResponseCode"))
                .vnpTransactionStatus(params.get("vnp_TransactionStatus"))
                .vnpBankCode(params.get("vnp_BankCode"))
                .vnpBankTranNo(params.get("vnp_BankTranNo"))
                .vnpCardType(params.get("vnp_CardType"))
                .vnpPayDate(params.get("vnp_PayDate"))
                .vnpAmount(vnpAmount)
                .vnpFee(parseLongOrNull(params.get("vnp_TransactionFee")))
                .vnpSecureHash(params.get("vnp_SecureHash"))
                .vnpSecureHashType(params.get("vnp_SecureHashType"))
                .build();
        payment.markProcessed(null);
        paymentRepository.save(payment);

        if (vnPayGateway.isSuccess(params)) {
            transaction.markSuccess(params.get("vnp_TransactionNo"));
            transaction.setGatewayResponseCode(params.get("vnp_ResponseCode"));
            transaction.setGatewayResponseMessage("Payment successful");
        } else {
            String responseCode = params.getOrDefault("vnp_ResponseCode", "99");
            transaction.markFailed("VNPay response code: " + responseCode);
            transaction.setGatewayResponseCode(responseCode);
            transaction.setGatewayResponseMessage("Payment failed");
        }

        return transactionRepository.save(transaction);
    }

    private Long parseLongOrNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private PaymentResponse mapToPaymentResponse(Transaction transaction) {
        User user = transaction.getUser();

        PaymentResponse.UserSummary userSummary = PaymentResponse.UserSummary.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();

        return PaymentResponse.builder()
                .id(transaction.getId())
                .orderId(transaction.getOrderId())
                .orderType(transaction.getOrderType())
                .orderDescription(transaction.getOrderDescription())
                .amount(transaction.getAmount())
                .originalAmount(transaction.getOriginalAmount())
                .discountAmount(transaction.getDiscountAmount())
                .voucherCode(transaction.getVoucherCode())
                .paymentMethod(transaction.getPaymentMethod())
                .paymentUrl(transaction.getPaymentUrl())
                .status(transaction.getStatus().name())
                .gatewayTransactionId(transaction.getGatewayTransactionId())
                .gatewayResponseCode(transaction.getGatewayResponseCode())
                .gatewayResponseMessage(transaction.getGatewayResponseMessage())
                .packageId(transaction.getPackageId())
                .postId(transaction.getPostId())
                .boostId(transaction.getBoostId())
                .subscriptionId(transaction.getSubscriptionId())
                .refundAmount(transaction.getRefundAmount())
                .refundReason(transaction.getRefundReason())
                .paidAt(transaction.getPaidAt())
                .failedAt(transaction.getFailedAt())
                .refundedAt(transaction.getRefundedAt())
                .expiresAt(transaction.getExpiresAt())
                .createdAt(transaction.getCreatedAt())
                .user(userSummary)
                .build();
    }
}
