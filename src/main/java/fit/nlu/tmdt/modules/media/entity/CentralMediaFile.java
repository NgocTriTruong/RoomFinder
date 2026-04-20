package fit.nlu.tmdt.modules.media.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import fit.nlu.tmdt.modules.media.entity.enums.MediaStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * CentralMediaFile Entity
 * Lưu trữ thông tin tất cả media files trong hệ thống
 * Phục vụ cho: User avatar, Post images, Room images, Review images, Chat media...
 */
@Entity
@Table(name = "central_media_files", indexes = {
        @Index(name = "idx_media_owner", columnList = "owner_id"),
        @Index(name = "idx_media_category", columnList = "category"),
        @Index(name = "idx_media_reference", columnList = "reference_type, reference_id"),
        @Index(name = "idx_media_status", columnList = "status"),
        @Index(name = "idx_media_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CentralMediaFile extends BaseEntity {

    // ==========================================
    // OWNER (User đã upload)
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // ==========================================
    // CATEGORY & TYPE
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private MediaCategory category;

    @Column(name = "original_name", nullable = false, length = 255)
    private String originalName;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(name = "extension", nullable = false, length = 20)
    private String extension;

    // ==========================================
    // DIMENSIONS (cho image/video)
    // ==========================================

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    // ==========================================
    // THUMBNAIL
    // ==========================================

    @Column(name = "thumbnail_path", length = 500)
    private String thumbnailPath;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "thumbnail_width")
    private Integer thumbnailWidth;

    @Column(name = "thumbnail_height")
    private Integer thumbnailHeight;

    // ==========================================
    // REFERENCE (Entity sử dụng media này)
    // ==========================================

    @Column(name = "reference_type", length = 50)
    private String referenceType;  // POST, ROOM, REVIEW, USER, etc.

    @Column(name = "reference_id")
    private Long referenceId;  // ID của entity

    @Column(name = "is_primary")
    @Builder.Default
    private Boolean isPrimary = false;  // Ảnh chính hay không

    // ==========================================
    // STATUS
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private MediaStatus status = MediaStatus.UPLOADING;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    // ==========================================
    // EXPIRATION (optional)
    // ==========================================

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Kiểm tra file có phải là hình ảnh không
     */
    public boolean isImage() {
        return mimeType != null && mimeType.startsWith("image/");
    }

    /**
     * Kiểm tra file có phải là video không
     */
    public boolean isVideo() {
        return mimeType != null && mimeType.startsWith("video/");
    }

    /**
     * Kiểm tra file có phải là audio không
     */
    public boolean isAudio() {
        return mimeType != null && mimeType.startsWith("audio/");
    }

    /**
     * Kiểm tra file đã sẵn sàng chưa
     */
    public boolean isReady() {
        return status == MediaStatus.READY;
    }

    /**
     * Kiểm tra file có bị hết hạn không
     */
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Lấy URL đầy đủ
     */
    public String getFullUrl(String baseUrl) {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            if (fileUrl.startsWith("http")) {
                return fileUrl;
            }
            return baseUrl + fileUrl;
        }
        return null;
    }

    /**
     * Format dung lượng file
     */
    public String getFormattedSize() {
        if (fileSize == null) {
            return "0 B";
        }
        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.1f KB", fileSize / 1024.0);
        } else if (fileSize < 1024 * 1024 * 1024) {
            return String.format("%.1f MB", fileSize / (1024.0 * 1024));
        } else {
            return String.format("%.2f GB", fileSize / (1024.0 * 1024 * 1024));
        }
    }

    /**
     * Đánh dấu file đã sẵn sàng
     */
    public void markAsReady() {
        this.status = MediaStatus.READY;
    }

    /**
     * Đánh dấu file thất bại
     */
    public void markAsFailed(String errorMessage) {
        this.status = MediaStatus.FAILED;
        this.errorMessage = errorMessage;
    }
}
