package fit.nlu.tmdt.modules.report.repository;

import fit.nlu.tmdt.modules.report.entity.Report;
import fit.nlu.tmdt.modules.report.entity.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Report Repository
 */
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findByIdAndDeletedAtIsNull(Long id);

    Page<Report> findByStatusAndDeletedAtIsNullOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);

    Page<Report> findByDeletedAtIsNullOrderByCreatedAtDesc(Pageable pageable);

    List<Report> findByReporterIdAndDeletedAtIsNull(Long reporterId);

    List<Report> findByTargetIdAndTargetTypeAndDeletedAtIsNull(Long targetId, String targetType);

    long countByStatusAndDeletedAtIsNull(ReportStatus status);

    long countByReporterIdAndDeletedAtIsNull(Long reporterId);

    @Query("SELECT r FROM Report r WHERE r.status = 'PENDING' AND r.deletedAt IS NULL ORDER BY r.createdAt ASC")
    List<Report> findPendingReportsOrdered();

    @Query("SELECT r FROM Report r WHERE r.targetType = :type AND r.targetId = :targetId AND r.status IN ('PENDING', 'PROCESSING') AND r.deletedAt IS NULL")
    List<Report> findActiveReportsByTarget(@Param("type") String type, @Param("targetId") Long targetId);

    @Query("SELECT r FROM Report r WHERE r.postId = :postId AND r.deletedAt IS NULL")
    List<Report> findByPostId(@Param("postId") Long postId);

    boolean existsByReporterIdAndTargetIdAndTargetTypeAndDeletedAtIsNull(Long reporterId, Long targetId, String targetType);
}