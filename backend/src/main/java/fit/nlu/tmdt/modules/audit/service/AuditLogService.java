package fit.nlu.tmdt.modules.audit.service;

import fit.nlu.tmdt.common.utils.PageResponse;
import fit.nlu.tmdt.modules.audit.dto.response.AuditLogResponse;
import fit.nlu.tmdt.modules.audit.enums.AuditAction;
import fit.nlu.tmdt.modules.audit.enums.AuditTarget;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {

    /**
     * Ghi log hoạt động của admin
     */
    void log(Long adminId, AuditAction action, AuditTarget target, Long targetId, String description, String metadata);

    /**
     * Lấy danh sách log có phân trang và filter
     */
    PageResponse<AuditLogResponse> getLogs(Long adminId, AuditAction action, AuditTarget target, Pageable pageable);

    /**
     * Xóa log cũ (tùy chọn)
     */
    void cleanOldLogs(int daysAgo);
}
