package fit.nlu.tmdt.modules.voucher.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.voucher.dto.request.ApplyVoucherRequest;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherResponse;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherValidationResponse;
import fit.nlu.tmdt.modules.voucher.entity.Voucher;
import fit.nlu.tmdt.modules.voucher.repository.VoucherRepository;
import fit.nlu.tmdt.modules.voucher.service.VoucherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Voucher Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

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

        return validateAndCalculate(voucher, request.getOrderAmount(), request.getPackageId(), request.getPackageType());
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

        return validateAndCalculate(voucher, orderAmount, packageId, null);
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

    private VoucherValidationResponse validateAndCalculate(Voucher voucher, Double orderAmount, Long packageId, String packageType) {
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
                .build();
    }
}