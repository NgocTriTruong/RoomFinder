package fit.nlu.tmdt.modules.subscription.repository;

import fit.nlu.tmdt.modules.subscription.entity.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Package Repository
 */
@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {

    List<Package> findByTypeAndIsActiveTrue(String type);

    @Query("SELECT p FROM Package p WHERE p.isActive = true AND p.validFrom IS NULL AND p.validTo IS NULL")
    List<Package> findAllActive();

    @Query("SELECT p FROM Package p WHERE p.isActive = true ORDER BY p.displayOrder ASC, p.price ASC")
    List<Package> findAllActiveOrdered();

    @Query("SELECT p FROM Package p WHERE p.isActive = true AND p.type = :type ORDER BY p.displayOrder ASC, p.price ASC")
    List<Package> findActiveByType(@Param("type") String type);

    @Query("SELECT p FROM Package p WHERE p.isActive = true AND p.isFeatured = true")
    List<Package> findFeatured();

    @Query("SELECT p FROM Package p WHERE p.isActive = true AND p.validFrom IS NOT NULL AND p.validTo IS NOT NULL")
    List<Package> findTimeLimited();
}
