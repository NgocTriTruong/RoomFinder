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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    private final JwtTokenProvider jwtTokenProvider;

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

        // 4. Create user - auto verified
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .status(UserStatus.ACTIVE)
                .isVerified(true)
                .provider("LOCAL")
                .build();

        user = userRepository.save(user);

        // 5. Generate tokens for auto-login
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // 6. Save refresh token
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        log.info("User registered and logged in successfully with ID: {}", user.getId());

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
        if (!request.getPassword().equals(user.getPassword())) {
            user.incrementFailedLoginAttempts();
            userRepository.save(user);
            throw new BusinessException(ErrorCode.AUTH_001, "Invalid email or password");
        }

        // 5. Check blacklisted
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BusinessException(ErrorCode.AUTH_002, "Account is suspended");
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
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // Validate current password
        if (!request.getCurrentPassword().equals(user.getPassword())) {
            throw new BusinessException(ErrorCode.AUTH_001, "Current password is incorrect");
        }

        // Validate new password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Passwords do not match");
        }

        // Check password not same as old
        if (request.getNewPassword().equals(user.getPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "New password must be different from current password");
        }

        user.setPassword(request.getNewPassword());
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
