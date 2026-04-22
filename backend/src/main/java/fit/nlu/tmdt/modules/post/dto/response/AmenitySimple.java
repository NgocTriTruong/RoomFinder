package fit.nlu.tmdt.modules.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Amenity Simple - Lightweight amenity info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmenitySimple {

    private Long id;
    private String name;
    private String icon;
    private String category;
}
