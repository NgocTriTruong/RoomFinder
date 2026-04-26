package fit.nlu.tmdt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * TMDT Application - Website Kết Nối Phòng Trọ cho Sinh Viên
 *
 * Main entry point cho Spring Boot application
 */
@SpringBootApplication
@EnableJpaAuditing  // Bật JPA Auditing cho BaseEntity
@EnableCaching      // Bật caching
@EnableAsync        // Bật async processing
@EnableScheduling   // Bật scheduled tasks (cho cron jobs)
public class TmdtApplication {

    public static void main(String[] args) {
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SpringApplication.run(TmdtApplication.class, args);
    }
}
