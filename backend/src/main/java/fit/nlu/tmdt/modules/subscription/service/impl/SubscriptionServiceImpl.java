package fit.nlu.tmdt.modules.subscription.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.subscription.dto.request.AdminPackageRequest;
import fit.nlu.tmdt.modules.subscription.dto.request.PurchasePackageRequest;
import fit.nlu.tmdt.modules.subscription.dto.response.PackageResponse;
import fit.nlu.tmdt.modules.subscription.dto.response.SubscriptionResponse;
import fit.nlu.tmdt.modules.subscription.entity.Boost;
import fit.nlu.tmdt.modules.subscription.entity.Package;
import fit.nlu.tmdt.modules.subscription.entity.Subscription;
import fit.nlu.tmdt.modules.subscription.repository.BoostRepository;
import fit.nlu.tmdt.modules.subscription.repository.PackageRepository;
import fit.nlu.tmdt.modules.subscription.repository.SubscriptionRepository;
import fit.nlu.tmdt.modules.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Subscription Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PackageRepository packageRepository;
    private final BoostRepository boostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Value("${subscription.auto-renew.grace-days:3}")
    private int autoRenewGraceDays;

    @Value("${subscription.payment.expiry-minutes:30}")
    private int paymentExpiryMinutes;

    @Override
    public SubscriptionResponse getCurrentSubscription(Long userId) {
        log.info("Getting current subscription for user: {}", userId);

        Subscription subscription = subscriptionRepository.findActiveByLandlordId(userId, LocalDateTime.now())
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_002, "No active subscription"));

        return toSubscriptionResponse(subscription);
    }

    @Override
    public List<SubscriptionResponse> getSubscriptionHistory(Long userId) {
        log.info("Getting subscription history for user: {}", userId);

        return subscriptionRepository.findByLandlordId(userId).stream()
                .map(this::toSubscriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PackageResponse> getAvailablePackages(String type) {
        log.info("Getting available packages, type: {}", type);

        List<Package> packages;
        if (type != null && !type.isBlank()) {
            packages = packageRepository.findByTypeAndIsActiveTrue(type);
        } else {
            packages = packageRepository.findAllActive();
        }

        return packages.stream()
                .map(this::toPackageResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PackageResponse> getAllPackages() {
        log.info("Admin: Getting all packages");
        return packageRepository.findAll().stream()
                .map(this::toPackageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> initiatePurchase(PurchasePackageRequest request, Long userId) {
        log.info("Initiating purchase for user: {}, package: {}", userId, request.getPackageId());

        // 1. Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // 2. Validate package
        Package pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_003, "Package not found"));

        if (!pkg.isActive()) {
            throw new BusinessException(ErrorCode.SUB_004, "Package is not available");
        }

        // 3. Check max purchase limit
        if (pkg.getMaxPurchasePerUser() != null && pkg.getMaxPurchasePerUser() > 0) {
            int purchaseCount = subscriptionRepository.countByLandlordIdAndPackageId(userId, pkg.getId());
            if (purchaseCount >= pkg.getMaxPurchasePerUser()) {
                throw new BusinessException(ErrorCode.SUB_004, "Purchase limit reached for this package");
            }
        }

        // 4. Calculate price
        Double finalPrice = pkg.getDiscountedPrice();

        // 5. Create pending subscription
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = now;
        LocalDateTime expiresAt = now.plusDays(pkg.getDurationDays());

        Subscription subscription = Subscription.builder()
                .landlord(user)
                .pkg(pkg)
                .maxPosts(pkg.getMaxPosts())
                .remainingPosts(pkg.getMaxPosts())
                .usedPosts(0)
                .startDate(startDate)
                .expiresAt(expiresAt)
                .isActive(false) // Will be activated after payment
                .autoRenew(false)
                .build();

        subscription = subscriptionRepository.save(subscription);

        // 6. Generate payment info (simulated)
        String paymentCode = "PAY-" + System.currentTimeMillis();
        LocalDateTime paymentExpiry = now.plusMinutes(paymentExpiryMinutes);

        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("subscriptionId", subscription.getId());
        paymentData.put("packageId", pkg.getId());
        paymentData.put("packageName", pkg.getName());
        paymentData.put("originalPrice", pkg.getPrice());
        paymentData.put("finalPrice", finalPrice);
        paymentData.put("paymentCode", paymentCode);
        paymentData.put("expiresAt", paymentExpiry);
        paymentData.put("redirectUrl", "/v1/payments/" + paymentCode);

        log.info("Purchase initiated: subscription={}, paymentCode={}", subscription.getId(), paymentCode);

        return paymentData;
    }

    @Override
    @Transactional
    public void toggleAutoRenew(Long userId, boolean enabled) {
        log.info("Toggle auto-renew for user: {}, enabled: {}", userId, enabled);

        Subscription subscription = subscriptionRepository.findActiveByLandlordId(userId, LocalDateTime.now())
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_002, "No active subscription to configure"));

        if (enabled) {
            LocalDateTime nextBilling = subscription.getExpiresAt().minusDays(autoRenewGraceDays);
            subscription.enableAutoRenew(nextBilling);
        } else {
            subscription.disableAutoRenew();
        }

        subscriptionRepository.save(subscription);
        log.info("Auto-renew updated for subscription: {}", subscription.getId());
    }

    @Override
    @Transactional
    public Map<String, Object> boostPost(Long postId, Long packageId, Long userId) {
        log.info("Boost post: {} with package: {} for user: {}", postId, packageId, userId);

        // 1. Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // 2. Validate post
        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        // 3. Check ownership
        if (!post.getLandlord().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.POST_008, "Not authorized to boost this post");
        }

        // 4. Validate package
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_003, "Package not found"));

        if (!pkg.isBoostPackage()) {
            throw new BusinessException(ErrorCode.SUB_004, "Package is not a boost package");
        }

        if (!pkg.isActive()) {
            throw new BusinessException(ErrorCode.SUB_004, "Package is not available");
        }

        // 5. Create boost
        Boost boost = Boost.create(user, post, pkg.getBoostDays(), pkg.getPrice());
        boost.setPackageId(pkg.getId());
        boost = boostRepository.save(boost);

        // 6. Generate payment info
        String paymentCode = "BOOST-" + System.currentTimeMillis();
        LocalDateTime paymentExpiry = LocalDateTime.now().plusMinutes(paymentExpiryMinutes);

        Map<String, Object> boostData = new HashMap<>();
        boostData.put("boostId", boost.getId());
        boostData.put("postId", postId);
        boostData.put("packageId", pkg.getId());
        boostData.put("packageName", pkg.getName());
        boostData.put("days", boost.getDays());
        boostData.put("price", boost.getPrice());
        boostData.put("paymentCode", paymentCode);
        boostData.put("expiresAt", paymentExpiry);
        boostData.put("redirectUrl", "/v1/payments/" + paymentCode);

        log.info("Boost initiated: boost={}, post={}", boost.getId(), postId);

        return boostData;
    }

    @Override
    public List<Map<String, Object>> getActiveBoosts(Long userId) {
        log.info("Getting active boosts for user: {}", userId);

        return boostRepository.findActiveByLandlordId(userId, LocalDateTime.now()).stream()
                .map(boost -> {
                    Map<String, Object> boostMap = new HashMap<>();
                    boostMap.put("id", boost.getId());
                    boostMap.put("postId", boost.getPost().getId());
                    boostMap.put("postTitle", boost.getPost().getTitle());
                    boostMap.put("days", boost.getDays());
                    boostMap.put("startTime", boost.getStartTime());
                    boostMap.put("expiresAt", boost.getExpiresAt());
                    boostMap.put("remainingDays", boost.getRemainingDays());
                    boostMap.put("priorityScore", boost.getPriorityScore());
                    boostMap.put("isActive", boost.isActive());
                    return boostMap;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void processSuccessfulPayment(Long subscriptionId, Long transactionId) {
        log.info("Processing successful payment: subscription={}, transaction={}", subscriptionId, transactionId);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_001, "Subscription not found"));

        // Activate subscription
        subscription.setIsActive(true);
        subscription.setTransactionId(transactionId);
        subscriptionRepository.save(subscription);

        log.info("Subscription activated: {}", subscriptionId);
    }

    @Override
    @Transactional
    public void cancelSubscription(Long userId, String reason) {
        log.info("Cancel subscription for user: {}, reason: {}", userId, reason);

        Subscription subscription = subscriptionRepository.findActiveByLandlordId(userId, LocalDateTime.now())
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_002, "No active subscription to cancel"));

        subscription.cancel(reason);
        subscriptionRepository.save(subscription);

        log.info("Subscription cancelled: {}", subscription.getId());
    }

    @Override
    @Transactional
    public PackageResponse createPackage(AdminPackageRequest request) {
        log.info("Creating new package: {}", request.getName());

        Package pkg = Package.builder()
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .maxPosts(request.getMaxPosts())
                .durationDays(request.getDurationDays())
                .boostDays(request.getBoostDays())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .discountPercent(request.getDiscountPercent())
                .features(request.getFeatures() != null ? request.getFeatures() : new ArrayList<>())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .build();

        pkg = packageRepository.save(pkg);
        return toPackageResponse(pkg);
    }

    @Override
    @Transactional
    public PackageResponse updatePackage(Long id, AdminPackageRequest request) {
        log.info("Updating package id: {}", id);

        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_003, "Package not found"));

        pkg.setName(request.getName());
        pkg.setType(request.getType());
        pkg.setDescription(request.getDescription());
        pkg.setMaxPosts(request.getMaxPosts());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setBoostDays(request.getBoostDays());
        pkg.setPrice(request.getPrice());
        pkg.setOriginalPrice(request.getOriginalPrice());
        pkg.setDiscountPercent(request.getDiscountPercent());
        if (request.getFeatures() != null) {
            pkg.setFeatures(request.getFeatures());
        }
        
        if (request.getIsActive() != null) pkg.setIsActive(request.getIsActive());
        if (request.getDisplayOrder() != null) pkg.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsFeatured() != null) pkg.setIsFeatured(request.getIsFeatured());

        pkg = packageRepository.save(pkg);
        return toPackageResponse(pkg);
    }

    @Override
    @Transactional
    public void deletePackage(Long id) {
        log.info("Hard deleting package id: {}", id);

        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_003, "Package not found"));

        // Check for subscriptions
        long subCount = subscriptionRepository.countByPkgId(id);
        if (subCount > 0) {
            throw new BusinessException(ErrorCode.SUB_006, 
                "Không thể xóa gói dịch vụ này vì đã có người dùng đăng ký (" + subCount + " lượt). " +
                "Vui lòng sử dụng tính năng 'Tắt' để ẩn gói này.");
        }

        packageRepository.delete(pkg);
    }

    // ==================== HELPER METHODS ====================

    private SubscriptionResponse toSubscriptionResponse(Subscription subscription) {
        Package pkg = subscription.getPkg();

        Hibernate.initialize(pkg.getFeatures());

        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .packageId(pkg.getId())
                .packageName(pkg.getName())
                .packageType(pkg.getType().name())
                .maxPosts(subscription.getMaxPosts())
                .remainingPosts(subscription.getRemainingPosts())
                .usedPosts(subscription.getUsedPosts())
                .startDate(subscription.getStartDate())
                .expiresAt(subscription.getExpiresAt())
                .remainingDays(subscription.getRemainingDays())
                .isActive(subscription.isActive())
                .isExpired(subscription.isExpired())
                .isExpiringSoon(subscription.isExpiringSoon())
                .autoRenew(subscription.getAutoRenew())
                .nextBillingDate(subscription.getNextBillingDate())
                .cancelledAt(subscription.getCancelledAt())
                .cancellationReason(subscription.getCancellationReason())
                .createdAt(subscription.getCreatedAt())
                .features(pkg.getFeatures())
                .build();
    }

    private PackageResponse toPackageResponse(Package pkg) {
        Hibernate.initialize(pkg.getFeatures());

        return PackageResponse.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .type(pkg.getType().name())
                .typeDisplayName(pkg.getType().getDisplayName())
                .description(pkg.getDescription())
                .maxPosts(pkg.getMaxPosts())
                .durationDays(pkg.getDurationDays())
                .boostDays(pkg.getBoostDays())
                .price(pkg.getPrice())
                .originalPrice(pkg.getOriginalPrice())
                .discountPercent(pkg.getDiscountPercent())
                .discountedPrice(pkg.getDiscountedPrice())
                .hasDiscount(pkg.hasDiscount())
                .features(pkg.getFeatures())
                .isActive(pkg.isActive())
                .isFeatured(pkg.getIsFeatured())
                .displayOrder(pkg.getDisplayOrder())
                .validFrom(pkg.getValidFrom())
                .validTo(pkg.getValidTo())
                .maxPurchasePerUser(pkg.getMaxPurchasePerUser())
                .build();
    }
}
