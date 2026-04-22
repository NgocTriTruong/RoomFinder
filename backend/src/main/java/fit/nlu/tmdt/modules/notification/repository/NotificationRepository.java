package fit.nlu.tmdt.modules.notification.repository;

import fit.nlu.tmdt.modules.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Notification Repository
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);

    Optional<Notification> findByIdAndDeletedAtIsNull(Long id);

    List<Notification> findByUserIdAndIsReadAndDeletedAtIsNull(Long userId, Boolean isRead);

    long countByUserIdAndIsReadAndDeletedAtIsNull(Long userId, Boolean isRead);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user.id = :userId AND n.isRead = false AND n.deletedAt IS NULL")
    int markAllAsReadByUserId(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false AND n.deletedAt IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.deletedAt IS NULL ORDER BY n.createdAt DESC LIMIT :limit")
    List<Notification> findRecentByUserId(@Param("userId") Long userId, @Param("limit") int limit);

    List<Notification> findByUserIdAndTypeAndDeletedAtIsNull(Long userId, String type);

    @Query("SELECT n FROM Notification n WHERE n.referenceType = :type AND n.referenceId = :refId AND n.deletedAt IS NULL")
    List<Notification> findByReference(@Param("type") String type, @Param("refId") Long refId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId AND n.createdAt < :before")
    int deleteOldNotifications(@Param("userId") Long userId, @Param("before") java.time.LocalDateTime before);
}