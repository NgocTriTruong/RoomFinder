package fit.nlu.tmdt.modules.user.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}
