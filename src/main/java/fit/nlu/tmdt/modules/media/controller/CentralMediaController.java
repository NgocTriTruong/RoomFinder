package fit.nlu.tmdt.modules.media.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.media.dto.response.CentralMediaResponse;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import fit.nlu.tmdt.modules.media.service.CentralMediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * CentralMedia Controller
 * API trung tâm cho upload và quản lý media của toàn bộ dự án
 */
@RestController
@RequestMapping("/v1/media")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Central Media", description = "Centralized media upload and management APIs")
public class CentralMediaController {

    private final CentralMediaService centralMediaService;

    // ==================== UPLOAD ====================

    /**
     * Upload một file đơn lẻ
     * POST /v1/media/upload
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file", description = "Upload a single file with category")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam(value = "referenceType", required = false) String referenceType,
            @RequestParam(value = "referenceId", required = false) Long referenceId,
            @RequestParam(value = "isPrimary", required = false) Boolean isPrimary,
            @CurrentUser Long userId) {

        log.info("Upload file: category={}, userId={}, fileName={}", category, userId, file.getOriginalFilename());

        MediaCategory mediaCategory = MediaCategory.valueOf(category.toUpperCase());
        CentralMediaResponse response;

        if (referenceType != null && referenceId != null) {
            response = centralMediaService.uploadFileWithReference(file, mediaCategory, referenceType, referenceId, userId);
        } else {
            response = centralMediaService.uploadFile(file, mediaCategory, userId);
        }

        if (Boolean.TRUE.equals(isPrimary) && response.getId() != null) {
            centralMediaService.setAsPrimary(response.getId(), userId);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("File uploaded successfully", response));
    }

    /**
     * Upload nhiều files
     * POST /v1/media/upload/multiple
     */
    @PostMapping(value = "/upload/multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload multiple files", description = "Upload multiple files at once (max 20 files)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<CentralMediaResponse>>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("category") String category,
            @RequestParam(value = "referenceType", required = false) String referenceType,
            @RequestParam(value = "referenceId", required = false) Long referenceId,
            @CurrentUser Long userId) {

        log.info("Upload multiple files: category={}, userId={}, count={}", category, userId, files.length);

        if (files.length > 20) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Maximum 20 files allowed per request"));
        }

        MediaCategory mediaCategory = MediaCategory.valueOf(category.toUpperCase());
        List<CentralMediaResponse> responses = centralMediaService.uploadMultipleFiles(files, mediaCategory, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Files uploaded successfully", responses));
    }

    // ==================== USER AVATAR ====================

    /**
     * Upload avatar
     * POST /v1/media/avatar
     */
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload avatar", description = "Upload user avatar image")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @CurrentUser Long userId) {

        log.info("Upload avatar: userId={}", userId);

        CentralMediaResponse response = centralMediaService.uploadFile(file, MediaCategory.USER_AVATAR, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Avatar uploaded successfully", response));
    }

    // ==================== POST MEDIA ====================

