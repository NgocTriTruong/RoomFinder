package fit.nlu.tmdt.modules.post.repository;

import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.favorite.entity.RoomHistory;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Post Repository
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    Optional<Post> findByIdAndDeletedAtIsNull(Long id);

    Page<Post> findByLandlordIdAndDeletedAtIsNull(Long landlordId, Pageable pageable);

    Page<Post> findByStatusAndDeletedAtIsNull(PostStatus status, Pageable pageable);

    Page<Post> findByLandlordIdAndStatusInAndDeletedAtIsNull(Long landlordId, List<PostStatus> statuses, Pageable pageable);

    boolean existsByRoomIdAndStatusInAndDeletedAtIsNull(Long roomId, List<PostStatus> statuses);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.landlord.id = :landlordId AND p.deletedAt IS NULL")
    long countByLandlordId(@Param("landlordId") Long landlordId);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.landlord.id = :landlordId AND p.status = :status AND p.deletedAt IS NULL")
    long countByLandlordIdAndStatus(@Param("landlordId") Long landlordId, @Param("status") PostStatus status);

    // Query với EntityGraph để tránh N+1
    @EntityGraph(attributePaths = {"images", "room", "room.amenities", "landlord"})
    @Query("SELECT p FROM Post p WHERE p.id = :id AND p.deletedAt IS NULL")
    Optional<Post> findByIdActive(@Param("id") Long id);

    @Query("SELECT CASE WHEN p.landlord.id = :userId THEN true ELSE false END FROM Post p WHERE p.id = :postId")
    boolean isOwner(@Param("postId") Long postId, @Param("userId") Long userId);

    // Boosted posts
    @Query("SELECT p FROM Post p WHERE p.isBoosted = true AND p.boostedUntil > :now AND p.deletedAt IS NULL")
    List<Post> findActiveBoostedPosts(@Param("now") LocalDateTime now);

    // Các bài viết phổ biến
    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL ORDER BY p.viewCount DESC")
    Page<Post> findMostViewed(Pageable pageable);

    // Các bài viết mới nhất
    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    Page<Post> findLatestApproved(Pageable pageable);

    // Cập nhật view count
    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // Đánh dấu hết hạn
    @Modifying
    @Query("UPDATE Post p SET p.status = 'EXPIRED' WHERE p.expiresAt < :now AND p.status = 'APPROVED' AND p.deletedAt IS NULL")
    int markExpiredPosts(@Param("now") LocalDateTime now);

    // Tìm bài viết sắp hết hạn (trong 3 ngày)
    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.expiresAt BETWEEN :now AND :deadline AND p.deletedAt IS NULL")
    List<Post> findExpiringPosts(@Param("now") LocalDateTime now, @Param("deadline") LocalDateTime deadline);

    // Tìm active post theo room ID
    @Query("SELECT p FROM Post p WHERE p.room.id = :roomId AND p.status = 'APPROVED' AND p.deletedAt IS NULL")
    Optional<Post> findActivePostByRoomId(@Param("roomId") Long roomId);

    // Thống kê
    @Query("SELECT p.status, COUNT(p) FROM Post p WHERE p.deletedAt IS NULL GROUP BY p.status")
    List<Object[]> countByStatus();

    @Query("SELECT COUNT(p) FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL")
    long countApprovedPosts();

    @Query("SELECT COUNT(p) FROM Post p WHERE p.status = :status AND p.deletedAt IS NULL")
    long countByStatusAndDeletedAtIsNull(@Param("status") PostStatus status);

    // Room History related queries
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    Page<Post> findLatestActivePosts(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL ORDER BY p.viewCount DESC")
    Page<Post> findMostViewedPosts(Pageable pageable);

    // Get recent posts viewed by user (based on room history)
    @Query("SELECT p FROM Post p " +
            "JOIN RoomHistory rh ON rh.post.id = p.id " +
            "WHERE rh.user.id = :userId AND p.deletedAt IS NULL " +
            "ORDER BY rh.viewedAt DESC")
    List<Post> findRecentPostsByUserId(@Param("userId") Long userId, Pageable pageable);

    // Find similar posts for recommendations
    @Query("SELECT p FROM Post p " +
            "WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL " +
            "AND p.room.district = :district " +
            "ORDER BY p.viewCount DESC")
    List<Post> findSimilarPosts(@Param("postId") Long postId, @Param("district") String district, Pageable pageable);

    // Featured posts (boosted + high rating)
    @EntityGraph(attributePaths = {"images", "room", "room.amenities", "landlord"})
    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL ORDER BY p.isBoosted DESC, p.viewCount DESC, p.createdAt DESC")
    List<Post> findFeaturedPosts(@Param("limit") int limit);

    // ==================== SPECIFICATION QUERIES WITH ENTITY GRAPH ====================

    // Note: For search with graph, use postRepository.postsWithGraph() in PostService

    // ==================== STATISTICS QUERIES ====================

    long countByLandlordIdAndCreatedAtBetween(Long landlordId, LocalDateTime start, LocalDateTime end);

    List<Post> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT AVG(p.price) FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL")
    Double avgPrice();

    @Query("SELECT AVG(p.viewCount) FROM Post p WHERE p.status = 'APPROVED' AND p.deletedAt IS NULL")
    Double avgViewCount();

    @Query("SELECT SUM(p.viewCount) FROM Post p WHERE p.deletedAt IS NULL")
    Long sumViewCount();

    @Query("SELECT SUM(p.favoriteCount) FROM Post p WHERE p.deletedAt IS NULL")
    Long sumFavoriteCount();

    @Query("SELECT SUM(p.viewCount) FROM Post p WHERE p.landlord.id = :landlordId AND p.deletedAt IS NULL")
    Long sumViewCountByLandlordId(@Param("landlordId") Long landlordId);

    @Query("SELECT SUM(p.favoriteCount) FROM Post p WHERE p.landlord.id = :landlordId AND p.deletedAt IS NULL")
    Long sumFavoriteCountByLandlordId(@Param("landlordId") Long landlordId);

    @Query("SELECT p.landlord.id, p.landlord.fullName, COUNT(p), SUM(p.viewCount) " +
            "FROM Post p WHERE p.createdAt BETWEEN :start AND :end AND p.deletedAt IS NULL " +
            "GROUP BY p.landlord.id, p.landlord.fullName ORDER BY COUNT(p) DESC")
    List<Object[]> findTopLandlordsByPosts(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.status = 'EXPIRED' AND p.deletedAt IS NULL")
    long countExpiredPosts();

    @Query("SELECT p.room.province, COUNT(p) FROM Post p " +
            "WHERE p.createdAt BETWEEN :start AND :end AND p.deletedAt IS NULL " +
            "GROUP BY p.room.province ORDER BY COUNT(p) DESC")
    List<Object[]> countByProvince(LocalDateTime start, LocalDateTime end);
}
