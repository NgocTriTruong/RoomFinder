package fit.nlu.tmdt.modules.post.dto.response;

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
    private List<DailyActivity> recentActivity;

    @Data
    @Builder
    public static class DailyActivity {
        private String date;
        private long views;
        private long contacts;
    }
}
