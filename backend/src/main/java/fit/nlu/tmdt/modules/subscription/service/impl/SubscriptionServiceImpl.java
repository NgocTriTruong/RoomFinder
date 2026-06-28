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
    private final fit.nlu.tmdt.modules.audit.service.AuditLogService auditLogService;
    private final fit.nlu.tmdt.modules.payment.service.PaymentService paymentService;

    @Value("${subscription.auto-renew.grace-days:3}")
    private int autoRenewGraceDays;

    @Value("${subscription.payment.expiry-minutes:30}")
    private int paymentExpiryMinutes;

    @Override
    public SubscriptionResponse getCurrentSubscription(Long userId) {
        log.info("Getting current subscription for user: {}", userId);

        Subscription subscription = subscriptionRepository.findActiveByLandlordId(userId, LocalDateTime.now())
                .stream().findFirst()
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

        // 6. Generate real payment info
        fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest paymentRequest = 
            fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest.builder()
                .amount(finalPrice)
                .orderType("PACKAGE_PURCHASE")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "VNPAY")
                .orderDescription("Mua goi dich vu: " + pkg.getName())
                .packageId(pkg.getId())
                .subscriptionId(subscription.getId())
                .build();

        fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse paymentResponse = paymentService.createOrder(userId, paymentRequest);

        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("subscriptionId", subscription.getId());
        paymentData.put("transactionId", paymentResponse.getId());
        paymentData.put("orderId", paymentResponse.getOrderId());
        paymentData.put("packageName", pkg.getName());
        paymentData.put("finalPrice", finalPrice);
        paymentData.put("paymentUrl", paymentResponse.getPaymentUrl());

        log.info("Purchase initiated: subscription={}, transaction={}", subscription.getId(), paymentResponse.getId());

        return paymentData;
    }

    @Override
    @Transactional
    public void toggleAutoRenew(Long userId, boolean enabled) {
        log.info("Toggle auto-renew for user: {}, enabled: {}", userId, enabled);

        Subscription subscription = subscriptionRepository.findActiveByLandlordId(userId, LocalDateTime.now())
                .stream().findFirst()
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

        // 5. Create boost (initially inactive)
        Boost boost = Boost.create(user, post, pkg.getBoostDays(), pkg.getPrice());
        boost.setIsActive(false); // Only active after payment
        boost.setPackageId(pkg.getId());
        boost = boostRepository.save(boost);

        // 6. Generate real payment info
        fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest paymentRequest = 
            fit.nlu.tmdt.modules.payment.dto.request.CreatePaymentRequest.builder()
                .amount(pkg.getPrice())
                .orderType("BOOST_PURCHASE")
                .paymentMethod("VNPAY")
                .orderDescription("Day tin: " + post.getTitle())
                .packageId(pkg.getId())
                .postId(postId)
                .boostId(boost.getId())
                .build();

        fit.nlu.tmdt.modules.payment.dto.response.PaymentResponse paymentResponse = paymentService.createOrder(userId, paymentRequest);

        Map<String, Object> boostData = new HashMap<>();
        boostData.put("boostId", boost.getId());
        boostData.put("transactionId", paymentResponse.getId());
        boostData.put("orderId", paymentResponse.getOrderId());
        boostData.put("packageName", pkg.getName());
        boostData.put("price", boost.getPrice());
        boostData.put("paymentUrl", paymentResponse.getPaymentUrl());

        log.info("Boost initiated: boost={}, transaction={}", boost.getId(), paymentResponse.getId());

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
        subscription.setStartDate(LocalDateTime.now());
        subscription.setExpiresAt(LocalDateTime.now().plusDays(subscription.getPkg().getDurationDays()));
        subscriptionRepository.save(subscription);

        log.info("Subscription activated: {}", subscriptionId);
    }

    @Override
    @Transactional
    public void processSuccessfulBoost(Long boostId, Long transactionId) {
        log.info("Processing successful boost: boost={}, transaction={}", boostId, transactionId);

        Boost boost = boostRepository.findById(boostId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_001, "Boost record not found"));

        // Activate boost
        boost.setIsActive(true);
        boost.setTransactionId(transactionId);
        boost.setStartTime(LocalDateTime.now());
        boost.setExpiresAt(LocalDateTime.now().plusDays(boost.getDays()));
        boostRepository.save(boost);

        // Update post boosted status
        Post post = boost.getPost();
        post.setIsBoosted(true);
        post.setBoostedUntil(boost.getExpiresAt());
        postRepository.save(post);

        log.info("Boost activated: {} for post: {}", boostId, post.getId());
    }

    @Override
    @Transactional
    public void cancelSubscription(Long userId, String reason) {
        log.info("Cancel subscription for user: {}, reason: {}", userId, reason);

        Subscription subscription = subscriptionRepository.findActiveByLandlordId(userId, LocalDateTime.now())
                .stream().findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.SUB_002, "No active subscription to cancel"));

        subscription.cancel(reason);
        subscriptionRepository.save(subscription);

        log.info("Subscription cancelled: {}", subscription.getId());
    }

    @Override
    @Transactional
    public PackageResponse createPackage(AdminPackageRequest request, Long adminId) {
        log.info("Creating new package: {} (by admin {})", request.getName(), adminId);

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

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.CREATE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.PACKAGE, pkg.getId(), 
                "Tạo mới gói dịch vụ: " + pkg.getName(), null);

        return toPackageResponse(pkg);
    }

    @Override
    @Transactional
    public PackageResponse updatePackage(Long id, AdminPackageRequest request, Long adminId) {
        log.info("Updating package id: {} (by admin {})", id, adminId);

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

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.UPDATE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.PACKAGE, pkg.getId(), 
                "Cập nhật gói dịch vụ: " + pkg.getName(), null);

        return toPackageResponse(pkg);
    }

    @Override
    @Transactional
    public void deletePackage(Long id, Long adminId) {
        log.info("Hard deleting package id: {} (by admin {})", id, adminId);

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

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.DELETE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.PACKAGE, id, 
                "Xóa gói dịch vụ: " + pkg.getName(), null);
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

    /**
     * Cleanup expired subscriptions and boosts every day at 1:00 AM
     */
    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void cleanupExpiredServices() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Starting cleanup of expired services at {}", now);

        // 1. Deactivate expired subscriptions
        List<Subscription> expiringSubs = subscriptionRepository.findExpiringSubscriptions(now.minusDays(1), now);
        for (Subscription sub : expiringSubs) {
            sub.setIsActive(false);
            log.info("Deactivated expired subscription: {}", sub.getId());
        }
        subscriptionRepository.saveAll(expiringSubs);

        // 2. Deactivate expired boosts
        List<Boost> expiredBoosts = boostRepository.findExpiredBoosts(now);
        for (Boost boost : expiredBoosts) {
            boost.setIsActive(false);
            
            // Also update the post status
            Post post = boost.getPost();
            if (post != null) {
                post.setIsBoosted(false);
                postRepository.save(post);
            }
            
            log.info("Deactivated expired boost: {} for post: {}", boost.getId(), boost.getPost().getId());
        }
        boostRepository.saveAll(expiredBoosts);

        log.info("Cleanup of expired services completed");
    }
}
