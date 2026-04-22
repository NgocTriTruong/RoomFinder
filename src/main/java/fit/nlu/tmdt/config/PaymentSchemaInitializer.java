package fit.nlu.tmdt.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Keeps the payment URL column large enough for VNPay checkout links.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class PaymentSchemaInitializer {

    private final JdbcTemplate jdbcTemplate;

    @Bean
    ApplicationRunner ensurePaymentUrlColumnLength() {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE transactions ALTER COLUMN payment_url TYPE VARCHAR(2000)");
            } catch (Exception exception) {
                log.warn("Skipping payment_url schema adjustment: {}", exception.getMessage());
            }
        };
    }
}
