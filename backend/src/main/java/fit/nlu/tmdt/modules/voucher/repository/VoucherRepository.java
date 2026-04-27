package fit.nlu.tmdt.modules.voucher.repository;

import fit.nlu.tmdt.modules.voucher.entity.Voucher;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Voucher Repository
 */
@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    @EntityGraph(attributePaths = {"applicablePackageIds"})
    Optional<Voucher> findByCodeAndDeletedAtIsNull(String code);

    @EntityGraph(attributePaths = {"applicablePackageIds"})
    Optional<Voucher> findByIdAndDeletedAtIsNull(Long id);

    @EntityGraph(attributePaths = {"applicablePackageIds"})
    List<Voucher> findByIsActiveAndDeletedAtIsNull(Boolean isActive);

    @EntityGraph(attributePaths = {"applicablePackageIds"})
    List<Voucher> findAllByDeletedAtIsNull();

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.isPublic = true AND v.deletedAt IS NULL " +
            "AND (v.validFrom IS NULL OR v.validFrom <= :now) " +
            "AND (v.expiresAt IS NULL OR v.expiresAt > :now) " +
            "AND (v.remainingQuantity IS NULL OR v.remainingQuantity > 0) " +
            "ORDER BY v.isFeatured DESC, v.createdAt DESC")
    List<Voucher> findAvailableVouchers(@Param("now") LocalDateTime now);

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.deletedAt IS NULL " +
            "AND (v.remainingQuantity IS NULL OR v.remainingQuantity > 0) " +
            "AND (v.expiresAt IS NULL OR v.expiresAt > :now)")
    List<Voucher> findActiveVouchers(@Param("now") LocalDateTime now);

    boolean existsByCodeAndDeletedAtIsNull(String code);

    long countByIsActiveAndDeletedAtIsNull(Boolean isActive);

    @Query("SELECT v FROM Voucher v WHERE v.expiresAt < :now AND v.isActive = true AND v.deletedAt IS NULL")
    List<Voucher> findExpiredVouchers(@Param("now") LocalDateTime now);

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.deletedAt IS NULL " +
            "AND (v.expiresAt IS NULL OR v.expiresAt > :now) " +
            "AND (v.remainingQuantity IS NULL OR v.remainingQuantity > 0) " +
            "AND (v.validFrom IS NULL OR v.validFrom <= :now) " +
            "AND v.code = :code")
    @EntityGraph(attributePaths = {"applicablePackageIds"})
    Optional<Voucher> findValidVoucherByCode(@Param("code") String code, @Param("now") LocalDateTime now);
}