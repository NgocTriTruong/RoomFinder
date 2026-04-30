package fit.nlu.tmdt.modules.post.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LandlordDashboardStats {
    private long totalPosts;
    private long activePosts;
    private long totalViews;
    private long totalBookings;
    private long pendingBookings;
    @JsonProperty("totalContacts")
    private long totalContacts;
    @JsonProperty("totalServiceCost")
    private double totalServiceCost;
    private double conversionRate;
    private String debugInfo;
    private List<PostSummary> topPosts;
    private List<DailyActivity> recentActivity;

    @Data
    @Builder
    public static class PostSummary {
        private Long id;
        private String title;
        private long views;
        private long bookings;
        private long contacts;
    }

    @Data
    @Builder
    public static class DailyActivity {
        private String date;
        private long views;
        private long contacts;
        @JsonProperty("serviceCost")
        private double serviceCost;
    }
}
