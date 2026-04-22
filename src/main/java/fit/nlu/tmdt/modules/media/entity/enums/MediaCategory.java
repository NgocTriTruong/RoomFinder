package fit.nlu.tmdt.modules.media.entity.enums;

/**
 * Media Category Enum
 * Phân loại media theo module/chức năng trong hệ thống
 */
public enum MediaCategory {
    
    // ========== USER ==========
    USER_AVATAR("avatars", "User avatars", "user", 5 * 1024 * 1024),  // 5MB max
    USER_KYC("users/kyc", "User KYC documents", "user", 10 * 1024 * 1024),  // 10MB max
    
    // ========== POST ==========
    POST_IMAGE("posts/images", "Post images", "post", 10 * 1024 * 1024),  // 10MB max
    POST_VIDEO("posts/videos", "Post videos", "post", 100 * 1024 * 1024),  // 100MB max
    
    // ========== ROOM ==========
    ROOM_IMAGE("rooms/images", "Room images", "room", 10 * 1024 * 1024),  // 10MB max
    ROOM_THUMBNAIL("rooms/thumbnails", "Room thumbnails", "room", 2 * 1024 * 1024),  // 2MB max
    
    // ========== REVIEW ==========
    REVIEW_IMAGE("reviews/images", "Review images", "review", 5 * 1024 * 1024),  // 5MB max
    
    // ========== CHAT ==========
    CHAT_IMAGE("chat/images", "Chat images", "chat", 10 * 1024 * 1024),  // 10MB max
    CHAT_VIDEO("chat/videos", "Chat videos", "chat", 50 * 1024 * 1024),  // 50MB max
    CHAT_AUDIO("chat/audio", "Chat audio recordings", "chat", 20 * 1024 * 1024),  // 20MB max
    CHAT_DOCUMENT("chat/documents", "Chat documents", "chat", 25 * 1024 * 1024),  // 25MB max
    
    // ========== VOUCHER ==========
    VOUCHER_IMAGE("vouchers/images", "Voucher images", "voucher", 2 * 1024 * 1024),  // 2MB max
    
    // ========== SUBSCRIPTION ==========
    SUBSCRIPTION_IMAGE("subscriptions/images", "Subscription package images", "subscription", 2 * 1024 * 1024),  // 2MB max
    
    // ========== NOTIFICATION ==========
    NOTIFICATION_IMAGE("notifications/images", "Notification images", "notification", 1 * 1024 * 1024),  // 1MB max
    
    // ========== GENERAL ==========
    GENERAL("general", "General files", "general", 50 * 1024 * 1024);  // 50MB max
    
    private final String path;
    private final String description;
    private final String module;
    private final long maxFileSize;
    
    MediaCategory(String path, String description, String module, long maxFileSize) {
        this.path = path;
        this.description = description;
        this.module = module;
        this.maxFileSize = maxFileSize;
    }
    
    public String getPath() {
        return path;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getModule() {
        return module;
    }
    
    public long getMaxFileSize() {
        return maxFileSize;
    }
    
    public long getMaxFileSizeMB() {
        return maxFileSize / (1024 * 1024);
    }
    
    /**
     * Tìm category từ module name
     */
    public static MediaCategory fromModule(String module) {
        if (module == null) {
            return GENERAL;
        }
        for (MediaCategory category : values()) {
            if (category.module.equalsIgnoreCase(module)) {
                return category;
            }
        }
        return GENERAL;
    }
}
