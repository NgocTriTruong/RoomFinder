package fit.nlu.tmdt.modules.favorite.service;

import fit.nlu.tmdt.modules.favorite.dto.response.FavoriteResponse;

import java.util.List;

/**
 * Favorite Service Interface
 */
public interface FavoriteService {

    /**
     * Get user's favorites
     */
    List<FavoriteResponse> getUserFavorites(Long userId);

    /**
     * Add room to favorites
     */
    FavoriteResponse addFavorite(Long userId, Long roomId);

    /**
     * Remove room from favorites
     */
    void removeFavorite(Long userId, Long roomId);

    /**
     * Check if room is in favorites
     */
    boolean isFavorite(Long userId, Long roomId);

    /**
     * Get favorite count for user
     */
    long getFavoriteCount(Long userId);

    /**
     * Check multiple rooms for favorites
     */
    List<Long> checkFavoriteRooms(Long userId, List<Long> roomIds);

    /**
     * Get suggested rooms for user
     */
    List<FavoriteResponse> getSuggestedRooms(Long userId, int limit);

    /**
     * Get most viewed rooms
     */
    List<FavoriteResponse> getMostViewedRooms(int limit);

    /**
     * Get latest rooms
     */
    List<FavoriteResponse> getLatestRooms(int limit);
}