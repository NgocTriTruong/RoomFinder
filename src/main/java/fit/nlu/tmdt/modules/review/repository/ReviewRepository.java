package fit.nlu.tmdt.modules.review.repository;

import fit.nlu.tmdt.modules.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Review Repository
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByPostIdAndIsVisibleAndDeletedAtIsNullOrderByCreatedAtDesc(Long postId, Boolean isVisible, Pageable pageable);

    List<Review> findByUserIdAndDeletedAtIsNull(Long userId);

    List<Review> findByLandlordIdAndDeletedAtIsNull(Long landlordId);

    Optional<Review> findByIdAndDeletedAtIsNull(Long id);

    Optional<Review> findByBookingIdAndDeletedAtIsNull(Long bookingId);

    boolean existsByBookingIdAndDeletedAtIsNull(Long bookingId);

    long countByPostIdAndIsVisibleAndDeletedAtIsNull(Long postId, Boolean isVisible);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.post.id = :postId AND r.isVisible = true AND r.deletedAt IS NULL")
    Double getAverageRatingByPostId(@Param("postId") Long postId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.post.id = :postId AND r.isVisible = true AND r.deletedAt IS NULL GROUP BY r.rating")
    List<Object[]> getRatingDistributionByPostId(@Param("postId") Long postId);

    @Query("SELECT AVG(r.landlordRating) FROM Review r WHERE r.landlord.id = :landlordId AND r.landlordRating IS NOT NULL AND r.deletedAt IS NULL")
    Double getAverageLandlordRatingByLandlordId(@Param("landlordId") Long landlordId);

    long countByLandlordIdAndDeletedAtIsNull(Long landlordId);

    List<Review> findByPostIdAndIsVisibleAndDeletedAtIsNull(Long postId, Boolean isVisible);

    @Query("SELECT r FROM Review r WHERE r.isVisible = true AND r.deletedAt IS NULL ORDER BY r.helpfulCount DESC, r.createdAt DESC")
    Page<Review> findTopHelpfulReviews(Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.reportCount >= 5 AND r.deletedAt IS NULL")
    List<Review> findReportedReviews();

    @Query("SELECT r FROM Review r WHERE r.landlord.id = :landlordId AND r.deletedAt IS NULL ORDER BY r.createdAt DESC")
    Page<Review> findByLandlordIdPaginated(@Param("landlordId") Long landlordId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.landlord.id = :landlordId AND r.isVisible = true AND r.deletedAt IS NULL ORDER BY r.createdAt DESC")
    List<Review> findByLandlordIdAndIsVisibleAndDeletedAtIsNull(@Param("landlordId") Long landlordId, Boolean isVisible);

    // ==================== STATISTICS QUERIES ====================

    List<Review> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}