package fit.nlu.tmdt.common.base;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base class cho tất cả entities
 * Cung cấp các trường common và audit fields
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================
    // AUDIT FIELDS - Tự động điền khi create/update
    // ==========================================

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private Long createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private Long updatedBy;

    // ==========================================
    // SOFT DELETE
    // ==========================================

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Version
    @Column(name = "version")
    private Long version;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Soft delete entity
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    /**
     * Kiểm tra entity có active không
     */
    public boolean isActive() {
        return deletedAt == null;
    }

    /**
     * Kiểm tra entity đã bị soft delete chưa
     */
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
