package fit.nlu.tmdt.modules.audit.service.impl;

import fit.nlu.tmdt.common.utils.PageResponse;
import fit.nlu.tmdt.modules.audit.dto.response.AuditLogResponse;
import fit.nlu.tmdt.modules.audit.entity.AuditLog;
import fit.nlu.tmdt.modules.audit.enums.AuditAction;
import fit.nlu.tmdt.modules.audit.enums.AuditTarget;
import fit.nlu.tmdt.modules.audit.repository.AuditLogRepository;
import fit.nlu.tmdt.modules.audit.service.AuditLogService;
import fit.nlu.tmdt.modules.auth.dto.response.UserResponse;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.transaction.annotation.Propagation;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(Long adminId, AuditAction action, AuditTarget target, Long targetId, String description, String metadata) {
        if (adminId == null) {
            log.warn("Cannot log audit action because adminId is null: action={}, target={}", action, target);
            return;
        }

        try {
            // Lấy thông tin admin
            User admin = userRepository.findById(adminId).orElse(null);
            if (admin == null) {
                log.warn("Cannot find admin with id {} to log action: action={}, target={}", adminId, action, target);
                return;
            }

            // Mọi hành động log hiện tại đều mặc định là thành công
            String status = "SUCCESS";

            AuditLog auditLog = AuditLog.builder()
                    .admin(admin)
                    .action(action)
                    .targetType(target)
                    .targetId(targetId)
                    .description(description)
                    .status(status)
                    .metadata(metadata)
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit log saved successfully: admin={}, action={}, target={}", admin.getEmail(), action, target);
        } catch (Exception e) {
            log.error("CRITICAL: Failed to save audit log. Error: {}", e.getMessage(), e);
        }
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return (attributes != null) ? attributes.getRequest() : null;
    }

    @Override
    public PageResponse<AuditLogResponse> getLogs(Long adminId, AuditAction action, AuditTarget target, Pageable pageable) {
        try {
            Page<AuditLog> logs = auditLogRepository.filterLogs(adminId, action, target, pageable);
            return PageResponse.of(logs.map(this::toResponse));
        } catch (Exception e) {
            log.error("Error fetching audit logs: adminId={}, action={}, target={}", adminId, action, target, e);
            throw e; // Re-throw to be handled by GlobalExceptionHandler
        }
    }

    @Override
    @Transactional
    public void cleanOldLogs(int daysAgo) {
        // Implementation for cleaning logs if needed
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .admin(toUserResponse(log.getAdmin()))
                .action(log.getAction().name())
                .actionDisplayName(log.getAction().getDisplayName())
                .targetType(log.getTargetType().name())
                .targetTypeDisplayName(log.getTargetType().getDisplayName())
                .targetId(log.getTargetId())
                .description(log.getDescription())
                .status(log.getStatus())
                .metadata(log.getMetadata())
                .createdAt(log.getCreatedAt())
                .build();
    }

    private UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatar(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();
    }
}
