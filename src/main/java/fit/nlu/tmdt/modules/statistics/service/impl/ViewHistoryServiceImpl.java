package fit.nlu.tmdt.modules.statistics.service.impl;

import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.statistics.entity.ViewHistory;
import fit.nlu.tmdt.modules.statistics.repository.ViewHistoryRepository;
import fit.nlu.tmdt.modules.statistics.service.ViewHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * ViewHistory Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ViewHistoryServiceImpl implements ViewHistoryService {

    private final ViewHistoryRepository viewHistoryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void recordView(Post post) {
        if (post == null || post.getLandlord() == null) {
            return;
        }
        
        try {
            ViewHistory viewHistory = getOrCreateToday(post);
            viewHistory.incrementView();
            viewHistoryRepository.save(viewHistory);
            log.debug("Recorded view for post {}", post.getId());
        } catch (Exception e) {
            log.warn("Failed to record view for post {}: {}", post.getId(), e.getMessage());
        }
    }

    @Override
    @Transactional
    public void recordContact(Post post) {
        if (post == null || post.getLandlord() == null) {
            return;
        }
        
        try {
            ViewHistory viewHistory = getOrCreateToday(post);
            viewHistory.incrementContact();
            viewHistoryRepository.save(viewHistory);
            log.debug("Recorded contact for post {}", post.getId());
        } catch (Exception e) {
            log.warn("Failed to record contact for post {}: {}", post.getId(), e.getMessage());
        }
    }

    @Override
    @Transactional
    public ViewHistory getOrCreateToday(Post post) {
        LocalDate today = LocalDate.now();
        User landlord = post.getLandlord();

        Optional<ViewHistory> existing = viewHistoryRepository.findByPostIdAndLandlordIdAndViewDate(
                post.getId(), landlord.getId(), today);

        if (existing.isPresent()) {
            return existing.get();
        }

        ViewHistory viewHistory = ViewHistory.create(landlord, post, today);
        return viewHistoryRepository.save(viewHistory);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ViewHistory> getByLandlordAndDate(Long landlordId, LocalDate date) {
        return viewHistoryRepository.findByLandlordIdAndViewDate(landlordId, date);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> getDailyStats(Long landlordId, LocalDate startDate, LocalDate endDate) {
        return viewHistoryRepository.getDailyStatsByLandlordId(landlordId, startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalViews(Long landlordId, LocalDate startDate, LocalDate endDate) {
        Long total = viewHistoryRepository.sumViewCountByLandlordIdAndDateRange(landlordId, startDate, endDate);
        return total != null ? total : 0L;
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalContacts(Long landlordId, LocalDate startDate, LocalDate endDate) {
        Long total = viewHistoryRepository.sumContactCountByLandlordIdAndDateRange(landlordId, startDate, endDate);
        return total != null ? total : 0L;
    }

    @Override
    @Transactional
    public void deleteOldRecords(int daysToKeep) {
        LocalDate cutoffDate = LocalDate.now().minusDays(daysToKeep);
        int deleted = viewHistoryRepository.deleteOldRecords(cutoffDate);
        log.info("Deleted {} old ViewHistory records older than {}", deleted, cutoffDate);
    }
}
