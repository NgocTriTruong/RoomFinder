package fit.nlu.tmdt.modules.voucher.service;

import fit.nlu.tmdt.modules.voucher.dto.request.ApplyVoucherRequest;
import fit.nlu.tmdt.modules.voucher.dto.request.VoucherRequest;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherResponse;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherValidationResponse;

import java.util.List;

/**
 * Voucher Service Interface
 */
public interface VoucherService {

    /**
     * Get voucher by code
     */
    VoucherResponse getVoucherByCode(String code);

    /**
     * Apply voucher to order
     */
    VoucherValidationResponse applyVoucher(ApplyVoucherRequest request, Long userId);

    /**
     * Get available vouchers
     */
    List<VoucherResponse> getAvailableVouchers();

    /**
     * Get all active vouchers (admin)
     */
    List<VoucherResponse> getAllActiveVouchers();

    /**
     * Validate voucher without applying
     */
    VoucherValidationResponse validateVoucher(String code, Double orderAmount, Long packageId, Long userId);

    /**
     * Get featured vouchers
     */
    List<VoucherResponse> getFeaturedVouchers();

    /**
     * Create a new voucher (admin)
     */
    VoucherResponse createVoucher(VoucherRequest request, Long adminId);

    /**
     * Update an existing voucher (admin)
     */
    VoucherResponse updateVoucher(Long id, VoucherRequest request, Long adminId);

    /**
     * Delete a voucher (admin)
     */
    void deleteVoucher(Long id, Long adminId);

    /**
     * Get all vouchers (admin)
     */
    List<VoucherResponse> getAllVouchers();
}