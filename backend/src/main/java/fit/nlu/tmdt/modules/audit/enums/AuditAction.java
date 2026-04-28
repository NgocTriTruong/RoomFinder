package fit.nlu.tmdt.modules.audit.enums;

import lombok.Getter;

@Getter
public enum AuditAction {
    LOGIN("Đăng nhập"),
    LOGOUT("Đăng xuất"),
    CREATE("Tạo mới"),
    UPDATE("Cập nhật"),
    DELETE("Xóa"),
    LOCK("Khóa"),
    UNLOCK("Mở khóa"),
    APPROVE("Phê duyệt"),
    REJECT("Từ chối"),
    VERIFY("Xác thực");

    private final String displayName;

    AuditAction(String displayName) {
        this.displayName = displayName;
    }
}
