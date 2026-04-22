package fit.nlu.tmdt.modules.payment.repository;

import fit.nlu.tmdt.modules.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByVnpTxnRefAndDeletedAtIsNull(String vnpTxnRef);

    List<Payment> findByTransactionIdAndDeletedAtIsNull(Long transactionId);

    boolean existsByVnpTxnRefAndIsProcessedTrue(String vnpTxnRef);
}
