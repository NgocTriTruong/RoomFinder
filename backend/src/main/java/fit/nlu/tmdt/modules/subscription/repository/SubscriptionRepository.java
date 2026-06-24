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

    @Query("SELECT s FROM Subscription s WHERE s.landlord.id = :landlordId AND s.isActive = true AND s.expiresAt > :now")
    List<Subscription> findAllActiveByLandlordId(@Param("landlordId") Long landlordId, @Param("now") LocalDateTime now);

    default Optional<Subscription> findActiveByLandlordId(Long landlordId, LocalDateTime now) {
        List<Subscription> subs = findAllActiveByLandlordId(landlordId, now);
        if (subs.isEmpty()) return Optional.empty();
        // Sort by package price descending to always return the highest tier package
        subs.sort((s1, s2) -> Double.compare(s2.getPkg().getPrice(), s1.getPkg().getPrice()));
        return Optional.of(subs.get(0));
    }



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
