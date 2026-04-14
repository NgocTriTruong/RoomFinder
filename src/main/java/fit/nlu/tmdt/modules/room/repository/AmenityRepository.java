package fit.nlu.tmdt.modules.room.repository;

import fit.nlu.tmdt.modules.room.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Amenity Repository
 */
@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    List<Amenity> findByCategory(String category);

    @Query("SELECT a FROM Amenity a WHERE a.id IN :ids")
    List<Amenity> findByIdIn(@Param("ids") List<Long> ids);

    @Query("SELECT DISTINCT a.category FROM Amenity a")
    List<String> findAllCategories();
}
