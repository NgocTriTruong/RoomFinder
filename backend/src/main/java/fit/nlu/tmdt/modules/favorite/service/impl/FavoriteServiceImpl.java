package fit.nlu.tmdt.modules.favorite.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.favorite.dto.response.FavoriteResponse;
import fit.nlu.tmdt.modules.favorite.entity.Favorite;
import fit.nlu.tmdt.modules.favorite.repository.FavoriteRepository;
import fit.nlu.tmdt.modules.favorite.service.FavoriteService;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.room.entity.Room;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Favorite Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getUserFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserIdAndDeletedAtIsNull(userId);
        return buildFavoriteResponses(favorites);
    }

    @Override
    public FavoriteResponse addFavorite(Long userId, Long roomId) {
        if (favoriteRepository.existsByUserIdAndRoomIdAndDeletedAtIsNull(userId, roomId)) {
            throw new BusinessException(ErrorCode.FAV_002.getCode(), ErrorCode.FAV_002.getMessage());
        }

        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        // Find active post for this room
        Post post = postRepository.findActivePostByRoomId(roomId)
                .orElseThrow(() -> new BusinessException("ROOM_001", "No active post found for this room"));

        Room room = post.getRoom();

        Favorite favorite = Favorite.create(user, room);
        favorite = favoriteRepository.save(favorite);

        return buildFavoriteResponse(favorite, post);
    }

    @Override
    public void removeFavorite(Long userId, Long roomId) {
        Favorite favorite = favoriteRepository.findByUserIdAndRoomIdAndDeletedAtIsNull(userId, roomId)
                .orElseThrow(() -> new BusinessException("FAV_003", "Favorite not found"));

        favorite.setDeletedAt(LocalDateTime.now());
        favoriteRepository.save(favorite);
        log.info("Removed favorite: userId={}, roomId={}", userId, roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long roomId) {
        return favoriteRepository.existsByUserIdAndRoomIdAndDeletedAtIsNull(userId, roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFavoriteCount(Long userId) {
        return favoriteRepository.countByUserIdAndDeletedAtIsNull(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> checkFavoriteRooms(Long userId, List<Long> roomIds) {
        List<Favorite> favorites = favoriteRepository.findByUserIdAndRoomIds(userId, roomIds);
        return favorites.stream()
                .map(f -> f.getRoom().getId())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getSuggestedRooms(Long userId, int limit) {
        // Get recently viewed rooms to base suggestions on
        List<Post> recentPosts = postRepository.findRecentPostsByUserId(userId, PageRequest.of(0, 5));
        
        if (recentPosts.isEmpty()) {
            // If no history, return latest posts as suggestions
            return getLatestRooms(limit);
        }
        
        // Get posts similar to recently viewed ones
        // This is a simplified recommendation - in production you'd use ML/CBRS
        Post firstPost = recentPosts.get(0);
        Hibernate.initialize(firstPost.getRoom());
        List<Post> suggestedPosts = postRepository.findSimilarPosts(
                firstPost.getId(),
                firstPost.getRoom().getDistrict(),
                PageRequest.of(0, limit)
        );
        
        return suggestedPosts.stream()
                .filter(p -> !p.getId().equals(firstPost.getId()))
                .limit(limit)
                .map(p -> buildPostResponse(p))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMostViewedRooms(int limit) {
        List<Post> posts = postRepository.findMostViewedPosts(PageRequest.of(0, limit)).getContent();
        return posts.stream()
                .map(this::buildPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getLatestRooms(int limit) {
        List<Post> posts = postRepository.findLatestActivePosts(PageRequest.of(0, limit)).getContent();
        return posts.stream()
                .map(this::buildPostResponse)
                .collect(Collectors.toList());
    }

    private FavoriteResponse buildPostResponse(Post post) {
        Room room = post.getRoom();

        Hibernate.initialize(room.getAmenities());
        Hibernate.initialize(post.getLandlord());

        FavoriteResponse.FavoriteResponseBuilder builder = FavoriteResponse.builder()
                .roomId(room.getId())
                .roomTitle(post.getTitle())
                .roomAddress(room.getAddress())
                .roomImageUrl(room.getThumbnailUrl())
                .roomPrice(post.getPrice())
                .priceType(post.getPriceType() != null ? post.getPriceType().name() : null)
                .addedAt(post.getCreatedAt());

        if (post.getLandlord() != null) {
            User landlord = post.getLandlord();
            builder.landlordId(landlord.getId())
                    .landlordName(landlord.getFullName())
                    .landlordAvatar(landlord.getAvatarUrl());
        }
        
        return builder.build();
    }

    private List<FavoriteResponse> buildFavoriteResponses(List<Favorite> favorites) {
        if (favorites.isEmpty()) {
            return new ArrayList<>();
        }

        return favorites.stream()
                .map(this::buildFavoriteResponse)
                .collect(Collectors.toList());
    }

    private FavoriteResponse buildFavoriteResponse(Favorite favorite) {
        Room room = favorite.getRoom();
        // Find active post from room
        Post activePost = postRepository.findActivePostByRoomId(room.getId()).orElse(null);
        return buildFavoriteResponse(favorite, activePost);
    }

    private FavoriteResponse buildFavoriteResponse(Favorite favorite, Post activePost) {
        Room room = favorite.getRoom();

        Hibernate.initialize(room.getAmenities());

        // Use post data if available, otherwise use room data
        String title = activePost != null ? activePost.getTitle() : null;
        String imageUrl = room.getThumbnailUrl();
        Double price = activePost != null ? activePost.getPrice() : null;
        String priceType = activePost != null && activePost.getPriceType() != null ? activePost.getPriceType().name() : null;

        FavoriteResponse.FavoriteResponseBuilder builder = FavoriteResponse.builder()
                .id(favorite.getId())
                .roomId(room.getId())
                .roomTitle(title)
                .roomAddress(room.getAddress())
                .roomImageUrl(imageUrl)
                .roomPrice(price)
                .priceType(priceType)
                .addedAt(favorite.getCreatedAt());

        if (activePost != null && activePost.getLandlord() != null) {
            User landlord = activePost.getLandlord();
            builder.landlordId(landlord.getId())
                    .landlordName(landlord.getFullName())
                    .landlordAvatar(landlord.getAvatarUrl());
        }

        return builder.build();
    }
}