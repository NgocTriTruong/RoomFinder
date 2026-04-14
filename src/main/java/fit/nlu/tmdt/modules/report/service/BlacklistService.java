package fit.nlu.tmdt.modules.report.service;

import fit.nlu.tmdt.modules.report.dto.response.BlacklistResponse;

import java.util.List;

/**
 * Blacklist Service Interface
 */
public interface BlacklistService {

    /**
     * Get all active blacklisted users
     */
    List<BlacklistResponse> getAllActiveBlacklist();

    /**
     * Add user to blacklist
     */
    BlacklistResponse addToBlacklist(Long userId, String reason, String type, Integer days, Long adminId);

    /**
     * Remove user from blacklist
     */
    BlacklistResponse removeFromBlacklist(Long blacklistId, String reason, Long adminId);

    /**
     * Check if user is blacklisted
     */
    boolean isBlacklisted(Long userId);

    /**
     * Get blacklist by user ID
     */
    BlacklistResponse getBlacklistByUserId(Long userId);

    /**
     * Get blacklist by ID
     */
    BlacklistResponse getBlacklistById(Long id);

    /**
     * Get blacklist statistics
     */
    Object getBlacklistStats();
}
