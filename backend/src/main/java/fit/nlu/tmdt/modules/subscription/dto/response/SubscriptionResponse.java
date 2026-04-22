package fit.nlu.tmdt.modules.subscription.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Subscription Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {

    private Long id;
    private Long packageId;
    private String packageName;
    private String packageType;

    // Posts quota
    private Integer maxPosts;
    private Integer remainingPosts;
    private Integer usedPosts;

    // Duration
    private LocalDateTime startDate;
    private LocalDateTime expiresAt;
    private Integer remainingDays;

    // Status
    private Boolean isActive;
    private Boolean isExpired;
    private Boolean isExpiringSoon;

    // Auto-renew
    private Boolean autoRenew;
    private LocalDateTime nextBillingDate;

    // Cancellation
    private LocalDateTime cancelledAt;
    private String cancellationReason;

    // Timestamps
    private LocalDateTime createdAt;

    // Features from package
    private List<String> features;
}
