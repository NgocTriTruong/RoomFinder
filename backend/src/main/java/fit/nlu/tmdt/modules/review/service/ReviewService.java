package fit.nlu.tmdt.modules.review.service;

import fit.nlu.tmdt.modules.review.dto.request.CreateReviewRequest;
import fit.nlu.tmdt.modules.review.dto.request.UpdateReviewRequest;
import fit.nlu.tmdt.modules.review.dto.response.ReviewResponse;
import fit.nlu.tmdt.modules.review.dto.response.ReviewStatsResponse;

import java.util.List;

/**
 * Review Service Interface
 */
public interface ReviewService {

    /**
     * Create review for a post
     */
    ReviewResponse createReview(CreateReviewRequest request, Long userId);

    /**
     * Update review
     */
    ReviewResponse updateReview(Long reviewId, UpdateReviewRequest request, Long userId);

    /**
     * Delete review
     */
    void deleteReview(Long reviewId, Long userId);

    /**
     * Get reviews by post
     */
    List<ReviewResponse> getPostReviews(Long postId, int page, int size);

    /**
     * Get user's reviews
     */
    List<ReviewResponse> getUserReviews(Long userId);

    /**
     * Get landlord's reviews
     */
    List<ReviewResponse> getLandlordReviews(Long landlordId);

    /**
     * Get reviews by landlord ID
     */
    List<ReviewResponse> getReviewsByLandlordId(Long landlordId);

    /**
     * Get average rating for post
     */
    ReviewStatsResponse getAverageRating(Long postId);

    /**
     * Get review by ID
     */
    ReviewResponse getReviewById(Long reviewId);

    /**
     * Landlord response to review
     */
    ReviewResponse landlordRespond(Long reviewId, String response, Long landlordId);

    /**
     * Get review stats for post
     */
    ReviewStatsResponse getPostReviewStats(Long postId);

    /**
     * Mark review as helpful
     */
    void markAsHelpful(Long reviewId, Long userId);

    /**
     * Report review
     */
    void reportReview(Long reviewId, String reason, Long reporterId);
}