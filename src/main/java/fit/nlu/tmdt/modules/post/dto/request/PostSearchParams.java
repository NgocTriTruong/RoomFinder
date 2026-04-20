package fit.nlu.tmdt.modules.post.dto.request;

import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Post Search Params - Parameters for filtering posts with fuzzy search support
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSearchParams {

    // ==================== FUZZY SEARCH ====================
    
    /**
     * Từ khóa tìm kiếm (hỗ trợ fuzzy search)
     */
    private String keyword;
    
    /**
     * Chế độ fuzzy search:
     * - NORMAL: Tìm kiếm bình thường, không phân biệt dấu
     * - EXACT: Tìm chính xác cụm từ (không dấu)
     * - PREFIX: Tìm theo tiền tố (phong* -> phong tro, phong o to)
     * - ALL_WORDS: Tất cả từ phải match (AND)
     * - ANY_WORD: Bất kỳ từ nào match (OR)
     * - PHRASE: Tìm chính xác cụm từ
     */
    private String fuzzyMode;
    
    /**
     * Độ fuzzy tối đa (1-5), mặc định 2
     * Áp dụng cho Levenshtein distance
     */
    private Integer fuzzyDistance;
    
    // ==================== PRICE & AREA ====================
    
    private Double minPrice;
    private Double maxPrice;
    private Double minArea;
    private Double maxArea;
    
    // ==================== LOCATION ====================
    
    private String district;
    private String province;
    private String ward;
    
    /**
     * Tìm kiếm gần đúng theo địa chỉ
     */
    private String address;
    
    /**
     * Tọa độ để tìm kiếm theo bán kính
     */
    private Double latitude;
    private Double longitude;
    private Double radiusKm;  // Bán kính tìm kiếm (km)
    
    // ==================== AMENITIES ====================
    
    /**
     * IDs của các tiện ích yêu cầu
     * Mặc định: tất cả tiện ích phải match (AND)
     * Nếu matchAny=true: bất kỳ tiện ích nào match (OR)
     */
    private List<Long> amenityIds;
    private Boolean matchAnyAmenity;  // true = OR, false = AND
    
    // ==================== FILTERS ====================
    
    private Boolean petFriendly;
    private Boolean parkingAvailable;
    private Boolean hasBalcony;
    private Boolean hasWindows;
    private Long nearbyUniversityId;
    private Integer minRating;
    private Integer minFloor;
    private Integer maxFloor;
    private Integer minOccupancy;
    
    // ==================== STATUS & SORTING ====================
    
    private PostStatus status;  // Default: APPROVED
    private Boolean isBoosted;
    private String sortBy;  // createdAt, price, viewCount, favoriteCount, area, rating
    private String sortDirection;  // asc, desc
    
    // ==================== PAGE ====================
    
    private Integer page;
    private Integer size;
    
    // ==================== HELPERS ====================
    
    /**
     * Lấy fuzzy mode với giá trị mặc định
     */
    public String getFuzzyModeOrDefault() {
        if (fuzzyMode == null || fuzzyMode.isBlank()) {
            return "NORMAL";
        }
        return fuzzyMode.toUpperCase();
    }
    
    /**
     * Lấy fuzzy distance với giá trị mặc định
     */
    public int getFuzzyDistanceOrDefault() {
        if (fuzzyDistance == null || fuzzyDistance < 1 || fuzzyDistance > 5) {
            return 2;
        }
        return fuzzyDistance;
    }
    
    /**
     * Kiểm tra có tìm kiếm theo vị trí không
     */
    public boolean hasLocationSearch() {
        return latitude != null && longitude != null;
    }
    
    /**
     * Kiểm tra có tìm kiếm theo vị trí cụ thể không
     */
    public boolean hasSpecificLocation() {
        return (district != null && !district.isBlank()) ||
               (province != null && !province.isBlank()) ||
               hasLocationSearch();
    }
    
    /**
     * Lấy sort field với giá trị mặc định
     */
    public String getSortByOrDefault() {
        if (sortBy == null || sortBy.isBlank()) {
            return "createdAt";
        }
        return sortBy.toLowerCase();
    }
    
    /**
     * Lấy sort direction với giá trị mặc định
     */
    public String getSortDirectionOrDefault() {
        if (sortDirection == null || sortDirection.isBlank()) {
            return "desc";
        }
        return sortDirection.toLowerCase();
    }
}
