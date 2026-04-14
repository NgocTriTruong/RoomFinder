package fit.nlu.tmdt.modules.favorite.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Favorite Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {

    private Long id;
    private Long roomId;
    private String roomTitle;
    private String roomAddress;
    private String roomImageUrl;
    private Double roomPrice;
    private String priceType;
    private Long landlordId;
    private String landlordName;
    private String landlordAvatar;
    private LocalDateTime addedAt;
}