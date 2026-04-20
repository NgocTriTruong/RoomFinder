package fit.nlu.tmdt.modules.media.service;

import fit.nlu.tmdt.modules.media.dto.request.UploadMediaRequest;
import fit.nlu.tmdt.modules.media.dto.response.CentralMediaResponse;
import fit.nlu.tmdt.modules.media.entity.enums.MediaCategory;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * CentralMedia Service Interface
 * Service trung tâm xử lý upload và quản lý media cho toàn bộ dự án
 */
public interface CentralMediaService {

    // ==================== UPLOAD ===========

    /**
     * Upload một file đơn lẻ
     *
     * @param file File cần upload
     * @param category Category của file
     * @param userId ID của user upload
     * @return CentralMediaResponse
     */
    CentralMediaResponse uploadFile(MultipartFile file, MediaCategory category, Long userId);

    /**
     * Upload file với reference
     *
     * @param file File cần upload
     * @param category Category của file
     * @param referenceType Entity type (POST, ROOM, USER...)
     * @param referenceId Entity ID
     * @param userId ID của user upload
     * @return CentralMediaResponse
     */
    CentralMediaResponse uploadFileWithReference(MultipartFile file, MediaCategory category,
                                                String referenceType, Long referenceId, Long userId);

    /**
     * Upload nhiều files
     *
     * @param files Danh sách files
     * @param category Category của file
     * @param userId ID của user upload
     * @return Danh sách CentralMediaResponse
     */
    List<CentralMediaResponse> uploadMultipleFiles(MultipartFile[] files, MediaCategory category, Long userId);

    // ==================== GET ==========

    /**
     * Lấy thông tin file theo ID
     *
     * @param fileId ID của file
     * @return CentralMediaResponse
     */
    CentralMediaResponse getFileById(Long fileId);

    /**
     * Lấy URL của file
     *
     * @param fileId ID của file
     * @return URL của file
     */
    String getFileUrl(Long fileId);

    /**
     * Lấy files theo reference
     *
     * @param referenceType Entity type
     * @param referenceId Entity ID
     * @return Danh sách files
     */
    List<CentralMediaResponse> getFilesByReference(String referenceType, Long referenceId);

    /**
     * Lấy files theo category của user
     *
     * @param category Category
     * @param userId ID của user
     * @return Danh sách files
     */
    List<CentralMediaResponse> getFilesByCategory(MediaCategory category, Long userId);

    /**
     * Lấy files của user với phân trang
     *
     * @param category Category (optional)
     * @param userId ID của user
     * @param page Trang
     * @param size Kích thước trang
     * @return Danh sách files
     */
    List<CentralMediaResponse> getUserFiles(MediaCategory category, Long userId, int page, int size);

    // ==================== UPDATE ==========

    /**
     * Set file là ảnh chính
     *
     * @param fileId ID của file
     * @param userId ID của user
     */
    void setAsPrimary(Long fileId, Long userId);

    /**
     * Cập nhật reference cho file
     *
     * @param fileId ID của file
     * @param referenceType Entity type
     * @param referenceId Entity ID
     * @param userId ID của user
     */
    void updateReference(Long fileId, String referenceType, Long referenceId, Long userId);

    // ==================== DELETE ==========

    /**
     * Xóa một file
     *
     * @param fileId ID của file
     * @param userId ID của user
     */
    void deleteFile(Long fileId, Long userId);

    /**
     * Xóa nhiều files
     *
     * @param fileIds Danh sách ID
     * @param userId ID của user
     */
    void deleteMultipleFiles(List<Long> fileIds, Long userId);

    /**
     * Xóa files theo reference
     *
     * @param referenceType Entity type
     * @param referenceId Entity ID
     */
    void deleteFilesByReference(String referenceType, Long referenceId);

    // ==================== VALIDATION ==========

    /**
     * Validate file
     *
     * @param file File cần validate
     * @param category Category của file
     * @throws IllegalArgumentException nếu không hợp lệ
     */
    void validateFile(MultipartFile file, MediaCategory category);

    // ==================== STATS ==========

    /**
     * Lấy thống kê storage của user
     *
     * @param userId ID của user
     * @return Map chứa thống kê
     */
    Map<String, Object> getUserStorageStats(Long userId);

    /**
     * Lấy thống kê storage theo category
     *
     * @param category Category
     * @param userId ID của user
     * @return Map chứa thống kê
     */
    Map<String, Object> getCategoryStats(MediaCategory category, Long userId);
}
