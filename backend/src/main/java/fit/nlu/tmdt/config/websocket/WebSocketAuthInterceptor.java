package fit.nlu.tmdt.config.websocket;

import fit.nlu.tmdt.config.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * WebSocket Authentication Interceptor
 * Xác thực JWT token khi client kết nối WebSocket
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final WebSocketSessionManager sessionManager;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Lấy Authorization header
            String authHeader = accessor.getFirstNativeHeader(AUTHORIZATION_HEADER);
            
            if (authHeader == null) {
                log.warn("WebSocket connection rejected: No Authorization header");
                throw new SecurityException("Authorization header is required");
            }

            // Extract token từ "Bearer <token>"
            String token = extractToken(authHeader);
            if (token == null) {
                log.warn("WebSocket connection rejected: Invalid Authorization header format");
                throw new SecurityException("Invalid Authorization header format");
            }

            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                log.warn("WebSocket connection rejected: Invalid JWT token");
                throw new SecurityException("Invalid JWT token");
            }

            // Extract user info từ token
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            String email = jwtTokenProvider.getEmailFromToken(token);
            String role = jwtTokenProvider.getRoleFromToken(token);

            // Set authentication vào accessor để Spring Security context được thiết lập
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);

            accessor.setUser(authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Thêm session vào session manager
            String sessionId = accessor.getSessionId();
            if (sessionId != null) {
                sessionManager.addSession(userId, sessionId);
            }

            log.info("WebSocket authenticated: userId={}, email={}, role={}", userId, email, role);
        } else if (accessor != null && StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            // Xử lý disconnect
            String sessionId = accessor.getSessionId();
            if (sessionId != null) {
                sessionManager.removeSession(sessionId);
            }
        }

        return message;
    }

    /**
     * Extract token từ Authorization header
     */
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}
