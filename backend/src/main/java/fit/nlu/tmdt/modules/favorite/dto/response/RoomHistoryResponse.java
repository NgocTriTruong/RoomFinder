package fit.nlu.tmdt.modules.favorite.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * RoomHistory Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomHistoryResponse {

    private Long id;
    private Long postId;
    private String postTitle;
    private String roomAddress;
    private String roomThumbnailUrl;
    private Double roomPrice;
    private String priceType;
    private Long landlordId;
    private String landlordName;
    private LocalDateTime viewedAt;
}
