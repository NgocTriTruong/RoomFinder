package fit.nlu.tmdt.modules.media.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Upload Media Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadMediaRequest {

    @NotNull(message = "Category is required")
    private String category;

    private String referenceType;
    
    private Long referenceId;
    
    private Boolean isPrimary;
    
    private String caption;
}
