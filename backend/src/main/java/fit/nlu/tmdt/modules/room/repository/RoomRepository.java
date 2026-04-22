package fit.nlu.tmdt.modules.room.repository;

import fit.nlu.tmdt.modules.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Room Repository
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByIdAndDeletedAtIsNull(Long id);

    List<Room> findByLandlordIdAndDeletedAtIsNull(Long landlordId);

    @Query("SELECT r FROM Room r WHERE r.landlord.id = :landlordId AND r.deletedAt IS NULL")
    List<Room> findAllByLandlordId(@Param("landlordId") Long landlordId);

    boolean existsByIdAndDeletedAtIsNull(Long id);
}
