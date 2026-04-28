package fit.nlu.tmdt.modules.post.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.post.dto.request.CreatePostRequest;
import fit.nlu.tmdt.modules.post.dto.request.PostSearchParams;
import fit.nlu.tmdt.modules.post.dto.request.UpdatePostRequest;
import fit.nlu.tmdt.modules.post.dto.response.*;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.post.repository.PostSpecifications;
import fit.nlu.tmdt.modules.post.service.PostService;
import fit.nlu.tmdt.modules.room.entity.Amenity;
import fit.nlu.tmdt.modules.room.entity.Room;
import fit.nlu.tmdt.modules.room.repository.RoomRepository;
import fit.nlu.tmdt.modules.subscription.entity.Boost;
import fit.nlu.tmdt.modules.subscription.entity.Package;
import fit.nlu.tmdt.modules.subscription.entity.Subscription;
import fit.nlu.tmdt.modules.subscription.repository.BoostRepository;
import fit.nlu.tmdt.modules.subscription.repository.PackageRepository;
import fit.nlu.tmdt.modules.subscription.repository.SubscriptionRepository;
import fit.nlu.tmdt.modules.statistics.service.ViewHistoryService;
import fit.nlu.tmdt.modules.notification.entity.Notification;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import org.hibernate.Hibernate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Post Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BoostRepository boostRepository;
    private final PackageRepository packageRepository;
    private final fit.nlu.tmdt.modules.booking.repository.BookingRepository bookingRepository;
    private final ViewHistoryService viewHistoryService;
    private final NotificationService notificationService;
    private final fit.nlu.tmdt.modules.audit.service.AuditLogService auditLogService;

    @Value("${post.default-duration-days:30}")
    private int defaultDurationDays;

    @Value("${post.free-quota:2}")
    private int freePostQuota;

    @Override
    public Page<PostResponse> searchPosts(PostSearchParams params, Pageable pageable, Long userId) {
        // Default status is APPROVED for public search
        if (params.getStatus() == null) {
            params.setStatus(PostStatus.APPROVED);
        }

        Page<Post> posts = postRepository.findAll(PostSpecifications.withSearchParams(params), pageable);
        return posts.map(post -> toPostResponse(post, userId));
    }

    @Override
    public PostResponse getPostById(Long id, Long userId) {
        Post post = postRepository.findByIdActive(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        return toPostResponse(post, userId);
    }

    @Override
    @Transactional
    public PostResponse createPost(CreatePostRequest request, Long landlordId) {
        log.info("Creating post for landlord: {}", landlordId);

        // 1. Check subscription or free quota
        Subscription subscription = subscriptionRepository.findActiveByLandlordId(landlordId, LocalDateTime.now())
                .orElse(null);

        if (subscription != null) {
            if (!subscription.usePost()) {
                throw new BusinessException(ErrorCode.POST_003,
                        "You have no remaining posts. Please purchase a package.");
            }
            subscriptionRepository.save(subscription);
        } else {
            long usedFreePosts = postRepository.countByLandlordId(landlordId);
            if (usedFreePosts >= freePostQuota) {
                throw new BusinessException(
                        ErrorCode.POST_002,
                        "You have used all free posts. Please purchase a package to continue posting.");
            }
        }

        // 2. Check room exists and belongs to landlord
        Room room = roomRepository.findByIdAndDeletedAtIsNull(request.getRoomId())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROOM_001, "Room not found"));

        if (!room.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.ROOM_002, "You don't own this room");
        }

        // 3. Check room doesn't have active post
        if (postRepository.existsByRoomIdAndStatusInAndDeletedAtIsNull(
                request.getRoomId(), List.of(PostStatus.APPROVED, PostStatus.PENDING))) {
            throw new BusinessException(ErrorCode.POST_004, "This room already has an active post");
        }

        // 4. Create post
        Post post = Post.builder()
                .landlord(room.getLandlord())
                .room(room)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .deposit(request.getDeposit())
                .priceType(fit.nlu.tmdt.modules.room.entity.enums.PriceType.valueOf(request.getPriceType()))
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .videoUrl(request.getVideoUrl())
                .status(PostStatus.PENDING)
                .viewCount(0)
                .favoriteCount(0)
                .contactCount(0)
                .bookingCount(0)
                .isBoosted(false)
                .build();

        // Set expiration
        int duration = request.getDurationDays() != null ? request.getDurationDays() : defaultDurationDays;
        post.setExpiresAt(LocalDateTime.now().plusDays(duration));

        post = postRepository.save(post);

        log.info("Post created with ID: {}", post.getId());
        return toPostResponse(post, landlordId);
    }

    @Override
    @Transactional
    public PostResponse updatePost(Long id, UpdatePostRequest request, Long landlordId) {
        Post post = postRepository.findByIdActive(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (!post.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.POST_008, "You don't own this post");
        }

        // Only PENDING or REJECTED posts can be edited
        if (post.getStatus() != PostStatus.PENDING && post.getStatus() != PostStatus.REJECTED) {
            throw new BusinessException(ErrorCode.POST_006, "Cannot edit this post");
        }

        // Update fields
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            post.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            post.setPrice(request.getPrice());
        }
        if (request.getPriceType() != null) {
            post.setPriceType(fit.nlu.tmdt.modules.room.entity.enums.PriceType.valueOf(request.getPriceType()));
        }
        if (request.getDeposit() != null) {
            post.setDeposit(request.getDeposit());
        }
        if (request.getImages() != null) {
            post.setImages(request.getImages());
        }
        if (request.getVideoUrl() != null) {
            post.setVideoUrl(request.getVideoUrl());
        }

        // Reset to PENDING for re-approval
        if (post.getStatus() == PostStatus.REJECTED) {
            post.setStatus(PostStatus.PENDING);
            post.setRejectionReason(null);
        }

        post = postRepository.save(post);

        log.info("Post updated: {}", post.getId());
        return toPostResponse(post, landlordId);
    }

    @Override
    @Transactional
    public void deletePost(Long id, Long landlordId) {
        Post post = postRepository.findByIdActive(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (!post.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.POST_008, "You don't own this post");
        }

        post.softDelete();
        postRepository.save(post);

        log.info("Post deleted: {}", id);
    }

    @Override
    @Transactional
    public void adminDeletePost(Long id, Long adminId) {
        Post post = postRepository.findByIdActive(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        post.softDelete();
        post.setStatus(PostStatus.REJECTED);
        post.setRejectionReason("Gỡ do vi phạm nội dung (Xử lý từ báo cáo)");
        postRepository.save(post);

        // Notify landlord
        String title = "Tin đăng bị gỡ bỏ";
        String content = "Tin đăng '" + post.getTitle() + "' của bạn đã bị gỡ bỏ do vi phạm tiêu chuẩn cộng đồng.";
        notificationService.createNotification(Notification.forPost(post.getLandlord(), title, content, post.getId()));

        log.info("Post {} force deleted by admin {}", id, adminId);

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.DELETE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.POST, id, 
                "Gỡ bài đăng do vi phạm tiêu chuẩn cộng đồng.", null);
    }

    @Override
    public Page<PostResponse> getMyPosts(Long landlordId, Pageable pageable) {
        Page<Post> posts = postRepository.findByLandlordIdAndDeletedAtIsNull(landlordId, pageable);
        return posts.map(post -> toPostResponse(post, landlordId));
    }

    @Override
    public LandlordDashboardStats getLandlordDashboardStats(Long landlordId) {
        long totalPosts = postRepository.countByLandlordId(landlordId);
        long activePosts = postRepository.countByLandlordIdAndStatus(landlordId, PostStatus.APPROVED);
        Long totalViews = postRepository.sumViewCountByLandlordId(landlordId);
        long totalBookings = bookingRepository.countByLandlordId(landlordId);
        long pendingBookings = bookingRepository.countByLandlordIdAndStatus(landlordId,
                fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus.PENDING);

        // Get daily stats from ViewHistory table (last 7 days)
        LocalDateTime now = LocalDateTime.now();
        LocalDate startDate = now.minusDays(6).toLocalDate();
        LocalDate endDate = now.toLocalDate();
        List<Object[]> dailyStats = viewHistoryService.getDailyStats(landlordId, startDate, endDate);

        // Build a map for quick lookup
        Map<LocalDate, Long> viewsMap = new HashMap<>();
        Map<LocalDate, Long> contactsMap = new HashMap<>();
        for (Object[] row : dailyStats) {
            LocalDate date = (LocalDate) row[0];
            Long views = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            Long contacts = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            viewsMap.put(date, views);
            contactsMap.put(date, contacts);
        }

        // Fill in the last 7 days
        List<LandlordDashboardStats.DailyActivity> recentActivity = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = now.minusDays(i).toLocalDate();
            recentActivity.add(LandlordDashboardStats.DailyActivity.builder()
                    .date(date.toString())
                    .views(viewsMap.getOrDefault(date, 0L))
                    .contacts(contactsMap.getOrDefault(date, 0L))
                    .build());
        }

        return LandlordDashboardStats.builder()
                .totalPosts(totalPosts)
                .activePosts(activePosts)
                .totalViews(totalViews != null ? totalViews : 0)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .recentActivity(recentActivity)
                .build();
    }

    @Override
    public PostService.PostStatsResponse getPostStats(Long postId, Long landlordId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (!post.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.POST_008, "You don't own this post");
        }

        return new PostService.PostStatsResponse(
                post.getId(),
                post.getViewCount(),
                post.getFavoriteCount(),
                post.getContactCount(),
                post.getBookingCount(),
                (int) bookingRepository.countByPostIdAndStatusAndDeletedAtIsNull(postId, BookingStatus.COMPLETED));
    }

    @Override
    public boolean isOwner(Long postId, Long userId) {
        return postRepository.isOwner(postId, userId);
    }

    @Override
    @Async
    public void incrementViewCountAsync(Long postId) {
        postRepository.incrementViewCount(postId);
        // Also record in ViewHistory for dashboard stats
        postRepository.findByIdActive(postId).ifPresent(viewHistoryService::recordView);
    }

    @Override
    public void recordContact(Long postId) {
        Post post = postRepository.findByIdActive(postId).orElse(null);
        if (post != null) {
            viewHistoryService.recordContact(post);
        }
    }

    @Override
    @Transactional
    public void approvePost(Long postId, Long adminId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (post.getStatus() != PostStatus.PENDING) {
            throw new BusinessException(ErrorCode.POST_005, "Post is not pending");
        }

        post.approve(adminId);
        postRepository.save(post);

        // Decrement subscription posts
        subscriptionRepository.decrementRemainingPosts(post.getLandlord().getId());

        // Send notification
        String title = "Tin đăng được duyệt";
        String content = "Tin đăng '" + post.getTitle()
                + "' của bạn đã được duyệt và hiện đang hiển thị trên hệ thống.";
        notificationService.createNotification(Notification.forPost(post.getLandlord(), title, content, post.getId()));

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.APPROVE, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.POST, postId, 
                "Phê duyệt bài đăng: " + post.getTitle(), null);

        log.info("Post approved: {} by admin: {}", postId, adminId);
    }

    @Override
    @Transactional
    public void rejectPost(Long postId, String reason, Long adminId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (post.getStatus() != PostStatus.PENDING) {
            throw new BusinessException(ErrorCode.POST_005, "Post is not pending");
        }

        post.reject(reason);
        postRepository.save(post);

        // Send notification
        String title = "Tin đăng bị từ chối";
        String content = "Tin đăng '" + post.getTitle() + "' của bạn đã bị từ chối. Lý do: " + reason;
        notificationService.createNotification(Notification.forPost(post.getLandlord(), title, content, post.getId()));

        // Ghi audit log
        auditLogService.log(adminId, fit.nlu.tmdt.modules.audit.enums.AuditAction.REJECT, 
                fit.nlu.tmdt.modules.audit.enums.AuditTarget.POST, postId, 
                "Từ chối bài đăng: " + post.getTitle() + ". Lý do: " + reason, null);

        log.info("Post rejected: {} by admin: {} with reason: {}", postId, adminId, reason);
    }

    @Override
    public Page<PostResponse> getPendingPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findByStatusAndDeletedAtIsNull(PostStatus.PENDING, pageable);
        return posts.map(post -> toPostResponse(post, null));
    }

    @Override
    public Page<PostResponse> getAdminPosts(PostSearchParams params, Pageable pageable) {
        Page<Post> posts = postRepository.findAll(PostSpecifications.withSearchParams(params, true), pageable);
        return posts.map(post -> toPostResponse(post, null));
    }

    @Override
    @Transactional
    public Map<String, Object> boostPost(Long postId, Long boostPackageId, Long landlordId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (!post.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.POST_008, "You don't own this post");
        }

        if (post.getStatus() != PostStatus.APPROVED) {
            throw new BusinessException(ErrorCode.POST_007, "Only approved posts can be boosted");
        }

        Package boostPackage = packageRepository.findById(boostPackageId)
                .orElseThrow(() -> new BusinessException("BOOST_001", "Boost package not found"));

        if (!boostPackage.isActive()) {
            throw new BusinessException("BOOST_002", "This boost package is not available");
        }

        Boost boost = Boost.create(post.getLandlord(), post, boostPackage.getBoostDays(), boostPackage.getPrice());
        boost.setPackageId(boostPackageId);
        boost = boostRepository.save(boost);

        post.setIsBoosted(true);
        post.setBoostedUntil(boost.getExpiresAt());
        postRepository.save(post);

        Map<String, Object> result = new HashMap<>();
        result.put("boostId", boost.getId());
        result.put("postId", post.getId());
        result.put("days", boost.getDays());
        result.put("expiresAt", boost.getExpiresAt());
        result.put("price", boost.getPrice());

        log.info("Post {} boosted for {} days", postId, boost.getDays());
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> extendPost(Long postId, int days, Long landlordId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        if (!post.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.POST_008, "You don't own this post");
        }

        LocalDateTime newExpiryDate;
        if (post.getExpiresAt() != null && post.getExpiresAt().isAfter(LocalDateTime.now())) {
            newExpiryDate = post.getExpiresAt().plusDays(days);
        } else {
            newExpiryDate = LocalDateTime.now().plusDays(days);
        }

        post.setExpiresAt(newExpiryDate);
        postRepository.save(post);

        Map<String, Object> result = new HashMap<>();
        result.put("postId", post.getId());
        result.put("daysAdded", days);
        result.put("newExpiryDate", newExpiryDate);

        log.info("Post {} extended by {} days to {}", postId, days, newExpiryDate);
        return result;
    }

    @Override
    public Page<PostResponse> searchPublicPosts(PostSearchParams params, Pageable pageable) {
        // Only show APPROVED posts that are not expired
        params.setStatus(PostStatus.APPROVED);
        Page<Post> posts = postRepository.findAll(PostSpecifications.withSearchParams(params), pageable);
        return posts.map(post -> toPostResponse(post, null));
    }

    @Override
    public List<PostResponse> getFeaturedPosts(int limit) {
        // Get boosted posts first, then by view count
        List<Post> posts = postRepository.findFeaturedPosts(PageRequest.of(0, limit));
        return posts.stream()
                .map(post -> toPostResponse(post, null))
                .collect(Collectors.toList());
    }

    // ==================== HELPER METHODS ====================

    private PostResponse toPostResponse(Post post, Long userId) {
        // Initialize lazy collections within transaction context
        Hibernate.initialize(post.getImages());
        if (post.getRoom() != null) {
            Hibernate.initialize(post.getRoom().getAmenities());
        }
        Hibernate.initialize(post.getLandlord());

        Room room = post.getRoom();
        User landlord = post.getLandlord();

        RoomSummary roomSummary = RoomSummary.builder()
                .id(room.getId())
                .area(room.getArea())
                .floor(room.getFloor())
                .maxOccupancy(room.getMaxOccupancy())
                .direction(room.getDirection() != null ? room.getDirection().name() : null)
                .thumbnailUrl(room.getThumbnailUrl())
                .address(room.getAddress())
                .district(room.getDistrict())
                .province(room.getProvince())
                .latitude(room.getLatitude())
                .longitude(room.getLongitude())
                .nearbyUniversityName(room.getNearbyUniversityName())
                .distanceToUniversity(room.getDistanceToUniversity())
                .hasParking(room.getIsParkingAvailable())
                .hasBalcony(room.getHasBalcony())
                .amenities(room.getAmenities().stream()
                        .map(this::toAmenitySimple)
                        .collect(Collectors.toList()))
                .build();

        LandlordSummary landlordSummary = LandlordSummary.builder()
                .id(landlord.getId())
                .fullName(landlord.getFullName())
                .avatar(landlord.getAvatarUrl())
                .phone(landlord.getPhone())
                .averageRating(landlord.getLandlordRating())
                .totalReviews(landlord.getTotalReviews())
                .isVerified(landlord.getIsVerified())
                .build();

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .price(post.getPrice())
                .priceType(post.getPriceType() != null ? post.getPriceType().name() : null)
                .deposit(post.getDeposit())
                .status(post.getStatus().name())
                .rejectionReason(post.getRejectionReason())
                .expiresAt(post.getExpiresAt())
                .isAutoRenew(post.getIsAutoRenew())
                .isBoosted(post.getIsBoosted())
                .boostedUntil(post.getBoostedUntil())
                .viewCount(post.getViewCount())
                .favoriteCount(post.getFavoriteCount())
                .contactCount(post.getContactCount())
                .bookingCount(post.getBookingCount())
                .room(roomSummary)
                .landlord(landlordSummary)
                .images(post.getImages())
                .videoUrl(post.getVideoUrl())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .canBook(post.isBookable())
                .build();
    }

    private AmenitySimple toAmenitySimple(Amenity amenity) {
        return AmenitySimple.builder()
                .id(amenity.getId())
                .name(amenity.getName())
                .icon(amenity.getIcon())
                .category(amenity.getCategory())
                .build();
    }
}
