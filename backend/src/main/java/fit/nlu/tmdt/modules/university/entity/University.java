package fit.nlu.tmdt.modules.university.entity;

import fit.nlu.tmdt.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * University Entity
 * Lưu thông tin các trường đại học tại Việt Nam để phục vụ tìm kiếm phòng trọ xung quanh
 */
@Entity
@Table(name = "universities", indexes = {
        @Index(name = "idx_uni_province", columnList = "province"),
        @Index(name = "idx_uni_location", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 50)
    private String abbreviation; // Viết tắt (VD: NLU, HUST, UEH)

    @Column(length = 500)
    private String address;

    @Column(length = 100)
    private String province;

    @Column(length = 100)
    private String district;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String website;

    @Column(length = 500)
    private String logoUrl;

    @Column(name = "email_domain", length = 100)
    private String emailDomain;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
