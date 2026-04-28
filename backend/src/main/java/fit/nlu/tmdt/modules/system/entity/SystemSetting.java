package fit.nlu.tmdt.modules.system.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

/**
 * System Setting Entity
 * Lưu trữ các cấu hình hệ thống dưới dạng Key-Value
 */
@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSetting extends BaseEntity {

    @Column(name = "setting_key", unique = true, nullable = false, length = 100)
    private String key;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String value;

    @Column(name = "group_name", length = 50)
    private String group;

    @Column(length = 255)
    private String description;

    @Column(name = "field_type", length = 20)
    @Builder.Default
    private String type = "text"; // text, number, checkbox, email
}
