package fit.nlu.tmdt.modules.subscription.entity.enums;

/**
 * Package Type Enum
 * Loại gói dịch vụ
 */
public enum PackageType {
    // Gói đăng tin
    POST_BASIC(5, 30, 99000.0, "Gói Cơ Bản"),
    POST_STANDARD(15, 30, 199000.0, "Gói Tiêu Chuẩn"),
    POST_PREMIUM(50, 90, 499000.0, "Gói Cao Cấp"),

    // Gói đẩy tin
    BOOST_DAILY(1, 1, 29000.0, "Đẩy tin 1 ngày"),
    BOOST_WEEKLY(7, 7, 99000.0, "Đẩy tin 7 ngày"),
    BOOST_MONTHLY(30, 30, 299000.0, "Đẩy tin 30 ngày");

    private final int quantity;
    private final int durationDays;
    private final double price;
    private final String displayName;

    PackageType(int quantity, int durationDays, double price, String displayName) {
        this.quantity = quantity;
        this.durationDays = durationDays;
        this.price = price;
        this.displayName = displayName;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public double getPrice() {
        return price;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Kiểm tra có phải gói boost không
     */
    public boolean isBoostPackage() {
        return this.name().startsWith("BOOST");
    }

    /**
     * Kiểm tra có phải gói đăng tin không
     */
    public boolean isPostPackage() {
        return this.name().startsWith("POST");
    }
}
