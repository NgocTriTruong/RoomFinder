package fit.nlu.tmdt.modules.favorite.repository;

import fit.nlu.tmdt.modules.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Favorite Repository
 */
@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserIdAndDeletedAtIsNull(Long userId);

    Optional<Favorite> findByIdAndDeletedAtIsNull(Long id);

    Optional<Favorite> findByUserIdAndRoomIdAndDeletedAtIsNull(Long userId, Long roomId);
    
    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId AND f.room.id = :roomId")
    Optional<Favorite> findByUserIdAndRoomId(@Param("userId") Long userId, @Param("roomId") Long roomId);

    boolean existsByUserIdAndRoomIdAndDeletedAtIsNull(Long userId, Long roomId);

    void deleteByUserIdAndRoomIdAndDeletedAtIsNull(Long userId, Long roomId);

    long countByUserIdAndDeletedAtIsNull(Long userId);

    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId AND f.room.id IN :roomIds AND f.deletedAt IS NULL")
    List<Favorite> findByUserIdAndRoomIds(@Param("userId") Long userId, @Param("roomIds") List<Long> roomIds);

    @Query("SELECT f.room.id FROM Favorite f WHERE f.user.id = :userId AND f.deletedAt IS NULL")
    List<Long> findRoomIdsByUserId(@Param("userId") Long userId);
}