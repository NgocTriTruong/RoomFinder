package fit.nlu.tmdt.common.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Backfill version = 0 cho dữ liệu cũ.
 * Hibernate @Version sẽ nổ nếu gặp bản ghi legacy có version NULL khi thực hiện update.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LegacyVersionBackfill {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void backfillNullVersions() {
        List<String> tables = jdbcTemplate.queryForList(
                """
                select table_name
                from information_schema.columns
                where table_schema = current_schema()
                  and column_name = 'version'
                group by table_name
                order by table_name
                """,
                String.class
        );

        for (String table : tables) {
            try {
                int updated = jdbcTemplate.update("UPDATE " + table + " SET version = 0 WHERE version IS NULL");
                if (updated > 0) {
                    log.info("Đã backfill version=0 cho {} dòng trong bảng {}", updated, table);
                }
            } catch (Exception ex) {
                log.warn("Không thể backfill version cho bảng {}: {}", table, ex.getMessage());
            }
        }
    }
}
