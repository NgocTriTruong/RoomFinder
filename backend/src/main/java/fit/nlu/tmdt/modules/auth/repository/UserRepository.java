package fit.nlu.tmdt.modules.auth.repository;

import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * User Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @Query("SELECT u FROM User u WHERE u.provider = :provider AND u.providerId = :providerId")
    Optional<User> findByProviderAndProviderId(@Param("provider") String provider, @Param("providerId") String providerId);

    List<User> findByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.status = 'LOCKED' AND u.lockoutEnd < CURRENT_TIMESTAMP")
    List<User> findExpiredLockouts();

    @Query("SELECT u FROM User u WHERE u.refreshToken = :refreshToken")
    Optional<User> findByRefreshToken(@Param("refreshToken") String refreshToken);

    @Query("SELECT u FROM User u WHERE u.id = :id AND u.deletedAt IS NULL")
    Optional<User> findByIdAndDeletedAtIsNull(@Param("id") Long id);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isVerified = true")
    long countVerifiedByRole(@Param("role") UserRole role);

    // ==================== STATISTICS QUERIES ====================

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isVerified = false")
    long countUnverifiedByRole(@Param("role") UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.createdAt BETWEEN :start AND :end")
    long countByRoleAndCreatedAtBetween(@Param("role") UserRole role, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :start AND :end")
    long countByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password, u.passwordChangedAt = CURRENT_TIMESTAMP, u.refreshToken = NULL WHERE u.id = :id")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = :status, u.refreshToken = NULL WHERE u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") UserStatus status);
}
