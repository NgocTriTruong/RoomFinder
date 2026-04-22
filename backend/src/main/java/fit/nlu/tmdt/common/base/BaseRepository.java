package fit.nlu.tmdt.common.base;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

/**
 * Base repository interface
 * Cung cấp các phương thức common cho tất cả repositories
 */
@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long>, JpaSpecificationExecutor<T> {

    /**
     * Tìm entity theo ID, không bao gồm soft-deleted
     */
    default Optional<T> findByIdActive(Long id) {
        return findById(id).filter(BaseEntity::isActive);
    }

    /**
     * Tìm tất cả entities active (không bao gồm soft-deleted)
     */
    default List<T> findAllActive() {
        return findAll().stream()
                .filter(BaseEntity::isActive)
                .toList();
    }

    /**
     * Tìm tất cả entities active với pagination
     */
    default Page<T> findAllActive(Pageable pageable) {
        return findAll(pageable).map(entity -> entity);
    }

    /**
     * Xóa mềm entity
     */
    default void softDelete(T entity) {
        entity.softDelete();
        save(entity);
    }

    /**
     * Xóa mềm entity theo ID
     */
    default boolean softDeleteById(Long id) {
        return findByIdActive(id)
                .map(entity -> {
                    entity.softDelete();
                    save(entity);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Kiểm tra entity tồn tại và active
     */
    default boolean existsActive(Long id) {
        return existsById(id);
    }
}
