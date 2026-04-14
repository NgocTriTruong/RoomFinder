package fit.nlu.tmdt.modules.voucher.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.voucher.dto.request.ApplyVoucherRequest;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherResponse;
import fit.nlu.tmdt.modules.voucher.dto.response.VoucherValidationResponse;
import fit.nlu.tmdt.modules.voucher.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Voucher Controller
 */
@RestController
@RequestMapping("/v1/vouchers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Voucher", description = "Voucher Management APIs")
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping("/{code}")
    @Operation(summary = "Get voucher by code")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherByCode(
            @PathVariable String code) {

        log.info("Get voucher by code: {}", code);
        VoucherResponse response = voucherService.getVoucherByCode(code);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/apply")
    @Operation(summary = "Apply voucher to order")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<VoucherValidationResponse>> applyVoucher(
            @Valid @RequestBody ApplyVoucherRequest request,
            @CurrentUser Long userId) {

        log.info("Apply voucher: code={}, userId={}", request.getCode(), userId);
        VoucherValidationResponse response = voucherService.applyVoucher(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Voucher applied successfully", response));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available vouchers")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getAvailableVouchers() {

        log.info("Get available vouchers");
        List<VoucherResponse> vouchers = voucherService.getAvailableVouchers();
        return ResponseEntity.ok(ApiResponse.success(vouchers));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate voucher without applying")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<VoucherValidationResponse>> validateVoucher(
            @RequestParam String code,
            @RequestParam Double orderAmount,
            @RequestParam(required = false) Long packageId,
            @CurrentUser Long userId) {

        log.info("Validate voucher: code={}, userId={}", code, userId);
        VoucherValidationResponse response = voucherService.validateVoucher(code, orderAmount, packageId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured vouchers")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getFeaturedVouchers() {

        log.info("Get featured vouchers");
        List<VoucherResponse> vouchers = voucherService.getFeaturedVouchers();
        return ResponseEntity.ok(ApiResponse.success(vouchers));
    }
}