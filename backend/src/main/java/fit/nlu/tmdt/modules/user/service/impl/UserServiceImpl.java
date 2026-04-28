package fit.nlu.tmdt.modules.user.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.auth.repository.UserSpecifications;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.notification.entity.Notification;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import fit.nlu.tmdt.modules.user.dto.request.UpdateProfileRequest;
import fit.nlu.tmdt.modules.user.service.UserService;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import fit.nlu.tmdt.modules.audit.enums.AuditAction;
import fit.nlu.tmdt.modules.audit.enums.AuditTarget;
import fit.nlu.tmdt.modules.auth.dto.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
    private final NotificationService notificationService;
    private final fit.nlu.tmdt.modules.audit.service.AuditLogService auditLogService;

    @Override
    @Transactional
    public UserResponse submitKYC(Long userId, fit.nlu.tmdt.modules.user.dto.request.KYCRequest request) {
        if (userId == null) {
            throw new BusinessException(ErrorCode.AUTH_001, "User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        user.setFrontIdCardUrl(request.getFrontIdCardUrl());
        user.setBackIdCardUrl(request.getBackIdCardUrl());
        user.setSelfieUrl(request.getSelfieUrl());
        user.setVerificationStatus("PENDING");

        user = userRepository.save(user);
        log.info("KYC submitted for user: {}", userId);
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse verifyUser(Long userId, String status, String adminNote, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        user.setAdminNote(adminNote);
        
        String title;
        String content;

        if ("APPROVED".equals(status)) {
            user.setVerificationStatus("APPROVED");
            user.setIsVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            
            title = "Xác thực KYC thành công";
            content = "Chúc mừng! Hồ sơ xác thực danh tính của bạn đã được phê duyệt. Bạn hiện đã là chủ trọ uy tín trên hệ thống.";
        } else if ("REJECTED".equals(status)) {
            user.setVerificationStatus("REJECTED");
            user.setIsVerified(false);
            
            title = "Xác thực KYC bị từ chối";
            content = "Rất tiếc, hồ sơ xác thực danh tính của bạn đã bị từ chối. Lý do: " + (adminNote != null ? adminNote : "Thông tin không hợp lệ.");
        } else {
            return toUserResponse(userRepository.save(user));
        }

        user = userRepository.save(user);
        
        // Gửi thông báo
        notificationService.createNotification(Notification.forSystem(user, title, content));
        
        // Ghi audit log
        fit.nlu.tmdt.modules.audit.enums.AuditAction action = "APPROVED".equals(status) 
                ? fit.nlu.tmdt.modules.audit.enums.AuditAction.APPROVE 
                : fit.nlu.tmdt.modules.audit.enums.AuditAction.REJECT;
        auditLogService.log(adminId, action, fit.nlu.tmdt.modules.audit.enums.AuditTarget.KYC, userId, 
                "Phê duyệt KYC: " + status + ". Ghi chú: " + adminNote, null);
        
        log.info("KYC {} for user: {}", status, userId);
        return toUserResponse(user);
    }

    @Override
    public Page<UserResponse> getAdminUsers(String search, String role, String status, String verificationStatus, Pageable pageable) {
        return userRepository.findAll(
                UserSpecifications.adminSearch(search, role, status, verificationStatus),
                pageable
        ).map(this::toUserResponse);
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long userId, String status, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        UserStatus userStatus;
        try {
            userStatus = UserStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Invalid user status");
        }

        user.setStatus(userStatus);

        if (userStatus == UserStatus.ACTIVE) {
            user.setLockoutEnd(null);
            user.setFailedLoginAttempts(0);
        } else if (userStatus == UserStatus.LOCKED && user.getLockoutEnd() == null) {
            user.setLockoutEnd(LocalDateTime.now().plusDays(3650));
        }

        user = userRepository.save(user);

        // Ghi audit log
        fit.nlu.tmdt.modules.audit.enums.AuditAction action = userStatus == UserStatus.ACTIVE 
                ? fit.nlu.tmdt.modules.audit.enums.AuditAction.UNLOCK 
                : fit.nlu.tmdt.modules.audit.enums.AuditAction.LOCK;
        auditLogService.log(adminId, action, fit.nlu.tmdt.modules.audit.enums.AuditTarget.USER, userId, 
                "Cập nhật trạng thái người dùng thành: " + userStatus, null);

        log.info("User status updated: {} -> {}", userId, userStatus);
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(Long userId, String role, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        UserRole userRole;
        try {
            userRole = UserRole.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Invalid user role");
        }

        UserRole oldRole = user.getRole();
        user.setRole(userRole);
        user = userRepository.save(user);

        // Ghi audit log
        auditLogService.log(adminId, AuditAction.UPDATE, 
                AuditTarget.USER, userId, 
                "Thay đổi vai trò người dùng: " + oldRole + " -> " + userRole, null);

        log.info("User role updated: {} -> {} (by admin {})", userId, userRole, adminId);
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createAdmin(RegisterRequest request, Long adminId) {
        log.info("Admin {} is creating new admin: {}", adminId, request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.USER_002, "Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword()) 
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .isVerified(true)
                .provider("LOCAL")
                .build();

        user = userRepository.save(user);

        // Ghi audit log
        auditLogService.log(adminId, AuditAction.CREATE, 
                AuditTarget.USER, user.getId(), 
                "Tạo tài khoản Admin mới: " + user.getEmail(), null);

        return toUserResponse(user);
    }

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
    public UserService.LandlordProfileResponse getLandlordProfile(Long landlordId) {
        User user = userRepository.findById(landlordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // Count posts
        long totalPosts = postRepository.countByLandlordId(landlordId);
        long activePosts = postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.APPROVED);

        return new UserService.LandlordProfileResponse(
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
                .verificationStatus(user.getVerificationStatus())
                .frontIdCardUrl(user.getFrontIdCardUrl())
                .backIdCardUrl(user.getBackIdCardUrl())
                .selfieUrl(user.getSelfieUrl())
                .verifiedAt(user.getVerifiedAt())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .bio(user.getBio())
                .landlordRating(user.getLandlordRating())
                .totalReviews(user.getTotalReviews())
                .adminNote(user.getAdminNote())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
