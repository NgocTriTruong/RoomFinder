package fit.nlu.tmdt.modules.statistics.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Statistics Controller
 */
@RestController
@RequestMapping("/v1/statistics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Statistics", description = "Statistics APIs")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        log.info("Get dashboard stats");
        Map<String, Object> stats = statisticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/posts")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get post statistics for landlord")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostStats(@CurrentUser Long landlordId) {
        log.info("Get post stats for landlord: {}", landlordId);
        Map<String, Object> stats = statisticsService.getPostStats(landlordId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueStats(
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam(defaultValue = "6") int months) {
        log.info("Get revenue stats: period={}, months={}", period, months);
        Map<String, Object> stats = statisticsService.getRevenueStats(period, months);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        log.info("Get user stats");
        Map<String, Object> stats = statisticsService.getUserStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get booking statistics for landlord")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingStats(@CurrentUser Long landlordId) {
        log.info("Get booking stats for landlord: {}", landlordId);
        Map<String, Object> stats = statisticsService.getBookingStats(landlordId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
