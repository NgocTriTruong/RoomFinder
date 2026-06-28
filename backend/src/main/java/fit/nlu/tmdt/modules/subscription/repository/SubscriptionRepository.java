package fit.nlu.tmdt.modules.subscription.repository;

import fit.nlu.tmdt.modules.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Subscription Repository
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByLandlordIdAndIsActiveTrue(Long landlordId);

    @Query("SELECT s FROM Subscription s WHERE s.landlord.id = :landlordId AND s.isActive = true AND s.expiresAt > :now ORDER BY s.expiresAt DESC, s.id DESC")
    List<Subscription> findActiveByLandlordId(@Param("landlordId") Long landlordId, @Param("now") LocalDateTime now);

    List<Subscription> findByLandlordId(Long landlordId);

    long countByPkgId(Long packageId);

    @Modifying
    @Query("UPDATE Subscription s SET s.remainingPosts = s.remainingPosts - 1 WHERE s.landlord.id = :landlordId AND s.remainingPosts > 0")
    void decrementRemainingPosts(@Param("landlordId") Long landlordId);

    @Modifying
    @Query("UPDATE Subscription s SET s.remainingPosts = s.remainingPosts + 1 WHERE s.id = :subscriptionId AND s.remainingPosts < s.maxPosts")
    void incrementRemainingPosts(@Param("subscriptionId") Long subscriptionId);

    @Query("SELECT s FROM Subscription s WHERE s.autoRenew = true AND s.nextBillingDate <= :now")
    List<Subscription> findSubscriptionsDueForRenewal(@Param("now") LocalDateTime now);

    @Query("SELECT s FROM Subscription s WHERE s.isActive = true AND s.expiresAt BETWEEN :now AND :deadline")
    List<Subscription> findExpiringSubscriptions(@Param("now") LocalDateTime now, @Param("deadline") LocalDateTime deadline);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.landlord.id = :landlordId AND s.pkg.id = :packageId")
    int countByLandlordIdAndPackageId(@Param("landlordId") Long landlordId, @Param("packageId") Long packageId);

    // ==================== STATISTICS QUERIES ====================

    List<Subscription> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
