package fit.nlu.tmdt.common.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Nâng kiểu cột ảnh cũ lên TEXT để tránh lỗi cắt chuỗi khi lưu URL dài.
 * Hibernate `ddl-auto=update` không tự đổi kiểu cột đã tồn tại, nên cần vá trực tiếp.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ImageColumnSchemaFixer {

    private final JdbcTemplate jdbcTemplate;

    private record ImageTable(String tableName) {}

    private static final List<ImageTable> IMAGE_TABLES = List.of(
            new ImageTable("post_images"),
            new ImageTable("room_images"),
            new ImageTable("review_images")
    );

    @EventListener(ApplicationReadyEvent.class)
    public void upgradeLegacyImageColumns() {
        cleanupOrphanImageRows();
        for (ImageTable table : IMAGE_TABLES) {
            try {
                upgradeColumnIfNeeded(table.tableName());
            } catch (Exception ex) {
                log.warn("Không thể nâng kiểu cột image_url cho bảng {}: {}", table.tableName(), ex.getMessage());
            }
        }
    }

    private void cleanupOrphanImageRows() {
        deleteOrphanRows("post_images", "posts", "post_id");
        deleteOrphanRows("room_images", "rooms", "room_id");
        deleteOrphanRows("review_images", "reviews", "review_id");
    }

    private void deleteOrphanRows(String imageTable, String parentTable, String parentKeyColumn) {
        try {
            Integer deleted = jdbcTemplate.update(
                    "DELETE FROM " + imageTable + " i WHERE NOT EXISTS (" +
                            "SELECT 1 FROM " + parentTable + " p WHERE p.id = i." + parentKeyColumn +
                            ")"
            );
            if (deleted != null && deleted > 0) {
                log.info("Đã xóa {} dòng ảnh mồ côi trong bảng {}", deleted, imageTable);
            }
        } catch (Exception ex) {
            log.warn("Không thể dọn ảnh mồ côi trong bảng {}: {}", imageTable, ex.getMessage());
        }
    }

    private void upgradeColumnIfNeeded(String tableName) {
        Boolean tableExists = jdbcTemplate.queryForObject(
                """
                select exists (
                    select 1
                    from information_schema.tables
                    where table_schema = current_schema()
                      and table_name = ?
                )
                """,
                Boolean.class,
                tableName
        );

        if (!Boolean.TRUE.equals(tableExists)) {
            return;
        }

        String dataType = jdbcTemplate.queryForObject(
                """
                select data_type
                from information_schema.columns
                where table_schema = current_schema()
                  and table_name = ?
                  and column_name = 'image_url'
                limit 1
                """,
                String.class,
                tableName
        );

        if (dataType != null && !"text".equalsIgnoreCase(dataType)) {
            jdbcTemplate.execute("ALTER TABLE " + tableName + " ALTER COLUMN image_url TYPE TEXT");
            log.info("Đã nâng cột {}.image_url sang TEXT", tableName);
        }
    }
}
