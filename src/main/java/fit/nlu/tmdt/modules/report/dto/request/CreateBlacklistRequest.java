package fit.nlu.tmdt.modules.report.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

/**
 * Create Blacklist Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBlacklistRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Reason is required")
    private String reason;

    private String type;  // SPAMMER, FRAUD, HARASSMENT, VIOLATION, etc.

    private Boolean isPermanent;

    @Positive(message = "Days must be positive")
    private Integer days;  // For temporary blacklist (e.g., 7, 30, 90 days)
}
