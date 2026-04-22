package fit.nlu.tmdt.config.websocket;

import fit.nlu.tmdt.modules.message.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.security.Principal;

/**
 * WebSocket Event Listener
 * Lắng nghe các sự kiện kết nối/ngắt kết nối WebSocket
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final ChatService chatService;

    /**
     * Khi client kết nối thành công
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        
        if (principal != null) {
            Long userId = Long.parseLong(principal.getName());
            log.info("WebSocket connected: userId={}, sessionId={}", userId, headerAccessor.getSessionId());
            
            // Cập nhật trạng thái online
            chatService.updateUserOnlineStatus(userId, true);
        }
    }

    /**
     * Khi client bắt đầu kết nối (trước khi authentication)
     * Chỉ log, không làm gì vì authentication đã được xử lý bởi interceptor
     */
    @EventListener
    public void handleWebSocketSessionConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.debug("WebSocket session connecting: sessionId={}", headerAccessor.getSessionId());
    }

    /**
     * Khi client ngắt kết nối
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        
        if (principal != null) {
            Long userId = Long.parseLong(principal.getName());
            log.info("WebSocket disconnected: userId={}, sessionId={}", userId, headerAccessor.getSessionId());
            
            // Cập nhật trạng thái offline
            chatService.updateUserOnlineStatus(userId, false);
        } else {
            log.warn("WebSocket disconnected without user info: sessionId={}", headerAccessor.getSessionId());
        }
    }

    /**
     * Khi client subscribe vào một channel
     */
    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();
        Principal principal = headerAccessor.getUser();
        
        if (principal != null && destination != null) {
            Long userId = Long.parseLong(principal.getName());
            log.debug("WebSocket subscribe: userId={}, destination={}", userId, destination);
        }
    }

    /**
     * Khi client unsubscribe khỏi một channel
     */
    @EventListener
    public void handleUnsubscribeEvent(SessionUnsubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();
        Principal principal = headerAccessor.getUser();
        
        if (principal != null && destination != null) {
            Long userId = Long.parseLong(principal.getName());
            log.debug("WebSocket unsubscribe: userId={}, destination={}", userId, destination);
        }
    }
}
