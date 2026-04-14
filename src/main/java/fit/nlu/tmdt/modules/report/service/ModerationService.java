package fit.nlu.tmdt.modules.report.service;

import fit.nlu.tmdt.modules.report.dto.request.CreateReportRequest;
import fit.nlu.tmdt.modules.report.dto.response.ReportResponse;

import java.util.List;

/**
 * Moderation Service Interface
 */
public interface ModerationService {

    /**
     * Create a new report
     */
    ReportResponse createReport(CreateReportRequest request, Long userId);

    /**
     * Get pending reports (admin)
     */
    List<ReportResponse> getPendingReports(int page, int size);

    /**
     * Get all reports (admin)
     */
    List<ReportResponse> getAllReports(int page, int size);

    /**
     * Get reports by reporter
     */
    List<ReportResponse> getReportsByReporter(Long reporterId);

    /**
     * Resolve report
     */
    ReportResponse resolveReport(Long reportId, String note, String action, Long adminId);

    /**
     * Dismiss report
     */
    ReportResponse dismissReport(Long reportId, String note, Long adminId);

    /**
     * Get report by ID
     */
    ReportResponse getReportById(Long reportId);

    /**
     * Get report count by status
     */
    long getReportCountByStatus(String status);
}