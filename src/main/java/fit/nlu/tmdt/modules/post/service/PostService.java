package fit.nlu.tmdt.modules.post.service;

import fit.nlu.tmdt.modules.post.dto.request.CreatePostRequest;
import fit.nlu.tmdt.modules.post.dto.request.PostSearchParams;
import fit.nlu.tmdt.modules.post.dto.request.UpdatePostRequest;
import fit.nlu.tmdt.modules.post.dto.response.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Post Service Interface
 */
public interface PostService {

    /**
     * Search posts với filter
     */
    Page<PostResponse> searchPosts(PostSearchParams params, Pageable pageable, Long userId);

    /**
     * Get post by ID
     */
    PostResponse getPostById(Long id, Long userId);

    /**
     * Create new post
     */
    PostResponse createPost(CreatePostRequest request, Long landlordId);

    /**
     * Update post
     */
    PostResponse updatePost(Long id, UpdatePostRequest request, Long landlordId);

    /**
     * Delete post (soft delete)
     */
    void deletePost(Long id, Long landlordId);

    /**
     * Get my posts
     */
    Page<PostResponse> getMyPosts(Long landlordId, Pageable pageable);

    /**
     * Get post stats
     */
    PostStatsResponse getPostStats(Long postId, Long landlordId);

    /**
     * Check if user is owner
     */
    boolean isOwner(Long postId, Long userId);

    /**
     * Increment view count async
     */
    void incrementViewCountAsync(Long postId);

    /**
     * Admin: Approve post
     */
    void approvePost(Long postId, Long adminId);

    /**
     * Admin: Reject post
     */
    void rejectPost(Long postId, String reason, Long adminId);

    /**
     * Admin: Get pending posts
     */
    Page<PostResponse> getPendingPosts(Pageable pageable);

    /**
     * Boost a post
     */
    Map<String, Object> boostPost(Long postId, Long boostPackageId, Long landlordId);

    /**
     * Extend post expiration
     */
    Map<String, Object> extendPost(Long postId, int days, Long landlordId);

    /**
     * Search public posts (no auth required)
     */
    Page<PostResponse> searchPublicPosts(PostSearchParams params, Pageable pageable);

    /**
     * Get featured posts (no auth required)
     */
    List<PostResponse> getFeaturedPosts(int limit);

    record PostStatsResponse(
            Long postId,
            Integer viewCount,
            Integer favoriteCount,
            Integer contactCount,
            Integer bookingCount,
            Integer completedBookings
    ) {}
}
