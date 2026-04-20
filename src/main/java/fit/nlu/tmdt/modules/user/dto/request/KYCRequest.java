package fit.nlu.tmdt.modules.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for Landlord KYC verification
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KYCRequest {
    private String frontIdCardUrl;
    private String backIdCardUrl;
    private String selfieUrl;
}
