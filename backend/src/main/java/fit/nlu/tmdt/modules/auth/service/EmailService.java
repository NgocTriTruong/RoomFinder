package fit.nlu.tmdt.modules.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

/**
 * Email Service - Xử lý gửi email thông báo và OTP
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async("emailExecutor")
    public void sendOtpEmail(String to, String otp) {
        log.info("Bắt đầu gửi OTP đến: {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            String htmlContent = "<html>" +
                    "<body style='font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px;'>" +
                    "  <div style='max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                    "    <h2 style='color: #1e40af; text-align: center;'>Xác thực tài khoản RoomFinder</h2>" +
                    "    <p style='color: #4b5563; font-size: 16px;'>Xin chào bạn,</p>" +
                    "    <p style='color: #4b5563; font-size: 16px;'>Bạn vừa thực hiện đăng ký tài khoản. Vui lòng sử dụng mã OTP dưới đây để hoàn tất xác minh email:</p>" +
                    "    <div style='background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;'>" +
                    "      <span style='font-size: 32px; font-weight: bold; color: #1d4ed8; letter-spacing: 5px;'>" + otp + "</span>" +
                    "    </div>" +
                    "    <p style='color: #6b7280; font-size: 14px;'>Mã xác minh này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>" +
                    "    <hr style='border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;'/>" +
                    "    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>Đội ngũ hỗ trợ RoomFinder</p>" +
                    "  </div>" +
                    "</body>" +
                    "</html>";

            helper.setTo(to);
            helper.setFrom(fromEmail, "RoomFinder Verification");
            helper.setSubject("[" + otp + "] Mã xác thực tài khoản RoomFinder");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Gửi OTP thành công đến: {}", to);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Lỗi nghiêm trọng khi gửi email OTP đến {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi không xác định khi gửi email đến {}: {}", to, e.getMessage());
        }
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
