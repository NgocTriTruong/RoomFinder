package fit.nlu.tmdt.modules.auth.repository;

import fit.nlu.tmdt.modules.auth.entity.OtpVerification;
import fit.nlu.tmdt.modules.auth.entity.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * OTP Verification Repository
 */
@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmailAndOtpTypeOrderByCreatedAtDesc(String email, OtpType otpType);

    @Query("SELECT o FROM OtpVerification o WHERE o.email = :email AND o.otpType = :type AND o.isUsed = false ORDER BY o.createdAt DESC")
    Optional<OtpVerification> findValidOtp(@Param("email") String email, @Param("type") OtpType type);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.email = :email AND o.otpType = :type")
    void deleteByEmailAndType(@Param("email") String email, @Param("type") OtpType type);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.expiredAt < :now")
    int deleteExpiredOtps(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(o) FROM OtpVerification o WHERE o.email = :email AND o.createdAt > :since")
    long countResendSince(@Param("email") String email, @Param("since") LocalDateTime since);
}
