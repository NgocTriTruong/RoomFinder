package fit.nlu.tmdt.config.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket Session Manager
 * Quản lý sessions và tracking user connections
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketSessionManager {

    // Map: userId -> Set of sessionIds (user có thể có nhiều connections)
    private final Map<Long, Map<String, Boolean>> userSessions = new ConcurrentHashMap<>();
    
    // Map: sessionId -> userId (để tra cứu nhanh)
    private final Map<String, Long> sessionUsers = new ConcurrentHashMap<>();

    /**
     * Thêm session cho user
     */
    public void addSession(Long userId, String sessionId) {
        userSessions.computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
                    .put(sessionId, true);
        sessionUsers.put(sessionId, userId);
        log.info("Session added: userId={}, sessionId={}, totalSessions={}", 
                userId, sessionId, getUserSessionCount(userId));
    }

    /**
     * Xóa session của user
     */
    public void removeSession(String sessionId) {
        Long userId = sessionUsers.remove(sessionId);
        if (userId != null) {
            Map<String, Boolean> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(sessionId);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                }
            }
            log.info("Session removed: userId={}, sessionId={}, remainingSessions={}", 
                    userId, sessionId, getUserSessionCount(userId));
        }
    }

    /**
     * Lấy số lượng sessions của user
     */
    public int getUserSessionCount(Long userId) {
        Map<String, Boolean> sessions = userSessions.get(userId);
        return sessions != null ? sessions.size() : 0;
    }

    /**
     * Kiểm tra user có session nào không
     */
    public boolean hasUserSession(Long userId) {
        return getUserSessionCount(userId) > 0;
    }

    /**
     * Lấy tất cả user IDs đang online
     */
    public java.util.Set<Long> getOnlineUsers() {
        return userSessions.keySet();
    }

    /**
     * Lấy user ID từ session ID
     */
    public Long getUserIdBySession(String sessionId) {
        return sessionUsers.get(sessionId);
    }

    /**
     * Handle connected event
     */
    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        String sessionId = headerAccessor.getSessionId();
        
        if (principal != null) {
            Long userId = Long.parseLong(principal.getName());
            addSession(userId, sessionId);
        }
    }

    /**
     * Handle disconnect event
     */
    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        if (sessionId != null) {
            removeSession(sessionId);
        }
    }
}
