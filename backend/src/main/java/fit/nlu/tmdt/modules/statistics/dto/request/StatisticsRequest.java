package fit.nlu.tmdt.modules.statistics.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Statistics Request DTO
 * Chứa các tham số cho thống kê
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsRequest {

    /**
     * Preset time periods:
     * - LAST_7_DAYS: 7 ngày gần nhất
     * - LAST_14_DAYS: 14 ngày gần nhất (2 tuần)
     * - LAST_30_DAYS: 30 ngày gần nhất
     * - LAST_90_DAYS: 90 ngày gần nhất
     * - CUSTOM: Tự chọn startDate và endDate
     */
    private String period;
    
    /**
     * Ngày bắt đầu (áp dụng khi period = CUSTOM)
     */
    private LocalDateTime startDate;
    
    /**
     * Ngày kết thúc (áp dụng khi period = CUSTOM)
     */
    private LocalDateTime endDate;
    
    /**
     * Trả về dữ liệu dạng biểu đồ
     */
    private Boolean includeChartData;
    
    /**
     * Giới hạn kết quả (top N)
     */
    private Integer limit;

    // ==================== PRESET VALUES ====================
    
    public static final String LAST_7_DAYS = "LAST_7_DAYS";
    public static final String LAST_14_DAYS = "LAST_14_DAYS";
    public static final String LAST_30_DAYS = "LAST_30_DAYS";
    public static final String LAST_90_DAYS = "LAST_90_DAYS";
    public static final String LAST_6_MONTHS = "LAST_6_MONTHS";
    public static final String LAST_12_MONTHS = "LAST_12_MONTHS";
    public static final String CUSTOM = "CUSTOM";
    
    // ==================== HELPERS ====================
    
    /**
     * Lấy ngày bắt đầu dựa trên period
     */
    public LocalDateTime getStartDateOrDefault() {
        if (startDate != null) {
            return startDate;
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        switch (period != null ? period.toUpperCase() : LAST_30_DAYS) {
            case LAST_7_DAYS:
                return now.minusDays(7);
            case LAST_14_DAYS:
                return now.minusDays(14);
            case LAST_30_DAYS:
                return now.minusDays(30);
            case LAST_90_DAYS:
                return now.minusDays(90);
            case LAST_6_MONTHS:
                return now.minusMonths(6);
            case LAST_12_MONTHS:
                return now.minusMonths(12);
            case CUSTOM:
            default:
                return now.minusDays(30);
        }
    }
    
    /**
     * Lấy ngày kết thúc
     */
    public LocalDateTime getEndDateOrDefault() {
        if (endDate != null) {
            return endDate;
        }
        return LocalDateTime.now();
    }
    
    /**
     * Lấy period với giá trị mặc định
     */
    public String getPeriodOrDefault() {
        if (period == null || period.isBlank()) {
            return LAST_30_DAYS;
        }
        return period.toUpperCase();
    }
    
    /**
     * Kiểm tra có lấy chart data không
     */
    public boolean shouldIncludeChartData() {
        return Boolean.TRUE.equals(includeChartData);
    }
    
    /**
     * Lấy limit với giá trị mặc định
     */
    public int getLimitOrDefault() {
        if (limit == null || limit <= 0) {
            return 10;
        }
        return Math.min(limit, 100);
    }
}
