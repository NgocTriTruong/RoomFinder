package fit.nlu.tmdt.config.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Broker Configuration (Additional)
 * Cấu hình bổ sung cho WebSocket message broker
 * 
 * Lưu ý: File này là backup, main config nằm trong WebSocketConfig.java
 * Nếu bạn muốn sử dụng external broker (RabbitMQ), hãy uncomment và cấu hình ở đây
 */
// @Configuration
// @EnableWebSocketMessageBroker
public class WebSocketBrokerConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Application destination prefix - messages from client to app
        config.setApplicationDestinationPrefixes("/app");
        
        // User destination prefix - for user-specific messages
        config.setUserDestinationPrefix("/user");
        
        // Enable simple broker with topic and queue
        // Topic: for broadcast (multiple subscribers)
        // Queue: for point-to-point (single receiver)
        config.enableSimpleBroker("/topic", "/queue");
        
        // Cache size for broker
        config.setCacheLimit(1024);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket endpoint with SockJS fallback
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS()
                .setHeartbeatTime(25000); // 25 seconds heartbeat
        
        // WebSocket endpoint without SockJS (for native WebSocket clients)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }
}
