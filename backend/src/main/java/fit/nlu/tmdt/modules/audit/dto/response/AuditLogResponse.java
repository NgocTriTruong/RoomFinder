package fit.nlu.tmdt.modules.audit.dto.response;

import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private UserResponse admin;
    private String action;
    private String actionDisplayName;
    private String targetType;
    private String targetTypeDisplayName;
    private Long targetId;
    private String description;
    private String status;
    private String metadata;
    private LocalDateTime createdAt;
}
