package fit.nlu.tmdt.modules.user.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.common.utils.PageResponse;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.media.dto.response.CentralMediaResponse;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import fit.nlu.tmdt.modules.media.service.CentralMediaService;
import fit.nlu.tmdt.modules.user.dto.request.UpdateProfileRequest;
import fit.nlu.tmdt.modules.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import fit.nlu.tmdt.modules.user.dto.request.KYCRequest;

import java.util.Map;

/**
 * User Controller
 */
@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User", description = "User Management APIs")
public class UserController {

    private final UserService userService;
    private final CentralMediaService centralMediaService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentProfile(
            @CurrentUser Long userId) {
        log.info("Get profile request for user: {}", userId);
        UserResponse response = userService.getCurrentProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user profile by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable Long id) {
        log.info("Get profile request for user: {}", id);
        UserResponse response = userService.getUserProfile(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @CurrentUser Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        log.info("Update profile request for user: {}", userId);
        UserResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/profile/avatar")
    @Operation(summary = "Upload avatar")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            @CurrentUser Long userId,
            @RequestParam("file") MultipartFile file) {
        log.info("Upload avatar request for user: {}", userId);
        
        // Upload file qua CentralMediaService
        CentralMediaResponse mediaResponse = centralMediaService.uploadFile(
                file, MediaCategory.USER_AVATAR, userId);
        
        // Update avatar URL
        String avatarUrl = mediaResponse.getFileUrl();
        UserResponse response = userService.uploadAvatar(userId, avatarUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", response));
    }

    @GetMapping("/landlords/{id}")
    @Operation(summary = "Get landlord profile with stats")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserService.LandlordProfileResponse>> getLandlordProfile(
            @PathVariable Long id) {
        log.info("Get landlord profile request: {}", id);
        UserService.LandlordProfileResponse response = userService.getLandlordProfile(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAdminUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String verificationStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserResponse> users = userService.getAdminUsers(search, role, status, verificationStatus, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(users)));
    }

    @GetMapping("/admin/pending-kyc")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get pending KYC users (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getPendingKycUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserResponse> users = userService.getAdminUsers(null, "LANDLORD", null, "PENDING", pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(users)));
    }

    @PutMapping("/admin/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user status (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long adminId) {

        String status = body.get("status");
        log.info("Update user status: {} -> {} (by admin {})", id, status, adminId);
        UserResponse response = userService.updateUserStatus(id, status, adminId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", response));
    }

    @PostMapping("/kyc")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Submit KYC verification (Landlord)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> submitKYC(
            @CurrentUser Long userId,
            @Valid @RequestBody KYCRequest request) {
        log.info("Submit KYC request for user: {}", userId);
        UserResponse response = userService.submitKYC(userId, request);
        return ResponseEntity.ok(ApiResponse.success("KYC submitted successfully", response));
    }

    @PostMapping("/admin/verify/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve or Reject KYC (Admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserResponse>> verifyUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long adminId) {
        String status = body.get("status");
        String adminNote = body.get("adminNote");
        log.info("Verify user {} request: status={} (by admin {})", id, status, adminId);
        UserResponse response = userService.verifyUser(id, status, adminNote, adminId);
        return ResponseEntity.ok(ApiResponse.success("User verification processed", response));
    }
}
