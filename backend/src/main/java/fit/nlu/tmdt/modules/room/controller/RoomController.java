package fit.nlu.tmdt.modules.room.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.room.dto.request.CreateRoomRequest;
import fit.nlu.tmdt.modules.room.dto.request.UpdateRoomRequest;
import fit.nlu.tmdt.modules.room.dto.response.RoomResponse;
import fit.nlu.tmdt.modules.room.entity.Amenity;
import fit.nlu.tmdt.modules.room.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Room Controller
 */
@RestController
@RequestMapping("/v1/rooms")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Room", description = "Room Management APIs")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Create a new room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            @CurrentUser Long landlordId) {

        log.info("Create room request from landlord: {}", landlordId);
        RoomResponse response = roomService.createRoom(request, landlordId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Room created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Update a room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomRequest request,
            @CurrentUser Long landlordId) {

        log.info("Update room: {} by landlord: {}", id, landlordId);
        RoomResponse response = roomService.updateRoom(id, request, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Room updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Delete a room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @PathVariable Long id,
            @CurrentUser Long landlordId) {

        log.info("Delete room: {} by landlord: {}", id, landlordId);
        roomService.deleteRoom(id, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Room deleted successfully", null));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Long id) {
        log.info("Get room: {}", id);
        RoomResponse response = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Get my rooms")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getMyRooms(@CurrentUser Long landlordId) {
        log.info("Get rooms for landlord: {}", landlordId);
        List<RoomResponse> rooms = roomService.getMyRooms(landlordId);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @PostMapping("/{id}/amenities/{amenityId}")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Add amenity to room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RoomResponse>> addAmenity(
            @PathVariable Long id,
            @PathVariable Long amenityId,
            @CurrentUser Long landlordId) {

        log.info("Add amenity: {} to room: {} by landlord: {}", amenityId, id, landlordId);
        RoomResponse response = roomService.addAmenity(id, amenityId, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Amenity added", response));
    }

    @DeleteMapping("/{id}/amenities/{amenityId}")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Remove amenity from room")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RoomResponse>> removeAmenity(
            @PathVariable Long id,
            @PathVariable Long amenityId,
            @CurrentUser Long landlordId) {

        log.info("Remove amenity: {} from room: {} by landlord: {}", amenityId, id, landlordId);
        RoomResponse response = roomService.removeAmenity(id, amenityId, landlordId);
        return ResponseEntity.ok(ApiResponse.success("Amenity removed", response));
    }

    @GetMapping("/amenities")
    @Operation(summary = "Get all amenities")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<Amenity>>> getAllAmenities() {
        log.info("Get all amenities");
        List<Amenity> amenities = roomService.getAllAmenities();
        return ResponseEntity.ok(ApiResponse.success(amenities));
    }

    @GetMapping("/amenities/category/{category}")
    @Operation(summary = "Get amenities by category")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<Amenity>>> getAmenitiesByCategory(@PathVariable String category) {
        log.info("Get amenities by category: {}", category);
        List<Amenity> amenities = roomService.getAmenitiesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(amenities));
    }
}
