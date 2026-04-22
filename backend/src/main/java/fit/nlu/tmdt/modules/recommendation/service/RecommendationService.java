package fit.nlu.tmdt.modules.recommendation.service;

import fit.nlu.tmdt.modules.recommendation.dto.request.RecommendationRequest;
import fit.nlu.tmdt.modules.recommendation.dto.request.UpdatePreferenceRequest;
import fit.nlu.tmdt.modules.recommendation.dto.response.RecommendationListResponse;
import fit.nlu.tmdt.modules.recommendation.dto.response.RecommendationResponse;
import fit.nlu.tmdt.modules.recommendation.entity.UserPreference;
import fit.nlu.tmdt.modules.recommendation.entity.enums.RecommendationType;

import java.util.List;
import java.util.Map;

/**
 * Recommendation Service Interface
 * Service xử lý AI recommendation cho phòng trọ
 */
public interface RecommendationService {

    // ==================== RECOMMENDATIONS ====================

    /**
     * Lấy personalized recommendations cho user
     *
     * @param userId ID của user
     * @param request Các tham số lọc
     * @return Danh sách recommendations
     */
    RecommendationListResponse getRecommendations(Long userId, RecommendationRequest request);

    /**
     * Lấy recommendations dựa trên tin đã xem
     *
     * @param userId ID của user
     * @param postId ID của tin đã xem
     * @param limit Số lượng recommendations
     * @return Danh sách recommendations
     */
    List<RecommendationResponse> getSimilarToViewed(Long userId, Long postId, int limit);

    /**
     * Lấy recommendations dựa trên tin đã yêu thích
     *
     * @param userId ID của user
     * @param limit Số lượng recommendations
     * @return Danh sách recommendations
     */
    List<RecommendationResponse> getBecauseYouLiked(Long userId, int limit);

    /**
     * Lấy recommendations gần vị trí user
     *
     * @param userId ID của user
     * @param latitude Vĩ độ
     * @param longitude Kinh độ
     * @param radiusKm Bán kính (km)
     * @param limit Số lượng recommendations
     * @return Danh sách recommendations
     */
    List<RecommendationResponse> getNearbyRecommendations(Long userId, Double latitude, Double longitude, Double radiusKm, int limit);

    /**
     * Lấy recommendations trong ngân sách
     *
     * @param userId ID của user
     * @param minBudget Ngân sách tối thiểu
     * @param maxBudget Ngân sách tối đa
     * @param limit Số lượng recommendations
     * @return Danh sách recommendations
     */
    List<RecommendationResponse> getBudgetFriendlyRecommendations(Long userId, Double minBudget, Double maxBudget, int limit);

    /**
     * Lấy tin mới đăng
     *
     * @param userId ID của user
     * @param limit Số lượng recommendations
     * @return Danh sách recommendations
     */
    List<RecommendationResponse> getNewPostRecommendations(Long userId, int limit);

    /**
     * Lấy trending posts
     *
     * @param userId ID của user
     * @param limit Số lượng recommendations
     * @return Danh sách recommendations
     */
    List<RecommendationResponse> getTrendingRecommendations(Long userId, int limit);

    // ==================== USER PREFERENCES ====================

    /**
     * Lấy preferences của user
     *
     * @param userId ID của user
     * @return UserPreference
     */
    UserPreference getUserPreferences(Long userId);

    /**
     * Cập nhật preferences của user
     *
     * @param userId ID của user
     * @param request Preference updates
     * @return Updated preferences
     */
    UserPreference updateUserPreferences(Long userId, UpdatePreferenceRequest request);

    /**
     * Tạo/mặc định preferences từ hành vi user
     *
     * @param userId ID của user
     * @return UserPreference
     */
    UserPreference buildPreferenceFromHistory(Long userId);

    /**
     * Xóa preferences của user
     *
     * @param userId ID của user
     */
    void deleteUserPreferences(Long userId);

    // ==================== TRACKING ====================

    /**
     * Track xem recommendation
     *
     * @param userId ID của user
     * @param postId ID của tin
     */
    void trackView(Long userId, Long postId);

    /**
     * Track click recommendation
     *
     * @param userId ID của user
     * @param postId ID của tin
     */
    void trackClick(Long userId, Long postId);

    /**
     * Track favorite từ recommendation
     *
     * @param userId ID của user
     * @param postId ID của tin
     */
    void trackFavorite(Long userId, Long postId);

    /**
     * Get engagement stats cho user
     *
     * @param userId ID của user
     * @return Map chứa stats
     */
    Map<String, Object> getEngagementStats(Long userId);

    // ==================== SCORING ====================

    /**
     * Tính recommendation score cho một post
     *
     * @param userId ID của user
     * @param postId ID của post
     * @param type Loại recommendation
     * @return Score (0.0 - 1.0)
     */
    double calculateScore(Long userId, Long postId, RecommendationType type);

    /**
     * Refresh recommendations cho user (chạy background)
     *
     * @param userId ID của user
     */
    void refreshRecommendations(Long userId);
}
