package fit.nlu.tmdt.modules.message.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Send Message Request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank(message = "Content is required")
    private String content;

    private String attachmentUrl;

    private Long postId;
}
