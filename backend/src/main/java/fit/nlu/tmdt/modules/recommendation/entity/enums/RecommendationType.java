package fit.nlu.tmdt.modules.recommendation.entity.enums;

/**
 * Recommendation Type Enum
 * Loại thuật toán recommendation được sử dụng
 */
public enum RecommendationType {
    
    // Content-based filtering
    SIMILAR_PRICE,         // Giá tương tự
    SIMILAR_AREA,          // Diện tích tương tự
    SIMILAR_LOCATION,     // Vị trí tương tự
    SIMILAR_AMENITIES,    // Tiện ích tương tự
    
    // Collaborative filtering
    POPULAR_IN_AREA,       // Phổ biến trong khu vực
    TRENDING,              // Đang trending
    
    // Personalized
    FOR_YOU,              // Dành cho bạn (kết hợp nhiều yếu tố)
    BECAUSE_YOU_LIKED,    // Vì bạn đã thích
    SIMILAR_TO_VIEWED,    // Tương tự đã xem
    
    // Context
    NEARBY,               // Gần bạn
    BUDGET_FRIENDLY,      // Trong ngân sách
    NEW_POSTS,            // Tin mới đăng
    TOP_RATED;           // Được đánh giá cao
    
    /**
     * Lấy mô tả cho loại recommendation
     */
    public String getDescription() {
        switch (this) {
            case SIMILAR_PRICE: return "Phòng có giá tương tự";
            case SIMILAR_AREA: return "Phòng có diện tích tương tự";
            case SIMILAR_LOCATION: return "Phòng ở khu vực tương tự";
            case SIMILAR_AMENITIES: return "Phòng có tiện ích tương tự";
            case POPULAR_IN_AREA: return "Phổ biến trong khu vực";
            case TRENDING: return "Đang được quan tâm";
            case FOR_YOU: return "Dành cho bạn";
            case BECAUSE_YOU_LIKED: return "Vì bạn đã thích";
            case SIMILAR_TO_VIEWED: return "Tương tự phòng bạn đã xem";
            case NEARBY: return "Gần vị trí của bạn";
            case BUDGET_FRIENDLY: return "Trong ngân sách của bạn";
            case NEW_POSTS: return "Tin mới đăng gần đây";
            case TOP_RATED: return "Được đánh giá cao";
            default: return name();
        }
    }
    
    /**
     * Trọng số mặc định (0.0 - 1.0)
     */
    public double getDefaultWeight() {
        switch (this) {
            case FOR_YOU: return 0.4;
            case BECAUSE_YOU_LIKED: return 0.3;
            case SIMILAR_PRICE: return 0.15;
            case NEARBY: return 0.15;
            default: return 0.1;
        }
    }
}
