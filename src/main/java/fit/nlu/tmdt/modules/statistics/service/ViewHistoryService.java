package fit.nlu.tmdt.modules.statistics.service;

import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.statistics.entity.ViewHistory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * ViewHistory Service Interface
 */
public interface ViewHistoryService {

    /**
     * Record a view for a post (called when a user views a post)
     */
    void recordView(Post post);

    /**
     * Record a contact for a post (called when a user contacts landlord)
     */
    void recordContact(Post post);

    /**
     * Get or create today's ViewHistory record for a post
     */
    ViewHistory getOrCreateToday(Post post);

    /**
     * Get ViewHistory by landlord and date
     */
    Optional<ViewHistory> getByLandlordAndDate(Long landlordId, LocalDate date);

    /**
     * Get daily stats for landlord in date range
     * Returns list of [viewDate, viewCount, contactCount]
     */
    List<Object[]> getDailyStats(Long landlordId, LocalDate startDate, LocalDate endDate);

    /**
     * Get total views for landlord in date range
     */
    long getTotalViews(Long landlordId, LocalDate startDate, LocalDate endDate);

    /**
     * Get total contacts for landlord in date range
     */
    long getTotalContacts(Long landlordId, LocalDate startDate, LocalDate endDate);

    /**
     * Delete old records for cleanup
     */
    void deleteOldRecords(int daysToKeep);
}
