package fit.nlu.tmdt.modules.subscription.service;

import fit.nlu.tmdt.modules.subscription.dto.request.PurchasePackageRequest;
import fit.nlu.tmdt.modules.subscription.dto.response.PackageResponse;
import fit.nlu.tmdt.modules.subscription.dto.response.SubscriptionResponse;

import java.util.List;
import java.util.Map;

/**
 * Subscription Service Interface
 */
public interface SubscriptionService {

    /**
     * Get current active subscription for user
     */
    SubscriptionResponse getCurrentSubscription(Long userId);

    /**
     * Get subscription history (all subscriptions)
     */
    List<SubscriptionResponse> getSubscriptionHistory(Long userId);

    /**
     * Get available packages
     */
    List<PackageResponse> getAvailablePackages(String type);

    /**
     * Initiate package purchase (creates pending subscription)
     */
    Map<String, Object> initiatePurchase(PurchasePackageRequest request, Long userId);

    /**
     * Toggle auto-renew setting
     */
    void toggleAutoRenew(Long userId, boolean enabled);

    /**
     * Boost a post
     */
    Map<String, Object> boostPost(Long postId, Long packageId, Long userId);

    /**
     * Get active boosts for user
     */
    List<Map<String, Object>> getActiveBoosts(Long userId);

    /**
     * Process successful payment (called after payment callback)
     */
    void processSuccessfulPayment(Long subscriptionId, Long transactionId);

    /**
     * Cancel subscription
     */
    void cancelSubscription(Long userId, String reason);
}
