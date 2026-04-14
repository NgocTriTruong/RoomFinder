package fit.nlu.tmdt.modules.favorite.repository;

import fit.nlu.tmdt.modules.favorite.entity.RoomHistory;
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
 * RoomHistory Repository
 */
@Repository
public interface RoomHistoryRepository extends JpaRepository<RoomHistory, Long> {

    List<RoomHistory> findByUserIdAndDeletedAtIsNullOrderByViewedAtDesc(Long userId);

    Page<RoomHistory> findByUserIdAndDeletedAtIsNullOrderByViewedAtDesc(Long userId, Pageable pageable);

    Optional<RoomHistory> findByUserIdAndPostIdAndDeletedAtIsNull(Long userId, Long postId);

    @Query("SELECT rh FROM RoomHistory rh WHERE rh.user.id = :userId AND rh.post.room.id = :roomId AND rh.deletedAt IS NULL ORDER BY rh.viewedAt DESC")
    Optional<RoomHistory> findLatestByUserIdAndRoomId(@Param("userId") Long userId, @Param("roomId") Long roomId);

    @Query("SELECT DISTINCT rh.post.room.id FROM RoomHistory rh WHERE rh.user.id = :userId AND rh.deletedAt IS NULL ORDER BY rh.viewedAt DESC")
    List<Long> findDistinctRoomIdsByUserIdOrderByViewedAtDesc(@Param("userId") Long userId, Pageable pageable);

    void deleteByUserIdAndDeletedAtIsNull(Long userId);

    @Query("SELECT COUNT(rh) FROM RoomHistory rh WHERE rh.user.id = :userId AND rh.deletedAt IS NULL")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT rh FROM RoomHistory rh WHERE rh.user.id = :userId AND rh.post.id = :postId AND rh.deletedAt IS NULL ORDER BY rh.viewedAt DESC")
    Optional<RoomHistory> findByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);

    @Query("SELECT rh FROM RoomHistory rh JOIN FETCH rh.post p JOIN FETCH p.room WHERE rh.user.id = :userId AND rh.deletedAt IS NULL ORDER BY rh.viewedAt DESC")
    List<RoomHistory> findByUserIdWithPostAndRoom(@Param("userId") Long userId);
}
