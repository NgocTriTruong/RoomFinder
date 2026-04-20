package fit.nlu.tmdt.modules.media.repository;

import fit.nlu.tmdt.modules.media.entity.CentralMediaFile;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import fit.nlu.tmdt.modules.media.entity.enums.MediaStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * CentralMediaFile Repository
 */
@Repository
public interface CentralMediaFileRepository extends JpaRepository<CentralMediaFile, Long> {

    // ========== FIND BY OWNER ==========

    @Query("SELECT m FROM CentralMediaFile m WHERE m.owner.id = :ownerId AND m.status != 'DELETED' ORDER BY m.createdAt DESC")
    Page<CentralMediaFile> findByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT m FROM CentralMediaFile m WHERE m.owner.id = :ownerId AND m.category = :category AND m.status = 'READY' ORDER BY m.createdAt DESC")
    List<CentralMediaFile> findByOwnerIdAndCategory(@Param("ownerId") Long ownerId, @Param("category") MediaCategory category);

    @Query("SELECT m FROM CentralMediaFile m WHERE m.owner.id = :ownerId AND m.category = :category AND m.isPrimary = true AND m.status = 'READY'")
    Optional<CentralMediaFile> findPrimaryByOwnerIdAndCategory(@Param("ownerId") Long ownerId, @Param("category") MediaCategory category);

    // ========== FIND BY REFERENCE ==========

    @Query("SELECT m FROM CentralMediaFile m WHERE m.referenceType = :refType AND m.referenceId = :refId AND m.status = 'READY' ORDER BY m.isPrimary DESC, m.createdAt ASC")
    List<CentralMediaFile> findByReference(@Param("refType") String refType, @Param("refId") Long refId);

    @Query("SELECT m FROM CentralMediaFile m WHERE m.referenceType = :refType AND m.referenceId = :refId AND m.isPrimary = true AND m.status = 'READY'")
    Optional<CentralMediaFile> findPrimaryByReference(@Param("refType") String refType, @Param("refId") Long refId);

    @Query("SELECT m FROM CentralMediaFile m WHERE m.referenceType = :refType AND m.referenceId = :refId AND m.status = 'READY' ORDER BY m.createdAt DESC")
    Page<CentralMediaFile> findByReferencePaged(@Param("refType") String refType, @Param("refId") Long refId, Pageable pageable);

    // ========== FIND BY CATEGORY ==========

    @Query("SELECT m FROM CentralMediaFile m WHERE m.category = :category AND m.status = 'READY' ORDER BY m.createdAt DESC")
    Page<CentralMediaFile> findByCategory(@Param("category") MediaCategory category, Pageable pageable);

    // ========== FIND EXPIRED ==========

    @Query("SELECT m FROM CentralMediaFile m WHERE m.expiresAt IS NOT NULL AND m.expiresAt < :now AND m.status = 'READY'")
    List<CentralMediaFile> findExpiredFiles(@Param("now") LocalDateTime now);

    // ========== COUNT ==========

    @Query("SELECT COUNT(m) FROM CentralMediaFile m WHERE m.owner.id = :ownerId AND m.status = 'READY'")
    long countByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT SUM(m.fileSize) FROM CentralMediaFile m WHERE m.owner.id = :ownerId AND m.status = 'READY'")
    Long sumFileSizeByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COUNT(m) FROM CentralMediaFile m WHERE m.referenceType = :refType AND m.referenceId = :refId AND m.status = 'READY'")
    long countByReference(@Param("refType") String refType, @Param("refId") Long refId);

    // ========== DELETE ==========

    @Modifying
    @Query("UPDATE CentralMediaFile m SET m.status = 'DELETED', m.updatedAt = :now WHERE m.id = :id")
    void softDelete(@Param("id") Long id, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE CentralMediaFile m SET m.status = 'DELETED', m.updatedAt = :now WHERE m.owner.id = :ownerId")
    void softDeleteAllByOwnerId(@Param("ownerId") Long ownerId, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE CentralMediaFile m SET m.status = 'DELETED', m.updatedAt = :now WHERE m.referenceType = :refType AND m.referenceId = :refId")
    void softDeleteByReference(@Param("refType") String refType, @Param("refId") Long refId, @Param("now") LocalDateTime now);

    // ========== UPDATE PRIMARY ==========

    @Modifying
    @Query("UPDATE CentralMediaFile m SET m.isPrimary = false WHERE m.referenceType = :refType AND m.referenceId = :refId AND m.isPrimary = true")
    void clearPrimaryByReference(@Param("refType") String refType, @Param("refId") Long refId);

    // ========== CLEANUP ==========

    @Modifying
    @Query("DELETE FROM CentralMediaFile m WHERE m.expiresAt IS NOT NULL AND m.expiresAt < :now AND m.status = 'READY'")
    int deleteExpiredFiles(@Param("now") LocalDateTime now);

    // ==================== STATISTICS QUERIES ====================

    @Query("SELECT m.category, SUM(m.fileSize) FROM CentralMediaFile m WHERE m.status = 'READY' GROUP BY m.category")
    List<Object[]> sumFileSizeGroupByCategory();
}
