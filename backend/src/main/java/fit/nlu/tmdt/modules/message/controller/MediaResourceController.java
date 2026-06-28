package fit.nlu.tmdt.modules.message.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Media Resource Controller
 * Serve các file media đã upload
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class MediaResourceController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;



    /**
     * Download file
     * GET /uploads/download/{*path}
     */
    @GetMapping("/uploads/download/{*path}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("path") String path) {
        try {
            String sanitizedPath = path.replace("..", "").replace("//", "/");
            Path filePath = Paths.get(uploadDir, sanitizedPath);
            
            File file = filePath.toFile();
            
            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }
            
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            String originalFilename = file.getName();
            
            Resource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + originalFilename + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get thumbnail
     * GET /uploads/thumb/{*path}
     */
    @GetMapping("/uploads/thumb/{*path}")
    public ResponseEntity<Resource> getThumbnail(@PathVariable("path") String path) {
        try {
            String sanitizedPath = path.replace("..", "").replace("//", "/");
            Path filePath = Paths.get(uploadDir, "thumb", sanitizedPath);
            
            File file = filePath.toFile();
            
            if (!file.exists() || !file.isFile()) {
                // Fallback to original if thumb doesn't exist
                filePath = Paths.get(uploadDir, sanitizedPath);
                file = filePath.toFile();
                
                if (!file.exists() || !file.isFile()) {
                    return ResponseEntity.notFound().build();
                }
            }
            
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "image/jpeg";
            }
            
            Resource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=31536000")
                    .body(resource);
                    
        } catch (Exception e) {
            log.error("Error serving thumbnail: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