    /**
     * Upload ảnh post
     * POST /v1/media/post/image
     */
    @PostMapping(value = "/post/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload post image", description = "Upload image for a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadPostImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") Long postId,
            @RequestParam(value = "isPrimary", required = false) Boolean isPrimary,
            @CurrentUser Long userId) {

        log.info("Upload post image: postId={}, userId={}", postId, userId);

        CentralMediaResponse response = centralMediaService.uploadFileWithReference(
                file, MediaCategory.POST_IMAGE, "POST", postId, userId);

        if (Boolean.TRUE.equals(isPrimary)) {
            centralMediaService.setAsPrimary(response.getId(), userId);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Post image uploaded successfully", response));
    }

    /**
     * Upload nhiều ảnh post
     * POST /v1/media/post/images
     */
    @PostMapping(value = "/post/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload post images", description = "Upload multiple images for a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<CentralMediaResponse>>> uploadPostImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("postId") Long postId,
            @CurrentUser Long userId) {

        log.info("Upload post images: postId={}, userId={}, count={}", postId, userId, files.length);

        if (files.length > 10) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Maximum 10 images allowed for a post"));
        }

        List<CentralMediaResponse> responses = centralMediaService.uploadMultipleFiles(
                files, MediaCategory.POST_IMAGE, userId);

        // Update references
        for (CentralMediaResponse response : responses) {
            centralMediaService.updateReference(response.getId(), "POST", postId, userId);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Post images uploaded successfully", responses));
    }

    /**
     * Upload video post
     * POST /v1/media/post/video
     */
    @PostMapping(value = "/post/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload post video", description = "Upload video for a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadPostVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") Long postId,
            @CurrentUser Long userId) {

        log.info("Upload post video: postId={}, userId={}", postId, userId);

        CentralMediaResponse response = centralMediaService.uploadFileWithReference(
                file, MediaCategory.POST_VIDEO, "POST", postId, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Post video uploaded successfully", response));
    }

    // ==================== ROOM MEDIA ====================

    /**
     * Upload ảnh phòng
     * POST /v1/media/room/image
     */
    @PostMapping(value = "/room/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload room image", description = "Upload image for a room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadRoomImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("roomId") Long roomId,
            @RequestParam(value = "isPrimary", required = false) Boolean isPrimary,
            @CurrentUser Long userId) {

        log.info("Upload room image: roomId={}, userId={}", roomId, userId);

        CentralMediaResponse response = centralMediaService.uploadFileWithReference(
                file, MediaCategory.ROOM_IMAGE, "ROOM", roomId, userId);

        if (Boolean.TRUE.equals(isPrimary)) {
            centralMediaService.setAsPrimary(response.getId(), userId);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Room image uploaded successfully", response));
    }

    /**
     * Upload nhiều ảnh phòng
     * POST /v1/media/room/images
     */
    @PostMapping(value = "/room/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload room images", description = "Upload multiple images for a room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<CentralMediaResponse>>> uploadRoomImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("roomId") Long roomId,
            @CurrentUser Long userId) {

        log.info("Upload room images: roomId={}, userId={}, count={}", roomId, userId, files.length);

        List<CentralMediaResponse> responses = centralMediaService.uploadMultipleFiles(
                files, MediaCategory.ROOM_IMAGE, userId);

        for (CentralMediaResponse response : responses) {
            centralMediaService.updateReference(response.getId(), "ROOM", roomId, userId);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Room images uploaded successfully", responses));
    }

    // ==================== REVIEW MEDIA ====================

    /**
     * Upload ảnh review
     * POST /v1/media/review/image
     */
    @PostMapping(value = "/review/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload review image", description = "Upload image for a review")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadReviewImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("reviewId") Long reviewId,
            @CurrentUser Long userId) {

        log.info("Upload review image: reviewId={}, userId={}", reviewId, userId);

        CentralMediaResponse response = centralMediaService.uploadFileWithReference(
                file, MediaCategory.REVIEW_IMAGE, "REVIEW", reviewId, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Review image uploaded successfully", response));
    }

    // ==================== GET ====================

    /**
     * Lấy thông tin file
     * GET /v1/media/{fileId}
     */
    @GetMapping("/{fileId}")
    @Operation(summary = "Get file info", description = "Get file information by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> getFileInfo(@PathVariable Long fileId) {

        log.info("Get file info: fileId={}", fileId);

        CentralMediaResponse response = centralMediaService.getFileById(fileId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Lấy URL file
     * GET /v1/media/{fileId}/url
     */
    @GetMapping("/{fileId}/url")
    @Operation(summary = "Get file URL", description = "Get file download/view URL")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, String>>> getFileUrl(@PathVariable Long fileId) {

        log.info("Get file URL: fileId={}", fileId);

        String url = centralMediaService.getFileUrl(fileId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("url", url)));
    }

    /**
     * Lấy files theo reference
     * GET /v1/media/reference/{type}/{id}
     */
    @GetMapping("/reference/{type}/{id}")
    @Operation(summary = "Get files by reference", description = "Get all media files for a specific entity")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<CentralMediaResponse>>> getFilesByReference(
            @PathVariable String type,
            @PathVariable Long id) {

        log.info("Get files by reference: type={}, id={}", type, id);

        List<CentralMediaResponse> responses = centralMediaService.getFilesByReference(type, id);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy files của user theo category
     * GET /v1/media/user?category=USER_AVATAR
     */
    @GetMapping("/user")
    @Operation(summary = "Get user files", description = "Get user's media files by category")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<CentralMediaResponse>>> getUserFiles(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @CurrentUser Long userId) {

        log.info("Get user files: category={}, userId={}", category, userId);

        MediaCategory mediaCategory = null;
        if (category != null && !category.isEmpty()) {
            mediaCategory = MediaCategory.valueOf(category.toUpperCase());
        }

        List<CentralMediaResponse> responses = centralMediaService.getUserFiles(mediaCategory, userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // ==================== UPDATE ====================

    /**
     * Set file là ảnh chính
     * PUT /v1/media/{fileId}/primary
     */
    @PutMapping("/{fileId}/primary")
    @Operation(summary = "Set as primary", description = "Set a file as primary image")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> setAsPrimary(
            @PathVariable Long fileId,
            @CurrentUser Long userId) {

        log.info("Set as primary: fileId={}, userId={}", fileId, userId);

        centralMediaService.setAsPrimary(fileId, userId);
        return ResponseEntity.ok(ApiResponse.success("Set as primary successfully", null));
    }

    /**
     * Cập nhật reference
     * PUT /v1/media/{fileId}/reference
     */
    @PutMapping("/{fileId}/reference")
    @Operation(summary = "Update reference", description = "Update file reference to an entity")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> updateReference(
            @PathVariable Long fileId,
            @RequestParam String referenceType,
            @RequestParam Long referenceId,
            @CurrentUser Long userId) {

        log.info("Update reference: fileId={}, type={}, id={}", fileId, referenceType, referenceId);

        centralMediaService.updateReference(fileId, referenceType, referenceId, userId);
        return ResponseEntity.ok(ApiResponse.success("Reference updated successfully", null));
    }

    // ==================== DELETE ====================

    /**
     * Xóa file
     * DELETE /v1/media/{fileId}
     */
    @DeleteMapping("/{fileId}")
    @Operation(summary = "Delete file", description = "Delete a media file")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @PathVariable Long fileId,
            @CurrentUser Long userId) {

        log.info("Delete file: fileId={}, userId={}", fileId, userId);

        centralMediaService.deleteFile(fileId, userId);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
    }

    /**
     * Xóa nhiều files
     * DELETE /v1/media
     */
    @DeleteMapping
    @Operation(summary = "Delete multiple files", description = "Delete multiple media files")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteMultipleFiles(
            @RequestBody List<Long> fileIds,
            @CurrentUser Long userId) {

        log.info("Delete multiple files: count={}, userId={}", fileIds.size(), userId);

        centralMediaService.deleteMultipleFiles(fileIds, userId);
        return ResponseEntity.ok(ApiResponse.success("Files deleted successfully", null));
    }

    /**
     * Xóa files theo reference
     * DELETE /v1/media/reference/{type}/{id}
     */
    @DeleteMapping("/reference/{type}/{id}")
    @Operation(summary = "Delete files by reference", description = "Delete all media files for an entity")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteFilesByReference(
            @PathVariable String type,
            @PathVariable Long id) {

        log.info("Delete files by reference: type={}, id={}", type, id);

        centralMediaService.deleteFilesByReference(type, id);
        return ResponseEntity.ok(ApiResponse.success("Files deleted successfully", null));
    }

    // ==================== STATS ====================

    /**
     * Lấy thống kê storage
     * GET /v1/media/stats
     */
    @GetMapping("/stats")
    @Operation(summary = "Get storage stats", description = "Get user's storage statistics")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStorageStats(@CurrentUser Long userId) {

        log.info("Get storage stats: userId={}", userId);

        Map<String, Object> stats = centralMediaService.getUserStorageStats(userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Lấy thống kê theo category
     * GET /v1/media/stats/{category}
     */
    @GetMapping("/stats/{category}")
    @Operation(summary = "Get category stats", description = "Get storage statistics for a specific category")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCategoryStats(
            @PathVariable String category,
            @CurrentUser Long userId) {

        log.info("Get category stats: category={}, userId={}", category, userId);

        MediaCategory mediaCategory = MediaCategory.valueOf(category.toUpperCase());
        Map<String, Object> stats = centralMediaService.getCategoryStats(mediaCategory, userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== CHAT/CONVERSATION MEDIA ====================

    /**
     * Lấy media của một conversation
     * GET /v1/media/chat/{conversationId}
     */
    @GetMapping("/chat/{conversationId}")
    @Operation(summary = "Get chat media", description = "Get all media files in a conversation")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<CentralMediaResponse>>> getChatMedia(
            @PathVariable Long conversationId) {

        log.info("Get chat media: conversationId={}", conversationId);

        List<CentralMediaResponse> responses = centralMediaService.getFilesByReference("CONVERSATION", conversationId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Upload media cho chat
     * POST /v1/media/chat/upload
     */
    @PostMapping(value = "/chat/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload chat media", description = "Upload image, video, audio or document for chat")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<CentralMediaResponse>> uploadChatMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("conversationId") Long conversationId,
            @RequestParam("fileType") String fileType,
            @CurrentUser Long userId) {

        log.info("Upload chat media: conversationId={}, userId={}, fileType={}", conversationId, userId, fileType);

        MediaCategory category = determineChatMediaCategory(fileType);
        CentralMediaResponse response = centralMediaService.uploadFileWithReference(
                file, category, "CONVERSATION", conversationId, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Chat media uploaded successfully", response));
    }

    /**
     * Xóa media chat
     * DELETE /v1/media/chat/{fileId}
     */
    @DeleteMapping("/chat/{fileId}")
    @Operation(summary = "Delete chat media", description = "Delete a chat media file")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteChatMedia(
            @PathVariable Long fileId,
            @CurrentUser Long userId) {

        log.info("Delete chat media: fileId={}, userId={}", fileId, userId);

        centralMediaService.deleteFile(fileId, userId);
        return ResponseEntity.ok(ApiResponse.success("Chat media deleted successfully", null));
    }

    /**
     * Helper method để xác định MediaCategory từ file type
     */
    private MediaCategory determineChatMediaCategory(String fileType) {
        if (fileType == null) return MediaCategory.CHAT_IMAGE;
        
        switch (fileType.toUpperCase()) {
            case "IMAGE":
            case "PHOTO":
                return MediaCategory.CHAT_IMAGE;
            case "VIDEO":
            case "CLIP":
                return MediaCategory.CHAT_VIDEO;
            case "AUDIO":
            case "VOICE":
            case "RECORDING":
                return MediaCategory.CHAT_AUDIO;
            case "DOCUMENT":
            case "FILE":
            case "PDF":
                return MediaCategory.CHAT_DOCUMENT;
            default:
                return MediaCategory.CHAT_IMAGE;
        }
    }
}
