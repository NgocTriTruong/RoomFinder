package fit.nlu.tmdt.modules.message.controller;

import fit.nlu.tmdt.modules.message.dto.websocket.ChatMessage;
import fit.nlu.tmdt.modules.message.dto.websocket.OnlineStatus;
import fit.nlu.tmdt.modules.message.dto.websocket.TypingIndicator;
import fit.nlu.tmdt.modules.message.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * Chat WebSocket Controller
 * Xử lý các message từ WebSocket client qua STOMP
 * 
 * Client gửi message tới /app/chat.{method}
 * Server sẽ xử lý và broadcast tới các client liên quan
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatService chatService;

    /**
     * Xử lý tin nhắn chat
     * Client gửi: /app/chat.send
     * Server broadcast: /user/{receiverId}/queue/messages
     *                 /topic/conversation/{conversationId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        Long senderId = getCurrentUserId(headerAccessor);
        log.info("WebSocket send message: senderId={}, receiverId={}", senderId, message.getReceiverId());
        
        ChatMessage response = chatService.handleChatMessage(message, senderId);
        log.debug("Message sent: messageId={}", response.getMessageId());
    }

    /**
     * Xử lý typing indicator
     * Client gửi: /app/chat.typing
     * Server broadcast: /topic/conversation/{conversationId}/typing
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingIndicator indicator, SimpMessageHeaderAccessor headerAccessor) {
        Long senderId = getCurrentUserId(headerAccessor);
        log.debug("WebSocket typing: senderId={}, conversationId={}, isTyping={}", 
                senderId, indicator.getConversationId(), indicator.isTyping());
        
        chatService.handleTypingIndicator(indicator, senderId);
    }

    /**
     * Xử lý read receipt
     * Client gửi: /app/chat.read
     * Server gửi tới: /user/{senderId}/queue/messages
     */
    @MessageMapping("/chat.read")
    public void handleReadReceipt(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        Long readerId = getCurrentUserId(headerAccessor);
        log.debug("WebSocket read receipt: readerId={}, conversationId={}, messageId={}", 
                readerId, message.getConversationId(), message.getMessageId());
        
        chatService.handleReadReceipt(message.getConversationId(), message.getMessageId(), readerId);
    }

    /**
     * Gửi tin nhắn tới user cụ thể (để test hoặc notification)
     * Client gửi: /app/chat.private
     * Server gửi tới: /user/{userId}/queue/messages
     */
    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        Long senderId = getCurrentUserId(headerAccessor);
        log.info("WebSocket private message: senderId={}, receiverId={}", senderId, message.getReceiverId());
        
        message.setSenderId(senderId);
        chatService.sendToUser(message.getReceiverId(), message);
    }

    /**
     * Lấy danh sách user đang online
     * Client gửi: /app/chat.online
     * Server trả về: /user/{userId}/queue/online
     */
    @MessageMapping("/chat.online")
    @SendToUser("/queue/online")
    public OnlineStatus getOnlineStatus(SimpMessageHeaderAccessor headerAccessor) {
        Long userId = getCurrentUserId(headerAccessor);
        log.debug("Get online status: userId={}", userId);
        
        return chatService.getUserOnlineStatus(userId);
    }

    /**
     * Lấy thông báo khi có user online/offline
     * Client subscribe: /topic/user/{userId}/status
     */
    @MessageMapping("/chat.status")
    public void updateStatus(SimpMessageHeaderAccessor headerAccessor) {
        Long userId = getCurrentUserId(headerAccessor);
        log.debug("User status update: userId={}", userId);
        
        chatService.updateUserOnlineStatus(userId, true);
    }

    /**
     * Lấy current user ID từ Principal
     */
    private Long getCurrentUserId(SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        if (principal != null) {
            return Long.parseLong(principal.getName());
        }
        throw new IllegalStateException("No authenticated user found");
    }
}
