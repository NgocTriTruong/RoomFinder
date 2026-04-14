package fit.nlu.tmdt.modules.statistics.service;

import java.util.Map;

/**
 * Statistics Service Interface
 */
public interface StatisticsService {

    Map<String, Object> getDashboardStats();

    Map<String, Object> getPostStats(Long landlordId);

    Map<String, Object> getRevenueStats(String period, int months);

    Map<String, Object> getUserStats();

    Map<String, Object> getBookingStats(Long landlordId);
}
