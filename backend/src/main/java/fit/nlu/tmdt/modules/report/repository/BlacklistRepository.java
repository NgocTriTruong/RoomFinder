package fit.nlu.tmdt.modules.report.repository;

import fit.nlu.tmdt.modules.report.entity.Blacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Blacklist Repository
 */
@Repository
public interface BlacklistRepository extends JpaRepository<Blacklist, Long> {

    Optional<Blacklist> findByIdAndDeletedAtIsNull(Long id);

    Optional<Blacklist> findByUserIdAndIsActiveAndDeletedAtIsNull(Long userId, Boolean isActive);

    List<Blacklist> findByUserIdAndDeletedAtIsNull(Long userId);

    List<Blacklist> findByIsActiveAndDeletedAtIsNull(Boolean isActive);

    @Query("SELECT b FROM Blacklist b WHERE b.user.id = :userId AND b.isActive = true AND b.deletedAt IS NULL AND " +
            "(b.isPermanent = true OR b.expiresAt > CURRENT_TIMESTAMP)")
    Optional<Blacklist> findActiveBlacklistByUserId(@Param("userId") Long userId);

    boolean existsByUserIdAndIsActiveAndDeletedAtIsNull(Long userId, Boolean isActive);

    long countByIsActiveAndDeletedAtIsNull(Boolean isActive);

    long countByIsPermanentAndDeletedAtIsNull(Boolean isPermanent);

    @Query("SELECT b FROM Blacklist b WHERE b.isActive = true AND b.deletedAt IS NULL AND b.isPermanent = false AND " +
            "b.expiresAt <= CURRENT_TIMESTAMP")
    List<Blacklist> findExpiredBlacklists();
}