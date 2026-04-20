package fit.nlu.tmdt.modules.booking.repository;

import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Booking Repository
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdAndDeletedAtIsNull(Long userId);

    List<Booking> findByLandlordIdAndDeletedAtIsNull(Long landlordId);

    List<Booking> findByPostIdAndDeletedAtIsNull(Long postId);

    long countByPostIdAndStatusAndDeletedAtIsNull(Long postId, BookingStatus status);

    Optional<Booking> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT b FROM Booking b WHERE b.post.id = :postId AND b.bookingTime >= :startOfDay AND b.bookingTime < :endOfDay AND b.status != 'CANCELLED' AND b.deletedAt IS NULL")
    List<Booking> findByPostIdAndDate(@Param("postId") Long postId, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT b FROM Booking b WHERE b.post.landlord.id = :landlordId AND b.bookingTime >= :startOfDay AND b.bookingTime < :endOfDay AND b.deletedAt IS NULL")
    List<Booking> findByLandlordIdAndDate(@Param("landlordId") Long landlordId, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    boolean existsByPostIdAndBookingTimeAndStatusNotIn(Long postId, LocalDateTime bookingTime, List<BookingStatus> excludedStatuses);

    long countByUserIdAndStatus(Long userId, BookingStatus status);

    long countByLandlordIdAndStatus(Long landlordId, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.status = 'CONFIRMED' AND b.bookingTime < :now AND b.deletedAt IS NULL")
    List<Booking> findPastConfirmedBookings(@Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.bookingTime < :deadline AND b.deletedAt IS NULL")
    List<Booking> findPendingBookingsPastDeadline(@Param("deadline") LocalDateTime deadline);

    // ==================== STATISTICS QUERIES ====================

    long countByLandlordId(Long landlordId);

    long countByStatus(BookingStatus status);

    long countByLandlordIdAndCreatedAtBetween(Long landlordId, LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Booking> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
