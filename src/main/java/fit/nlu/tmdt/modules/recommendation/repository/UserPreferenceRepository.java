package fit.nlu.tmdt.modules.recommendation.repository;

import fit.nlu.tmdt.modules.recommendation.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserPreference Repository
 */
@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    Optional<UserPreference> findByUserId(Long userId);

    @Query("SELECT up FROM UserPreference up WHERE up.user.id = :userId")
    Optional<UserPreference> findByUserIdLazy(@Param("userId") Long userId);

    boolean existsByUserId(Long userId);

    @Query("SELECT up FROM UserPreference up WHERE up.user.id IN :userIds")
    List<UserPreference> findByUserIds(@Param("userIds") List<Long> userIds);
}
