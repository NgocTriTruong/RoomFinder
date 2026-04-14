package fit.nlu.tmdt.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Post Response DTO - Chi tiết bài đăng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private String priceType;
    private Double deposit;

    // Status
    private String status;
    private String rejectionReason;
    private LocalDateTime expiresAt;
    private Boolean isAutoRenew;

    // Boost
    private Boolean isBoosted;
    private LocalDateTime boostedUntil;

    // Stats
    private Integer viewCount;
    private Integer favoriteCount;
    private Integer contactCount;
    private Integer bookingCount;
    private Double averageRating;
    private Integer reviewCount;

    // Room info
    private RoomSummary room;

    // Landlord info
    private LandlordSummary landlord;

    // Images
    private List<String> images;
    private String videoUrl;

    // Dates
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional info
    private Boolean isFavorite;  // Current user favorited this post
    private Boolean canBook;     // Current user can book this post
}
