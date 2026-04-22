package fit.nlu.tmdt.config;

import fit.nlu.tmdt.config.websocket.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration
 * Cấu hình STOMP over WebSocket cho real-time messaging
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Prefix để gửi message từ client lên server
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefix cho user-specific destinations (subscribe cá nhân)
        config.setUserDestinationPrefix("/user");
        
        // Enable Simple Broker để broadcast messages
        // Topic: /topic - broadcast messages
        // Queue: /queue - point-to-point messages
        config.enableSimpleBroker("/topic", "/queue");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket endpoint - client kết nối tại đây
        // SockJS fallback được enable để hỗ trợ browsers không hỗ trợ WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        
        // Endpoint không có SockJS (cho mobile apps hoặc clients hỗ trợ WebSocket tốt)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Thêm interceptor để xử lý JWT authentication
        registration.interceptors(webSocketAuthInterceptor);
    }
}
