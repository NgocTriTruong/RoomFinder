package fit.nlu.tmdt.modules.payment.service;

import fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest;
import fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface PaymentService {

    /**
     * Tạo đơn hàng và transaction mới
     */
    PaymentResponse createOrder(Long userId, CreatePaymentRequest request);

    /**
     * Lấy URL phê duyệt thanh toán PayPal cho transaction.
     */
    String getPaymentUrl(Long transactionId, Long userId, HttpServletRequest servletRequest);

    /**
     * Xử lý callback return từ PayPal.
     */
    PaymentResponse processPayPalReturn(String paypalOrderId);

    /**
     * Xử lý khi người dùng hủy thanh toán PayPal.
     */
    PaymentResponse processPayPalCancel(String paypalOrderId);

    /**
     * Lấy chi tiết transaction theo ID
     */
    PaymentResponse getTransaction(Long transactionId, Long userId);

    /**
     * Lấy lịch sử thanh toán của user
     */
    List<PaymentResponse> getPaymentHistory(Long userId);
}
