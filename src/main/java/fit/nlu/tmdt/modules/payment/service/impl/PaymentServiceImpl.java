package fit.nlu.tmdt.modules.payment.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest;
import fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse;
import fit.nlu.tmdt.modules.payment.entity.Payment;
import fit.nlu.tmdt.modules.payment.entity.Transaction;
import fit.nlu.tmdt.modules.payment.gateway.PayPalGateway;
import fit.nlu.tmdt.modules.payment.gateway.PayPalGateway.PayPalCaptureResponse;
import fit.nlu.tmdt.modules.payment.gateway.PayPalGateway.PayPalOrderResponse;
import fit.nlu.tmdt.modules.payment.repository.PaymentRepository;
import fit.nlu.tmdt.modules.payment.repository.TransactionRepository;
import fit.nlu.tmdt.modules.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private static final String PAYPAL = "PAYPAL";

    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final PayPalGateway payPalGateway;

    @Override
    @Transactional
    public PaymentResponse createOrder(Long userId, CreatePaymentRequest request) {
        log.info("Creating PayPal payment order for user: {}, orderType: {}", userId, request.getOrderType());

        User user = findUserById(userId);
        Double originalAmount = request.getAmount();
        Double discountAmount = 0.0;
        Double finalAmount = originalAmount - discountAmount;

        Transaction transaction = Transaction.builder()
                .user(user)
                .orderId(Transaction.generateOrderId())
                .orderType(request.getOrderType())
                .orderDescription(buildOrderDescription(request))
                .amount(finalAmount)
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .voucherCode(request.getVoucherCode())
                .paymentMethod(PAYPAL)
                .packageId(request.getPackageId())
                .postId(request.getPostId())
                .boostId(request.getBoostId())
                .expiresAt(Transaction.calculateExpiry())
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToPaymentResponse(transaction);
    }

    @Override
    @Transactional
    public String getPaymentUrl(Long transactionId, Long userId, HttpServletRequest servletRequest) {
        log.info("Generating PayPal approval URL for transaction: {}, user: {}", transactionId, userId);

        Transaction transaction = findTransactionById(transactionId);
        validateTransactionOwner(transaction, userId);

        if (!transaction.canPay()) {
            if (transaction.isExpired()) {
                throw new BusinessException(ErrorCode.PAY_003.getCode(), ErrorCode.PAY_003.getMessage());
            }
            throw new BusinessException(ErrorCode.PAY_007.getCode(), ErrorCode.PAY_007.getMessage());
        }

        PayPalOrderResponse order = payPalGateway.createOrder(
                transaction.getOrderId(),
                transaction.getAmount(),
                transaction.getOrderDescription()
        );

        if (order.getApprovalUrl() == null || order.getApprovalUrl().isBlank()) {
            throw new BusinessException(ErrorCode.PAY_001.getCode(), "PayPal approval URL was not returned");
        }

        transaction.setGatewayTransactionId(order.getPaypalOrderId());
        transaction.setGatewayResponseCode(order.getStatus());
        transaction.setGatewayResponseMessage("PayPal order created");
        transaction.setPaymentUrl(order.getApprovalUrl());
        transactionRepository.save(transaction);

        return order.getApprovalUrl();
    }

    @Override
    @Transactional
    public PaymentResponse processPayPalReturn(String paypalOrderId) {
        log.info("Processing PayPal return for order: {}", paypalOrderId);

        Transaction transaction = findTransactionByGatewayOrderId(paypalOrderId);
        if (paymentRepository.existsByExternalOrderIdAndIsProcessedTrue(paypalOrderId)) {
            return mapToPaymentResponse(transaction);
        }

        PayPalCaptureResponse capture = payPalGateway.captureOrder(paypalOrderId);
        validateCapturedAmount(transaction, capture.getAmount());

        Payment payment = Payment.builder()
                .transactionId(transaction.getId())
                .provider(PAYPAL)
                .externalOrderId(capture.getPaypalOrderId())
                .externalTransactionId(capture.getCaptureId())
                .payerId(capture.getPayerId())
                .payerEmail(capture.getPayerEmail())
                .gatewayOrderInfo(transaction.getOrderDescription())
                .responseCode(capture.getResponseCode())
                .transactionStatus(capture.getStatus())
                .responseMessage(capture.getResponseMessage())
                .amount(capture.getAmount())
                .currency(capture.getCurrency())
                .rawResponse("PayPal capture completed")
                .build();
        payment.markProcessed(null);
        paymentRepository.save(payment);

        if ("COMPLETED".equalsIgnoreCase(capture.getStatus())) {
            transaction.markSuccess(capture.getCaptureId());
            transaction.setGatewayResponseCode(capture.getResponseCode());
            transaction.setGatewayResponseMessage("PayPal payment completed");
        } else {
            transaction.markFailed("PayPal status: " + capture.getStatus());
            transaction.setGatewayResponseCode(capture.getResponseCode());
            transaction.setGatewayResponseMessage(capture.getResponseMessage());
        }

        transactionRepository.save(transaction);
        return mapToPaymentResponse(transaction);
    }

    @Override
    @Transactional
    public PaymentResponse processPayPalCancel(String paypalOrderId) {
        if (paypalOrderId == null || paypalOrderId.isBlank()) {
            throw new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage());
        }

        Transaction transaction = findTransactionByGatewayOrderId(paypalOrderId);
        if (transaction.isPending()) {
            transaction.markFailed("Payment cancelled by user");
            transaction.setGatewayResponseCode("CANCELLED");
            transaction.setGatewayResponseMessage("PayPal payment cancelled");
            transactionRepository.save(transaction);
        }
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

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001.getCode(), ErrorCode.USER_001.getMessage()));
    }

    private Transaction findTransactionById(Long transactionId) {
        return transactionRepository.findByIdAndDeletedAtIsNull(transactionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage()));
    }

    private Transaction findTransactionByGatewayOrderId(String paypalOrderId) {
        return transactionRepository.findByGatewayTransactionIdAndDeletedAtIsNull(paypalOrderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage()));
    }

    private void validateTransactionOwner(Transaction transaction, Long userId) {
        if (!transaction.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PAY_002.getCode(), ErrorCode.PAY_002.getMessage());
        }
    }

    private void validateCapturedAmount(Transaction transaction, Double capturedAmount) {
        if (capturedAmount == null) {
            throw new BusinessException(ErrorCode.PAY_004.getCode(), ErrorCode.PAY_004.getMessage());
        }
        double delta = Math.abs(transaction.getAmount() - capturedAmount);
        if (delta > 0.01d) {
            throw new BusinessException(ErrorCode.PAY_004.getCode(), ErrorCode.PAY_004.getMessage());
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
