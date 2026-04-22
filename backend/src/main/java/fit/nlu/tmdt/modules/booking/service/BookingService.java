package fit.nlu.tmdt.modules.booking.service;

import fit.nlu.tmdt.modules.booking.dto.request.CreateBookingRequest;
import fit.nlu.tmdt.modules.booking.dto.response.BookingResponse;
import fit.nlu.tmdt.modules.booking.dto.response.TimeSlotResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Booking Service Interface
 */
public interface BookingService {

    /**
     * Create booking
     */
    BookingResponse createBooking(CreateBookingRequest request, Long userId);

    /**
     * Get user's bookings
     */
    List<BookingResponse> getUserBookings(Long userId);

    /**
     * Get landlord's bookings
     */
    List<BookingResponse> getLandlordBookings(Long landlordId);

    /**
     * Get booking by ID
     */
    BookingResponse getBookingById(Long bookingId, Long userId);

    /**
     * Confirm booking (landlord)
     */
    void confirmBooking(Long bookingId, Long landlordId);

    /**
     * Cancel booking (user or landlord)
     */
    void cancelBooking(Long bookingId, Long userId, String reason);

    /**
     * Complete booking (landlord)
     */
    void completeBooking(Long bookingId, Long landlordId, String note);

    /**
     * Mark as no-show (landlord)
     */
    void markNoShow(Long bookingId, Long landlordId, String reason);

    /**
     * Get available time slots for a post on a date
     */
    TimeSlotResponse getAvailableSlots(Long postId, LocalDate date);

    /**
     * Get calendar view for landlord
     */
    List<BookingResponse> getLandlordCalendar(Long landlordId, LocalDate startDate, LocalDate endDate);
}
