package fit.nlu.tmdt.modules.favorite.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.favorite.dto.response.RoomHistoryResponse;
import fit.nlu.tmdt.modules.favorite.entity.RoomHistory;
import fit.nlu.tmdt.modules.favorite.repository.RoomHistoryRepository;
import fit.nlu.tmdt.modules.favorite.service.RoomHistoryService;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.room.entity.Room;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * RoomHistory Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RoomHistoryServiceImpl implements RoomHistoryService {

    private final RoomHistoryRepository roomHistoryRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<RoomHistoryResponse> getUserHistory(Long userId, Pageable pageable) {
        Page<RoomHistory> historyPage = roomHistoryRepository.findByUserIdAndDeletedAtIsNullOrderByViewedAtDesc(userId, pageable);
        
        List<RoomHistoryResponse> responses = historyPage.getContent().stream()
                .map(this::buildResponse)
                .toList();
        
        return new PageImpl<>(responses, pageable, historyPage.getTotalElements());
    }

    @Override
    public RoomHistoryResponse recordView(Long userId, Long postId) {
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException("USER_001", "User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException("POST_001", "Post not found"));

        // Check if already viewed - update time instead of creating new
        Optional<RoomHistory> existingHistory = roomHistoryRepository.findByUserIdAndPostId(userId, postId);
        
        RoomHistory history;
        if (existingHistory.isPresent()) {
            history = existingHistory.get();
            history.updateViewTime();
        } else {
            history = RoomHistory.create(user, post);
        }
        
        history = roomHistoryRepository.save(history);
        log.info("Recorded view: userId={}, postId={}", userId, postId);
        
        return buildResponse(history);
    }

    @Override
    public void deleteUserHistory(Long userId) {
        roomHistoryRepository.deleteByUserIdAndDeletedAtIsNull(userId);
        log.info("Deleted all history for user: {}", userId);
    }

    @Override
    public void deleteHistory(Long historyId, Long userId) {
        RoomHistory history = roomHistoryRepository.findById(historyId)
                .orElseThrow(() -> new BusinessException("HIST_001", "History not found"));
        
        if (!history.isOwnedBy(userId)) {
            throw new BusinessException("HIST_002", "Not authorized to delete this history");
        }
        
        history.setDeletedAt(LocalDateTime.now());
        roomHistoryRepository.save(history);
        log.info("Deleted history: id={}, userId={}", historyId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getRecentlyViewedRoomIds(Long userId, int limit) {
        List<RoomHistory> histories = roomHistoryRepository.findByUserIdWithPostAndRoom(userId);
        return histories.stream()
                .map(h -> h.getPost().getRoom().getId())
                .distinct()
                .limit(limit)
                .toList();
    }

    private RoomHistoryResponse buildResponse(RoomHistory history) {
        Post post = history.getPost();
        Room room = post.getRoom();
        
        RoomHistoryResponse.RoomHistoryResponseBuilder builder = RoomHistoryResponse.builder()
                .id(history.getId())
                .postId(post.getId())
                .postTitle(post.getTitle())
                .roomAddress(room.getAddress())
                .roomThumbnailUrl(room.getThumbnailUrl())
                .roomPrice(post.getPrice())
                .priceType(post.getPriceType() != null ? post.getPriceType().name() : null)
                .viewedAt(history.getViewedAt());

        if (post.getLandlord() != null) {
            User landlord = post.getLandlord();
            builder.landlordId(landlord.getId())
                    .landlordName(landlord.getFullName());
        }
        
        return builder.build();
    }
}
