package fit.nlu.tmdt.modules.report.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Blacklist Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistResponse {

    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
    private String reason;
    private String type;
    private Boolean isPermanent;
    private LocalDateTime expiresAt;
    private Long addedBy;
    private String addedByName;
    private LocalDateTime addedAt;
    private Long removedBy;
    private String removedByName;
    private LocalDateTime removedAt;
    private String removalReason;
    private Boolean isActive;
}
