package fit.nlu.tmdt.modules.review.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.review.dto.request.CreateReviewRequest;
import fit.nlu.tmdt.modules.review.dto.request.UpdateReviewRequest;
import fit.nlu.tmdt.modules.review.dto.response.ReviewResponse;
import fit.nlu.tmdt.modules.review.dto.response.ReviewStatsResponse;
import fit.nlu.tmdt.modules.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Review Controller
 */
@RestController
@RequestMapping("/v1/reviews")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Review", description = "Review Management APIs")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Create a new review")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @CurrentUser Long userId) {

        log.info("Create review from user: {}", userId);
        ReviewResponse response = reviewService.createReview(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Review created successfully", response));
    }

    @GetMapping("/post/{postId}")
    @Operation(summary = "Get reviews for a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getPostReviews(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Get reviews for post: {}", postId);
        List<ReviewResponse> reviews = reviewService.getPostReviews(postId, page, size);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's reviews")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @CurrentUser Long userId) {

        log.info("Get reviews for user: {}", userId);
        List<ReviewResponse> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a review")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewRequest request,
            @CurrentUser Long userId) {

        log.info("Update review: {} by user: {}", id, userId);
        ReviewResponse response = reviewService.updateReview(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            @CurrentUser Long userId) {

        log.info("Delete review: {} by user: {}", id, userId);
        reviewService.deleteReview(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }

    @PostMapping("/{id}/helpful")
    @Operation(summary = "Mark review as helpful")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> markAsHelpful(
            @PathVariable Long id,
            @CurrentUser Long userId) {

        log.info("Mark review as helpful: {} by user: {}", id, userId);
        reviewService.markAsHelpful(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Marked as helpful", null));
    }

    @PostMapping("/{id}/report")
    @Operation(summary = "Report a review")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> reportReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long userId) {

        String reason = body.get("reason");
        log.info("Report review: {} by user: {}", id, userId);
        reviewService.reportReview(id, reason, userId);
        return ResponseEntity.ok(ApiResponse.success("Review reported", null));
    }

    @PostMapping("/{id}/respond")
    @Operation(summary = "Landlord responds to review")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReviewResponse>> landlordRespond(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long landlordId) {

        String response = body.get("response");
        log.info("Landlord respond to review: {} by landlord: {}", id, landlordId);
        ReviewResponse reviewResponse = reviewService.landlordRespond(id, response, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Response added", reviewResponse));
    }

    @GetMapping("/landlord/{landlordId}")
    @Operation(summary = "Get reviews for a landlord")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getLandlordReviews(
            @PathVariable Long landlordId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Get reviews for landlord: {}", landlordId);
        List<ReviewResponse> reviews = reviewService.getReviewsByLandlordId(landlordId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/average/{postId}")
    @Operation(summary = "Get average rating for a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReviewStatsResponse>> getAverageRating(
            @PathVariable Long postId) {

        log.info("Get average rating for post: {}", postId);
        ReviewStatsResponse stats = reviewService.getAverageRating(postId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}