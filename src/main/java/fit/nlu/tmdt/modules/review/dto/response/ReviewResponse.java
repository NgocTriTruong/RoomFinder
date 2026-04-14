package fit.nlu.tmdt.modules.review.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Review Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long postId;
    private String postTitle;
    private Long landlordId;
    private String landlordName;
    private Integer rating;
    private String comment;
    private List<String> images;
    private Integer landlordRating;
    private String landlordComment;
    private Boolean isVisible;
    private Integer helpfulCount;
    private Integer reportCount;
    private String landlordResponse;
    private LocalDateTime landlordResponseAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}