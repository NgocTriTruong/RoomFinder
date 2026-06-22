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
import fit.nlu.tmdt.modules.audit.service.AuditLogService;
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
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public UserResponse submitKYC(Long userId, fit.nlu.tmdt.modules.user.dto.request.KYCRequest request) {
        if (userId == null) {
            throw new BusinessException(ErrorCode.AUTH_001, "Mã người dùng không được để trống");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "Không tìm thấy người dùng"));

        user.setFrontIdCardUrl(request.getFrontIdCardUrl());
        user.setBackIdCardUrl(request.getBackIdCardUrl());
        user.setSelfieUrl(request.getSelfieUrl());
        user.setBusinessLicenseUrl(request.getBusinessLicenseUrl());
        user.setVerificationStatus("PENDING");

        user = userRepository.save(user);
        log.info("KYC submitted for user: {}", userId);
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse verifyUser(Long userId, String status, String adminNote, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "Không tìm thấy người dùng"));

        user.setAdminNote(adminNote);
        
        String title;
        String content;

        if ("APPROVED".equals(status)) {
            user.setVerificationStatus("APPROVED");
            user.setIsVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            
            title = "Xác thực KYC thành công";
            if (user.getRole() == UserRole.LANDLORD) {
                content = "Chúc mừng! Hồ sơ xác thực danh tính của bạn đã được phê duyệt. Bạn hiện đã là chủ trọ uy tín trên hệ thống.";
            } else {
                content = "Chúc mừng! Tài khoản sinh viên của bạn đã được xác thực thành công. Bạn hiện có thể tự do nhắn tin và liên hệ với các chủ trọ.";
            }
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
        
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản đang bị khóa hoặc chưa được kích hoạt");
        }
        
        return toUserResponse(user);
    }

    @Override
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản đang bị khóa hoặc chưa được kích hoạt");
        }

        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        return updateProfile(userId, request, null);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request, Long adminId) {
        log.info("Starting updateProfile for user ID: {} (By admin: {})", userId, adminId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        if (user.getStatus() != UserStatus.ACTIVE && adminId == null) {
            throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản đang bị khóa hoặc chưa được kích hoạt");
        }

        try {
            // Update fields
            user.setFullName(request.getFullName());

            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                if (userRepository.existsByPhone(request.getPhone()) 
                        && !request.getPhone().equals(user.getPhone())) {
                    throw new BusinessException(ErrorCode.USER_005, "Số điện thoại đã được sử dụng bởi tài khoản khác");
                }
                user.setPhone(request.getPhone());
            } else if (request.getPhone() != null && request.getPhone().trim().isEmpty()) {
                user.setPhone(null);
            }

            if (request.getBio() != null) {
                user.setBio(request.getBio());
            }

            if (request.getAddress() != null) {
                user.setAddress(request.getAddress());
            }

            if (request.getDateOfBirth() != null && !request.getDateOfBirth().trim().isEmpty()) {
                try {
                    user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth(), DateTimeFormatter.ISO_DATE));
                } catch (Exception e) {
                    throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Định dạng ngày sinh không hợp lệ (YYYY-MM-DD)");
                }
            } else if (request.getDateOfBirth() != null && request.getDateOfBirth().trim().isEmpty()) {
                user.setDateOfBirth(null);
            }

            if (request.getUniversityId() != null) {
                user.setUniversityId(request.getUniversityId());
            }

            user = userRepository.save(user);

            // Ghi audit log nếu người thực hiện là admin
            if (adminId != null) {
                try {
                    String description = String.format("Admin (ID: %d) đã cập nhật thông tin tài khoản cho người dùng %s (ID: %d)", 
                            adminId, user.getEmail(), user.getId());
                    auditLogService.log(adminId, 
                            fit.nlu.tmdt.modules.audit.enums.AuditAction.UPDATE, 
                            fit.nlu.tmdt.modules.audit.enums.AuditTarget.USER, 
                            user.getId(), 
                            description, null);
                } catch (Exception e) {
                    log.warn("Failed to log audit for admin update: {}", e.getMessage());
                }
            }

            log.info("Profile successfully updated for user: {}", userId);
            return toUserResponse(user);
        } catch (BusinessException be) {
            throw be;
        } catch (Exception e) {
            log.error("Error in updateProfile for user {}: {}", userId, e.getMessage());
            throw new BusinessException("SYSTEM_ERROR", "Lỗi hệ thống: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
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

    @Override
    @Transactional
    public void deactivateAccount(Long userId) {
        log.info("Request to deactivate account for user ID: {}", userId);
        
        if (userId == null) {
            log.error("UserId is null in deactivateAccount");
            throw new BusinessException(ErrorCode.AUTH_001, "Vui lòng đăng nhập để thực hiện");
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "Người dùng không tồn tại"));

            log.info("Deactivating user: {} (Current status: {})", user.getEmail(), user.getStatus());
            
            // Sử dụng Query update trực tiếp để đảm bảo tính nhất quán
            int updated = userRepository.updateStatus(userId, UserStatus.INACTIVE);
            
            if (updated == 0) {
                log.error("No rows updated when deactivating account for user: {}", userId);
                throw new BusinessException(ErrorCode.INTERNAL_ERROR, "Không thể vô hiệu hóa tài khoản");
            }

            log.info("Account successfully deactivated via direct query for user: {}", userId);

            // Ghi audit log
            auditLogService.log(userId, AuditAction.UPDATE, 
                    AuditTarget.USER, userId, 
                    "Người dùng tự vô hiệu hóa tài khoản", null);
        } catch (BusinessException be) {
            log.warn("Business error during account deactivation for user {}: {}", userId, be.getMessage());
            throw be;
        } catch (Exception e) {
            log.error("CRITICAL: Error deactivating account for user {}: {}", userId, e.getMessage(), e);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "Lỗi khi vô hiệu hóa tài khoản: " + e.getMessage());
        }
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
                .businessLicenseUrl(user.getBusinessLicenseUrl())
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
