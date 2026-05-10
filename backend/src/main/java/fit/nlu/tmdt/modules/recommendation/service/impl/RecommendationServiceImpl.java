package fit.nlu.tmdt.modules.recommendation.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.booking.repository.BookingRepository;
import fit.nlu.tmdt.modules.favorite.entity.Favorite;
import fit.nlu.tmdt.modules.favorite.repository.FavoriteRepository;
import fit.nlu.tmdt.modules.favorite.repository.RoomHistoryRepository;
import fit.nlu.tmdt.modules.post.dto.response.PostResponse;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.room.entity.Room;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.post.service.PostService;
import fit.nlu.tmdt.modules.recommendation.dto.request.RecommendationRequest;
import fit.nlu.tmdt.modules.recommendation.dto.request.UpdatePreferenceRequest;
import fit.nlu.tmdt.modules.recommendation.dto.response.RecommendationListResponse;
import fit.nlu.tmdt.modules.recommendation.dto.response.RecommendationResponse;
import fit.nlu.tmdt.modules.recommendation.entity.RecommendationLog;
import fit.nlu.tmdt.modules.recommendation.entity.UserPreference;
import fit.nlu.tmdt.modules.recommendation.entity.enums.RecommendationType;
import fit.nlu.tmdt.modules.recommendation.repository.RecommendationLogRepository;
import fit.nlu.tmdt.modules.recommendation.repository.UserPreferenceRepository;
import fit.nlu.tmdt.modules.recommendation.service.RecommendationService;
import fit.nlu.tmdt.modules.room.entity.Amenity;
import fit.nlu.tmdt.modules.university.entity.University;
import fit.nlu.tmdt.modules.university.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Recommendation Service Implementation
 * AI-powered recommendation engine cho phòng trọ
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RecommendationServiceImpl implements RecommendationService {

    private final PostRepository postRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final RecommendationLogRepository recommendationLogRepository;
    private final FavoriteRepository favoriteRepository;
    private final RoomHistoryRepository roomHistoryRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PostService postService;
    private final UniversityRepository universityRepository;

    // Weights
    private static final double WEIGHT_PRICE = 0.30;
    private static final double WEIGHT_LOCATION = 0.25;
    private static final double WEIGHT_AREA = 0.15;
    private static final double WEIGHT_AMENITIES = 0.15;
    private static final double WEIGHT_TRENDING = 0.10;
    private static final double WEIGHT_BOOSTED = 0.05;

    @Override
    @Transactional
    public RecommendationListResponse getRecommendations(Long userId, RecommendationRequest request) {
        log.info("Getting recommendations for user: {}", userId);
        UserPreference preferences = getOrCreatePreferences(userId);
        List<RecommendationResponse> all = new ArrayList<>();

        all.addAll(getForYouRecommendations(userId, preferences, request.getSize()));
        all.addAll(getNewPostRecommendations(userId, request.getSize()));
        all.addAll(getTrendingRecommendations(userId, request.getSize()));
        
        if (preferences.hasBudgetPreference()) {
            all.addAll(getBudgetFriendlyRecommendations(userId, preferences.getMinBudget(), preferences.getMaxBudget(), request.getSize()));
        }
        
        if (preferences.hasLocationPreference()) {
            all.addAll(getNearbyRecommendations(userId, preferences.getPreferredLatitude(), 
                    preferences.getPreferredLongitude(), preferences.getMaxDistanceKm(), request.getSize()));
        }
        
        all.addAll(getBecauseYouLiked(userId, request.getSize()));
        
        // ===== STUDENT FILTER: CHỈ GỢI Ý PHÒNG GẦN TRƯỜNG CHO SINH VIÊN =====
        if (preferences.getUniversityLatitude() != null && preferences.getUniversityLongitude() != null) {
            final double uniLat = preferences.getUniversityLatitude();
            final double uniLon = preferences.getUniversityLongitude();
            // Bán kính lọc: Dùng maxDistanceKm của user, mặc định 10km
            final double maxDist = preferences.getMaxDistanceKm() != null ? preferences.getMaxDistanceKm() : 10.0;

            all = all.stream().filter(rec -> {
                if (rec.getPost() == null || rec.getPost().getRoom() == null) return false;
                Double roomLat = rec.getPost().getRoom().getLatitude();
                Double roomLon = rec.getPost().getRoom().getLongitude();
                if (roomLat == null || roomLon == null) return false;
                
                double d = calculateDistance(uniLat, uniLon, roomLat, roomLon);
                // Điều chỉnh điểm ưu tiên cho phòng ở siêu gần trường
                if (d <= maxDist) {
                    // Tăng score của các phòng trong phạm vi dựa trên độ gần
                    rec.setScore(rec.getScore() * 0.6 + (1.0 - d / maxDist) * 0.4);
                    rec.setReason("Gần trường " + preferences.getUniversityName() + " (" + String.format("%.1f", d) + " km)");
                    return true;
                }
                return false;
            }).collect(Collectors.toList());
        }
        // ===================================================================

        List<RecommendationResponse> unique = removeDuplicatesAndSort(all);
        logRecommendations(userId, unique);

        int totalCount = unique.size();
        int start = request.getPage() * request.getSize();
        int end = Math.min(start + request.getSize(), totalCount);
        List<RecommendationResponse> paged = start < totalCount ? unique.subList(start, end) : Collections.emptyList();

        return buildResponse(paged, preferences);
    }

    @Override
    public List<RecommendationResponse> getSimilarToViewed(Long userId, Long postId, int limit) {
        log.info("Getting similar posts for postId: {}", postId);
        
        Post targetPost = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));
        
        Room targetRoom = targetPost.getRoom();
        Hibernate.initialize(targetRoom);
        Hibernate.initialize(targetRoom.getAmenities());
        String district = targetRoom.getDistrict();
        
        // Find candidates in the same district
        List<Post> candidates = postRepository.findSimilarPosts(postId, district, PageRequest.of(0, 50));
        
        List<ScoredPost> scored = new ArrayList<>();
        for (Post candidate : candidates) {
            if (candidate.getId().equals(postId)) continue;
            
            double score = 0;
            String reason = "";
            Room candidateRoom = candidate.getRoom();
            Hibernate.initialize(candidateRoom);
            Hibernate.initialize(candidateRoom.getAmenities());
            
            // 1. Same District (already filtered but we can boost it)
            score += 0.4; // Base score for same district
            
            // 2. Price similarity (within ±30%)
            double priceDiff = Math.abs(candidate.getPrice() - targetPost.getPrice());
            if (priceDiff <= targetPost.getPrice() * 0.3) {
                score += 0.3 * (1 - priceDiff / (targetPost.getPrice() * 0.3));
                reason = "Giá tương đương";
            }
            
            // 3. Area similarity (within ±30%)
            if (candidateRoom != null && targetRoom != null) {
                double areaDiff = Math.abs(candidateRoom.getArea() - targetRoom.getArea());
                if (areaDiff <= targetRoom.getArea() * 0.3) {
                    score += 0.15 * (1 - areaDiff / (targetRoom.getArea() * 0.3));
                }
            }
            
            // 4. Shared amenities
            if (candidateRoom != null && targetRoom != null && !targetRoom.getAmenities().isEmpty()) {
                Set<Long> targetAmenityIds = targetRoom.getAmenities().stream().map(Amenity::getId).collect(Collectors.toSet());
                long matchCount = candidateRoom.getAmenities().stream().filter(a -> targetAmenityIds.contains(a.getId())).count();
                score += 0.15 * (matchCount / (double) Math.max(targetAmenityIds.size(), 1));
            }
            
            if (score > 0.4) {
                scored.add(new ScoredPost(candidate, score, reason.isEmpty() ? "Cùng khu vực " + district : reason));
            }
        }
        
        return scored.stream()
                .sorted(Comparator.comparingDouble(ScoredPost::getScore).reversed())
                .limit(limit)
                .map(sp -> buildRecommendationResponse(sp.post, RecommendationType.SIMILAR_TO_VIEWED, sp.score, sp.reason, postId))
                .collect(Collectors.toList());
    }

    @Override
    public List<RecommendationResponse> getBecauseYouLiked(Long userId, int limit) {
        log.info("Getting because-you-liked for user: {}", userId);
        List<Favorite> favorites = favoriteRepository.findByUserIdAndDeletedAtIsNull(userId);
        if (favorites.isEmpty()) return Collections.emptyList();

        Set<Long> excludeIds = getExcludedPostIds(userId);
        Set<String> districts = new HashSet<>();
        Set<Long> amenityIds = new HashSet<>();
        double totalArea = 0;

        for (Favorite fav : favorites) {
            Room room = fav.getRoom();
            Hibernate.initialize(room);
            Hibernate.initialize(room.getAmenities());
            if (room != null) {
                if (room.getDistrict() != null) districts.add(room.getDistrict());
                totalArea += room.getArea();
                if (room.getAmenities() != null) {
                    room.getAmenities().forEach(a -> amenityIds.add(a.getId()));
                }
            }
        }
        double avgArea = favorites.isEmpty() ? 0 : totalArea / favorites.size();

        Page<Post> page = postRepository.findLatestApproved(PageRequest.of(0, 100));
        List<RecommendationResponse> results = new ArrayList<>();

        for (Post post : page.getContent()) {
            if (results.size() >= limit || excludeIds.contains(post.getId())) continue;
            Room room = post.getRoom();
            Hibernate.initialize(room);
            Hibernate.initialize(room.getAmenities());
            if (room == null) continue;

            double score = 0;
            String reason = "";
            if (districts.contains(room.getDistrict())) {
                score += 0.4;
                reason = "Cùng khu vực " + room.getDistrict();
            }
            if (Math.abs(room.getArea() - avgArea) < avgArea * 0.3) score += 0.3;
            if (!amenityIds.isEmpty() && room.getAmenities() != null) {
                long match = room.getAmenities().stream().filter(a -> amenityIds.contains(a.getId())).count();
                score += (match / (double) Math.max(amenityIds.size(), 1)) * 0.3;
            }
            if (score > 0.3) {
                results.add(buildRecommendationResponse(post, RecommendationType.BECAUSE_YOU_LIKED, Math.min(score, 1.0), reason, null));
            }
        }

        return results.stream().sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed()).limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<RecommendationResponse> getNearbyRecommendations(Long userId, Double latitude, Double longitude, Double radiusKm, int limit) {
        log.info("Getting nearby for user: {} at {}, {}", userId, latitude, longitude);
        Page<Post> page = postRepository.findLatestApproved(PageRequest.of(0, 100));
        Set<Long> excludeIds = getExcludedPostIds(userId);
        List<RecommendationResponse> results = new ArrayList<>();

        for (Post post : page.getContent()) {
            if (excludeIds.contains(post.getId())) continue;
            Room room = post.getRoom();
            Hibernate.initialize(room);
            Hibernate.initialize(room.getAmenities());
            if (room == null || room.getLatitude() == null) continue;
            double dist = calculateDistance(latitude, longitude, room.getLatitude(), room.getLongitude());
            if (dist <= radiusKm) {
                results.add(buildRecommendationResponse(post, RecommendationType.NEARBY, 1.0 - dist / radiusKm, String.format("Cách bạn %.1f km", dist), null));
            }
        }
        return results.stream().sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed()).limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<RecommendationResponse> getBudgetFriendlyRecommendations(Long userId, Double minBudget, Double maxBudget, int limit) {
        final double finalMin = minBudget != null ? minBudget : 0.0;
        final double finalMax = maxBudget != null ? maxBudget : 10000000.0;

        Page<Post> page = postRepository.findLatestApproved(PageRequest.of(0, 100));
        Set<Long> excludeIds = getExcludedPostIds(userId);
        double optimal = (finalMin + finalMax) / 2;
        double maxDist = (finalMax - finalMin) / 2;

        List<RecommendationResponse> results = page.getContent().stream()
                .filter(p -> !excludeIds.contains(p.getId()))
                .filter(p -> p.getPrice() >= finalMin && p.getPrice() <= finalMax)
                .map(p -> {
                    double dist = Math.abs(p.getPrice() - optimal);
                    double score = maxDist > 0 ? 1.0 - dist / maxDist : 0.5;
                    return buildRecommendationResponse(p, RecommendationType.BUDGET_FRIENDLY, Math.max(score, 0.1), String.format("Giá %.0f VNĐ", p.getPrice()), null);
                })
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
        return results;
    }

    @Override
    public List<RecommendationResponse> getNewPostRecommendations(Long userId, int limit) {
        log.info("Getting new posts for user: {}", userId);
        Page<Post> page = postRepository.findLatestApproved(PageRequest.of(0, limit * 2));
        Set<Long> excludeIds = getExcludedPostIds(userId);
        List<RecommendationResponse> results = new ArrayList<>();
        int rank = 1;
        for (Post post : page.getContent()) {
            if (excludeIds.contains(post.getId()) || results.size() >= limit) continue;
            results.add(buildRecommendationResponse(post, RecommendationType.NEW_POSTS, 1.0 / (rank * 0.1), "Tin mới " + formatTimeAgo(post.getCreatedAt()), null));
            rank++;
        }
        return results;
    }

    @Override
    public List<RecommendationResponse> getTrendingRecommendations(Long userId, int limit) {
        log.info("Getting trending for user: {}", userId);
        List<Post> posts = postRepository.findMostViewedPosts(PageRequest.of(0, limit * 2)).getContent();
        Set<Long> excludeIds = getExcludedPostIds(userId);
        List<RecommendationResponse> results = new ArrayList<>();
        for (Post post : posts) {
            if (excludeIds.contains(post.getId()) || results.size() >= limit) continue;
            double score = Math.min(1.0, (post.getViewCount() != null ? post.getViewCount() : 0) / 1000.0);
            String reason = (post.getViewCount() != null ? post.getViewCount() : 0) + " lượt xem";
            if (Boolean.TRUE.equals(post.getIsBoosted())) {
                score += WEIGHT_BOOSTED;
                reason += " • Được đẩy tin";
            }
            results.add(buildRecommendationResponse(post, RecommendationType.TRENDING, Math.min(score, 1.0), reason, null));
        }
        return results;
    }

    private List<RecommendationResponse> getForYouRecommendations(Long userId, UserPreference preferences, int limit) {
        log.info("Getting FOR_YOU for user: {}", userId);
        Page<Post> page = postRepository.findLatestApproved(PageRequest.of(0, 100));
        Set<Long> excludeIds = getExcludedPostIds(userId);
        List<ScoredPost> scored = new ArrayList<>();

        for (Post post : page.getContent()) {
            if (excludeIds.contains(post.getId())) continue;
            double totalScore = 0;
            String reason = "";
            Room room = post.getRoom();
            Hibernate.initialize(room);
            Hibernate.initialize(room.getAmenities());

            if (preferences.hasBudgetPreference()) {
                double ps = calculatePriceScore(post.getPrice(), preferences.getMinBudget(), preferences.getMaxBudget());
                totalScore += ps * WEIGHT_PRICE;
                if (ps > 0.8) reason = String.format("Giá %.0f VNĐ phù hợp", post.getPrice());
            }
            if (preferences.hasLocationPreference() && room != null && room.getLatitude() != null) {
                double dist = calculateDistance(preferences.getPreferredLatitude(), preferences.getPreferredLongitude(), room.getLatitude(), room.getLongitude());
                double ls = Math.max(0, 1 - dist / preferences.getMaxDistanceKm());
                totalScore += ls * WEIGHT_LOCATION;
                if (ls > 0.8 && reason.isEmpty()) reason = String.format("Cách bạn %.1f km", dist);
            }
            if (preferences.hasAreaPreference() && room != null) {
                totalScore += calculateAreaScore(room.getArea(), preferences.getMinArea(), preferences.getMaxArea()) * WEIGHT_AREA;
            }
            if (preferences.hasAmenityPreference() && room != null && room.getAmenities() != null) {
                Set<Long> pref = new HashSet<>(preferences.getPreferredAmenityIds());
                long match = room.getAmenities().stream().filter(a -> pref.contains(a.getId())).count();
                totalScore += (match / (double) Math.max(pref.size(), 1)) * WEIGHT_AMENITIES;
            }
            if (post.getViewCount() != null) {
                totalScore += Math.min(1.0, post.getViewCount() / 500.0) * WEIGHT_TRENDING;
            }
            if (Boolean.TRUE.equals(post.getIsBoosted())) {
                totalScore += WEIGHT_BOOSTED;
            }
            if (totalScore > 0) {
                scored.add(new ScoredPost(post, totalScore, reason));
            }
        }

        return scored.stream()
                .sorted(Comparator.comparingDouble(ScoredPost::getScore).reversed())
                .limit(limit)
                .map(sp -> buildRecommendationResponse(sp.post, RecommendationType.FOR_YOU, sp.score, sp.reason, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserPreference getUserPreferences(Long userId) {
        UserPreference pref = userPreferenceRepository.findByUserId(userId).orElse(null);
        if (pref == null) {
            pref = buildPreferenceFromHistory(userId);
        }
        return pref;
    }

    @Override
    @Transactional
    public UserPreference updateUserPreferences(Long userId, UpdatePreferenceRequest request) {
        UserPreference pref = getOrCreatePreferences(userId);
        if (request.getMinBudget() != null) pref.setMinBudget(request.getMinBudget());
        if (request.getMaxBudget() != null) pref.setMaxBudget(request.getMaxBudget());
        if (request.getPreferredProvince() != null) pref.setPreferredProvince(request.getPreferredProvince());
        if (request.getPreferredDistrict() != null) pref.setPreferredDistrict(request.getPreferredDistrict());
        if (request.getPreferredLatitude() != null) pref.setPreferredLatitude(request.getPreferredLatitude());
        if (request.getPreferredLongitude() != null) pref.setPreferredLongitude(request.getPreferredLongitude());
        if (request.getMaxDistanceKm() != null) pref.setMaxDistanceKm(request.getMaxDistanceKm());
        if (request.getMinArea() != null) pref.setMinArea(request.getMinArea());
        if (request.getMaxArea() != null) pref.setMaxArea(request.getMaxArea());
        if (request.getPreferredAmenityIds() != null) pref.setPreferredAmenityIds(request.getPreferredAmenityIds());
        if (request.getHasPet() != null) pref.setHasPet(request.getHasPet());
        if (request.getNeedsParking() != null) pref.setNeedsParking(request.getNeedsParking());
        if (request.getUniversityId() != null) pref.setUniversityId(request.getUniversityId());
        return userPreferenceRepository.save(pref);
    }

    @Override
    @Transactional
    public UserPreference buildPreferenceFromHistory(Long userId) {
        log.info("Building preference from history for user: {}", userId);
        
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
                
        UserPreference pref = userPreferenceRepository.findByUserId(userId).orElseGet(() -> {
            return UserPreference.builder().user(user).maxDistanceKm(10.0).totalFavorites(0).totalViews(0).build();
        });

        // Sync University Data if student
        if (user.getUniversityId() != null) {
            Optional<University> uniOpt = universityRepository.findById(user.getUniversityId());
            if (uniOpt.isPresent()) {
                University uni = uniOpt.get();
                pref.setUniversityId(uni.getId());
                pref.setUniversityName(uni.getName());
                pref.setUniversityLatitude(uni.getLatitude());
                pref.setUniversityLongitude(uni.getLongitude());
                
                // Automatically use university location as primary preference if not custom-set yet
                if (pref.getPreferredLatitude() == null || pref.getPreferredLongitude() == null) {
                    pref.setPreferredLatitude(uni.getLatitude());
                    pref.setPreferredLongitude(uni.getLongitude());
                    pref.setPreferredDistrict(uni.getDistrict());
                    pref.setPreferredProvince(uni.getProvince());
                }
            }
        }

        List<Favorite> favorites = favoriteRepository.findByUserIdAndDeletedAtIsNull(userId);
        pref.setTotalFavorites(favorites.size());
        if (!favorites.isEmpty()) {
            double totalArea = 0;
            Set<String> districts = new HashSet<>();
            Set<Long> amenityIds = new HashSet<>();
            for (Favorite fav : favorites) {
                Room room = fav.getRoom();
                Hibernate.initialize(room);
                Hibernate.initialize(room.getAmenities());
                if (room != null) {
                    totalArea += room.getArea();
                    if (room.getDistrict() != null) districts.add(room.getDistrict());
                    if (room.getAmenities() != null) room.getAmenities().forEach(a -> amenityIds.add(a.getId()));
                }
            }
            int count = favorites.size();
            pref.setMinArea(totalArea / count * 0.7);
            pref.setMaxArea(totalArea / count * 1.3);
            if (!districts.isEmpty()) pref.setPreferredDistrict(districts.iterator().next());
            if (!amenityIds.isEmpty()) pref.setPreferredAmenityIds(new ArrayList<>(amenityIds));
        }
        return userPreferenceRepository.save(pref);
    }

    @Override
    @Transactional
    public void deleteUserPreferences(Long userId) {
        userPreferenceRepository.findByUserId(userId).ifPresent(userPreferenceRepository::delete);
    }

    @Override
    @Transactional
    public void trackView(Long userId, Long postId) {
        recommendationLogRepository.markAsViewed(userId, postId, LocalDateTime.now());
    }

    @Override
    @Transactional
    public void trackClick(Long userId, Long postId) {
        recommendationLogRepository.markAsClicked(userId, postId, LocalDateTime.now());
        postRepository.incrementViewCount(postId);
    }

    @Override
    @Transactional
    public void trackFavorite(Long userId, Long postId) {
        recommendationLogRepository.markAsFavorited(userId, postId, LocalDateTime.now());
    }

    @Override
    public Map<String, Object> getEngagementStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("clickedCount", recommendationLogRepository.countClickedByUserId(userId));
        stats.put("favoritedCount", recommendationLogRepository.countFavoritedByUserId(userId));
        return stats;
    }

    @Override
    public double calculateScore(Long userId, Long postId, RecommendationType type) {
        if (userId == null || postId == null) {
            return 0.5;
        }
        
        try {
            Post post = postRepository.findById(postId).orElse(null);
            if (post == null) {
                return 0.5;
            }
            
            UserPreference pref = getOrCreatePreferences(userId);
            Room room = post.getRoom();
            Hibernate.initialize(room);
            Hibernate.initialize(room.getAmenities());
            
            double score = 0;
            int weightCount = 0;
            
            // Price match (30% weight)
            if (pref.hasBudgetPreference()) {
                double priceScore = calculatePriceScore(post.getPrice(), pref.getMinBudget(), pref.getMaxBudget());
                score += priceScore * WEIGHT_PRICE;
                weightCount++;
            }
            
            // Location match (25% weight)
            if (pref.hasLocationPreference() && room != null && room.getLatitude() != null) {
                double dist = calculateDistance(
                    pref.getPreferredLatitude(), pref.getPreferredLongitude(),
                    room.getLatitude(), room.getLongitude()
                );
                double locationScore = Math.max(0, 1 - dist / pref.getMaxDistanceKm());
                score += locationScore * WEIGHT_LOCATION;
                weightCount++;
            }
            
            // Area match (15% weight)
            if (pref.hasAreaPreference() && room != null) {
                double areaScore = calculateAreaScore(room.getArea(), pref.getMinArea(), pref.getMaxArea());
                score += areaScore * WEIGHT_AREA;
                weightCount++;
            }
            
            // Amenities match (15% weight)
            if (pref.hasAmenityPreference() && room != null && room.getAmenities() != null && !room.getAmenities().isEmpty()) {
                Set<Long> prefAmenityIds = new HashSet<>(pref.getPreferredAmenityIds());
                long matchCount = room.getAmenities().stream()
                    .filter(a -> prefAmenityIds.contains(a.getId()))
                    .count();
                double amenityScore = matchCount / (double) Math.max(prefAmenityIds.size(), 1);
                score += amenityScore * WEIGHT_AMENITIES;
                weightCount++;
            }
            
            // Trending (10% weight)
            if (post.getViewCount() != null && post.getViewCount() > 0) {
                score += Math.min(1.0, post.getViewCount() / 500.0) * WEIGHT_TRENDING;
                weightCount++;
            }
            
            // Boosted (5% weight)
            if (Boolean.TRUE.equals(post.getIsBoosted())) {
                score += WEIGHT_BOOSTED;
                weightCount++;
            }
            
            // Normalize score
            if (weightCount > 0) {
                return Math.min(1.0, score);
            }
            
            return 0.5;
        } catch (Exception e) {
            log.warn("Error calculating score for user {} post {}: {}", userId, postId, e.getMessage());
            return 0.5;
        }
    }

    @Override
    @Async
    public void refreshRecommendations(Long userId) { buildPreferenceFromHistory(userId); }

    // === Helpers ===

    private UserPreference getOrCreatePreferences(Long userId) {
        return userPreferenceRepository.findByUserId(userId).orElseGet(() -> buildPreferenceFromHistory(userId));
    }

    private Set<Long> getExcludedPostIds(Long userId) {
        if (userId == null) {
            return new HashSet<>();
        }
        
        try {
            Set<Long> excludedIds = new HashSet<>();
            
            // Exclude posts that user has already booked (completed)
            List<Booking> completedBookings = bookingRepository.findByUserIdAndDeletedAtIsNull(userId);
            for (Booking booking : completedBookings) {
                if (booking.getStatus() == BookingStatus.CONFIRMED || 
                    booking.getStatus() == BookingStatus.COMPLETED) {
                    excludedIds.add(booking.getPost().getId());
                }
            }
            
            // Exclude posts that user has favorited (don't recommend what they already saved)
            List<Favorite> favorites = favoriteRepository.findByUserIdAndDeletedAtIsNull(userId);
            for (Favorite fav : favorites) {
                if (fav.getRoom() != null) {
                    Post activePost = postRepository.findActivePostByRoomId(fav.getRoom().getId()).orElse(null);
                    if (activePost != null) {
                        excludedIds.add(activePost.getId());
                    }
                }
            }
            
            return excludedIds;
        } catch (Exception e) {
            log.warn("Error getting excluded post IDs for user {}: {}", userId, e.getMessage());
            return new HashSet<>();
        }
    }

    private List<RecommendationResponse> removeDuplicatesAndSort(List<RecommendationResponse> recs) {
        Map<Long, RecommendationResponse> map = new LinkedHashMap<>();
        for (RecommendationResponse r : recs) {
            Long id = r.getPost().getId();
            if (!map.containsKey(id) || r.getScore() > map.get(id).getScore()) {
                map.put(id, r);
            }
        }
        return map.values().stream().sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed()).collect(Collectors.toList());
    }

    private void logRecommendations(Long userId, List<RecommendationResponse> recs) {
        int rank = 1;
        for (RecommendationResponse r : recs) {
            try {
                if (r.getPostId() != null) {
                    Post post = postRepository.findById(r.getPostId()).orElse(null);
                    if (post != null) {
                        RecommendationLog log = RecommendationLog.builder()
                                .userId(userId)
                                .post(post)
                                .type(r.getType())
                                .score(r.getScore())
                                .rankPosition(rank)
                                .reason(r.getReason())
                                .build();
                        recommendationLogRepository.save(log);
                    }
                }
            } catch (Exception e) { log.warn("Failed to log recommendation: {}", e.getMessage()); }
            rank++;
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDist = Math.toRadians(lat2 - lat1);
        double lonDist = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDist / 2) * Math.sin(latDist / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(lonDist / 2) * Math.sin(lonDist / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private double calculatePriceScore(double price, Double min, Double max) {
        if (min == null && max == null) return 0.5;
        if (max == null) max = min * 2;
        if (min == null) min = max * 0.5;
        if (price >= min && price <= max) return 1.0;
        if (price < min) return Math.max(0, price / min);
        return Math.max(0, max / price);
    }

    private double calculateAreaScore(double area, Double min, Double max) {
        if (min == null && max == null) return 0.5;
        if (max == null) max = min * 1.5;
        if (min == null) min = max * 0.5;
        if (area >= min && area <= max) return 1.0;
        if (area < min) return Math.max(0, area / min);
        return Math.max(0, max / area);
    }

    private RecommendationResponse buildRecommendationResponse(Post post, RecommendationType type, double score, String reason, Long basedOn) {
        PostResponse postResp = postService.getPostById(post.getId(), null);
        return RecommendationResponse.builder().id(post.getId()).postId(post.getId()).post(postResp).type(type).typeDescription(type.getDescription())
                .score(score).reason(reason).matchPercentage(score * 100).recommendedAt(LocalDateTime.now()).build();
    }

    private RecommendationListResponse buildResponse(List<RecommendationResponse> recs, UserPreference pref) {
        double avg = recs.stream().mapToDouble(RecommendationResponse::getScore).average().orElse(0);
        String summary = pref.hasBudgetPreference() ? String.format("Ngân sách: %.0f - %.0f VNĐ", pref.getMinBudget() != null ? pref.getMinBudget() : 0, pref.getMaxBudget() != null ? pref.getMaxBudget() : 0) : "";
        return RecommendationListResponse.builder().recommendations(recs).totalCount(recs.size()).averageScore(avg)
                .userPreferenceSummary(summary).overallMatchPercentage(avg * 100).build();
    }

    private String formatTimeAgo(LocalDateTime dt) {
        if (dt == null) return "";
        long mins = java.time.Duration.between(dt, LocalDateTime.now()).toMinutes();
        if (mins < 1) return "vừa xong";
        if (mins < 60) return mins + " phút trước";
        if (mins < 1440) return (mins / 60) + " giờ trước";
        if (mins < 10080) return (mins / 1440) + " ngày trước";
        return dt.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private static class ScoredPost {
        final Post post;
        final double score;
        final String reason;
        ScoredPost(Post p, double s, String r) { this.post = p; this.score = s; this.reason = r; }
        Post getPost() { return post; }
        double getScore() { return score; }
        String getReason() { return reason; }
    }
}
