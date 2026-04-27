package fit.nlu.tmdt.modules.report.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.report.dto.request.CreateBlacklistRequest;
import fit.nlu.tmdt.modules.report.dto.response.BlacklistResponse;
import fit.nlu.tmdt.modules.report.entity.Blacklist;
import fit.nlu.tmdt.modules.report.repository.BlacklistRepository;
import fit.nlu.tmdt.modules.report.service.BlacklistService;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.notification.entity.Notification;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Blacklist Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BlacklistServiceImpl implements BlacklistService {

    private final BlacklistRepository blacklistRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<BlacklistResponse> getAllActiveBlacklist() {
        List<Blacklist> blacklists = blacklistRepository.findByIsActiveAndDeletedAtIsNull(true);
        return blacklists.stream()
                .map(this::buildResponse)
                .toList();
    }

    @Override
    public BlacklistResponse addToBlacklist(Long userId, String reason, String type, Integer days, Long adminId) {
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException("USER_001", "User not found"));

        // Check if already blacklisted
        blacklistRepository.findByUserIdAndIsActiveAndDeletedAtIsNull(userId, true)
                .ifPresent(b -> {
                    throw new BusinessException("BL_001", "User is already blacklisted");
                });

        // Backend Protection: Prevent blacklisting Admin
        if (user.getRole() == UserRole.ADMIN) {
            throw new BusinessException("BL_006", "Cannot blacklist an admin account");
        }

        Blacklist blacklist;
        if ("PERMANENT".equalsIgnoreCase(type) || (days == null || days <= 0)) {
            blacklist = Blacklist.createPermanent(user, reason, adminId);
            blacklist.setType("PERMANENT");
        } else {
            blacklist = Blacklist.createTemporary(user, reason, days, adminId);
            blacklist.setType(type);
        }

        // Synchronize User Status
        user.setStatus(UserStatus.LOCKED);
        userRepository.save(user);

        blacklist = blacklistRepository.save(blacklist);
        log.info("Added user {} to blacklist by admin {}, reason: {}", userId, adminId, reason);

        // Send Notification
        String title = "Tài khoản của bạn đã bị khóa";
        String content = String.format("Tài khoản của bạn đã bị đưa vào danh sách đen. Lý do: %s. %s", 
                reason, blacklist.getIsPermanent() ? "Đây là lệnh khóa vĩnh viễn." : "Thời hạn đến: " + blacklist.getExpiresAt());
        notificationService.createNotification(Notification.forSystem(user, title, content));

        return buildResponse(blacklist);
    }

    @Override
    public BlacklistResponse removeFromBlacklist(Long blacklistId, String reason, Long adminId) {
        Blacklist blacklist = blacklistRepository.findByIdAndDeletedAtIsNull(blacklistId)
                .orElseThrow(() -> new BusinessException("BL_002", "Blacklist entry not found"));

        if (!blacklist.getIsActive()) {
            throw new BusinessException("BL_003", "User is not currently blacklisted");
        }

        unlockUser(blacklist, adminId, reason);
        log.info("Removed user {} from blacklist by admin {}", blacklist.getUser().getId(), adminId);

        return buildResponse(blacklist);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isBlacklisted(Long userId) {
        return blacklistRepository.findActiveBlacklistByUserId(userId).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public BlacklistResponse getBlacklistByUserId(Long userId) {
        Blacklist blacklist = blacklistRepository.findActiveBlacklistByUserId(userId)
                .orElseThrow(() -> new BusinessException("BL_004", "User is not blacklisted"));
        return buildResponse(blacklist);
    }

    @Override
    @Transactional(readOnly = true)
    public BlacklistResponse getBlacklistById(Long id) {
        Blacklist blacklist = blacklistRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new BusinessException("BL_005", "Blacklist entry not found"));
        return buildResponse(blacklist);
    }

    @Override
    @Transactional(readOnly = true)
    public Object getBlacklistStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalActive", blacklistRepository.countByIsActiveAndDeletedAtIsNull(true));
        stats.put("totalPermanent", blacklistRepository.countByIsPermanentAndDeletedAtIsNull(true));
        stats.put("totalTemporary", blacklistRepository.countByIsPermanentAndDeletedAtIsNull(false));
        return stats;
    }

    /**
     * Auto-unlock task: Runs every hour to unlock users whose blacklist period has expired
     */
    @Override
    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void autoUnlockExpiredBlacklist() {
        log.info("Running auto-unlock task for expired blacklists...");
        List<Blacklist> expiredBlacklists = blacklistRepository.findByIsActiveAndDeletedAtIsNull(true)
                .stream()
                .filter(b -> !b.getIsPermanent() && b.getExpiresAt() != null && b.getExpiresAt().isBefore(LocalDateTime.now()))
                .toList();

        if (expiredBlacklists.isEmpty()) {
            return;
        }

        for (Blacklist blacklist : expiredBlacklists) {
            try {
                log.info("Auto-unlocking user: {}", blacklist.getUser().getId());
                unlockUser(blacklist, null, "Hệ thống tự động gỡ chặn sau khi hết hạn");
            } catch (Exception e) {
                log.error("Failed to auto-unlock user {}: {}", blacklist.getUser().getId(), e.getMessage());
            }
        }
    }

    private void unlockUser(Blacklist blacklist, Long adminId, String reason) {
        blacklist.deactivate(adminId, reason);
        
        // Synchronize User Status - Unlock user
        User user = blacklist.getUser();
        user.setStatus(UserStatus.ACTIVE);
        user.setLockoutEnd(null);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        blacklistRepository.save(blacklist);
    }

    private BlacklistResponse buildResponse(Blacklist blacklist) {
        User user = blacklist.getUser();
        
        BlacklistResponse.BlacklistResponseBuilder builder = BlacklistResponse.builder()
                .id(blacklist.getId())
                .userId(user.getId())
                .userFullName(user.getFullName())
                .userEmail(user.getEmail())
                .userPhone(user.getPhone())
                .reason(blacklist.getReason())
                .type(blacklist.getType())
                .isPermanent(blacklist.getIsPermanent())
                .expiresAt(blacklist.getExpiresAt())
                .addedBy(blacklist.getAddedBy())
                .addedAt(blacklist.getCreatedAt())
                .removedBy(blacklist.getRemovedBy())
                .removedAt(blacklist.getRemovedAt())
                .removalReason(blacklist.getRemovalReason())
                .isActive(blacklist.getIsActive());

        // Get admin names if available
        if (blacklist.getAddedBy() != null) {
            userRepository.findById(blacklist.getAddedBy()).ifPresent(admin -> 
                    builder.addedByName(admin.getFullName()));
        }
        if (blacklist.getRemovedBy() != null) {
            userRepository.findById(blacklist.getRemovedBy()).ifPresent(admin -> 
                    builder.removedByName(admin.getFullName()));
        }

        return builder.build();
    }
}
