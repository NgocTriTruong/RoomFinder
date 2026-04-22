package fit.nlu.tmdt.modules.payment.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest;
import fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse;
import fit.nlu.tmdt.modules.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Payment Controller
 */
@RestController
@RequestMapping("/v1/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment", description = "Payment APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @Operation(summary = "Create payment order")
    @PreAuthorize("isAuthenticated()")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PaymentResponse>> createOrder(
            @Valid @RequestBody CreatePaymentRequest request,
            @CurrentUser Long userId) {

        log.info("Create payment order request from user: {}, orderType: {}", userId, request.getOrderType());
        PaymentResponse response = paymentService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Payment order created successfully", response));
    }

    @GetMapping("/{transactionId}/url")
    @Operation(summary = "Get PayPal approval URL for a transaction")
    @PreAuthorize("isAuthenticated()")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<String>> getPaymentUrl(
            @Parameter(description = "Transaction ID") @PathVariable Long transactionId,
            @CurrentUser Long userId,
            HttpServletRequest servletRequest) {

        log.info("Get payment URL for transaction: {}, user: {}", transactionId, userId);
        String paymentUrl = paymentService.getPaymentUrl(transactionId, userId, servletRequest);
        return ResponseEntity.ok(ApiResponse.success("Payment URL generated", paymentUrl));
    }

    @GetMapping("/paypal/return")
    @Operation(summary = "PayPal return URL after payment completion")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PaymentResponse>> paypalReturn(
            @RequestParam("token") String paypalOrderId) {
        log.info("Received PayPal return callback for order: {}", paypalOrderId);
        PaymentResponse response = paymentService.processPayPalReturn(paypalOrderId);
        return ResponseEntity.ok(ApiResponse.success("Payment processed", response));
    }

    @GetMapping("/paypal/cancel")
    @Operation(summary = "PayPal cancel URL")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PaymentResponse>> paypalCancel(
            @RequestParam(value = "token", required = false) String paypalOrderId) {
        log.info("Received PayPal cancel callback for order: {}", paypalOrderId);
        PaymentResponse response = paymentService.processPayPalCancel(paypalOrderId);
        return ResponseEntity.ok(ApiResponse.success("Payment cancelled", response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get payment history of current user")
    @PreAuthorize("isAuthenticated()")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentHistory(
            @CurrentUser Long userId) {

        List<PaymentResponse> history = paymentService.getPaymentHistory(userId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction detail by ID")
    @PreAuthorize("isAuthenticated()")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PaymentResponse>> getTransaction(
            @Parameter(description = "Transaction ID") @PathVariable Long id,
            @CurrentUser Long userId) {

        PaymentResponse response = paymentService.getTransaction(id, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
