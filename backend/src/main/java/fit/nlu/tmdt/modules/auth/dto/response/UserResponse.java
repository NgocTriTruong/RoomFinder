package fit.nlu.tmdt.modules.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * User Response DTO - Thông tin user trả về
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private String role;
    private String status;
    private Boolean isVerified;
    private String verificationStatus;
    private String frontIdCardUrl;
    private String backIdCardUrl;
    private String selfieUrl;
    private String businessLicenseUrl;
    private LocalDateTime verifiedAt;
    private LocalDate dateOfBirth;
    private String address;
    private String bio;
    private Long universityId;
    private Double landlordRating;
    private Integer totalReviews;
    private String adminNote;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
}
