package fit.nlu.tmdt.modules.booking.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.booking.dto.request.CreateBookingRequest;
import fit.nlu.tmdt.modules.booking.dto.response.BookingResponse;
import fit.nlu.tmdt.modules.booking.dto.response.TimeSlotResponse;
import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.booking.repository.BookingRepository;
import fit.nlu.tmdt.modules.booking.service.BookingService;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Booking Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Value("${booking.min-advance-hours:2}")
    private int minAdvanceHours;

    @Value("${booking.max-advance-days:14}")
    private int maxAdvanceDays;

    @Value("${booking.slot-duration-minutes:30}")
    private int slotDurationMinutes;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        log.info("Creating booking for user: {} on post: {}", userId, request.getPostId());

        // 1. Get post
        Post post = postRepository.findByIdActive(request.getPostId())
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_001, "Post not found"));

        // 2. Check post is bookable
        if (!post.isBookable()) {
            throw new BusinessException(ErrorCode.POST_009, "This post is not available for booking");
        }

        // 3. Cannot book own post
        if (post.getLandlord().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.BOOK_003, "You cannot book your own post");
        }

        // 4. Check booking time is valid
        LocalDateTime bookingTime = request.getBookingTime();
        LocalDateTime now = LocalDateTime.now();

        if (bookingTime.isBefore(now.plusHours(minAdvanceHours))) {
            throw new BusinessException(ErrorCode.BOOK_004, "Booking must be at least " + minAdvanceHours + " hours in advance");
        }

        if (bookingTime.isAfter(now.plusDays(maxAdvanceDays))) {
            throw new BusinessException(ErrorCode.BOOK_004, "Cannot book more than " + maxAdvanceDays + " days in advance");
        }

        // 5. Check slot not taken
        boolean slotTaken = bookingRepository.existsByPostIdAndBookingTimeAndStatusNotIn(
                request.getPostId(), bookingTime, List.of(BookingStatus.CANCELLED));

        if (slotTaken) {
            throw new BusinessException(ErrorCode.BOOK_002, "This time slot is already booked");
        }

        // 6. Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // 7. Create booking
        Booking booking = Booking.builder()
                .user(user)
                .landlord(post.getLandlord())
                .post(post)
                .bookingTime(bookingTime)
                .note(request.getNote())
                .status(BookingStatus.PENDING)
                .confirmationCode(Booking.generateConfirmationCode())
                .build();

        booking = bookingRepository.save(booking);

        // 8. Increment booking count on post
        post.incrementBookingCount();
        postRepository.save(post);

        log.info("Booking created: {} with code: {}", booking.getId(), booking.getConfirmationCode());

        return toBookingResponse(booking);
    }

    @Override
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdAndDeletedAtIsNull(userId).stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getLandlordBookings(Long landlordId) {
        return bookingRepository.findByLandlordIdAndDeletedAtIsNull(landlordId).stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(bookingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001, "Booking not found"));

        // Check authorization
        if (!booking.getUser().getId().equals(userId) && !booking.getLandlord().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.BOOK_008, "Not authorized to view this booking");
        }

        return toBookingResponse(booking);
    }

    @Override
    @Transactional
    public void confirmBooking(Long bookingId, Long landlordId) {
        Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(bookingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001, "Booking not found"));

        if (!booking.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.BOOK_008, "Not authorized to confirm this booking");
        }

        if (booking.isPending()) {
            throw new BusinessException(ErrorCode.BOOK_005, "Booking already confirmed or not pending");
        }

        booking.confirm(landlordId);
        bookingRepository.save(booking);

        log.info("Booking confirmed: {}", bookingId);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, Long userId, String reason) {
        Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(bookingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001, "Booking not found"));

        // Check authorization
        boolean isUser = booking.getUser().getId().equals(userId);
        boolean isLandlord = booking.getLandlord().getId().equals(userId);

        if (!isUser && !isLandlord) {
            throw new BusinessException(ErrorCode.BOOK_008, "Not authorized to cancel this booking");
        }

        // Check booking can be cancelled
        if (!booking.canCancel()) {
            throw new BusinessException(ErrorCode.BOOK_009, "Cannot cancel within 1 hour of booking time");
        }

        if (booking.isCancelled() || booking.isCompleted()) {
            throw new BusinessException(ErrorCode.BOOK_006, "Cannot cancel this booking");
        }

        booking.cancel(reason, userId);
        bookingRepository.save(booking);

        log.info("Booking cancelled: {} by user: {}", bookingId, userId);
    }

    @Override
    @Transactional
    public void completeBooking(Long bookingId, Long landlordId, String note) {
        Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(bookingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001, "Booking not found"));

        if (!booking.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.BOOK_008, "Not authorized to complete this booking");
        }

        if (!booking.isConfirmed()) {
            throw new BusinessException(ErrorCode.BOOK_007, "Booking must be confirmed first");
        }

        booking.complete(note);
        bookingRepository.save(booking);

        log.info("Booking completed: {}", bookingId);
    }

    @Override
    @Transactional
    public void markNoShow(Long bookingId, Long landlordId, String reason) {
        Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(bookingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001, "Booking not found"));

        if (!booking.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException(ErrorCode.BOOK_008, "Not authorized");
        }

        booking.markNoShow(reason);
        bookingRepository.save(booking);

        log.info("Booking marked as no-show: {}", bookingId);
    }

    @Override
    public TimeSlotResponse getAvailableSlots(Long postId, LocalDate date) {
        // Generate time slots (8:00 - 18:00, 30 min each)
        List<TimeSlotResponse.TimeSlot> slots = new ArrayList<>();
        LocalTime startTime = LocalTime.of(8, 0);
        LocalTime endTime = LocalTime.of(18, 0);

        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();

        // Get booked slots
        Set<LocalTime> bookedTimes = bookingRepository.findByPostIdAndDate(postId, dayStart, dayEnd)
                .stream()
                .map(b -> b.getBookingTime().toLocalTime())
                .collect(Collectors.toSet());

        // Generate slots
        LocalTime current = startTime;
        while (current.isBefore(endTime)) {
            boolean available = !bookedTimes.contains(current);
            slots.add(TimeSlotResponse.TimeSlot.builder()
                    .time(current.toString())
                    .available(available)
                    .build());
            current = current.plusMinutes(slotDurationMinutes);
        }

        return TimeSlotResponse.builder()
                .postId(postId)
                .date(date)
                .availableSlots(slots)
                .landlordPreferences(TimeSlotResponse.WorkingHours.builder()
                        .start("08:00")
                        .end("18:00")
                        .build())
                .build();
    }

    @Override
    public List<BookingResponse> getLandlordCalendar(Long landlordId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay();

        return bookingRepository.findByLandlordIdAndDate(landlordId, start, end).stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    // ==================== HELPER ====================

    private BookingResponse toBookingResponse(Booking booking) {
        Post post = booking.getPost();
        User user = booking.getUser();
        User landlord = booking.getLandlord();

        Hibernate.initialize(post.getRoom());

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingTime(booking.getBookingTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().name())
                .note(booking.getNote())
                .landlordNote(booking.getLandlordNote())
                .confirmationCode(booking.getConfirmationCode())
                .post(BookingResponse.PostSummary.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .thumbnailUrl(post.getRoom() != null ? post.getRoom().getThumbnailUrl() : null)
                        .address(post.getRoom() != null ? post.getRoom().getAddress() : null)
                        .build())
                .user(BookingResponse.UserSummary.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .phone(user.getPhone())
                        .avatar(user.getAvatarUrl())
                        .build())
                .landlord(BookingResponse.UserSummary.builder()
                        .id(landlord.getId())
                        .fullName(landlord.getFullName())
                        .phone(landlord.getPhone())
                        .avatar(landlord.getAvatarUrl())
                        .build())
                .createdAt(booking.getCreatedAt())
                .confirmedAt(booking.getConfirmedAt())
                .cancelledAt(booking.getCancelledAt())
                .completedAt(booking.getCompletedAt())
                .build();
    }
}
