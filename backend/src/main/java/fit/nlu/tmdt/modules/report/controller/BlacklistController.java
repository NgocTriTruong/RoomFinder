package fit.nlu.tmdt.modules.report.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.report.dto.request.CreateBlacklistRequest;
import fit.nlu.tmdt.modules.report.dto.response.BlacklistResponse;
import fit.nlu.tmdt.modules.report.service.BlacklistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Blacklist Controller
 */
@RestController
@RequestMapping("/v1/blacklist")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Blacklist", description = "Blacklist Management APIs")
public class BlacklistController {

    private final BlacklistService blacklistService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all active blacklisted users")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<BlacklistResponse>>> getAllBlacklist() {
        log.info("Get all blacklist");
        List<BlacklistResponse> blacklist = blacklistService.getAllActiveBlacklist();
        return ResponseEntity.ok(ApiResponse.success(blacklist));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add user to blacklist")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<BlacklistResponse>> addToBlacklist(
            @Valid @RequestBody CreateBlacklistRequest request,
            @CurrentUser Long adminId) {

        log.info("Add user {} to blacklist, reason: {}", request.getUserId(), request.getReason());
        BlacklistResponse response = blacklistService.addToBlacklist(
                request.getUserId(),
                request.getReason(),
                request.getType(),
                request.getDays(),
                adminId
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("User added to blacklist", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove user from blacklist")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<BlacklistResponse>> removeFromBlacklist(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long adminId) {

        String reason = body.get("reason");
        log.info("Remove blacklist entry {}, reason: {}", id, reason);
        BlacklistResponse response = blacklistService.removeFromBlacklist(id, reason, adminId);
        return ResponseEntity.ok(ApiResponse.success("User removed from blacklist", response));
    }

    @GetMapping("/check/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Check if user is blacklisted")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkBlacklist(@PathVariable Long userId) {
        log.info("Check blacklist for user: {}", userId);
        boolean isBlacklisted = blacklistService.isBlacklisted(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("isBlacklisted", isBlacklisted)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get blacklist entry by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<BlacklistResponse>> getBlacklistById(@PathVariable Long id) {
        log.info("Get blacklist entry: {}", id);
        BlacklistResponse response = blacklistService.getBlacklistById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get blacklist entry by user ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<BlacklistResponse>> getBlacklistByUserId(@PathVariable Long userId) {
        log.info("Get blacklist entry for user: {}", userId);
        BlacklistResponse response = blacklistService.getBlacklistByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get blacklist statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Object>> getBlacklistStats() {
        log.info("Get blacklist stats");
        Object stats = blacklistService.getBlacklistStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
