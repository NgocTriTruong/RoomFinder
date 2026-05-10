package fit.nlu.tmdt.modules.booking.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.booking.dto.request.CreateBookingRequest;
import fit.nlu.tmdt.modules.booking.dto.request.UpdateBookingRequest;
import fit.nlu.tmdt.modules.booking.dto.response.BookingResponse;
import fit.nlu.tmdt.modules.booking.dto.response.TimeSlotResponse;
import fit.nlu.tmdt.modules.booking.entity.Booking;
import fit.nlu.tmdt.modules.booking.entity.enums.BookingStatus;
import fit.nlu.tmdt.modules.booking.repository.BookingRepository;
import fit.nlu.tmdt.modules.booking.service.BookingService;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.notification.entity.Notification;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import fit.nlu.tmdt.modules.notification.entity.Notification;
import fit.nlu.tmdt.modules.notification.service.NotificationService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
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
    private final NotificationService notificationService;

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
                request.getPostId(), bookingTime, Arrays.asList(BookingStatus.CANCELLED, BookingStatus.REJECTED));

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

        // 9. Send notification to landlord
        try {
            String title = "Lịch hẹn xem phòng mới";
            String content = String.format("Người dùng %s đã đặt lịch xem phòng %s vào %s", 
                user.getFullName(), post.getTitle(), bookingTime.toString());
            notificationService.createNotification(Notification.forBooking(post.getLandlord(), title, content, booking.getId()));
        } catch (Exception e) {
            log.error("Failed to send notification for new booking: {}", e.getMessage());
        }

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
        log.info(">>> Service: Fetching bookings for landlord ID: {}", landlordId);
        List<Booking> bookings = bookingRepository.findByLandlordIdAndDeletedAtIsNull(landlordId);
        log.info(">>> Service: Found {} raw bookings for landlord {}", bookings.size(), landlordId);
        
        return bookings.stream()
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

        if (!booking.isPending()) {
            throw new BusinessException(ErrorCode.BOOK_005, "Booking already confirmed or not pending");
        }

        booking.confirm(landlordId);
        bookingRepository.save(booking);

        log.info("Booking confirmed: {}", bookingId);

        // Send notification to user (tenant)
        try {
            String title = "Lịch hẹn đã được xác nhận";
            String content = "Lịch hẹn xem phòng của bạn cho bài đăng '" + booking.getPost().getTitle() + 
                    "' đã được chủ trọ xác nhận. Mã xác nhận: " + booking.getConfirmationCode();
            notificationService.createNotification(Notification.forBooking(booking.getUser(), title, content, bookingId));
        } catch (Exception e) {
            log.error("Failed to send confirmation notification: {}", e.getMessage());
        }
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

        if (isLandlord && booking.isPending()) {
            booking.reject(reason, userId);
        } else {
            booking.cancel(reason, userId);
        }
        bookingRepository.save(booking);

        log.info("Booking cancelled: {} by user: {}", bookingId, userId);

        // Send notification to the other party
        try {
            User otherParty = isUser ? booking.getLandlord() : booking.getUser();
            String cancellerName = isUser ? booking.getUser().getFullName() : "Chủ trọ";
            String title = "Lịch hẹn đã bị hủy";
            String content = "Lịch hẹn cho bài đăng '" + booking.getPost().getTitle() + 
                    "' đã bị hủy bởi " + cancellerName + ". Lý do: " + reason;
            notificationService.createNotification(Notification.forBooking(otherParty, title, content, bookingId));
        } catch (Exception e) {
            log.error("Failed to send cancellation notification: {}", e.getMessage());
        }
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

        // Send notification to user (tenant) that they can now review
        try {
            String title = "Hãy chia sẻ trải nghiệm của bạn!";
            String content = String.format("Lịch hẹn xem phòng cho %s đã hoàn tất. Hãy để lại đánh giá để giúp cộng đồng nhé!", booking.getPost().getTitle());
            notificationService.createNotification(Notification.forBooking(booking.getUser(), title, content, bookingId));
        } catch (Exception e) {
            log.error("Failed to send review prompt notification: {}", e.getMessage());
        }
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

        // Send notification to user
        try {
            String title = "Thông báo vắng mặt";
            String content = String.format("Chủ trọ đã đánh dấu bạn vắng mặt tại buổi hẹn cho bài viết: %s", booking.getPost().getTitle());
            notificationService.createNotification(Notification.forBooking(booking.getUser(), title, content, bookingId));
        } catch (Exception e) {
            log.error("Failed to send no-show notification: {}", e.getMessage());
        }
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
        try {
            Post post = booking.getPost();
            User user = booking.getUser();
            User landlord = booking.getLandlord();

            if (post != null && post.getRoom() != null) {
                Hibernate.initialize(post.getRoom());
            }

            String displayNote = booking.getLandlordNote();
            if (booking.isCancelled() && booking.getCancellationReason() != null) {
                displayNote = booking.getCancellationReason();
            } else if (booking.getStatus() == BookingStatus.NO_SHOW && booking.getNoShowReason() != null) {
                displayNote = booking.getNoShowReason();
            } else if (booking.isCompleted() && booking.getCompletionNote() != null) {
                displayNote = booking.getCompletionNote();
            }

            return BookingResponse.builder()
                    .id(booking.getId())
                    .bookingTime(booking.getBookingTime())
                    .endTime(booking.getEndTime())
                    .status(booking.getStatus().name())
                    .note(booking.getNote())
                    .landlordNote(displayNote)
                    .confirmationCode(booking.getConfirmationCode())
                    .post(post != null ? BookingResponse.PostSummary.builder()
                            .id(post.getId())
                            .title(post.getTitle())
                            .thumbnailUrl(post.getRoom() != null ? post.getRoom().getThumbnailUrl() : null)
                            .address(post.getRoom() != null ? post.getRoom().getAddress() : null)
                            .build() : null)
                    .user(user != null ? BookingResponse.UserSummary.builder()
                            .id(user.getId())
                            .fullName(user.getFullName())
                            .phone(user.getPhone())
                            .avatar(user.getAvatarUrl())
                            .build() : null)
                    .landlord(landlord != null ? BookingResponse.UserSummary.builder()
                            .id(landlord.getId())
                            .fullName(landlord.getFullName())
                            .phone(landlord.getPhone())
                            .avatar(landlord.getAvatarUrl())
                            .build() : null)
                    .createdAt(booking.getCreatedAt())
                    .confirmedAt(booking.getConfirmedAt())
                    .cancelledAt(booking.getCancelledAt())
                    .completedAt(booking.getCompletedAt())
                    .build();
        } catch (Exception e) {
            log.error("Error mapping booking response for ID {}: {}", booking.getId(), e.getMessage());
            return BookingResponse.builder().id(booking.getId()).status(booking.getStatus().name()).build();
        }
    }

    @Override
    @Transactional
    public BookingResponse updateBooking(Long bookingId, UpdateBookingRequest request, Long userId) {
        log.info("Updating booking ID: {} by user: {}", bookingId, userId);
        
        try {
            Booking booking = bookingRepository.findByIdAndDeletedAtIsNull(bookingId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_001, "Booking not found"));

            // Check if user is either the guest or the landlord
            if (!booking.getUser().getId().equals(userId) && !booking.getLandlord().getId().equals(userId)) {
                throw new BusinessException(ErrorCode.BOOK_003, "You do not have permission to update this booking");
            }

            // Only allowed to update PENDING or CONFIRMED bookings
            if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
                throw new BusinessException(ErrorCode.BOOK_003, "Cannot update booking with status: " + booking.getStatus());
            }

            if (request.getBookingTime() != null) {
                log.info("New booking time: {}", request.getBookingTime());
                // Check if new time is in the future
                if (request.getBookingTime().isBefore(LocalDateTime.now().plusHours(minAdvanceHours))) {
                    throw new BusinessException(ErrorCode.BOOK_004, "New booking time must be at least " + minAdvanceHours + " hours in advance");
                }
                
                // Check slot availability (if time changed)
                if (!request.getBookingTime().equals(booking.getBookingTime())) {
                    log.info("Time changed from {} to {}. Checking availability...", booking.getBookingTime(), request.getBookingTime());
                    boolean slotTaken = bookingRepository.existsByPostIdAndBookingTimeAndStatusNotIn(
                            booking.getPost().getId(), request.getBookingTime(), Arrays.asList(BookingStatus.CANCELLED, BookingStatus.REJECTED));
                    
                    if (slotTaken) {
                        throw new BusinessException(ErrorCode.BOOK_002, "This time slot is already booked");
                    }
                    booking.setBookingTime(request.getBookingTime());
                }
            }

            if (request.getNote() != null) {
                booking.setNote(request.getNote());
            }

            Booking updatedBooking = bookingRepository.save(booking);
            log.info("Booking {} updated successfully", bookingId);
            return toBookingResponse(updatedBooking);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error updating booking {}: {}", bookingId, e.getMessage(), e);
            throw new BusinessException(ErrorCode.BOOK_001, "Lỗi khi cập nhật lịch hẹn: " + e.getMessage());
        }
    }
}
