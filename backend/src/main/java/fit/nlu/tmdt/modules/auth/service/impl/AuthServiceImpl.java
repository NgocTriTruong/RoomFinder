package fit.nlu.tmdt.modules.auth.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.config.JwtTokenProvider;
import fit.nlu.tmdt.modules.auth.dto.request.*;
import fit.nlu.tmdt.modules.auth.dto.response.AuthResponse;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.auth.service.AuthService;
import fit.nlu.tmdt.modules.auth.service.EmailService;
import fit.nlu.tmdt.modules.university.repository.UniversityRepository;
import fit.nlu.tmdt.modules.university.entity.University;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Auth Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.access-token-expiration:900000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // 1. Validate email chưa tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.USER_002, "Email này đã được đăng ký trong hệ thống");
        }

        // 2. Validate password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mật khẩu xác nhận không khớp");
        }

        // 3. Validate role
        UserRole role;
        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Vai trò không hợp lệ");
        }

        // 4. Validate Student Email if Role is USER
        Long universityId = null;
        if (role == UserRole.USER) {
            University university = findUniversityByEmail(request.getEmail());
            if (university == null) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, 
                    "Bạn phải sử dụng email sinh viên để đăng ký tài khoản người thuê trọ.");
            }
            universityId = university.getId();
        }

        // 5. Generate OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        // 6. Create user - PENDING until OTP verified
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .status(UserStatus.PENDING)
                .isVerified(false)
                .universityId(universityId)
                .otpCode(otp)
                .otpExpiry(expiry)
                .provider("LOCAL")
                .build();

        user = userRepository.save(user);

        // 7. Send OTP Email
        emailService.sendOtpEmail(user.getEmail(), otp);

        log.info("User registered. OTP sent to: {}", user.getEmail());

        return AuthResponse.builder()
                .requiresVerification(true)
                .user(toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // 1. Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_001, "Email hoặc mật khẩu không chính xác"));

        // 2. Check if OAuth2 user
        if (!"LOCAL".equals(user.getProvider())) {
            throw new BusinessException(ErrorCode.AUTH_001, "Tài khoản này đã được đăng ký bằng mạng xã hội. Vui lòng đăng nhập bằng Google hoặc Facebook.");
        }

        // 3. Check account lockout
        if (user.isLocked()) {
            throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản của bạn đã bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau.");
        }

        // 4. Validate password
        String storedPassword = user.getPassword();
        boolean passwordMatch = false;
        
        if (storedPassword != null) {
            // Thử so khớp theo BCrypt
            try {
                if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
                    passwordMatch = passwordEncoder.matches(request.getPassword(), storedPassword);
                } else {
                    // Nếu không giống định dạng BCrypt, so sánh trực tiếp
                    log.info("Stored password is plain text, using direct comparison for user: {}", user.getEmail());
                    passwordMatch = request.getPassword().equals(storedPassword);
                }
            } catch (Exception e) {
                log.warn("BCrypt check failed, using fallback for user: {}", user.getEmail());
                passwordMatch = request.getPassword().equals(storedPassword);
            }
        }

        if (!passwordMatch) {
            log.warn("Login failed for user: {}. Password mismatch.", user.getEmail());
            user.incrementFailedLoginAttempts();
            userRepository.save(user);
            throw new BusinessException(ErrorCode.AUTH_001, "Email hoặc mật khẩu không chính xác");
        }

        // 5. Check account status
        if (user.getStatus() != UserStatus.ACTIVE) {
            if (user.getStatus() == UserStatus.LOCKED) {
                throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
            } else if (user.getStatus() == UserStatus.INACTIVE) {
                throw new BusinessException(ErrorCode.AUTH_006, "Tài khoản của bạn đang bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ hoặc sử dụng chức năng kích hoạt lại.");
            } else if (user.getStatus() == UserStatus.PENDING) {
                throw new BusinessException(ErrorCode.AUTH_001, "Tài khoản đang chờ xác thực. Vui lòng xác thực OTP.");
            } else {
                throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản không khả dụng.");
            }
        }

        // 6. Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // 7. Save refresh token
        user.setRefreshToken(refreshToken);
        user.recordSuccessfulLogin(null);
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .refreshExpiresIn(refreshTokenExpiration / 1000)
                .user(toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // 1. Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken) || !jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new BusinessException(ErrorCode.AUTH_005, "Invalid refresh token");
        }

        // 2. Find user by refresh token
        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_005, "Invalid refresh token"));

        // 3. Check user status
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản của bạn hiện không khả dụng");
        }

        // 4. Generate new tokens
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // 5. Save new refresh token
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .refreshExpiresIn(refreshTokenExpiration / 1000)
                .user(toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        user.setRefreshToken(null);
        userRepository.save(user);

        log.info("User logged out: {}", userId);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Attempting password change for userId: {}", userId);
        
        if (userId == null) {
            log.error("UserId is null in changePassword");
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Vui lòng đăng nhập để thực hiện");
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "Người dùng không tồn tại"));

            log.info("Current user status: {}", user.getStatus());
            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new BusinessException(ErrorCode.AUTH_002, "Tài khoản đang bị khóa hoặc chưa kích hoạt");
            }

            // Validate current password
            log.debug("Checking current password match for userId: {}", userId);
            String storedPassword = user.getPassword();
            boolean currentMatch = false;
            
            if (storedPassword != null) {
                try {
                    if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
                        currentMatch = passwordEncoder.matches(request.getCurrentPassword(), storedPassword);
                    } else {
                        currentMatch = request.getCurrentPassword().equals(storedPassword);
                    }
                } catch (Exception e) {
                    log.warn("Fallback to plain text check for password change: {}", userId);
                    currentMatch = request.getCurrentPassword().equals(storedPassword);
                }
            }

            if (!currentMatch) {
                log.warn("Password mismatch for user: {}", userId);
                throw new BusinessException(ErrorCode.AUTH_001, "Mật khẩu hiện tại không chính xác");
            }

            // Validate new password match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mật khẩu xác nhận không khớp");
            }

            // Check password not same as old
            if (passwordEncoder.matches(request.getNewPassword(), storedPassword)) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mật khẩu mới phải khác mật khẩu hiện tại");
            }

            // Sử dụng Query update trực tiếp để đảm bảo tính nhất quán
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            int updated = userRepository.updatePassword(userId, encodedPassword);
            
            if (updated == 0) {
                log.error("No rows updated when changing password for user: {}", userId);
                throw new BusinessException(ErrorCode.INTERNAL_ERROR, "Không thể cập nhật mật khẩu");
            }

            log.info("Password successfully updated via direct query for user: {}", userId);
        } catch (BusinessException be) {
            log.warn("Business error during password change for user {}: {}", userId, be.getMessage());
            throw be;
        } catch (Exception e) {
            log.error("CRITICAL: Unexpected error in changePassword for user {}: {}", userId, e.getMessage(), e);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "Lỗi hệ thống khi đổi mật khẩu: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void reactivateAccount(LoginRequest request) {
        log.info("Attempting account reactivation for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_001, "Tài khoản không tồn tại"));

        if (user.getStatus() != UserStatus.INACTIVE) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Tài khoản hiện không ở trạng thái vô hiệu hóa");
        }

        // Verify password before reactivation
        String storedPassword = user.getPassword();
        boolean passwordMatch = false;
        try {
            if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
                passwordMatch = passwordEncoder.matches(request.getPassword(), storedPassword);
            } else {
                passwordMatch = request.getPassword().equals(storedPassword);
            }
        } catch (Exception e) {
            passwordMatch = request.getPassword().equals(storedPassword);
        }

        if (!passwordMatch) {
            throw new BusinessException(ErrorCode.AUTH_001, "Mật khẩu không chính xác");
        }

        userRepository.updateStatus(user.getId(), UserStatus.ACTIVE);
        log.info("Account reactivated successfully for email: {}", request.getEmail());
    }

    @Override
    @Transactional
    public AuthResponse oauth2Login(String provider, String providerId, String email, String fullName) {
        log.info("OAuth2 login attempt: provider={}, email={}", provider, email);

        // 1. Try to find existing user
        User user = userRepository.findByProviderAndProviderId(provider.toUpperCase(), providerId)
                .orElseGet(() -> {
                    // 2. Or find by email and link OAuth
                    return userRepository.findByEmail(email)
                            .map(existingUser -> {
                                existingUser.setProvider(provider.toUpperCase());
                                existingUser.setProviderId(providerId);
                                return userRepository.save(existingUser);
                            })
                            .orElseGet(() -> {
                                // 3. Check if email is student email to set KYC (isVerified = true)
                                University university = findUniversityByEmail(email);
                                
                                boolean isStudentVerified = university != null;
                                Long universityId = isStudentVerified ? university.getId() : null;

                                // Create new user
                                User newUser = User.builder()
                                        .email(email)
                                        .fullName(fullName)
                                        .role(UserRole.USER)
                                        .status(UserStatus.ACTIVE)
                                        .isVerified(isStudentVerified) // Only student emails get automatically verified/KYC'ed
                                        .universityId(universityId)
                                        .provider(provider.toUpperCase())
                                        .providerId(providerId)
                                        .build();
                                return userRepository.save(newUser);
                            });
                });

        // 4. Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        user.setRefreshToken(refreshToken);
        user.recordSuccessfulLogin(null);
        userRepository.save(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .refreshExpiresIn(refreshTokenExpiration / 1000)
                .user(toUserResponse(user))
                .build();
    }

    // ==================== HELPER METHODS ====================

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
                .universityId(user.getUniversityId())
                .landlordRating(user.getLandlordRating())
                .totalReviews(user.getTotalReviews())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        log.info("Verifying OTP for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
        
        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Account đã được xác thực");
        }
        
        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtpCode())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mã OTP không chính xác");
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mã OTP đã hết hạn");
        }
        
        // Mark as active and verify if student (USER role)
        user.setStatus(UserStatus.ACTIVE);
        if (user.getRole() == UserRole.USER) {
            user.setIsVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
        } else {
            user.setIsVerified(false);
            user.setVerifiedAt(null);
        }
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        
        userRepository.save(user);
        
        // Auto login
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        
        log.info("OTP verified successfully for user: {}", user.getId());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .refreshExpiresIn(refreshTokenExpiration / 1000)
                .user(toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public void resendOtp(String email) {
        log.info("Resending OTP to email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
        
        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Account đã được xác thực");
        }
        
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    private University findUniversityByEmail(String email) {
        if (email == null || !email.contains("@")) {
            return null;
        }
        String domain = email.substring(email.lastIndexOf("@") + 1).toLowerCase();
        
        // Normalize hcmuaf.edu.vn to nlu.edu.vn for Nong Lam University
        if (domain.endsWith("hcmuaf.edu.vn")) {
            domain = "nlu.edu.vn";
        }
        
        String finalDomain = domain;
        var universities = universityRepository.findAll();
        return universities.stream()
                .filter(u -> u.getEmailDomain() != null && !u.getEmailDomain().isEmpty() 
                           && finalDomain.endsWith(u.getEmailDomain().toLowerCase()))
                .findFirst()
                .orElse(null);
    }
}
