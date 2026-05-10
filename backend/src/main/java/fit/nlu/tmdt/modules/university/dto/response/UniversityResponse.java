package fit.nlu.tmdt.modules.university.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UniversityResponse {
    private Long id;
    private String name;
    private String abbreviation;
    private String address;
    private String province;
    private String district;
    private String emailDomain;
    private Double latitude;
    private Double longitude;
    private String logoUrl;
}
