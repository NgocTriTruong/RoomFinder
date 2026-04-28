package fit.nlu.tmdt.modules.audit.repository;

import fit.nlu.tmdt.modules.audit.entity.AuditLog;
import fit.nlu.tmdt.modules.audit.enums.AuditAction;
import fit.nlu.tmdt.modules.audit.enums.AuditTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<AuditLog> findByAdminIdOrderByCreatedAtDesc(Long adminId, Pageable pageable);

    Page<AuditLog> findByTargetTypeOrderByCreatedAtDesc(AuditTarget targetType, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:adminId IS NULL OR a.admin.id = :adminId) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:targetType IS NULL OR a.targetType = :targetType)")
    Page<AuditLog> filterLogs(Long adminId, AuditAction action, AuditTarget targetType, Pageable pageable);
}
