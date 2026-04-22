package fit.nlu.tmdt.modules.report.dto.request;

import fit.nlu.tmdt.modules.report.entity.enums.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Create Report Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {

    @NotNull(message = "Target ID is required")
    private Long targetId;

    @NotBlank(message = "Target type is required")
    private String targetType;

    @NotNull(message = "Report type is required")
    private ReportType type;

    @NotBlank(message = "Reason is required")
    private String reason;

    private String evidenceUrl;

    private Long postId;

    private Long bookingId;
}