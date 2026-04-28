package fit.nlu.tmdt.modules.system.repository;

import fit.nlu.tmdt.modules.system.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    Optional<SystemSetting> findByKey(String key);
    List<SystemSetting> findByGroup(String group);
}
