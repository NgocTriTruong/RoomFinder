package fit.nlu.tmdt.modules.media.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * CentralMediaResponse DTO
 * Response cho thông tin file media
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CentralMediaResponse {

    private Long id;
    private String category;
    private String originalName;
    private String fileName;
    private String fileUrl;
    private String thumbnailUrl;
    private Long fileSize;
    private String formattedSize;
    private String mimeType;
    private String extension;
    private Integer width;
    private Integer height;
    private String referenceType;
    private Long referenceId;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
    
    // Preview info
    private String previewUrl;
    private boolean isImage;
    private boolean isVideo;
    private boolean isAudio;
}
