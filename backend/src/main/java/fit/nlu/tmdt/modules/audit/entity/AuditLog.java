package fit.nlu.tmdt.modules.audit.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.audit.enums.AuditAction;
import fit.nlu.tmdt.modules.audit.enums.AuditTarget;
import fit.nlu.tmdt.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity lưu vết hoạt động của Admin
 */
@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private AuditAction action;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private AuditTarget targetType;

    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "SUCCESS";

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;
}
