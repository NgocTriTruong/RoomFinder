package fit.nlu.tmdt.modules.media.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.media.dto.response.CentralMediaResponse;
import fit.nlu.tmdt.modules.media.entity.CentralMediaFile;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import fit.nlu.tmdt.modules.media.entity.enums.MediaStatus;
import fit.nlu.tmdt.modules.media.repository.CentralMediaFileRepository;
import fit.nlu.tmdt.modules.media.service.CentralMediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CentralMedia Service Implementation
 * Service trung tâm xử lý upload và quản lý media cho toàn bộ dự án
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CentralMediaServiceImpl implements CentralMediaService {

    private final CentralMediaFileRepository mediaFileRepository;
    private final UserRepository userRepository;

    @Value("${app.media.base-url:http://localhost:8080/api/uploads}")
    private String mediaBaseUrl;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.media.max-storage-per-user:5368709120}")  // 5GB default
    private long maxStoragePerUser;

    // Allowed MIME types by category
    private static final Set<String> IMAGE_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
    );

    private static final Set<String> VIDEO_MIME_TYPES = Set.of(
            "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"
    );

    private static final Set<String> AUDIO_MIME_TYPES = Set.of(
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac", "audio/flac", "audio/amr"
    );

    private static final Set<String> DOCUMENT_MIME_TYPES = Set.of(
            "application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    // ==================== UPLOAD ====================

    @Override
    @Transactional
    public CentralMediaResponse uploadFile(MultipartFile file, MediaCategory category, Long userId) {
        return uploadFileWithReference(file, category, null, null, userId);
    }

    @Override
    @Transactional
    public CentralMediaResponse uploadFileWithReference(MultipartFile file, MediaCategory category,
                                                      String referenceType, Long referenceId, Long userId) {
        log.info("Uploading file: category={}, userId={}, originalName={}, size={}",
                category, userId, file.getOriginalFilename(), file.getSize());

        // Validate file
        validateFile(file, category);

        // Get user
        User user = getUser(userId);

        // Check storage limit
        Long usedStorage = mediaFileRepository.sumFileSizeByOwnerId(userId);
        if ((usedStorage == null ? 0 : usedStorage) + file.getSize() > maxStoragePerUser) {
            throw new BusinessException(ErrorCode.MEDIA_009, "Storage limit exceeded");
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = getExtension(originalFilename);
            String newFilename = generateUniqueFilename(extension);

            // Create directory path
            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String fullDir = uploadDir + "/" + category.getPath() + "/" + datePath;

            Path uploadPath = Paths.get(fullDir);
            Files.createDirectories(uploadPath);

            // Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create entity
            CentralMediaFile mediaFile = CentralMediaFile.builder()
                    .owner(user)
                    .category(category)
                    .originalName(originalFilename)
                    .fileName(newFilename)
                    .filePath(filePath.toString())
                    .fileSize(file.getSize())
                    .mimeType(file.getContentType())
                    .extension(extension)
                    .referenceType(referenceType)
                    .referenceId(referenceId)
                    .status(MediaStatus.PROCESSING)
                    .build();

            // Extract metadata
            extractMetadata(mediaFile, filePath.toFile());

            // Create thumbnail for images
            createThumbnail(mediaFile, filePath.toFile());

            // Mark as ready
            mediaFile.markAsReady();

            // Save to database
            mediaFile = mediaFileRepository.save(mediaFile);

            log.info("File uploaded successfully: id={}, fileName={}", mediaFile.getId(), newFilename);

            return toCentralMediaResponse(mediaFile);

        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.MEDIA_002, "Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public List<CentralMediaResponse> uploadMultipleFiles(MultipartFile[] files, MediaCategory category, Long userId) {
        List<CentralMediaResponse> responses = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            try {
                if (file != null && !file.isEmpty()) {
                    CentralMediaResponse response = uploadFile(file, category, userId);
                    responses.add(response);
                }
            } catch (Exception e) {
                log.error("Failed to upload file {}: {}", i, e.getMessage());
                errors.add("File " + (i + 1) + ": " + e.getMessage());
            }
        }

        if (!errors.isEmpty() && responses.isEmpty()) {
            throw new BusinessException(ErrorCode.MEDIA_003, "All files failed to upload: " + String.join(", ", errors));
        }

        return responses;
    }

    // ==================== GET ====================

    @Override
    public CentralMediaResponse getFileById(Long fileId) {
        CentralMediaFile mediaFile = mediaFileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_001, "File not found"));
        return toCentralMediaResponse(mediaFile);
    }

    @Override
    public String getFileUrl(Long fileId) {
        CentralMediaFile mediaFile = mediaFileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_001, "File not found"));

        if (!mediaFile.isReady()) {
            throw new BusinessException(ErrorCode.MEDIA_004, "File is not ready");
        }

        return mediaFile.getFullUrl(mediaBaseUrl);
    }

    @Override
    public List<CentralMediaResponse> getFilesByReference(String referenceType, Long referenceId) {
        List<CentralMediaFile> files = mediaFileRepository.findByReference(referenceType, referenceId);
        return files.stream().map(this::toCentralMediaResponse).collect(Collectors.toList());
    }

    @Override
    public List<CentralMediaResponse> getFilesByCategory(MediaCategory category, Long userId) {
        List<CentralMediaFile> files = mediaFileRepository.findByOwnerIdAndCategory(userId, category);
        return files.stream().map(this::toCentralMediaResponse).collect(Collectors.toList());
    }

    @Override
    public List<CentralMediaResponse> getUserFiles(MediaCategory category, Long userId, int page, int size) {
        Page<CentralMediaFile> files;
        if (category != null) {
            files = mediaFileRepository.findByOwnerId(userId, PageRequest.of(page, size));
            return files.getContent().stream()
                    .filter(f -> f.getCategory() == category)
                    .map(this::toCentralMediaResponse)
                    .collect(Collectors.toList());
        } else {
            files = mediaFileRepository.findByOwnerId(userId, PageRequest.of(page, size));
            return files.getContent().stream()
                    .map(this::toCentralMediaResponse)
                    .collect(Collectors.toList());
        }
    }

    // ==================== UPDATE ====================

    @Override
    @Transactional
    public void setAsPrimary(Long fileId, Long userId) {
        CentralMediaFile mediaFile = mediaFileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_001, "File not found"));

        if (!mediaFile.getOwner().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Not authorized");
        }

        // Clear existing primary
        if (mediaFile.getReferenceType() != null && mediaFile.getReferenceId() != null) {
            mediaFileRepository.clearPrimaryByReference(mediaFile.getReferenceType(), mediaFile.getReferenceId());
        }

        mediaFile.setIsPrimary(true);
        mediaFileRepository.save(mediaFile);
    }

    @Override
    @Transactional
    public void updateReference(Long fileId, String referenceType, Long referenceId, Long userId) {
        CentralMediaFile mediaFile = mediaFileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_001, "File not found"));

        if (!mediaFile.getOwner().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Not authorized");
        }

        mediaFile.setReferenceType(referenceType);
        mediaFile.setReferenceId(referenceId);
        mediaFileRepository.save(mediaFile);
    }

    // ==================== DELETE ====================

    @Override
    @Transactional
    public void deleteFile(Long fileId, Long userId) {
        CentralMediaFile mediaFile = mediaFileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_001, "File not found"));

        if (!mediaFile.getOwner().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Not authorized");
        }

        // Delete physical files
        deletePhysicalFile(mediaFile.getFilePath());
        if (mediaFile.getThumbnailPath() != null) {
            deletePhysicalFile(mediaFile.getThumbnailPath());
        }

        // Soft delete in database
        mediaFileRepository.softDelete(fileId, LocalDateTime.now());
        log.info("File deleted: id={}", fileId);
    }

    @Override
    @Transactional
    public void deleteMultipleFiles(List<Long> fileIds, Long userId) {
        for (Long fileId : fileIds) {
            try {
                deleteFile(fileId, userId);
            } catch (Exception e) {
                log.error("Failed to delete file {}: {}", fileId, e.getMessage());
            }
        }
    }

    @Override
    @Transactional
    public void deleteFilesByReference(String referenceType, Long referenceId) {
        List<CentralMediaFile> files = mediaFileRepository.findByReference(referenceType, referenceId);
        for (CentralMediaFile file : files) {
            deletePhysicalFile(file.getFilePath());
            if (file.getThumbnailPath() != null) {
                deletePhysicalFile(file.getThumbnailPath());
            }
            mediaFileRepository.softDelete(file.getId(), LocalDateTime.now());
        }
    }

    // ==================== VALIDATION ====================

    @Override
    public void validateFile(MultipartFile file, MediaCategory category) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.MEDIA_005, "File is empty");
        }

        String contentType = file.getContentType();
        Set<String> allowedTypes = getAllowedMimeTypes(category);

        if (contentType == null || !allowedTypes.contains(contentType.toLowerCase())) {
            throw new BusinessException(ErrorCode.MEDIA_006, "File type not allowed for category " + category + ": " + contentType);
        }

        if (file.getSize() > category.getMaxFileSize()) {
            throw new BusinessException(ErrorCode.MEDIA_007,
                    String.format("File size exceeds limit: %d bytes (max: %d MB)",
                            file.getSize(), category.getMaxFileSizeMB()));
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            throw new BusinessException(ErrorCode.MEDIA_008, "Invalid filename");
        }

        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            throw new BusinessException(ErrorCode.MEDIA_009, "Invalid filename: path traversal detected");
        }
    }

    // ==================== STATS ====================

    @Override
    public Map<String, Object> getUserStorageStats(Long userId) {
        Long usedStorage = mediaFileRepository.sumFileSizeByOwnerId(userId);
        long used = usedStorage == null ? 0 : usedStorage;

        Map<String, Object> stats = new HashMap<>();
        stats.put("usedBytes", used);
        stats.put("usedFormatted", formatBytes(used));
        stats.put("maxBytes", maxStoragePerUser);
        stats.put("maxFormatted", formatBytes(maxStoragePerUser));
        stats.put("availableBytes", maxStoragePerUser - used);
        stats.put("availableFormatted", formatBytes(maxStoragePerUser - used));
        stats.put("usagePercent", (double) used / maxStoragePerUser * 100);
        stats.put("totalFiles", mediaFileRepository.countByOwnerId(userId));

        return stats;
    }

    @Override
    public Map<String, Object> getCategoryStats(MediaCategory category, Long userId) {
        List<CentralMediaFile> files = mediaFileRepository.findByOwnerIdAndCategory(userId, category);
        
        long totalSize = files.stream().mapToLong(f -> f.getFileSize() != null ? f.getFileSize() : 0).sum();
        long imageCount = files.stream().filter(CentralMediaFile::isImage).count();
        long videoCount = files.stream().filter(CentralMediaFile::isVideo).count();
        long audioCount = files.stream().filter(CentralMediaFile::isAudio).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("category", category.name());
        stats.put("totalFiles", files.size());
        stats.put("totalSize", totalSize);
        stats.put("totalSizeFormatted", formatBytes(totalSize));
        stats.put("imageCount", imageCount);
        stats.put("videoCount", videoCount);
        stats.put("audioCount", audioCount);
        stats.put("maxSizeMB", category.getMaxFileSizeMB());

        return stats;
    }

    // ==================== HELPER METHODS ====================

    private User getUser(Long userId) {
        return userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
    }

    private Set<String> getAllowedMimeTypes(MediaCategory category) {
        switch (category) {
            case POST_IMAGE:
            case ROOM_IMAGE:
            case ROOM_THUMBNAIL:
            case USER_AVATAR:
            case REVIEW_IMAGE:
            case VOUCHER_IMAGE:
            case SUBSCRIPTION_IMAGE:
            case NOTIFICATION_IMAGE:
            case CHAT_IMAGE:
                return IMAGE_MIME_TYPES;
            case POST_VIDEO:
            case CHAT_VIDEO:
                return VIDEO_MIME_TYPES;
            case CHAT_AUDIO:
                return AUDIO_MIME_TYPES;
            case CHAT_DOCUMENT:
                return DOCUMENT_MIME_TYPES;
            default:
                Set<String> all = new HashSet<>();
                all.addAll(IMAGE_MIME_TYPES);
                all.addAll(VIDEO_MIME_TYPES);
                all.addAll(AUDIO_MIME_TYPES);
                all.addAll(DOCUMENT_MIME_TYPES);
                return all;
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private String generateUniqueFilename(String extension) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return timestamp + "_" + uuid + (extension.isEmpty() ? "" : "." + extension);
    }

    private void extractMetadata(CentralMediaFile mediaFile, File file) {
        try {
            if (mediaFile.isImage()) {
                BufferedImage img = ImageIO.read(file);
                if (img != null) {
                    mediaFile.setWidth(img.getWidth());
                    mediaFile.setHeight(img.getHeight());
                }
            }
        } catch (IOException e) {
            log.warn("Failed to extract metadata: {}", e.getMessage());
        }
    }

    private void createThumbnail(CentralMediaFile mediaFile, File file) {
        try {
            if (mediaFile.isImage()) {
                BufferedImage originalImage = ImageIO.read(file);
                if (originalImage != null) {
                    int maxSize = 300;
                    int width = originalImage.getWidth();
                    int height = originalImage.getHeight();

                    double ratio = Math.min((double) maxSize / width, (double) maxSize / height);
                    int newWidth = (int) (width * ratio);
                    int newHeight = (int) (height * ratio);

                    BufferedImage thumbnail = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
                    thumbnail.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

                    String thumbnailFilename = "thumb_" + mediaFile.getFileName();
                    Path filePath = Paths.get(mediaFile.getFilePath());
                    String thumbnailDir = filePath.getParent().toString();
                    File thumbnailFile = new File(thumbnailDir, thumbnailFilename);

                    String thumbnailFormat = mediaFile.getExtension().equals("png") ? "png" : "jpg";
                    ImageIO.write(thumbnail, thumbnailFormat, thumbnailFile);

                    mediaFile.setThumbnailPath(thumbnailFile.getAbsolutePath());
                    mediaFile.setThumbnailWidth(newWidth);
                    mediaFile.setThumbnailHeight(newHeight);
                }
            }
        } catch (IOException e) {
            log.warn("Failed to create thumbnail: {}", e.getMessage());
        }
    }

    private void deletePhysicalFile(String filePath) {
        if (filePath != null && !filePath.isEmpty()) {
            try {
                Path path = Paths.get(filePath);
                Files.deleteIfExists(path);
            } catch (IOException e) {
                log.error("Failed to delete physical file: {}", filePath, e);
            }
        }
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        } else if (bytes < 1024 * 1024) {
            return String.format("%.1f KB", bytes / 1024.0);
        } else if (bytes < 1024 * 1024 * 1024) {
            return String.format("%.1f MB", bytes / (1024.0 * 1024));
        } else {
            return String.format("%.2f GB", bytes / (1024.0 * 1024 * 1024));
        }
    }

    private CentralMediaResponse toCentralMediaResponse(CentralMediaFile mediaFile) {
        return CentralMediaResponse.builder()
                .id(mediaFile.getId())
                .category(mediaFile.getCategory().name())
                .originalName(mediaFile.getOriginalName())
                .fileName(mediaFile.getFileName())
                .fileUrl(mediaFile.getFullUrl(mediaBaseUrl))
                .thumbnailUrl(mediaFile.getThumbnailUrl() != null ? 
                        mediaBaseUrl + mediaFile.getThumbnailUrl() : mediaFile.getFullUrl(mediaBaseUrl))
                .fileSize(mediaFile.getFileSize())
                .formattedSize(mediaFile.getFormattedSize())
                .mimeType(mediaFile.getMimeType())
                .extension(mediaFile.getExtension())
                .width(mediaFile.getWidth())
                .height(mediaFile.getHeight())
                .referenceType(mediaFile.getReferenceType())
                .referenceId(mediaFile.getReferenceId())
                .isPrimary(mediaFile.getIsPrimary())
                .createdAt(mediaFile.getCreatedAt())
                .previewUrl(mediaFile.getThumbnailUrl() != null ?
                        mediaBaseUrl + mediaFile.getThumbnailUrl() : mediaFile.getFullUrl(mediaBaseUrl))
                .isImage(mediaFile.isImage())
                .isVideo(mediaFile.isVideo())
                .isAudio(mediaFile.isAudio())
                .build();
    }
}
