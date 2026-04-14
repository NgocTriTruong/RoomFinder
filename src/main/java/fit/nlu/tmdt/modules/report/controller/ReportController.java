package fit.nlu.tmdt.modules.report.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.report.dto.request.CreateReportRequest;
import fit.nlu.tmdt.modules.report.dto.response.ReportResponse;
import fit.nlu.tmdt.modules.report.service.ModerationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Report Controller
 */
@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Report", description = "Report & Moderation APIs")
public class ReportController {

    private final ModerationService moderationService;

    @PostMapping
    @Operation(summary = "Create a new report")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            @Valid @RequestBody CreateReportRequest request,
            @CurrentUser Long userId) {

        log.info("Create report from user: {}, target: {}/{}", 
                userId, request.getTargetType(), request.getTargetId());
        ReportResponse response = moderationService.createReport(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Report submitted successfully", response));
    }

    @GetMapping("/admin/pending")
    @Operation(summary = "Get pending reports (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getPendingReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get pending reports");
        List<ReportResponse> reports = moderationService.getPendingReports(page, size);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Resolve report (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReportResponse>> resolveReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long adminId) {

        String note = body.get("note");
        String action = body.get("action");
        log.info("Resolve report: id={}, action={}", id, action);
        ReportResponse response = moderationService.resolveReport(id, note, action, adminId);
        return ResponseEntity.ok(ApiResponse.success("Report resolved", response));
    }

    @PutMapping("/{id}/dismiss")
    @Operation(summary = "Dismiss report (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReportResponse>> dismissReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @CurrentUser Long adminId) {

        String note = body.get("note");
        log.info("Dismiss report: id={}", id);
        ReportResponse response = moderationService.dismissReport(id, note, adminId);
        return ResponseEntity.ok(ApiResponse.success("Report dismissed", response));
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Get my reports")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getMyReports(
            @CurrentUser Long userId) {

        log.info("Get reports by user: {}", userId);
        List<ReportResponse> reports = moderationService.getReportsByReporter(userId);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get report by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(
            @PathVariable Long id) {

        log.info("Get report: {}", id);
        ReportResponse response = moderationService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Get all reports (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get all reports");
        List<ReportResponse> reports = moderationService.getAllReports(page, size);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/admin/count")
    @Operation(summary = "Get report count by status (admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Long>>> getReportCount(
            @RequestParam String status) {

        long count = moderationService.getReportCountByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
    }
}