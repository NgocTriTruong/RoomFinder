package fit.nlu.tmdt.modules.subscription.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.subscription.dto.request.AdminPackageRequest;
import fit.nlu.tmdt.modules.subscription.dto.request.PurchasePackageRequest;
import fit.nlu.tmdt.modules.subscription.dto.response.PackageResponse;
import fit.nlu.tmdt.modules.subscription.dto.response.SubscriptionResponse;
import fit.nlu.tmdt.modules.subscription.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Subscription Controller
 */
@RestController
@RequestMapping("/v1/subscriptions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Subscription", description = "Subscription Management APIs")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/current")
    @Operation(summary = "Get current subscription")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getCurrentSubscription(
            @CurrentUser Long userId) {

        log.info("Get current subscription for user: {}", userId);
        SubscriptionResponse response = subscriptionService.getCurrentSubscription(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/packages")
    @Operation(summary = "List available packages")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<PackageResponse>>> getAvailablePackages(
            @RequestParam(required = false) String type) {

        log.info("Get available packages, type: {}", type);
        List<PackageResponse> packages = subscriptionService.getAvailablePackages(type);
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    @GetMapping("/history")
    @Operation(summary = "Get subscription history")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<SubscriptionResponse>>> getSubscriptionHistory(
            @CurrentUser Long userId) {

        log.info("Get subscription history for user: {}", userId);
        List<SubscriptionResponse> history = subscriptionService.getSubscriptionHistory(userId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @PostMapping("/purchase")
    @Operation(summary = "Purchase package")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> purchasePackage(
            @Valid @RequestBody PurchasePackageRequest request,
            @CurrentUser Long userId) {

        log.info("Purchase package: {} for user: {}", request.getPackageId(), userId);
        Map<String, Object> paymentData = subscriptionService.initiatePurchase(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Purchase initiated successfully", paymentData));
    }

    @PutMapping("/auto-renew")
    @Operation(summary = "Toggle auto-renew")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> toggleAutoRenew(
            @RequestParam boolean enabled,
            @CurrentUser Long userId) {

        log.info("Toggle auto-renew for user: {}, enabled: {}", userId, enabled);
        subscriptionService.toggleAutoRenew(userId, enabled);
        return ResponseEntity.ok(ApiResponse.success(
                enabled ? "Auto-renew enabled" : "Auto-renew disabled", null));
    }

    @PostMapping("/boost/{postId}")
    @Operation(summary = "Boost a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Object>>> boostPost(
            @PathVariable Long postId,
            @RequestParam Long packageId,
            @CurrentUser Long userId) {

        log.info("Boost post: {} with package: {} for user: {}", postId, packageId, userId);
        Map<String, Object> boostData = subscriptionService.boostPost(postId, packageId, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Boost initiated successfully", boostData));
    }

    @GetMapping("/boosts/active")
    @Operation(summary = "Get active boosts for current user")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActiveBoosts(
            @CurrentUser Long userId) {

        log.info("Get active boosts for user: {}", userId);
        List<Map<String, Object>> boosts = subscriptionService.getActiveBoosts(userId);
        return ResponseEntity.ok(ApiResponse.success(boosts));
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================
    
    @GetMapping("/admin/packages")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all packages (Admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<PackageResponse>>> getAllPackages() {
        log.info("Admin: Getting all packages");
        List<PackageResponse> packages = subscriptionService.getAllPackages();
        return ResponseEntity.ok(ApiResponse.success(packages));
    }

    @PostMapping("/admin/packages")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create package (Admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PackageResponse>> createPackage(
            @Valid @RequestBody AdminPackageRequest request) {

        log.info("Admin: Creating new package: {}", request.getName());
        PackageResponse response = subscriptionService.createPackage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Package created successfully", response));
    }

    @PutMapping("/admin/packages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update package (Admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PackageResponse>> updatePackage(
            @PathVariable Long id,
            @Valid @RequestBody AdminPackageRequest request) {

        log.info("Admin: Updating package id: {}", id);
        PackageResponse response = subscriptionService.updatePackage(id, request);
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", response));
    }

    @DeleteMapping("/admin/packages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete package (Admin)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {

        log.info("Admin: Deleting package id: {}", id);
        subscriptionService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.success("Package deleted successfully", null));
    }
}
