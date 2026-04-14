package fit.nlu.tmdt.modules.favorite.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.favorite.dto.response.FavoriteResponse;
import fit.nlu.tmdt.modules.favorite.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Favorite Controller
 */
@RestController
@RequestMapping("/v1/favorites")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Favorite", description = "Favorite Management APIs")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    @Operation(summary = "Get user's favorites")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getUserFavorites(
            @CurrentUser Long userId) {

        log.info("Get favorites for user: {}", userId);
        List<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    @PostMapping("/{roomId}")
    @Operation(summary = "Add room to favorites")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @PathVariable Long roomId,
            @CurrentUser Long userId) {

        log.info("Add favorite: userId={}, roomId={}", userId, roomId);
        FavoriteResponse response = favoriteService.addFavorite(userId, roomId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Added to favorites", response));
    }

    @DeleteMapping("/{roomId}")
    @Operation(summary = "Remove room from favorites")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Long roomId,
            @CurrentUser Long userId) {

        log.info("Remove favorite: userId={}, roomId={}", userId, roomId);
        favoriteService.removeFavorite(userId, roomId);
        return ResponseEntity.ok(ApiResponse.success("Removed from favorites", null));
    }

    @GetMapping("/check/{roomId}")
    @Operation(summary = "Check if room is in favorites")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkFavorite(
            @PathVariable Long roomId,
            @CurrentUser Long userId) {

        boolean isFavorite = favoriteService.isFavorite(userId, roomId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("isFavorite", isFavorite)));
    }

    @GetMapping("/suggestions")
    @Operation(summary = "Get suggested rooms based on user's preferences")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getSuggestions(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get room suggestions for user: {}", userId);
        List<FavoriteResponse> suggestions = favoriteService.getSuggestedRooms(userId, limit);
        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }

    @GetMapping("/most-viewed")
    @Operation(summary = "Get most viewed rooms")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMostViewedRooms(
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get most viewed rooms, limit: {}", limit);
        List<FavoriteResponse> rooms = favoriteService.getMostViewedRooms(limit);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest rooms")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getLatestRooms(
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get latest rooms, limit: {}", limit);
        List<FavoriteResponse> rooms = favoriteService.getLatestRooms(limit);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }
}