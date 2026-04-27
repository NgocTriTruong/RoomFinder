package fit.nlu.tmdt.modules.statistics.service.impl;

import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.booking.repository.BookingRepository;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import fit.nlu.tmdt.modules.media.repository.CentralMediaFileRepository;
import fit.nlu.tmdt.modules.payment.entity.Transaction;
import fit.nlu.tmdt.modules.payment.entity.enums.PaymentStatus;
import fit.nlu.tmdt.modules.payment.repository.TransactionRepository;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.report.entity.enums.ReportStatus;
import fit.nlu.tmdt.modules.report.repository.ReportRepository;
import fit.nlu.tmdt.modules.review.entity.Review;
import fit.nlu.tmdt.modules.review.repository.ReviewRepository;
import fit.nlu.tmdt.modules.statistics.dto.request.StatisticsRequest;
import fit.nlu.tmdt.modules.statistics.service.StatisticsService;
import fit.nlu.tmdt.modules.subscription.entity.Subscription;
import fit.nlu.tmdt.modules.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Statistics Service Implementation - Full Version
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TransactionRepository transactionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ReportRepository reportRepository;
    private final ReviewRepository reviewRepository;
    private final CentralMediaFileRepository mediaFileRepository;

    // ==================== OVERVIEW ====================

    @Override
    public Map<String, Object> getDashboardStats() {
        return getDashboardStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getDashboardStats(StatisticsRequest request) {
        log.info("Getting dashboard stats");

        Map<String, Object> stats = new LinkedHashMap<>();

        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        // Basic counts
        stats.put("totalPosts", postRepository.count());
        stats.put("approvedPosts", postRepository.countApprovedPosts());
        stats.put("pendingPosts", postRepository.countByStatusAndDeletedAtIsNull(PostStatus.PENDING));
        stats.put("rejectedPosts", postRepository.countByStatusAndDeletedAtIsNull(PostStatus.REJECTED));

        stats.put("totalUsers", userRepository.count());
        stats.put("verifiedUsers", userRepository.countVerifiedByRole(null));
        stats.put("landlords", userRepository.countByRole(UserRole.LANDLORD));
        stats.put("tenants", userRepository.countByRole(UserRole.USER));

        stats.put("pendingReports", reportRepository.countByStatusAndDeletedAtIsNull(ReportStatus.PENDING));
        stats.put("totalReports", reportRepository.count());

        // Revenue
        List<Transaction> transactions = transactionRepository.findAll();
        log.info("Calculating revenue from {} transactions", transactions.size());

        double totalRevenue = transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Transaction::getAmount)
                .sum();
        stats.put("totalRevenue", totalRevenue);

        // Growth metrics
        LocalDateTime lastMonthStart = startDate.minusMonths(1);
        LocalDateTime lastMonthEnd = startDate;
        
        double lastMonthRevenue = transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.SUCCESS && t.getCreatedAt() != null)
                .filter(t -> !t.getCreatedAt().isBefore(lastMonthStart) && t.getCreatedAt().isBefore(lastMonthEnd))
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        double currentMonthRevenue = transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.SUCCESS && t.getCreatedAt() != null)
                .filter(t -> !t.getCreatedAt().isBefore(startDate) && t.getCreatedAt().isBefore(endDate))
                .mapToDouble(Transaction::getAmount)
                .sum();

        log.info("Revenue stats - Total: {}, Last Month: {}, Current Month: {}", totalRevenue, lastMonthRevenue, currentMonthRevenue);

        double revenueGrowth = 0;
        if (lastMonthRevenue > 0) {
            revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (currentMonthRevenue > 0) {
            revenueGrowth = 100.0; // 100% growth if started from 0
        }
        stats.put("revenueGrowth", Math.round(revenueGrowth * 10.0) / 10.0);

        long lastMonthUsers = userRepository.countByCreatedAtBetween(lastMonthStart, lastMonthEnd);
        long currentMonthUsers = userRepository.countByCreatedAtBetween(startDate, endDate);
        double userGrowth = 0;
        if (lastMonthUsers > 0) {
            userGrowth = ((double)(currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
        } else if (currentMonthUsers > 0) {
            userGrowth = 100.0;
        }
        stats.put("userGrowth", Math.round(userGrowth * 10.0) / 10.0);
        
        stats.put("newPostsToday", postRepository.countByCreatedAtBetween(LocalDateTime.now().withHour(0).withMinute(0), LocalDateTime.now()));

        // Period stats
        stats.put("periodStart", startDate);
        stats.put("periodEnd", endDate);

        return stats;
    }

    // ==================== POSTS ====================

    @Override
    public Map<String, Object> getPostStats(Long landlordId) {
        return getPostStats(landlordId, StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getPostStats(Long landlordId, StatisticsRequest request) {
        log.info("Getting post stats for landlord: {}", landlordId);

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalPosts", postRepository.countByLandlordId(landlordId));
        stats.put("approvedPosts", postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.APPROVED));
        stats.put("pendingPosts", postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.PENDING));
        stats.put("rejectedPosts", postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.REJECTED));

        stats.put("totalViews", postRepository.sumViewCountByLandlordId(landlordId));
        stats.put("totalFavorites", postRepository.sumFavoriteCountByLandlordId(landlordId));
        stats.put("newPostsInPeriod", postRepository.countByLandlordIdAndCreatedAtBetween(landlordId, startDate, endDate));

        // Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (PostStatus status : PostStatus.values()) {
            statusBreakdown.put(status.name(), (long) postRepository.countByLandlordIdAndStatus(landlordId, status));
        }
        stats.put("statusBreakdown", statusBreakdown);

        return stats;
    }

    @Override
    public Map<String, Object> getAllPostStats() {
        return getAllPostStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getAllPostStats(StatisticsRequest request) {
        log.info("Getting all post stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalPosts", postRepository.count());
        stats.put("approvedPosts", postRepository.countApprovedPosts());
        stats.put("pendingPosts", postRepository.countByStatusAndDeletedAtIsNull(PostStatus.PENDING));
        stats.put("rejectedPosts", postRepository.countByStatusAndDeletedAtIsNull(PostStatus.REJECTED));

        stats.put("newPostsInPeriod", postRepository.countByCreatedAtBetween(startDate, endDate));
        stats.put("avgPrice", postRepository.avgPrice());
        stats.put("avgViewCount", postRepository.avgViewCount());
        stats.put("totalViews", postRepository.sumViewCount());
        stats.put("totalFavorites", postRepository.sumFavoriteCount());

        // Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (PostStatus status : PostStatus.values()) {
            statusBreakdown.put(status.name(), postRepository.countByStatusAndDeletedAtIsNull(status));
        }
        stats.put("statusBreakdown", statusBreakdown);

        // Top landlords
        stats.put("topLandlords", getLandlordPostStats(startDate, endDate, request.getLimitOrDefault()));

        return stats;
    }

    private List<Map<String, Object>> getLandlordPostStats(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Object[]> results = postRepository.findTopLandlordsByPosts(startDate, endDate, PageRequest.of(0, limit));
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("landlordId", row[0]);
            item.put("landlordName", row[1]);
            item.put("postCount", row[2]);
            item.put("totalViews", row[3]);
            list.add(item);
        }
        return list;
    }

    // ==================== USERS ====================

    @Override
    public Map<String, Object> getUserStats() {
        return getUserStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getUserStats(StatisticsRequest request) {
        log.info("Getting user stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalUsers", userRepository.count());
        stats.put("verifiedUsers", userRepository.countVerifiedByRole(null));
        stats.put("unverifiedUsers", userRepository.countUnverifiedByRole(null));

        stats.put("landlords", userRepository.countByRole(UserRole.LANDLORD));
        stats.put("tenants", userRepository.countByRole(UserRole.USER));
        stats.put("admins", userRepository.countByRole(UserRole.ADMIN));

        stats.put("newUsersInPeriod", userRepository.countByCreatedAtBetween(startDate, endDate));

        // Role breakdown
        Map<String, Long> roleBreakdown = new LinkedHashMap<>();
        for (UserRole role : UserRole.values()) {
            roleBreakdown.put(role.name(), userRepository.countByRole(role));
        }
        stats.put("roleBreakdown", roleBreakdown);

        return stats;
    }

    @Override
    public Map<String, Object> getUserRegistrationStats(StatisticsRequest request) {
        log.info("Getting user registration stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalRegistrations", userRepository.countByCreatedAtBetween(startDate, endDate));

        // Daily registrations
        stats.put("dailyRegistrations", getDailyRegistrations(startDate, endDate));

        // By role
        Map<String, Long> byRole = new LinkedHashMap<>();
        byRole.put("LANDLORD", userRepository.countByRoleAndCreatedAtBetween(UserRole.LANDLORD, startDate, endDate));
        byRole.put("USER", userRepository.countByRoleAndCreatedAtBetween(UserRole.USER, startDate, endDate));
        byRole.put("ADMIN", userRepository.countByRoleAndCreatedAtBetween(UserRole.ADMIN, startDate, endDate));
        stats.put("byRole", byRole);

        // Growth rate
        long daysDiff = java.time.Duration.between(startDate, endDate).toDays();
        LocalDateTime previousStart = startDate.minusDays(daysDiff);
        LocalDateTime previousEnd = startDate;
        long current = userRepository.countByCreatedAtBetween(startDate, endDate);
        long previous = userRepository.countByCreatedAtBetween(previousStart, previousEnd);
        double growthRate = previous > 0 ? ((double) (current - previous) / previous) * 100 : 0;
        stats.put("growthRate", Math.round(growthRate * 100.0) / 100.0);

        return stats;
    }

    private Map<String, Long> getDailyRegistrations(LocalDateTime startDate, LocalDateTime endDate) {
        List<User> users = userRepository.findByCreatedAtBetween(startDate, endDate);
        Map<String, Long> daily = new LinkedHashMap<>();

        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        while (!current.isAfter(end)) {
            LocalDateTime day = current;
            String dateKey = day.format(formatter);
            long count = users.stream()
                    .filter(u -> u.getCreatedAt().toLocalDate().atStartOfDay().equals(day))
                    .count();
            daily.put(dateKey, count);
            current = current.plusDays(1);
        }

        return daily;
    }

    @Override
    public Map<String, Object> getTopLandlords(StatisticsRequest request, int limit) {
        log.info("Getting top landlords");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();
        int topLimit = request.getLimitOrDefault();

        List<Object[]> results = postRepository.findTopLandlordsByPosts(startDate, endDate, PageRequest.of(0, topLimit));
        List<Map<String, Object>> landlords = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> landlord = new LinkedHashMap<>();
            landlord.put("landlordId", row[0]);
            landlord.put("landlordName", row[1]);
            landlord.put("postCount", row[2]);
            landlord.put("totalViews", row[3]);
            landlord.put("totalFavorites", postRepository.sumFavoriteCountByLandlordId((Long) row[0]));
            landlords.add(landlord);
        }

        stats.put("topLandlords", landlords);
        return stats;
    }

    // ==================== BOOKINGS ====================

    @Override
    public Map<String, Object> getBookingStats(Long landlordId) {
        return getBookingStats(landlordId, StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getBookingStats(Long landlordId, StatisticsRequest request) {
        log.info("Getting booking stats for landlord: {}", landlordId);

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalBookings", bookingRepository.countByLandlordId(landlordId));
        stats.put("pendingBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.PENDING));
        stats.put("confirmedBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.CONFIRMED));
        stats.put("completedBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.COMPLETED));
        stats.put("cancelledBookings", bookingRepository.countByLandlordIdAndStatus(landlordId, BookingStatus.CANCELLED));

        stats.put("bookingsInPeriod", bookingRepository.countByLandlordIdAndCreatedAtBetween(landlordId, startDate, endDate));

        // Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            statusBreakdown.put(status.name(), (long) bookingRepository.countByLandlordIdAndStatus(landlordId, status));
        }
        stats.put("statusBreakdown", statusBreakdown);

        return stats;
    }

    @Override
    public Map<String, Object> getAllBookingStats() {
        return getAllBookingStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getAllBookingStats(StatisticsRequest request) {
        log.info("Getting all booking stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalBookings", bookingRepository.count());
        stats.put("pendingBookings", bookingRepository.countByStatus(BookingStatus.PENDING));
        stats.put("confirmedBookings", bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        stats.put("completedBookings", bookingRepository.countByStatus(BookingStatus.COMPLETED));
        stats.put("cancelledBookings", bookingRepository.countByStatus(BookingStatus.CANCELLED));

        stats.put("bookingsInPeriod", bookingRepository.countByCreatedAtBetween(startDate, endDate));

        // Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            statusBreakdown.put(status.name(), (long) bookingRepository.countByStatus(status));
        }
        stats.put("statusBreakdown", statusBreakdown);

        return stats;
    }

    // ==================== REVENUE ====================

    @Override
    public Map<String, Object> getRevenueStats(String period, int months) {
        StatisticsRequest req = StatisticsRequest.builder().period(period).build();
        return getRevenueStats(req);
    }

    @Override
    public Map<String, Object> getRevenueStats(StatisticsRequest request) {
        log.info("Getting revenue stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        List<Transaction> transactions = transactionRepository.findByCreatedAtBetween(startDate, endDate);

        double totalRevenue = transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Transaction::getAmount)
                .sum();

        stats.put("totalRevenue", totalRevenue);
        stats.put("transactionCount", transactions.size());
        stats.put("successfulTransactions", transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.SUCCESS).count());
        stats.put("failedTransactions", transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.FAILED).count());
        stats.put("pendingTransactions", transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.PENDING).count());

        // Daily revenue
        if (request.shouldIncludeChartData()) {
            stats.put("dailyRevenue", getDailyRevenue(transactions, startDate, endDate));
            stats.put("revenueByType", getRevenueByType(transactions));
        }

        return stats;
    }

    private Map<String, Double> getDailyRevenue(List<Transaction> transactions, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Double> daily = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();

        while (!current.isAfter(end)) {
            LocalDateTime day = current;
            String dateKey = day.format(formatter);
            double dayRevenue = transactions.stream()
                    .filter(t -> t.getStatus() == PaymentStatus.SUCCESS)
                    .filter(t -> t.getCreatedAt().toLocalDate().atStartOfDay().equals(day))
                    .mapToDouble(Transaction::getAmount)
                    .sum();
            daily.put(dateKey, dayRevenue);
            current = current.plusDays(1);
        }

        return daily;
    }

    private Map<String, Double> getRevenueByType(List<Transaction> transactions) {
        Map<String, Double> byType = new LinkedHashMap<>();

        Map<String, Double> grouped = transactions.stream()
                .filter(t -> t.getStatus() == PaymentStatus.SUCCESS)
                .collect(Collectors.groupingBy(
                        t -> t.getOrderType() != null ? t.getOrderType() : "UNKNOWN",
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        return grouped;
    }

    // ==================== REVIEWS ====================

    @Override
    public Map<String, Object> getReviewStats() {
        return getReviewStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getReviewStats(StatisticsRequest request) {
        log.info("Getting review stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        List<Review> reviews = reviewRepository.findByCreatedAtBetween(startDate, endDate);

        stats.put("totalReviews", reviewRepository.count());
        stats.put("reviewsInPeriod", reviews.size());

        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        stats.put("averageRating", Math.round(avgRating * 10.0) / 10.0);

        // Rating distribution
        Map<Integer, Long> ratingDistribution = reviews.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
        stats.put("ratingDistribution", ratingDistribution);

        // Daily reviews
        if (request.shouldIncludeChartData()) {
            stats.put("dailyReviews", getDailyReviews(reviews, startDate, endDate));
        }

        return stats;
    }

    private Map<String, Long> getDailyReviews(List<Review> reviews, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Long> daily = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();

        while (!current.isAfter(end)) {
            LocalDateTime day = current;
            String dateKey = day.format(formatter);
            long count = reviews.stream()
                    .filter(r -> r.getCreatedAt().toLocalDate().atStartOfDay().equals(day))
                    .count();
            daily.put(dateKey, count);
            current = current.plusDays(1);
        }

        return daily;
    }

    // ==================== MEDIA ====================

    @Override
    public Map<String, Object> getMediaStats() {
        return getMediaStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getMediaStats(StatisticsRequest request) {
        log.info("Getting media stats");

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("totalFiles", mediaFileRepository.count());

        // Storage by category
        List<Object[]> byCategory = mediaFileRepository.sumFileSizeGroupByCategory();
        Map<String, Long> storageByCategory = new LinkedHashMap<>();
        long totalStorage = 0;
        for (Object[] row : byCategory) {
            String category = row[0] != null ? ((MediaCategory) row[0]).name() : "UNKNOWN";
            Long size = (Long) row[1];
            storageByCategory.put(category, size != null ? size : 0L);
            totalStorage += size != null ? size : 0L;
        }
        stats.put("storageByCategory", storageByCategory);
        stats.put("totalStorageBytes", totalStorage);
        stats.put("totalStorageMB", Math.round(totalStorage / (1024.0 * 1024.0) * 100.0) / 100.0);
        stats.put("totalStorageGB", Math.round(totalStorage / (1024.0 * 1024.0 * 1024.0) * 100.0) / 100.0);

        return stats;
    }

    // ==================== REPORTS ====================

    @Override
    public Map<String, Object> getReportStats() {
        return getReportStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getReportStats(StatisticsRequest request) {
        log.info("Getting report stats");

        Map<String, Object> stats = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        stats.put("totalReports", reportRepository.count());
        stats.put("pendingReports", reportRepository.countByStatusAndDeletedAtIsNull(ReportStatus.PENDING));
        stats.put("resolvedReports", reportRepository.countByStatusAndDeletedAtIsNull(ReportStatus.RESOLVED));
        stats.put("dismissedReports", reportRepository.countByStatusAndDeletedAtIsNull(ReportStatus.DISMISSED));

        stats.put("reportsInPeriod", reportRepository.countByCreatedAtBetween(startDate, endDate));

        // Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (ReportStatus status : ReportStatus.values()) {
            statusBreakdown.put(status.name(), reportRepository.countByStatusAndDeletedAtIsNull(status));
        }
        stats.put("statusBreakdown", statusBreakdown);

        return stats;
    }

    // ==================== SUBSCRIPTIONS ====================

    @Override
    public Map<String, Object> getSubscriptionStats() {
        return getSubscriptionStats(StatisticsRequest.builder().build());
    }

    @Override
    public Map<String, Object> getSubscriptionStats(StatisticsRequest request) {
        log.info("Getting subscription stats");

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("totalSubscriptions", subscriptionRepository.count());
        
        List<Subscription> allSubscriptions = subscriptionRepository.findAll();
        
        long activeCount = allSubscriptions.stream().filter(Subscription::isActive).count();
        long expiredCount = allSubscriptions.stream().filter(Subscription::isExpired).count();
        
        stats.put("activeSubscriptions", activeCount);
        stats.put("expiredSubscriptions", expiredCount);

        // Status breakdown
        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        statusBreakdown.put("ACTIVE", activeCount);
        statusBreakdown.put("EXPIRED", expiredCount);
        stats.put("statusBreakdown", statusBreakdown);

        return stats;
    }

    // ==================== COMPREHENSIVE ====================

    @Override
    public Map<String, Object> getComprehensiveStats(StatisticsRequest request) {
        log.info("Getting comprehensive stats");

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("overview", getDashboardStats(request));
        stats.put("posts", getAllPostStats(request));
        stats.put("users", getUserStats(request));
        stats.put("bookings", getAllBookingStats(request));
        stats.put("revenue", getRevenueStats(request));
        stats.put("reviews", getReviewStats(request));
        stats.put("media", getMediaStats(request));
        stats.put("reports", getReportStats(request));
        stats.put("subscriptions", getSubscriptionStats(request));

        return stats;
    }

    // ==================== CHART DATA ====================

    @Override
    public Map<String, Object> getPostChartData(StatisticsRequest request) {
        log.info("Getting post chart data");

        Map<String, Object> chartData = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        List<Post> posts = postRepository.findByCreatedAtBetween(startDate, endDate);

        chartData.put("dailyPosts", getDailyPostCounts(posts, startDate, endDate));
        chartData.put("period", request.getPeriodOrDefault());
        chartData.put("startDate", startDate);
        chartData.put("endDate", endDate);

        return chartData;
    }

    private Map<String, Long> getDailyPostCounts(List<Post> posts, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Long> daily = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();

        while (!current.isAfter(end)) {
            LocalDateTime day = current;
            String dateKey = day.format(formatter);
            long count = posts.stream()
                    .filter(p -> p.getCreatedAt().toLocalDate().atStartOfDay().equals(day))
                    .count();
            daily.put(dateKey, count);
            current = current.plusDays(1);
        }

        return daily;
    }

    @Override
    public Map<String, Object> getUserChartData(StatisticsRequest request) {
        Map<String, Object> chartData = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        chartData.put("dailyRegistrations", getDailyRegistrations(startDate, endDate));
        chartData.put("period", request.getPeriodOrDefault());
        chartData.put("startDate", startDate);
        chartData.put("endDate", endDate);

        return chartData;
    }

    @Override
    public Map<String, Object> getBookingChartData(StatisticsRequest request) {
        Map<String, Object> chartData = new LinkedHashMap<>();
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();

        List<Booking> bookings = bookingRepository.findByCreatedAtBetween(startDate, endDate);

        chartData.put("dailyBookings", getDailyBookingCounts(bookings, startDate, endDate));
        chartData.put("byStatus", getBookingCountsByStatus(bookings));
        chartData.put("period", request.getPeriodOrDefault());
        chartData.put("startDate", startDate);
        chartData.put("endDate", endDate);

        return chartData;
    }

    private Map<String, Long> getDailyBookingCounts(List<Booking> bookings, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Long> daily = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();

        while (!current.isAfter(end)) {
            LocalDateTime day = current;
            String dateKey = day.format(formatter);
            long count = bookings.stream()
                    .filter(b -> b.getCreatedAt().toLocalDate().atStartOfDay().equals(day))
                    .count();
            daily.put(dateKey, count);
            current = current.plusDays(1);
        }

        return daily;
    }

    private Map<String, Long> getBookingCountsByStatus(List<Booking> bookings) {
        return bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getStatus().name(),
                        Collectors.counting()
                ));
    }

    @Override
    public Map<String, Object> getRevenueChartData(StatisticsRequest request) {
        LocalDateTime startDate = request.getStartDateOrDefault();
        LocalDateTime endDate = request.getEndDateOrDefault();
        List<Transaction> transactions = transactionRepository.findByCreatedAtBetween(startDate, endDate);

        Map<String, Object> chartData = new LinkedHashMap<>();
        chartData.put("dailyRevenue", getDailyRevenue(transactions, startDate, endDate));
        chartData.put("period", request.getPeriodOrDefault());
        chartData.put("startDate", startDate);
        chartData.put("endDate", endDate);

        return chartData;
    }
}
