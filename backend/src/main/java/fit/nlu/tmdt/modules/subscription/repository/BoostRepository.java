package fit.nlu.tmdt.modules.subscription.repository;

import fit.nlu.tmdt.modules.subscription.entity.Boost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Boost Repository
 */
@Repository
public interface BoostRepository extends JpaRepository<Boost, Long> {

    @Query("SELECT b FROM Boost b WHERE b.landlord.id = :landlordId AND b.isActive = true AND b.expiresAt > :now ORDER BY b.expiresAt ASC")
    List<Boost> findActiveByLandlordId(@Param("landlordId") Long landlordId, @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Boost b WHERE b.post.id = :postId AND b.isActive = true AND b.expiresAt > :now")
    List<Boost> findActiveByPostId(@Param("postId") Long postId, @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Boost b WHERE b.isActive = true AND b.expiresAt <= :now")
    List<Boost> findExpiredBoosts(@Param("now") LocalDateTime now);

    Optional<Boost> findByPostIdAndLandlordIdAndIsActiveTrue(Long postId, Long landlordId);

    @Query("SELECT b FROM Boost b WHERE b.landlord.id = :landlordId ORDER BY b.createdAt DESC")
    List<Boost> findByLandlordIdOrderByCreatedAtDesc(@Param("landlordId") Long landlordId);

    @Query("SELECT b FROM Boost b WHERE b.isActive = true ORDER BY b.priorityScore DESC")
    List<Boost> findAllActiveOrderByPriority();

    @Query("SELECT COUNT(b) FROM Boost b WHERE b.post.id = :postId AND b.isActive = true AND b.expiresAt > :now")
    long countActiveBoostsByPostId(@Param("postId") Long postId, @Param("now") LocalDateTime now);
}
