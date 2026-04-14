package fit.nlu.tmdt.modules.statistics.service.impl;

import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.booking.repository.BookingRepository;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.payment.repository.TransactionRepository;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.report.repository.ReportRepository;
import fit.nlu.tmdt.modules.report.entity.enums.ReportStatus;
import fit.nlu.tmdt.modules.subscription.repository.SubscriptionRepository;
import fit.nlu.tmdt.modules.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Statistics Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsServiceImpl implements StatisticsService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TransactionRepository transactionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ReportRepository reportRepository;

    @Override
    public Map<String, Object> getDashboardStats() {
        log.info("Getting dashboard stats");

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalPosts", postRepository.count());
        stats.put("approvedPosts", postRepository.countApprovedPosts());
        stats.put("pendingPosts", postRepository.countByStatusAndDeletedAtIsNull(PostStatus.PENDING));
        stats.put("totalUsers", userRepository.count());
        stats.put("verifiedUsers", userRepository.countVerifiedByRole(null));
        stats.put("pendingReports", reportRepository.countByStatusAndDeletedAtIsNull(ReportStatus.PENDING));

        return stats;
    }

    @Override
    public Map<String, Object> getPostStats(Long landlordId) {
        log.info("Getting post stats for landlord: {}", landlordId);

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalPosts", postRepository.countByLandlordId(landlordId));
        stats.put("approvedPosts", postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.APPROVED));
        stats.put("pendingPosts", postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.PENDING));
        stats.put("rejectedPosts", postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.REJECTED));

        return stats;
    }

    @Override
    public Map<String, Object> getRevenueStats(String period, int months) {
        log.info("Getting revenue stats: period={}, months={}", period, months);

        Map<String, Object> stats = new HashMap<>();

        stats.put("period", period);
        stats.put("months", months);
        stats.put("totalRevenue", 0);
        stats.put("transactionCount", 0);

        return stats;
    }

    @Override
    public Map<String, Object> getUserStats() {
        log.info("Getting user stats");

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("verifiedUsers", userRepository.countVerifiedByRole(null));

        return stats;
    }

    @Override
    public Map<String, Object> getBookingStats(Long landlordId) {
        log.info("Getting booking stats for landlord: {}", landlordId);

        Map<String, Object> stats = new HashMap<>();

        stats.put("pendingBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.PENDING));
        stats.put("confirmedBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.CONFIRMED));
        stats.put("completedBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.COMPLETED));
        stats.put("cancelledBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.CANCELLED));

        return stats;
    }
}
