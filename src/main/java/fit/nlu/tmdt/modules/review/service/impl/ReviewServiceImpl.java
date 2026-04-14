package fit.nlu.tmdt.modules.review.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.booking.repository.BookingRepository;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.review.dto.request.CreateReviewRequest;
import fit.nlu.tmdt.modules.review.dto.request.UpdateReviewRequest;
import fit.nlu.tmdt.modules.review.dto.response.ReviewResponse;
import fit.nlu.tmdt.modules.review.dto.response.ReviewStatsResponse;
import fit.nlu.tmdt.modules.review.entity.Review;
import fit.nlu.tmdt.modules.review.repository.ReviewRepository;
import fit.nlu.tmdt.modules.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Review Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponse createReview(CreateReviewRequest request, Long userId) {
        if (reviewRepository.existsByBookingIdAndDeletedAtIsNull(request.getBookingId())) {
            throw new BusinessException(ErrorCode.REV_003);
        }

        Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(request.getBookingId())
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.REV_005);
        }

        if (!booking.isCompleted()) {
            throw new BusinessException(ErrorCode.REV_002);
        }

        LocalDateTime deadline = booking.getCompletedAt().plusDays(7);
        if (LocalDateTime.now().isAfter(deadline)) {
            throw new BusinessException(ErrorCode.REV_004);
        }

        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001));
        Post post = postRepository.findByIdAndDeletedAtIsNull(request.getPostId())
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001));

        Review review = Review.builder()
                .user(user)
                .post(post)
                .landlord(post.getLandlord())
                .rating(request.getRating())
                .comment(request.getComment())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .landlordRating(request.getLandlordRating())
                .landlordComment(request.getLandlordComment())
                .isVisible(true)
                .isApproved(true)
                .build();

        review = reviewRepository.save(review);
        log.info("Created review: id={}, userId={}, postId={}", review.getId(), userId, request.getPostId());
        return toResponse(review);
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, UpdateReviewRequest request, Long userId) {
        Review review = reviewRepository.findByIdAndDeletedAtIsNull(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REV_001));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.REV_005);
        }

        if (!review.isEditable()) {
            throw new BusinessException("Cannot edit review after 24 hours");
        }

        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }
        if (request.getImages() != null) {
            review.setImages(request.getImages());
        }

        review = reviewRepository.save(review);
        log.info("Updated review: id={}", reviewId);
        return toResponse(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findByIdAndDeletedAtIsNull(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REV_001));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.REV_005);
        }

        review.setDeletedAt(LocalDateTime.now());
        reviewRepository.save(review);
        log.info("Deleted review: id={}", reviewId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getPostReviews(Long postId, int page, int size) {
        Page<Review> reviews = reviewRepository.findByPostIdAndIsVisibleAndDeletedAtIsNullOrderByCreatedAtDesc(
                postId, true, PageRequest.of(page, size));
        return reviews.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdAndDeletedAtIsNull(userId);
        return reviews.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getLandlordReviews(Long landlordId) {
        List<Review> reviews = reviewRepository.findByLandlordIdAndDeletedAtIsNull(landlordId);
        return reviews.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByLandlordId(Long landlordId) {
        List<Review> reviews = reviewRepository.findByLandlordIdAndIsVisibleAndDeletedAtIsNull(landlordId, true);
        return reviews.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewStatsResponse getAverageRating(Long postId) {
        return getPostReviewStats(postId);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findByIdAndDeletedAtIsNull(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REV_001));
        return toResponse(review);
    }

    @Override
    public ReviewResponse landlordRespond(Long reviewId, String response, Long landlordId) {
        Review review = reviewRepository.findByIdAndDeletedAtIsNull(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REV_001));

        if (!review.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.REV_005);
        }

        review.respondAsLandlord(response);
        review = reviewRepository.save(review);
        log.info("Landlord responded to review: id={}, landlordId={}", reviewId, landlordId);
        return toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewStatsResponse getPostReviewStats(Long postId) {
        long totalReviews = reviewRepository.countByPostIdAndIsVisibleAndDeletedAtIsNull(postId, true);
        Double avgRating = reviewRepository.getAverageRatingByPostId(postId);
        List<Object[]> distribution = reviewRepository.getRatingDistributionByPostId(postId);

        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }
        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count);
        }

        List<Review> allReviews = reviewRepository.findByPostIdAndIsVisibleAndDeletedAtIsNull(postId, true);
        long hiddenCount = reviewRepository.countByPostIdAndIsVisibleAndDeletedAtIsNull(postId, false);

        return ReviewStatsResponse.builder()
                .postId(postId)
                .totalReviews(totalReviews)
                .averageRating(avgRating != null ? Math.round(avgRating * 10) / 10.0 : 0.0)
                .ratingDistribution(ratingDistribution)
                .visibleCount(totalReviews)
                .hiddenCount(hiddenCount)
                .build();
    }

    @Override
    public void markAsHelpful(Long reviewId, Long userId) {
        Review review = reviewRepository.findByIdAndDeletedAtIsNull(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REV_001));
        review.incrementHelpful();
        reviewRepository.save(review);
        log.info("Marked review as helpful: id={}", reviewId);
    }

    @Override
    public void reportReview(Long reviewId, String reason, Long reporterId) {
        Review review = reviewRepository.findByIdAndDeletedAtIsNull(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REV_001));

        if (review.getUser().getId().equals(reporterId)) {
            throw new BusinessException(ErrorCode.RPT_002);
        }

        review.incrementReport();
        reviewRepository.save(review);
        log.info("Reported review: id={}, reporterId={}, reason={}", reviewId, reporterId, reason);
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .userAvatar(review.getUser().getAvatarUrl())
                .postId(review.getPost().getId())
                .postTitle(review.getPost().getTitle())
                .landlordId(review.getLandlord().getId())
                .landlordName(review.getLandlord().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .images(review.getImages())
                .landlordRating(review.getLandlordRating())
                .landlordComment(review.getLandlordComment())
                .isVisible(review.getIsVisible())
                .helpfulCount(review.getHelpfulCount())
                .reportCount(review.getReportCount())
                .landlordResponse(review.getLandlordResponse())
                .landlordResponseAt(review.getLandlordResponseAt())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}