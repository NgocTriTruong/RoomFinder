package fit.nlu.tmdt.modules.statistics.repository;

import fit.nlu.tmdt.modules.statistics.entity.ViewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * ViewHistory Repository
 */
@Repository
public interface ViewHistoryRepository extends JpaRepository<ViewHistory, Long> {

    /**
     * Find ViewHistory by landlord and date
     */
    Optional<ViewHistory> findByLandlordIdAndViewDate(Long landlordId, LocalDate viewDate);

    /**
     * Find ViewHistory by post and date
     */
    Optional<ViewHistory> findByPostIdAndViewDate(Long postId, LocalDate viewDate);

    /**
     * Find ViewHistory by post, landlord and date
     */
    Optional<ViewHistory> findByPostIdAndLandlordIdAndViewDate(Long postId, Long landlordId, LocalDate viewDate);

    /**
     * Get daily stats for a landlord in date range
     * Returns [viewDate, totalViewCount, totalContactCount]
     */
    @Query("SELECT vh.viewDate, SUM(vh.viewCount), SUM(vh.contactCount) " +
            "FROM ViewHistory vh " +
            "WHERE vh.landlord.id = :landlordId " +
            "AND vh.viewDate BETWEEN :startDate AND :endDate " +
            "GROUP BY vh.viewDate " +
            "ORDER BY vh.viewDate ASC")
    List<Object[]> getDailyStatsByLandlordId(
            @Param("landlordId") Long landlordId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get daily stats for a specific post in date range
     * Returns [viewDate, totalViewCount, totalContactCount]
     */
    @Query("SELECT vh.viewDate, SUM(vh.viewCount), SUM(vh.contactCount) " +
            "FROM ViewHistory vh " +
            "WHERE vh.post.id = :postId " +
            "AND vh.viewDate BETWEEN :startDate AND :endDate " +
            "GROUP BY vh.viewDate " +
            "ORDER BY vh.viewDate ASC")
    List<Object[]> getDailyStatsByPostId(
            @Param("postId") Long postId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get total views for a landlord in date range
     */
    @Query("SELECT COALESCE(SUM(vh.viewCount), 0) FROM ViewHistory vh WHERE vh.landlord.id = :landlordId AND vh.viewDate BETWEEN :startDate AND :endDate")
    Long sumViewCountByLandlordIdAndDateRange(
            @Param("landlordId") Long landlordId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get total contacts for a landlord in date range
     */
    @Query("SELECT COALESCE(SUM(vh.contactCount), 0) FROM ViewHistory vh WHERE vh.landlord.id = :landlordId AND vh.viewDate BETWEEN :startDate AND :endDate")
    Long sumContactCountByLandlordIdAndDateRange(
            @Param("landlordId") Long landlordId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Delete old view history records (for cleanup)
     */
    @Modifying
    @Query("DELETE FROM ViewHistory vh WHERE vh.viewDate < :beforeDate")
    int deleteOldRecords(@Param("beforeDate") LocalDate beforeDate);
}
