package fit.nlu.tmdt.modules.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Email Service - Gửi email (mock implementation)
 * Thực tế nên sử dụng Spring Mail với SMTP server
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Async("emailExecutor")
    public void sendBookingConfirmationEmail(String to, String bookingDetails) {
        log.info("Sending booking confirmation email to: {}", to);
        // TODO: Implement
    }

    @Async("emailExecutor")
    public void sendPaymentSuccessEmail(String to, String transactionDetails) {
        log.info("Sending payment success email to: {}", to);
        // TODO: Implement
    }

    @Async("emailExecutor")
    public void sendSubscriptionExpiringEmail(String to, int daysRemaining) {
        log.info("Sending subscription expiring email to: {} ({} days remaining)", to, daysRemaining);
        // TODO: Implement
    }
}
