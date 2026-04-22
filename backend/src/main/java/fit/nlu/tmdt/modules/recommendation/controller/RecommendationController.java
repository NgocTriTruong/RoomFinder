package fit.nlu.tmdt.modules.recommendation.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.recommendation.dto.request.RecommendationRequest;
import fit.nlu.tmdt.modules.recommendation.dto.request.UpdatePreferenceRequest;
import fit.nlu.tmdt.modules.recommendation.dto.response.RecommendationListResponse;
import fit.nlu.tmdt.modules.recommendation.dto.response.RecommendationResponse;
import fit.nlu.tmdt.modules.recommendation.entity.UserPreference;
import fit.nlu.tmdt.modules.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Recommendation Controller
 * API cho AI-powered recommendation system
 */
@RestController
@RequestMapping("/v1/recommendations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Recommendation", description = "AI-powered room recommendation APIs")
public class RecommendationController {

    private final RecommendationService recommendationService;

    // ==================== RECOMMENDATIONS ====================

    /**
     * Lấy personalized recommendations
     * GET /api/v1/recommendations
     */
    @GetMapping
    @Operation(summary = "Get personalized recommendations", 
               description = "Get AI-powered room recommendations based on user preferences and behavior")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RecommendationListResponse>> getRecommendations(
            @CurrentUser Long userId,
            @ModelAttribute RecommendationRequest request) {

        log.info("Get recommendations for user: {}", userId);
        RecommendationListResponse response = recommendationService.getRecommendations(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Lấy recommendations vì bạn đã thích
     * GET /api/v1/recommendations/because-you-liked
     */
    @GetMapping("/because-you-liked")
    @Operation(summary = "Recommendations based on favorites", 
               description = "Get recommendations similar to rooms you've favorited")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getBecauseYouLiked(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get because-you-liked recommendations for user: {}", userId);
        List<RecommendationResponse> responses = recommendationService.getBecauseYouLiked(userId, limit);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy recommendations tương tự đã xem
     * GET /api/v1/recommendations/similar
     */
    @GetMapping("/similar")
    @Operation(summary = "Recommendations similar to viewed posts", 
               description = "Get recommendations similar to posts you've viewed")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getSimilarToViewed(
            @CurrentUser Long userId,
            @RequestParam(required = false) Long postId,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get similar-to-viewed recommendations for user: {}, based on post: {}", userId, postId);
        List<RecommendationResponse> responses = recommendationService.getSimilarToViewed(userId, postId, limit);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy recommendations gần bạn
     * GET /api/v1/recommendations/nearby
     */
    @GetMapping("/nearby")
    @Operation(summary = "Get nearby recommendations", 
               description = "Get room recommendations near your location")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getNearbyRecommendations(
            @CurrentUser Long userId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radiusKm,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get nearby recommendations for user: {} at {}, {}", userId, latitude, longitude);
        List<RecommendationResponse> responses = recommendationService.getNearbyRecommendations(
                userId, latitude, longitude, radiusKm, limit);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy recommendations trong ngân sách
     * GET /api/v1/recommendations/budget-friendly
     */
    @GetMapping("/budget-friendly")
    @Operation(summary = "Get budget-friendly recommendations", 
               description = "Get room recommendations within your budget")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getBudgetFriendlyRecommendations(
            @CurrentUser Long userId,
            @RequestParam(required = false) Double minBudget,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get budget-friendly recommendations for user: {}", userId);
        List<RecommendationResponse> responses = recommendationService.getBudgetFriendlyRecommendations(
                userId, minBudget, maxBudget, limit);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy tin mới
     * GET /api/v1/recommendations/new
     */
    @GetMapping("/new")
    @Operation(summary = "Get new post recommendations", 
               description = "Get recently posted room recommendations")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getNewPostRecommendations(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get new post recommendations for user: {}", userId);
        List<RecommendationResponse> responses = recommendationService.getNewPostRecommendations(userId, limit);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy trending recommendations
     * GET /api/v1/recommendations/trending
     */
    @GetMapping("/trending")
    @Operation(summary = "Get trending recommendations", 
               description = "Get popular/trending room recommendations")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getTrendingRecommendations(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get trending recommendations for user: {}", userId);
        List<RecommendationResponse> responses = recommendationService.getTrendingRecommendations(userId, limit);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // ==================== USER PREFERENCES ====================

    /**
     * Lấy preferences của user
     * GET /api/v1/recommendations/preferences
     */
    @GetMapping("/preferences")
    @Operation(summary = "Get user preferences", 
               description = "Get user's room preferences for recommendations")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserPreference>> getUserPreferences(@CurrentUser Long userId) {

        log.info("Get preferences for user: {}", userId);
        UserPreference preferences = recommendationService.getUserPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success(preferences));
    }

    /**
     * Cập nhật preferences
     * PUT /api/v1/recommendations/preferences
     */
    @PutMapping("/preferences")
    @Operation(summary = "Update user preferences", 
               description = "Update user's room preferences for better recommendations")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserPreference>> updatePreferences(
            @CurrentUser Long userId,
            @Valid @RequestBody UpdatePreferenceRequest request) {

        log.info("Update preferences for user: {}", userId);
        UserPreference preferences = recommendationService.updateUserPreferences(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", preferences));
    }

    /**
     * Xóa preferences
     * DELETE /api/v1/recommendations/preferences
     */
    @DeleteMapping("/preferences")
    @Operation(summary = "Delete user preferences", 
               description = "Reset user preferences to default")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deletePreferences(@CurrentUser Long userId) {

        log.info("Delete preferences for user: {}", userId);
        recommendationService.deleteUserPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success("Preferences deleted successfully", null));
    }

    /**
     * Build preferences từ lịch sử
     * POST /api/v1/recommendations/preferences/build
     */
    @PostMapping("/preferences/build")
    @Operation(summary = "Build preferences from history", 
               description = "Automatically build preferences based on user's viewing and favoriting history")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<UserPreference>> buildPreferencesFromHistory(@CurrentUser Long userId) {

        log.info("Build preferences from history for user: {}", userId);
        UserPreference preferences = recommendationService.buildPreferenceFromHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("Preferences built from history", preferences));
    }

    // ==================== TRACKING ====================

    /**
     * Track xem recommendation
     * POST /api/v1/recommendations/track/view
     */
    @PostMapping("/track/view")
    @Operation(summary = "Track recommendation view", 
               description = "Track when a recommended post is viewed")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> trackView(
            @CurrentUser Long userId,
            @RequestParam Long postId) {

        log.info("Track view: user={}, post={}", userId, postId);
        recommendationService.trackView(userId, postId);
        return ResponseEntity.ok(ApiResponse.success("View tracked", null));
    }

    /**
     * Track click recommendation
     * POST /api/v1/recommendations/track/click
     */
    @PostMapping("/track/click")
    @Operation(summary = "Track recommendation click", 
               description = "Track when a recommended post is clicked")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> trackClick(
            @CurrentUser Long userId,
            @RequestParam Long postId) {

        log.info("Track click: user={}, post={}", userId, postId);
        recommendationService.trackClick(userId, postId);
        return ResponseEntity.ok(ApiResponse.success("Click tracked", null));
    }

    /**
     * Track favorite từ recommendation
     * POST /api/v1/recommendations/track/favorite
     */
    @PostMapping("/track/favorite")
    @Operation(summary = "Track recommendation favorite", 
               description = "Track when a recommended post is favorited")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> trackFavorite(
            @CurrentUser Long userId,
            @RequestParam Long postId) {

        log.info("Track favorite: user={}, post={}", userId, postId);
        recommendationService.trackFavorite(userId, postId);
        return ResponseEntity.ok(ApiResponse.success("Favorite tracked", null));
    }

    /**
     * Lấy engagement stats
     * GET /api/v1/recommendations/engagement
     */
    @GetMapping("/engagement")
    @Operation(summary = "Get engagement statistics", 
               description = "Get recommendation engagement statistics for the user")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEngagementStats(@CurrentUser Long userId) {

        log.info("Get engagement stats for user: {}", userId);
        Map<String, Object> stats = recommendationService.getEngagementStats(userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Refresh recommendations
     * POST /api/v1/recommendations/refresh
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh recommendations", 
               description = "Manually trigger recommendation refresh")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> refreshRecommendations(@CurrentUser Long userId) {

        log.info("Refresh recommendations for user: {}", userId);
        recommendationService.refreshRecommendations(userId);
        return ResponseEntity.ok(ApiResponse.success("Recommendations refreshed", null));
    }
}
