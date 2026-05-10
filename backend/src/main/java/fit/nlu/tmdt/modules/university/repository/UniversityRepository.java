package fit.nlu.tmdt.modules.university.repository;

import fit.nlu.tmdt.modules.university.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {

    List<University> findByIsActiveTrue();

    List<University> findByProvinceAndIsActiveTrue(String province);

    java.util.Optional<University> findByEmailDomainAndIsActiveTrue(String emailDomain);

    @Query(value = "SELECT * FROM universities u WHERE " +
           "(unaccent(LOWER(u.name)) ILIKE unaccent(LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "unaccent(LOWER(u.abbreviation)) ILIKE unaccent(LOWER(CONCAT('%', :keyword, '%')))) " +
           "AND u.is_active = true", nativeQuery = true)
    List<University> searchUniversities(@Param("keyword") String keyword);

    @Query(value = "SELECT * FROM universities u WHERE u.is_active = true " +
           "AND (6371 * acos(cos(radians(:lat)) * cos(radians(u.latitude)) * " +
           "cos(radians(u.longitude) - radians(:lng)) + sin(radians(:lat)) * " +
           "sin(radians(u.latitude)))) <= :radius", nativeQuery = true)
    List<University> findNearby(@Param("lat") Double lat, @Param("lng") Double lng, @Param("radius") Double radius);
}
