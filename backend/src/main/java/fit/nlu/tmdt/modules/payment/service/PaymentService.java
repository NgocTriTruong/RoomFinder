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
     * Lấy URL thanh toán VNPay cho transaction
     */
    String getPaymentUrl(Long transactionId, Long userId, HttpServletRequest servletRequest);

    /**
     * Xử lý IPN callback từ VNPay
     */
    void processVnpayIpn(HttpServletRequest request);

    /**
     * Xử lý return URL từ VNPay (sau khi user hoàn tất thanh toán)
     */
    PaymentResponse processVnpayReturn(HttpServletRequest request);

    /**
     * Lấy chi tiết transaction theo ID
     */
    PaymentResponse getTransaction(Long transactionId, Long userId);

    /**
     * Lấy lịch sử thanh toán của user
     */
    List<PaymentResponse> getPaymentHistory(Long userId);
}
