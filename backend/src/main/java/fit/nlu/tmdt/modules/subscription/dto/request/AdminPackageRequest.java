package fit.nlu.tmdt.modules.subscription.dto.request;

import fit.nlu.tmdt.modules.subscription.entity.enums.PackageType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPackageRequest {
    
    @NotBlank(message = "Package name is required")
    private String name;

    @NotNull(message = "Package type is required")
    private PackageType type;

    private String description;

    @Min(value = 0, message = "Max posts cannot be negative")
    private Integer maxPosts;

    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;

    @Min(value = 0, message = "Boost days cannot be negative")
    private Integer boostDays;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;

    private Double originalPrice;

    @Min(value = 0, message = "Discount cannot be negative")
    private Integer discountPercent;

    private List<String> features;

    private Boolean isActive;
    
    private Integer displayOrder;
    
    private Boolean isFeatured;
}
