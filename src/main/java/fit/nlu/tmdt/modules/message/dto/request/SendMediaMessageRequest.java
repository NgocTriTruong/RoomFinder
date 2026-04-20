package fit.nlu.tmdt.modules.message.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Send Media Message Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMediaMessageRequest {

    @NotBlank(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank(message = "Content is required")
    private String content;

    // Media info
    private Long mediaId;  // ID của file đã upload trong media_files

    private String attachmentUrl;  // URL của file (nếu chưa upload qua hệ thống)

    private String mediaType;  // IMAGE, VIDEO, AUDIO, DOCUMENT

    private Long postId;
}
