package fit.nlu.tmdt.modules.booking.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.booking.dto.request.CreateBookingRequest;
import fit.nlu.tmdt.modules.booking.dto.response.BookingResponse;
import fit.nlu.tmdt.modules.booking.dto.response.TimeSlotResponse;
import fit.nlu.tmdt.modules.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Booking Controller
 */
@RestController
@RequestMapping("/v1/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking", description = "Booking Management APIs")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create new booking")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @CurrentUser Long userId) {

        log.info("Create booking request from user: {}", userId);
        BookingResponse response = bookingService.createBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Booking created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get my bookings (user)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @CurrentUser Long userId) {

        List<BookingResponse> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            @CurrentUser Long userId) {

        BookingResponse booking = bookingService.getBookingById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm booking (landlord)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> confirmBooking(
            @PathVariable Long id,
            @CurrentUser Long landlordId) {

        log.info("Confirm booking: {} by landlord: {}", id, landlordId);
        bookingService.confirmBooking(id, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed", null));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long id,
            @CurrentUser Long userId,
            @RequestBody(required = false) Map<String, String> body) {

        log.info("Cancel booking: {} by user: {}", id, userId);
        String reason = body != null ? body.get("reason") : null;
        bookingService.cancelBooking(id, userId, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", null));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Complete booking (landlord)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> completeBooking(
            @PathVariable Long id,
            @CurrentUser Long landlordId,
            @RequestBody(required = false) Map<String, String> body) {

        log.info("Complete booking: {} by landlord: {}", id, landlordId);
        String note = body != null ? body.get("note") : null;
        bookingService.completeBooking(id, landlordId, note);
        return ResponseEntity.ok(ApiResponse.success("Booking completed", null));
    }

    @PutMapping("/{id}/no-show")
    @Operation(summary = "Mark as no-show (landlord)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> markNoShow(
            @PathVariable Long id,
            @CurrentUser Long landlordId,
            @RequestBody(required = false) Map<String, String> body) {

        log.info("Mark no-show for booking: {} by landlord: {}", id, landlordId);
        String reason = body != null ? body.get("reason") : null;
        bookingService.markNoShow(id, landlordId, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking marked as no-show", null));
    }

    @GetMapping("/available-slots")
    @Operation(summary = "Get available time slots for a post")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<TimeSlotResponse>> getAvailableSlots(
            @RequestParam Long postId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        TimeSlotResponse slots = bookingService.getAvailableSlots(postId, date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get calendar view (landlord)")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getCalendar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @CurrentUser Long landlordId) {

        List<BookingResponse> bookings = bookingService.getLandlordCalendar(landlordId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}
