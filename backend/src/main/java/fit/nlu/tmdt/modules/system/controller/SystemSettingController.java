package fit.nlu.tmdt.modules.system.controller;

import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.system.entity.SystemSetting;
import fit.nlu.tmdt.modules.system.service.SystemSettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/system/settings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "System", description = "System Configuration APIs")
public class SystemSettingController {

    private final SystemSettingService settingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all system settings")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingService.getAllSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update multiple system settings")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody Map<String, String> settings) {
        log.info("Updating {} system settings", settings.size());
        settingService.updateSettings(settings);
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", null));
    }
}
