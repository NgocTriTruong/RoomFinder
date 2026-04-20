package fit.nlu.tmdt.modules.post.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.common.utils.PageResponse;
import fit.nlu.tmdt.modules.post.dto.request.CreatePostRequest;
import fit.nlu.tmdt.modules.post.dto.request.PostSearchParams;
import fit.nlu.tmdt.modules.post.dto.request.UpdatePostRequest;
import fit.nlu.tmdt.modules.post.dto.response.LandlordDashboardStats;
import fit.nlu.tmdt.modules.post.dto.response.PostResponse;
import fit.nlu.tmdt.modules.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Post Controller
 */
@RestController
@RequestMapping("/v1/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Post", description = "Post Management APIs")
public class PostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "Search/list posts (authenticated)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPosts(
            @ModelAttribute PostSearchParams params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @CurrentUser(required = false) Long userId) {

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PostResponse> posts = postService.searchPosts(params, pageable, userId);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(posts)));
    }

    @GetMapping("/public")
    @Operation(summary = "Search/list public posts (no auth required)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPublicPosts(
            @ModelAttribute PostSearchParams params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PostResponse> posts = postService.searchPublicPosts(params, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(posts)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured posts (no auth required)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<PostResponse>>> getFeaturedPosts(
            @RequestParam(defaultValue = "10") int limit) {

        List<PostResponse> posts = postService.getFeaturedPosts(limit);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get post by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(
            @PathVariable Long id,
            @CurrentUser(required = false) Long userId) {

        PostResponse response = postService.getPostById(id, userId);
        postService.incrementViewCountAsync(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Create new post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @CurrentUser Long landlordId) {

        log.info("Create post request from landlord: {}", landlordId);
        PostResponse response = postService.createPost(request, landlordId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Post created successfully and pending approval", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Update post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            @CurrentUser Long landlordId) {

        log.info("Update post: {} by landlord: {}", id, landlordId);
        PostResponse response = postService.updatePost(id, request, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Delete post (soft delete)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id,
            @CurrentUser Long landlordId) {

        log.info("Delete post: {} by landlord: {}", id, landlordId);
        postService.deletePost(id, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get my posts")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser Long landlordId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PostResponse> posts = postService.getMyPosts(landlordId, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(posts)));
    }

    @GetMapping("/landlord/dashboard/stats")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get landlord dashboard stats")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<LandlordDashboardStats>> getLandlordDashboardStats(
            @CurrentUser Long landlordId) {

        log.info("Get landlord dashboard stats for landlord: {}", landlordId);
        LandlordDashboardStats stats = postService.getLandlordDashboardStats(landlordId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get post statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PostService.PostStatsResponse>> getPostStats(
            @PathVariable Long id,
            @CurrentUser Long landlordId) {

        PostService.PostStatsResponse stats = postService.getPostStats(id, landlordId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PostMapping("/{id}/boost")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Boost a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> boostPost(
            @PathVariable Long id,
            @RequestParam Long boostPackageId,
            @CurrentUser Long landlordId) {

        log.info("Boost post: {} with package: {} by landlord: {}", id, boostPackageId, landlordId);
        Map<String, Object> result = postService.boostPost(id, boostPackageId, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Post boosted successfully", result));
    }

    @PostMapping("/{id}/extend")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Extend post expiration")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> extendPost(
            @PathVariable Long id,
            @RequestParam(defaultValue = "30") int days,
            @CurrentUser Long landlordId) {

        log.info("Extend post: {} by {} days by landlord: {}", id, days, landlordId);
        Map<String, Object> result = postService.extendPost(id, days, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Post extended successfully", result));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get pending posts (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<PostResponse> posts = postService.getPendingPosts(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(posts)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin posts with optional status filter")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getAdminPosts(
            @ModelAttribute PostSearchParams params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PostResponse> posts = postService.getAdminPosts(params, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(posts)));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve post (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> approvePost(
            @PathVariable Long id,
            @CurrentUser Long adminId) {

        log.info("Approve post: {} by admin: {}", id, adminId);
        postService.approvePost(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Post approved successfully", null));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject post (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> rejectPost(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long adminId) {

        String reason = body.get("reason");
        log.info("Reject post: {} by admin: {} with reason: {}", id, adminId, reason);
        postService.rejectPost(id, reason, adminId);
        return ResponseEntity.ok(ApiResponse.success("Post rejected", null));
    }
}
