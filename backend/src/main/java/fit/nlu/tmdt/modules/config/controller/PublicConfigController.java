package fit.nlu.tmdt.modules.config.controller;

import fit.nlu.tmdt.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public runtime configuration for the frontend.
 */
@RestController
@RequestMapping("/v1/config")
@Tag(name = "Public Config", description = "Public runtime configuration APIs")
public class PublicConfigController {

    @Value("${app.google-maps.api-key:}")
    private String googleMapsApiKey;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    @GetMapping("/public")
    @Operation(summary = "Get public runtime configuration")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPublicConfig() {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "googleMapsApiKey", googleMapsApiKey == null ? "" : googleMapsApiKey,
                "appUrl", appUrl
        )));
    }
}
