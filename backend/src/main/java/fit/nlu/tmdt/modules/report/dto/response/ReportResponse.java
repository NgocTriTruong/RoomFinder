package fit.nlu.tmdt.modules.report.dto.response;

import fit.nlu.tmdt.modules.report.entity.enums.ReportStatus;
import fit.nlu.tmdt.modules.report.entity.enums.ReportType;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Report Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private Long id;
    private Long reporterId;
    private String reporterName;
    private Long targetId;
    private String targetType;
    private ReportType type;
    private String reason;
    private String description;
    private String evidenceUrl;
    private ReportStatus status;
    private Long handledBy;
    private String handledByName;
    private LocalDateTime handledAt;
    private String handledNote;
    private String actionTaken;
    private Long postId;
    private Long bookingId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}