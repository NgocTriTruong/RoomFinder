package fit.nlu.tmdt.modules.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Auth Response DTO - Chứa thông tin login thành công
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;        // Access token expiration in seconds
    private long refreshExpiresIn; // Refresh token expiration in seconds
    private UserResponse user;
}
