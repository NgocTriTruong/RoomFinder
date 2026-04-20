package fit.nlu.tmdt.modules.recommendation.repository;

import fit.nlu.tmdt.modules.recommendation.entity.RecommendationLog;
import fit.nlu.tmdt.modules.recommendation.entity.enums.RecommendationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * RecommendationLog Repository
 */
@Repository
public interface RecommendationLogRepository extends JpaRepository<RecommendationLog, Long> {

    // Find by user
    Page<RecommendationLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Find by user and type
    List<RecommendationLog> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, RecommendationType type);

    // Find by post
    List<RecommendationLog> findByPostId(Long postId);

    // Find unwatched recommendations
    @Query("SELECT rl FROM RecommendationLog rl WHERE rl.userId = :userId AND rl.wasViewed = false ORDER BY rl.createdAt DESC")
    List<RecommendationLog> findUnwatchedByUserId(@Param("userId") Long userId, Pageable pageable);

    // Count interactions
    @Query("SELECT COUNT(rl) FROM RecommendationLog rl WHERE rl.userId = :userId AND rl.wasClicked = true")
    long countClickedByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(rl) FROM RecommendationLog rl WHERE rl.userId = :userId AND rl.wasFavorited = true")
    long countFavoritedByUserId(@Param("userId") Long userId);

    // Check if user has recommendation for post
    Optional<RecommendationLog> findByUserIdAndPostId(Long userId, Long postId);

    // Mark as viewed
    @Modifying
    @Query("UPDATE RecommendationLog rl SET rl.wasViewed = true, rl.viewedAt = :now WHERE rl.userId = :userId AND rl.post.id = :postId AND rl.wasViewed = false")
    int markAsViewed(@Param("userId") Long userId, @Param("postId") Long postId, @Param("now") LocalDateTime now);

    // Mark as clicked
    @Modifying
    @Query("UPDATE RecommendationLog rl SET rl.wasClicked = true, rl.clickedAt = :now WHERE rl.userId = :userId AND rl.post.id = :postId AND rl.wasClicked = false")
    int markAsClicked(@Param("userId") Long userId, @Param("postId") Long postId, @Param("now") LocalDateTime now);

    // Mark as favorited
    @Modifying
    @Query("UPDATE RecommendationLog rl SET rl.wasFavorited = true, rl.favoritedAt = :now WHERE rl.userId = :userId AND rl.post.id = :postId AND rl.wasFavorited = false")
    int markAsFavorited(@Param("userId") Long userId, @Param("postId") Long postId, @Param("now") LocalDateTime now);

    // Get engagement stats
    @Query("SELECT rl.type, COUNT(rl), SUM(CASE WHEN rl.wasClicked = true THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN rl.wasFavorited = true THEN 1 ELSE 0 END) " +
           "FROM RecommendationLog rl WHERE rl.userId = :userId GROUP BY rl.type")
    List<Object[]> getEngagementStatsByType(@Param("userId") Long userId);

    // Cleanup old logs
    @Modifying
    @Query("DELETE FROM RecommendationLog rl WHERE rl.createdAt < :before AND rl.wasViewed = false")
    int deleteOldUnwatched(@Param("before") LocalDateTime before);
}
