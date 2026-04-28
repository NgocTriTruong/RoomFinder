package fit.nlu.tmdt.modules.voucher.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.voucher.dto.request.ApplyVoucherRequest;
import fit.nlu.tmdt.modules.voucher.dto.request.VoucherRequest;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherResponse;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherValidationResponse;
import fit.nlu.tmdt.modules.voucher.entity.Voucher;
import fit.nlu.tmdt.modules.payment.entity.enums.PaymentStatus;
import fit.nlu.tmdt.modules.payment.repository.TransactionRepository;
import fit.nlu.tmdt.modules.voucher.repository.VoucherRepository;
import fit.nlu.tmdt.modules.voucher.service.VoucherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Voucher Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final TransactionRepository transactionRepository;
    private final fit.nlu.tmdt.modules.audit.service.AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public VoucherResponse getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCodeAndDeletedAtIsNull(code)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOU_001));
        return toResponse(voucher);
    }

    @Override
    public VoucherValidationResponse applyVoucher(ApplyVoucherRequest request, Long userId) {
        Voucher voucher = voucherRepository.findValidVoucherByCode(request.getCode(), LocalDateTime.now())
                .orElseThrow(() -> new BusinessException(ErrorCode.VOU_001));

        return validateAndCalculate(voucher, request.getOrderAmount(), request.getPackageId(),
                request.getPackageType(), userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getAvailableVouchers() {
        List<Voucher> vouchers = voucherRepository.findAvailableVouchers(LocalDateTime.now());
        return vouchers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getAllActiveVouchers() {
        List<Voucher> vouchers = voucherRepository.findActiveVouchers(LocalDateTime.now());
        return vouchers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherValidationResponse validateVoucher(String code, Double orderAmount, Long packageId, Long userId) {
        Voucher voucher = voucherRepository.findValidVoucherByCode(code, LocalDateTime.now())
                .orElseThrow(() -> new BusinessException(ErrorCode.VOU_001));

        return validateAndCalculate(voucher, orderAmount, packageId, null, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getFeaturedVouchers() {
        List<Voucher> vouchers = voucherRepository.findAvailableVouchers(LocalDateTime.now());
        return vouchers.stream()
                .filter(Voucher::getIsFeatured)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request, Long adminId) {
        if (voucherRepository.existsByCodeAndDeletedAtIsNull(request.getCode())) {
            throw new BusinessException(ErrorCode.VOU_007, "Voucher code already exists");
        }

        Voucher voucher = Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discount(request.getDiscount())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .minOrderAmount(request.getMinOrderAmount())
                .totalQuantity(request.getTotalQuantity())
                .remainingQuantity(request.getTotalQuantity())
                .maxPerUser(request.getMaxPerUser())
                .validFrom(request.getValidFrom())
                .expiresAt(request.getExpiresAt())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .applicableTypes(request.getApplicableTypes())
                .applicablePackageIds(request.getApplicablePackageIds())
                .createdBy(adminId)
                .usedCount(0)
                .build();

        voucher = voucherRepository.save(voucher);
        log.info("Created new voucher: {}", voucher.getCode());

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.CREATE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.VOUCHER, voucher.getId(), 
                "Tạo mới voucher: " + voucher.getCode(), null);

        return toResponse(voucher);
    }

    @Override
    @Transactional
    public VoucherResponse updateVoucher(Long id, VoucherRequest request, Long adminId) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOU_001));

        voucher.setName(request.getName());
        voucher.setDescription(request.getDescription());
        voucher.setDiscountType(request.getDiscountType());
        voucher.setDiscount(request.getDiscount());
        voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        voucher.setMinOrderAmount(request.getMinOrderAmount());
        // Logic update quantity: if totalQuantity increases, increase remainingQuantity accordingly
        if (request.getTotalQuantity() != null) {
            int oldTotal = voucher.getTotalQuantity() != null ? voucher.getTotalQuantity() : 0;
            int newTotal = request.getTotalQuantity();
            int diff = newTotal - oldTotal;
            
            voucher.setTotalQuantity(newTotal);
            int currentRemaining = voucher.getRemainingQuantity() != null ? voucher.getRemainingQuantity() : 0;
            voucher.setRemainingQuantity(Math.max(0, currentRemaining + diff));
        }

        voucher.setMaxPerUser(request.getMaxPerUser());
        voucher.setValidFrom(request.getValidFrom());
        voucher.setExpiresAt(request.getExpiresAt());
        voucher.setIsActive(request.getIsActive());
        voucher.setIsPublic(request.getIsPublic());
        voucher.setIsFeatured(request.getIsFeatured());
        voucher.setApplicableTypes(request.getApplicableTypes());
        voucher.setApplicablePackageIds(request.getApplicablePackageIds());

        voucher = voucherRepository.save(voucher);
        log.info("Updated voucher: {}", voucher.getCode());

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.UPDATE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.VOUCHER, voucher.getId(), 
                "Cập nhật voucher: " + voucher.getCode(), null);

        return toResponse(voucher);
    }

    @Override
    @Transactional
    public void deleteVoucher(Long id, Long adminId) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOU_001));
        voucher.softDelete();
        voucherRepository.saveAndFlush(voucher);
        log.info("Deleted voucher: {}", voucher.getCode());

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.DELETE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.VOUCHER, voucher.getId(), 
                "Xóa voucher: " + voucher.getCode(), null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getAllVouchers() {
        List<Voucher> vouchers = voucherRepository.findAllByDeletedAtIsNull();
        vouchers.forEach(v -> Hibernate.initialize(v.getApplicablePackageIds()));
        return vouchers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private VoucherValidationResponse validateAndCalculate(Voucher voucher, Double orderAmount, Long packageId,
            String packageType, Long userId) {
        if (!voucher.isActive()) {
            throw new BusinessException(ErrorCode.VOU_003);
        }

        if (!voucher.isValidNow()) {
            throw new BusinessException(ErrorCode.VOU_002);
        }

        if (!voucher.hasRemainingQuantity()) {
            throw new BusinessException(ErrorCode.VOU_004);
        }

        if (voucher.getMinOrderAmount() != null && orderAmount < voucher.getMinOrderAmount()) {
            throw new BusinessException(ErrorCode.VOU_005);
        }

        if (packageType != null && !voucher.isApplicableForType(packageType)) {
            throw new BusinessException(ErrorCode.VOU_006);
        }

        if (packageId != null && !voucher.isApplicableForPackage(packageId)) {
            throw new BusinessException(ErrorCode.VOU_006);
        }

        // Check max per user
        if (userId != null && voucher.getMaxPerUser() != null) {
            long usedCount = transactionRepository.countByUserIdAndVoucherCodeAndStatusAndDeletedAtIsNull(
                    userId, voucher.getCode(), PaymentStatus.SUCCESS);
            if (usedCount >= voucher.getMaxPerUser()) {
                throw new BusinessException(ErrorCode.VOU_008);
            }
        }

        Double discountedAmount = voucher.calculateDiscount(orderAmount);

        return VoucherValidationResponse.builder()
                .isValid(true)
                .code(voucher.getCode())
                .name(voucher.getName())
                .discountType(voucher.getDiscountType())
                .discount(voucher.getDiscount())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .originalAmount(orderAmount)
                .discountedAmount(discountedAmount)
                .message("Voucher applied successfully")
                .expiresAt(voucher.getExpiresAt())
                .isPercentage(voucher.isPercentage())
                .build();
    }

    private VoucherResponse toResponse(Voucher voucher) {
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .name(voucher.getName())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discount(voucher.getDiscount())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .minOrderAmount(voucher.getMinOrderAmount())
                .totalQuantity(voucher.getTotalQuantity())
                .remainingQuantity(voucher.getRemainingQuantity())
                .maxPerUser(voucher.getMaxPerUser())
                .validFrom(voucher.getValidFrom())
                .expiresAt(voucher.getExpiresAt())
                .isActive(voucher.getIsActive())
                .isPublic(voucher.getIsPublic())
                .isFeatured(voucher.getIsFeatured())
                .applicableTypes(voucher.getApplicableTypes())
                .applicablePackageIds(voucher.getApplicablePackageIds() != null ? voucher.getApplicablePackageIds()
                        : new java.util.HashSet<>())
                .usedCount(voucher.getUsedCount())
                .build();
    }
}