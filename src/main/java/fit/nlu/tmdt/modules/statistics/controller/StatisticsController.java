package fit.nlu.tmdt.modules.statistics.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.statistics.dto.request.StatisticsRequest;
import fit.nlu.tmdt.modules.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Statistics Controller - Full Version
 */
@RestController
@RequestMapping("/v1/statistics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Statistics", description = "Statistics APIs")
public class StatisticsController {

    private final StatisticsService statisticsService;

    // ==================== PRESET TIME PERIODS ====================
    // LAST_7_DAYS, LAST_14_DAYS, LAST_30_DAYS, LAST_90_DAYS, LAST_6_MONTHS, LAST_12_MONTHS, CUSTOM

    /**
     * Get dashboard overview statistics
     * Requires: ADMIN role
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(
            @Parameter(description = "Time period preset: LAST_7_DAYS, LAST_14_DAYS, LAST_30_DAYS, LAST_90_DAYS, LAST_6_MONTHS, LAST_12_MONTHS")
            @RequestParam(required = false) String period,
            
            @Parameter(description = "Start date (for CUSTOM period, format: yyyy-MM-ddTHH:mm:ss)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            
            @Parameter(description = "End date (for CUSTOM period, format: yyyy-MM-ddTHH:mm:ss)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get dashboard stats: period={}, startDate={}, endDate={}", period, startDate, endDate);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getDashboardStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get comprehensive statistics - all stats in one call
     * Requires: ADMIN role
     */
    @GetMapping("/comprehensive")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all statistics in one call")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveStats(
            @Parameter(description = "Time period preset")
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            
            @Parameter(description = "Include chart data (daily breakdowns)")
            @RequestParam(required = false, defaultValue = "false") Boolean includeChartData) {

        log.info("Get comprehensive stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .includeChartData(includeChartData)
                .build();

        Map<String, Object> stats = statisticsService.getComprehensiveStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== POSTS ====================

    /**
     * Get post statistics for landlord
     * Requires: LANDLORD role
     */
    @GetMapping("/posts")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get post statistics for landlord")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostStats(
            @CurrentUser Long landlordId,
            
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get post stats for landlord: {}", landlordId);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getPostStats(landlordId, request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get all post statistics (admin)
     * Requires: ADMIN role
     */
    @GetMapping("/posts/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all post statistics (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllPostStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {

        log.info("Get all post stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .limit(limit)
                .build();

        Map<String, Object> stats = statisticsService.getAllPostStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get post chart data (daily breakdown)
     * Requires: ADMIN role
     */
    @GetMapping("/posts/chart")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get post chart data")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostChartData(
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get post chart data: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> chartData = statisticsService.getPostChartData(request);
        return ResponseEntity.ok(ApiResponse.success(chartData));
    }

    // ==================== USERS ====================

    /**
     * Get user statistics
     * Requires: ADMIN role
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get user stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getUserStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get user registration statistics (daily breakdown)
     * Requires: ADMIN role
     */
    @GetMapping("/users/registrations")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user registration statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserRegistrationStats(
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get user registration stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .includeChartData(true)
                .build();

        Map<String, Object> stats = statisticsService.getUserRegistrationStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get user chart data
     * Requires: ADMIN role
     */
    @GetMapping("/users/chart")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user chart data")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserChartData(
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get user chart data: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> chartData = statisticsService.getUserChartData(request);
        return ResponseEntity.ok(ApiResponse.success(chartData));
    }

    /**
     * Get top landlords by posts
     * Requires: ADMIN role
     */
    @GetMapping("/landlords/top")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get top landlords by posts")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTopLandlords(
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {

        log.info("Get top landlords: period={}, limit={}", period, limit);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .limit(limit)
                .build();

        Map<String, Object> stats = statisticsService.getTopLandlords(request, limit);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== BOOKINGS ====================

    /**
     * Get booking statistics for landlord
     * Requires: LANDLORD role
     */
    @GetMapping("/bookings")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get booking statistics for landlord")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingStats(
            @CurrentUser Long landlordId,
            
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get booking stats for landlord: {}", landlordId);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getBookingStats(landlordId, request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get all booking statistics (admin)
     * Requires: ADMIN role
     */
    @GetMapping("/bookings/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all booking statistics (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllBookingStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get all booking stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getAllBookingStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get booking chart data
     * Requires: ADMIN role
     */
    @GetMapping("/bookings/chart")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get booking chart data")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingChartData(
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get booking chart data: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> chartData = statisticsService.getBookingChartData(request);
        return ResponseEntity.ok(ApiResponse.success(chartData));
    }

    // ==================== REVENUE ====================

    /**
     * Get revenue statistics
     * Requires: ADMIN role
     */
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueStats(
            @RequestParam(required = false, defaultValue = "monthly") String period,
            @RequestParam(required = false, defaultValue = "6") int months,
            
            @RequestParam(required = false) String timePeriod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            
            @RequestParam(required = false, defaultValue = "false") Boolean includeChartData) {

        log.info("Get revenue stats: period={}, months={}", period, months);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(timePeriod != null ? timePeriod : period)
                .startDate(startDate)
                .endDate(endDate)
                .includeChartData(includeChartData)
                .build();

        Map<String, Object> stats = statisticsService.getRevenueStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get revenue chart data
     * Requires: ADMIN role
     */
    @GetMapping("/revenue/chart")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue chart data")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueChartData(
            @RequestParam(required = false, defaultValue = "LAST_30_DAYS") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get revenue chart data: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> chartData = statisticsService.getRevenueChartData(request);
        return ResponseEntity.ok(ApiResponse.success(chartData));
    }

    // ==================== REVIEWS ====================

    /**
     * Get review statistics
     * Requires: ADMIN role
     */
    @GetMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get review statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReviewStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false, defaultValue = "false") Boolean includeChartData) {

        log.info("Get review stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .includeChartData(includeChartData)
                .build();

        Map<String, Object> stats = statisticsService.getReviewStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== MEDIA ====================

    /**
     * Get media/storage statistics
     * Requires: ADMIN role
     */
    @GetMapping("/media")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get media/storage statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMediaStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get media stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getMediaStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== REPORTS ====================

    /**
     * Get report statistics
     * Requires: ADMIN role
     */
    @GetMapping("/reports")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get report statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReportStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get report stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getReportStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== SUBSCRIPTIONS ====================

    /**
     * Get subscription statistics
     * Requires: ADMIN role
     */
    @GetMapping("/subscriptions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get subscription statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubscriptionStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Get subscription stats: period={}", period);

        StatisticsRequest request = StatisticsRequest.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        Map<String, Object> stats = statisticsService.getSubscriptionStats(request);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
