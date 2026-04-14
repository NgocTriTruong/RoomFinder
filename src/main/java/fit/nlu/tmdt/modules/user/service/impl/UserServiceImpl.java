package fit.nlu.tmdt.modules.user.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.user.dto.request.UpdateProfileRequest;
import fit.nlu.tmdt.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * User Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    public UserResponse getCurrentProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
        return toUserResponse(user);
    }

    @Override
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // Update fields
        user.setFullName(request.getFullName());

        if (request.getPhone() != null) {
            // Check if phone already used by another user
            if (userRepository.existsByPhone(request.getPhone()) 
                    && !request.getPhone().equals(user.getPhone())) {
                throw new BusinessException(ErrorCode.USER_005, "Phone number already in use");
            }
            user.setPhone(request.getPhone());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        if (request.getDateOfBirth() != null) {
            try {
                user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth(), DateTimeFormatter.ISO_DATE));
            } catch (Exception e) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Invalid date format");
            }
        }

        if (request.getUniversityId() != null) {
            user.setUniversityId(request.getUniversityId());
        }

        user = userRepository.save(user);
        log.info("Profile updated for user: {}", userId);

        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse uploadAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        user.setAvatarUrl(avatarUrl);
        user = userRepository.save(user);

        log.info("Avatar updated for user: {}", userId);
        return toUserResponse(user);
    }

    @Override
    public LandlordProfileResponse getLandlordProfile(Long landlordId) {
        User user = userRepository.findById(landlordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // Count posts
        long totalPosts = postRepository.countByLandlordId(landlordId);
        long activePosts = postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.APPROVED);

        return new LandlordProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getPhone(),
                user.getBio(),
                user.getLandlordRating(),
                user.getTotalReviews(),
                (int) totalPosts,
                (int) activePosts,
                user.getIsVerified()
        );
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatar(user.getAvatarUrl())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .isVerified(user.getIsVerified())
                .verifiedAt(user.getVerifiedAt())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .bio(user.getBio())
                .landlordRating(user.getLandlordRating())
                .totalReviews(user.getTotalReviews())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
