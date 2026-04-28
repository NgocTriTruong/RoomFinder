package fit.nlu.tmdt.modules.audit.enums;

import lombok.Getter;

@Getter
public enum AuditTarget {
    USER("Người dùng"),
    POST("Tin đăng"),
    ROOM("Phòng trọ"),
    VOUCHER("Mã giảm giá"),
    PACKAGE("Gói cước"),
    REPORT("Báo cáo vi phạm"),
    TRANSACTION("Giao dịch"),
    KYC("Xác thực định danh");

    private final String displayName;

    AuditTarget(String displayName) {
        this.displayName = displayName;
    }
}
