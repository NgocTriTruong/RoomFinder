package fit.nlu.tmdt.modules.auth.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.config.JwtTokenProvider;
import fit.nlu.tmdt.modules.auth.dto.request.*;
import fit.nlu.tmdt.modules.auth.dto.response.AuthResponse;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.auth.entity.OtpVerification;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.entity.enums.OtpType;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import fit.nlu.tmdt.modules.auth.repository.OtpVerificationRepository;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.auth.service.AuthService;
import fit.nlu.tmdt.modules.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

/**
 * Auth Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${jwt.access-token-expiration:900000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    @Value("${otp.max-resend-per-hour:3}")
    private int maxResendPerHour;

    private static final Random RANDOM = new Random();

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // 1. Validate email chưa tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.USER_002, "Email already registered");
        }

        // 2. Validate password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Passwords do not match");
        }

        // 3. Validate role
        UserRole role;
        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Invalid role");
        }

        // 4. Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .status(UserStatus.ACTIVE)
                .isVerified(false)
                .provider("LOCAL")
                .build();

        user = userRepository.save(user);

        // 5. Generate OTP for email verification
        String otpCode = generateOtp();
        saveOtp(user.getEmail(), otpCode, OtpType.EMAIL_VERIFICATION);

        // 6. Send verification email
        emailService.sendVerificationEmail(user.getEmail(), otpCode);

        log.info("User registered successfully with ID: {}", user.getId());

        return AuthResponse.builder()
                .user(toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // 1. Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_001, "Invalid email or password"));

        // 2. Check if OAuth2 user
        if (!"LOCAL".equals(user.getProvider())) {
            throw new BusinessException(ErrorCode.AUTH_001, "Please use OAuth login");
        }

        // 3. Check account lockout
        if (user.isLocked()) {
            throw new BusinessException(ErrorCode.AUTH_002, "Account is locked. Try again later");
        }

        // 4. Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            user.incrementFailedLoginAttempts();
            userRepository.save(user);
            throw new BusinessException(ErrorCode.AUTH_001, "Invalid email or password");
        }

        // 5. Check email verified
        if (!user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.AUTH_003, "Please verify your email first");
        }

        // 6. Check blacklisted
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BusinessException(ErrorCode.AUTH_002, "Account is suspended");
        }

        // 7. Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // 8. Save refresh token
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
            throw new BusinessException(ErrorCode.AUTH_002, "Account is not active");
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
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Forgot password request for: {}", request.getEmail());

        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String otpCode = generateOtp();
            saveOtp(user.getEmail(), otpCode, OtpType.PASSWORD_RESET);
            emailService.sendPasswordResetEmail(user.getEmail(), otpCode);
        });

        // Always return success to prevent email enumeration
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Reset password request for: {}", request.getEmail());

        // 1. Validate password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Passwords do not match");
        }

        // 2. Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // 3. Validate OTP
        OtpVerification otp = otpVerificationRepository.findValidOtp(request.getEmail(), OtpType.PASSWORD_RESET)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_006, "OTP not found or expired"));

        if (!otp.getOtpCode().equals(request.getOtpCode())) {
            otp.incrementAttempts();
            otpVerificationRepository.save(otp);
            throw new BusinessException(ErrorCode.AUTH_007, "Invalid OTP");
        }

        if (!otp.isValid()) {
            throw new BusinessException(ErrorCode.AUTH_006, "OTP expired or too many attempts");
        }

        // 4. Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        user.resetFailedLoginAttempts();
        userRepository.save(user);

        // 5. Mark OTP as used
        otp.markAsUsed();
        otpVerificationRepository.save(otp);

        // 6. Invalidate refresh tokens
        user.setRefreshToken(null);
        userRepository.save(user);

        log.info("Password reset successfully for: {}", request.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(Long userId, VerifyEmailRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        OtpVerification otp = otpVerificationRepository.findValidOtp(user.getEmail(), OtpType.EMAIL_VERIFICATION)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_006, "OTP not found or expired"));

        if (!otp.getOtpCode().equals(request.getOtpCode())) {
            otp.incrementAttempts();
            otpVerificationRepository.save(otp);
            throw new BusinessException(ErrorCode.AUTH_007, "Invalid OTP");
        }

        if (!otp.isValid()) {
            throw new BusinessException(ErrorCode.AUTH_006, "OTP expired or too many attempts");
        }

        user.setIsVerified(true);
        user.setVerifiedAt(LocalDateTime.now());
        userRepository.save(user);

        otp.markAsUsed();
        otpVerificationRepository.save(otp);

        log.info("Email verified for user: {}", userId);
    }

    @Override
    @Transactional
    public void resendVerifyEmail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        if (user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Email already verified");
        }

        // Check resend limit
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long resendCount = otpVerificationRepository.countResendSince(user.getEmail(), oneHourAgo);

        if (resendCount >= maxResendPerHour) {
            throw new BusinessException(ErrorCode.AUTH_008, "Too many resend requests. Try again later.");
        }

        String otpCode = generateOtp();
        saveOtp(user.getEmail(), otpCode, OtpType.EMAIL_VERIFICATION);
        emailService.sendVerificationEmail(user.getEmail(), otpCode);

        log.info("Verification email resent for user: {}", userId);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // Validate current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.AUTH_001, "Current password is incorrect");
        }

        // Validate new password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Passwords do not match");
        }

        // Check password not same as old
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        user.setRefreshToken(null); // Invalidate all sessions
        userRepository.save(user);

        log.info("Password changed for user: {}", userId);
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
                                // 3. Create new user
                                User newUser = User.builder()
                                        .email(email)
                                        .fullName(fullName)
                                        .role(UserRole.USER)
                                        .status(UserStatus.ACTIVE)
                                        .isVerified(true) // OAuth users are pre-verified
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

    private String generateOtp() {
        return String.format("%06d", RANDOM.nextInt(1000000));
    }

    private void saveOtp(String email, String otpCode, OtpType type) {
        // Delete old OTPs
        otpVerificationRepository.deleteByEmailAndType(email, type);

        // Create new OTP
        OtpVerification otp = OtpVerification.create(email, otpCode, type);
        otpVerificationRepository.save(otp);
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
