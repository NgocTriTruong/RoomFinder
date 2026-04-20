package fit.nlu.tmdt.modules.user.service;

import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.user.dto.request.UpdateProfileRequest;
import fit.nlu.tmdt.modules.user.dto.request.KYCRequest;

/**
 * User Service Interface
 */
public interface UserService {

    /**
     * Get current user profile
     */
    UserResponse getCurrentProfile(Long userId);

    /**
     * Get user profile by ID
     */
    UserResponse getUserProfile(Long userId);

    /**
     * Update user profile
     */
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    /**
     * Upload avatar
     */
    UserResponse uploadAvatar(Long userId, String avatarUrl);

    /**
     * Get landlord profile with stats
     */
    LandlordProfileResponse getLandlordProfile(Long landlordId);

    /**
     * Submit KYC verification (Landlord)
     */
    UserResponse submitKYC(Long userId, KYCRequest request);

    /**
     * Approve or Reject KYC (Admin)
     */
    UserResponse verifyUser(Long userId, String status, String adminNote);

    /**
     * Landlord Profile Response DTO
     */
    record LandlordProfileResponse(
            Long id,
            String fullName,
            String avatar,
            String phone,
            String bio,
            Double rating,
            Integer totalReviews,
            Integer totalPosts,
            Integer activePosts,
            Boolean isVerified
    ) {}
}
