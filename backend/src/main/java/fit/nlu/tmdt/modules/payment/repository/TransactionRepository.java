package fit.nlu.tmdt.modules.payment.repository;

import fit.nlu.tmdt.modules.payment.entity.Transaction;
import fit.nlu.tmdt.modules.payment.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndDeletedAtIsNull(Long id);

    Optional<Transaction> findByOrderIdAndDeletedAtIsNull(String orderId);

    List<Transaction> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);

    List<Transaction> findByStatusAndExpiresAtBeforeAndDeletedAtIsNull(PaymentStatus status, LocalDateTime now);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.deletedAt IS NULL ORDER BY t.createdAt DESC")
    List<Transaction> findPaymentHistoryByUser(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.status = :status AND t.deletedAt IS NULL ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndStatusAndDeletedAtIsNull(@Param("userId") Long userId, @Param("status") PaymentStatus status);

    boolean existsByOrderIdAndDeletedAtIsNull(String orderId);

    long countByUserIdAndVoucherCodeAndStatusAndDeletedAtIsNull(Long userId, String voucherCode, PaymentStatus status);

    // ==================== STATISTICS QUERIES ====================

    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.status = :status AND t.deletedAt IS NULL")
    List<Transaction> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") PaymentStatus status);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.status = :status AND t.deletedAt IS NULL")
    Double sumTotalAmount(@Param("userId") Long userId, @Param("status") PaymentStatus status);

    @Query(value = "SELECT CAST(created_at AS DATE) as date, SUM(amount) as total " +
                   "FROM transactions " +
                   "WHERE user_id = :userId AND status = 'SUCCESS' AND deleted_at IS NULL " +
                   "AND created_at >= :start AND created_at <= :end " +
                   "GROUP BY CAST(created_at AS DATE)", nativeQuery = true)
    List<Object[]> getDailyServiceCostNative(@Param("userId") Long userId, 
                                            @Param("start") LocalDateTime start, 
                                            @Param("end") LocalDateTime end);
}
