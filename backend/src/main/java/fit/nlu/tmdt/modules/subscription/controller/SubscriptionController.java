package fit.nlu.tmdt.modules.subscription.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
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
}
