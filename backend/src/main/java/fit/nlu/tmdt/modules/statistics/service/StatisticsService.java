package fit.nlu.tmdt.modules.statistics.service;

import fit.nlu.tmdt.modules.statistics.dto.request.StatisticsRequest;

import java.util.Map;

/**
 * Statistics Service Interface
 */
public interface StatisticsService {

    // ==================== OVERVIEW ====================
    
    /**
     * Dashboard stats - tổng quan hệ thống
     */
    Map<String, Object> getDashboardStats();

    /**
     * Dashboard stats với khoảng thời gian
     */
    Map<String, Object> getDashboardStats(StatisticsRequest request);

    // ==================== POSTS ====================
    
    /**
     * Post stats cho landlord
     */
    Map<String, Object> getPostStats(Long landlordId);

    /**
     * Post stats cho landlord với khoảng thời gian
     */
    Map<String, Object> getPostStats(Long landlordId, StatisticsRequest request);

    /**
     * Tất cả post stats (admin)
     */
    Map<String, Object> getAllPostStats();

    /**
     * Tất cả post stats với khoảng thời gian (admin)
     */
    Map<String, Object> getAllPostStats(StatisticsRequest request);

    // ==================== USERS ====================
    
    /**
     * User stats
     */
    Map<String, Object> getUserStats();

    /**
     * User stats với khoảng thời gian
     */
    Map<String, Object> getUserStats(StatisticsRequest request);

    /**
     * Thống kê đăng ký user theo thời gian
     */
    Map<String, Object> getUserRegistrationStats(StatisticsRequest request);

    /**
     * Top landlords
     */
    Map<String, Object> getTopLandlords(StatisticsRequest request, int limit);

    // ==================== BOOKINGS ====================
    
    /**
     * Booking stats cho landlord
     */
    Map<String, Object> getBookingStats(Long landlordId);

    /**
     * Booking stats với khoảng thời gian
     */
    Map<String, Object> getBookingStats(Long landlordId, StatisticsRequest request);

    /**
     * Tất cả booking stats (admin)
     */
    Map<String, Object> getAllBookingStats();

    /**
     * Tất cả booking stats với khoảng thời gian
     */
    Map<String, Object> getAllBookingStats(StatisticsRequest request);

    // ==================== REVENUE ====================
    
    /**
     * Revenue stats (legacy)
     */
    Map<String, Object> getRevenueStats(String period, int months);

    /**
     * Revenue stats với request chi tiết
     */
    Map<String, Object> getRevenueStats(StatisticsRequest request);

    // ==================== REVIEWS ====================
    
    /**
     * Review stats
     */
    Map<String, Object> getReviewStats();

    /**
     * Review stats với khoảng thời gian
     */
    Map<String, Object> getReviewStats(StatisticsRequest request);

    // ==================== MEDIA ====================
    
    /**
     * Media/Storage stats
     */
    Map<String, Object> getMediaStats();

    /**
     * Media/Storage stats với khoảng thời gian
     */
    Map<String, Object> getMediaStats(StatisticsRequest request);

    // ==================== REPORTS ====================
    
    /**
     * Report stats
     */
    Map<String, Object> getReportStats();

    /**
     * Report stats với khoảng thời gian
     */
    Map<String, Object> getReportStats(StatisticsRequest request);

    // ==================== SUBSCRIPTIONS ====================
    
    /**
     * Subscription stats
     */
    Map<String, Object> getSubscriptionStats();

    /**
     * Subscription stats với khoảng thời gian
     */
    Map<String, Object> getSubscriptionStats(StatisticsRequest request);

    // ==================== COMPREHENSIVE ====================
    
    /**
     * Comprehensive stats - tất cả trong một
     */
    Map<String, Object> getComprehensiveStats(StatisticsRequest request);

    // ==================== CHART DATA ====================
    
    /**
     * Lấy dữ liệu biểu đồ posts theo thời gian
     */
    Map<String, Object> getPostChartData(StatisticsRequest request);

    /**
     * Lấy dữ liệu biểu đồ users theo thời gian
     */
    Map<String, Object> getUserChartData(StatisticsRequest request);

    /**
     * Lấy dữ liệu biểu đồ bookings theo thời gian
     */
    Map<String, Object> getBookingChartData(StatisticsRequest request);

    /**
     * Lấy dữ liệu biểu đồ revenue theo thời gian
     */
    Map<String, Object> getRevenueChartData(StatisticsRequest request);
}
