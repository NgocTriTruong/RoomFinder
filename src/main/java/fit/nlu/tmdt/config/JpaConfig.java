package fit.nlu.tmdt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * JPA Configuration
 * Bật JPA Auditing và cấu hình Auditor
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {

    /**
     * Cung cấp Auditor Aware để tự động điền createdBy, updatedBy
     */
    @Bean
    public AuditorAware<Long> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }
            try {
                Object principal = authentication.getPrincipal();
                if (principal instanceof Long) {
                    return Optional.of((Long) principal);
                }
                // Giả sử UserDetails có getId() method
                var method = principal.getClass().getMethod("getId");
                Object id = method.invoke(principal);
                if (id instanceof Long) {
                    return Optional.of((Long) id);
                }
            } catch (Exception ignored) {
            }
            return Optional.empty();
        };
    }
}
