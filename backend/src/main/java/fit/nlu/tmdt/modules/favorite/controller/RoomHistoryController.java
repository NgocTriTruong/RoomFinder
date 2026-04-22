package fit.nlu.tmdt.modules.favorite.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.common.utils.PageResponse;
import fit.nlu.tmdt.modules.favorite.dto.response.RoomHistoryResponse;
import fit.nlu.tmdt.modules.favorite.service.RoomHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * RoomHistory Controller
 */
@RestController
@RequestMapping("/v1/room-history")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Room History", description = "Room Viewing History APIs")
public class RoomHistoryController {

    private final RoomHistoryService roomHistoryService;

    @GetMapping
    @Operation(summary = "Get user's room viewing history")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PageResponse<RoomHistoryResponse>>> getUserHistory(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get room history for user: {}", userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<RoomHistoryResponse> history = roomHistoryService.getUserHistory(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(history)));
    }

    @PostMapping("/{postId}")
    @Operation(summary = "Record a room view")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<RoomHistoryResponse>> recordView(
            @PathVariable Long postId,
            @CurrentUser Long userId) {

        log.info("Record view: userId={}, postId={}", userId, postId);
        RoomHistoryResponse response = roomHistoryService.recordView(userId, postId);
        return ResponseEntity.ok(ApiResponse.success("View recorded", response));
    }

    @DeleteMapping
    @Operation(summary = "Delete all user's room history")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteAllHistory(@CurrentUser Long userId) {

        log.info("Delete all history for user: {}", userId);
        roomHistoryService.deleteUserHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("History deleted", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete specific history item")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> deleteHistory(
            @PathVariable Long id,
            @CurrentUser Long userId) {

        log.info("Delete history: id={}, userId={}", id, userId);
        roomHistoryService.deleteHistory(id, userId);
        return ResponseEntity.ok(ApiResponse.success("History deleted", null));
    }
}
