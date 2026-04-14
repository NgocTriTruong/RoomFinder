package fit.nlu.tmdt.modules.favorite.service;

import fit.nlu.tmdt.modules.favorite.dto.response.RoomHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * RoomHistory Service Interface
 */
public interface RoomHistoryService {

    /**
     * Get user's room history
     */
    Page<RoomHistoryResponse> getUserHistory(Long userId, Pageable pageable);

    /**
     * Record a room view
     */
    RoomHistoryResponse recordView(Long userId, Long postId);

    /**
     * Delete user's history
     */
    void deleteUserHistory(Long userId);

    /**
     * Delete specific history item
     */
    void deleteHistory(Long historyId, Long userId);

    /**
     * Get distinct room IDs from history for recommendations
     */
    List<Long> getRecentlyViewedRoomIds(Long userId, int limit);
}
