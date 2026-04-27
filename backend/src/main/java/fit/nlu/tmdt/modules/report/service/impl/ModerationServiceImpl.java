package fit.nlu.tmdt.modules.report.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.report.dto.request.CreateReportRequest;
import fit.nlu.tmdt.modules.report.dto.response.ReportResponse;
import fit.nlu.tmdt.modules.report.entity.Blacklist;
import fit.nlu.tmdt.modules.report.entity.Report;
import fit.nlu.tmdt.modules.report.entity.enums.ReportStatus;
import fit.nlu.tmdt.modules.report.repository.BlacklistRepository;
import fit.nlu.tmdt.modules.report.repository.ReportRepository;
import fit.nlu.tmdt.modules.report.service.ModerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Moderation Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ModerationServiceImpl implements ModerationService {

    private final ReportRepository reportRepository;
    private final BlacklistRepository blacklistRepository;
    private final UserRepository userRepository;
    private final fit.nlu.tmdt.modules.post.service.PostService postService;

    @Override
    public ReportResponse createReport(CreateReportRequest request, Long userId) {
        if (reportRepository.existsByReporterIdAndTargetIdAndTargetTypeAndDeletedAtIsNull(
                userId, request.getTargetId(), request.getTargetType())) {
            throw new BusinessException("You have already reported this content");
        }

        if ("USER".equals(request.getTargetType()) || "LANDLORD".equals(request.getTargetType())) {
            if (request.getTargetId().equals(userId)) {
                throw new BusinessException(ErrorCode.RPT_002, "Cannot report yourself");
            }
        }

        User reporter = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        Report report = Report.builder()
                .reporter(reporter)
                .targetId(request.getTargetId())
                .targetType(request.getTargetType())
                .type(request.getType())
                .reason(request.getReason())
                .description(request.getDescription())
                .evidenceUrl(request.getEvidenceUrl())
                .postId(request.getPostId())
                .bookingId(request.getBookingId())
                .status(ReportStatus.PENDING)
                .build();

        report = reportRepository.save(report);
        log.info("Created report: id={}, reporter={}, target={}/{}", 
                report.getId(), userId, request.getTargetType(), request.getTargetId());
        return toResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getPendingReports(int page, int size) {
        Page<Report> reports = reportRepository.findByStatusAndDeletedAtIsNullOrderByCreatedAtDesc(
                ReportStatus.PENDING, PageRequest.of(page, size));
        return reports.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports(int page, int size) {
        Page<Report> reports = reportRepository.findByDeletedAtIsNullOrderByCreatedAtDesc(PageRequest.of(page, size));
        return reports.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByReporter(Long reporterId) {
        List<Report> reports = reportRepository.findByReporterIdAndDeletedAtIsNull(reporterId);
        return reports.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponse resolveReport(Long reportId, String note, String action, Long adminId) {
        Report report = reportRepository.findByIdAndDeletedAtIsNull(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RPT_001, "Report not found"));

        if (!report.isPending() && !report.isProcessing()) {
            throw new BusinessException("Report is not in resolvable state");
        }

        report.resolve(note, action);
        
        if ("BLACKLIST_USER".equals(action) && report.getTargetType().matches("USER|LANDLORD")) {
            blacklistUser(report.getTargetId(), note, adminId);
        } else if ("REMOVE_POST".equals(action) && "POST".equals(report.getTargetType())) {
            // Handle post removal
            postService.adminDeletePost(report.getTargetId(), adminId);
            log.info("Post {} removed by admin {} due to report {}", report.getTargetId(), adminId, reportId);
        }

        report = reportRepository.save(report);
        log.info("Resolved report: id={}, action={}", reportId, action);
        return toResponse(report);
    }

    @Override
    public ReportResponse dismissReport(Long reportId, String note, Long adminId) {
        Report report = reportRepository.findByIdAndDeletedAtIsNull(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RPT_001, "Report not found"));

        if (!report.isPending()) {
            throw new BusinessException("Report is not in dismissible state");
        }

        report.dismiss(note);
        report.setHandledBy(adminId);
        report.setHandledAt(LocalDateTime.now());
        
        report = reportRepository.save(report);
        log.info("Dismissed report: id={}", reportId);
        return toResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportRepository.findByIdAndDeletedAtIsNull(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RPT_001, "Report not found"));
        return toResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public long getReportCountByStatus(String status) {
        try {
            ReportStatus reportStatus = ReportStatus.valueOf(status.toUpperCase());
            return reportRepository.countByStatusAndDeletedAtIsNull(reportStatus);
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }

    private void blacklistUser(Long userId, String reason, Long adminId) {
        Optional<Blacklist> existingBlacklist = blacklistRepository.findActiveBlacklistByUserId(userId);
        
        if (existingBlacklist.isPresent()) {
            log.info("User {} is already blacklisted", userId);
            return;
        }

        User user = userRepository.findByIdAndDeletedAtIsNull(userId).orElse(null);
        if (user == null) {
            log.warn("Cannot blacklist user, user not found: {}", userId);
            return;
        }

        Blacklist blacklist = Blacklist.createTemporary(user, reason, 30, adminId);
        blacklistRepository.save(blacklist);
        log.info("Blacklisted user: userId={}, reason={}", userId, reason);
    }

    private ReportResponse toResponse(Report report) {
        ReportResponse.ReportResponseBuilder builder = ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterName(report.getReporter().getFullName())
                .targetId(report.getTargetId())
                .targetType(report.getTargetType())
                .type(report.getType())
                .reason(report.getReason())
                .description(report.getDescription())
                .evidenceUrl(report.getEvidenceUrl())
                .status(report.getStatus())
                .postId(report.getPostId())
                .bookingId(report.getBookingId())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt());

        if (report.getHandledBy() != null) {
            builder.handledBy(report.getHandledBy());
            builder.handledAt(report.getHandledAt());
            builder.handledNote(report.getHandledNote());
            builder.actionTaken(report.getActionTaken());
            
            userRepository.findByIdAndDeletedAtIsNull(report.getHandledBy())
                    .ifPresent(handler -> builder.handledByName(handler.getFullName()));
        }

        return builder.build();
    }
}