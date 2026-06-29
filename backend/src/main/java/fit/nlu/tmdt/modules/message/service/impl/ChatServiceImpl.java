package fit.nlu.tmdt.modules.message.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.message.dto.websocket.ChatMessage;
import fit.nlu.tmdt.modules.message.dto.websocket.OnlineStatus;
import fit.nlu.tmdt.modules.message.dto.websocket.TypingIndicator;
import fit.nlu.tmdt.modules.message.entity.Conversation;
import fit.nlu.tmdt.modules.message.entity.Message;
import fit.nlu.tmdt.modules.message.entity.enums.MessageType;
import fit.nlu.tmdt.modules.message.repository.ConversationRepository;
import fit.nlu.tmdt.modules.message.repository.MessageRepository;
import fit.nlu.tmdt.modules.message.service.ChatService;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Chat Service Implementation
 * Xử lý real-time messaging qua WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    // Lưu trữ user đang online (in-memory, có thể thay bằng Redis)
    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();
    
    // Cache user info để tránh query nhiều lần
    private final Map<Long, User> userCache = new ConcurrentHashMap<>();
    
    // Typing users cache: conversationId -> userId đang typing
    private final Map<Long, Long> typingUsers = new ConcurrentHashMap<>();

    // ==================== MESSAGE HANDLING ====================

    @Override
    @Transactional
    public ChatMessage handleChatMessage(ChatMessage message, Long senderId) {
        log.info("Handling chat message: senderId={}, receiverId={}", senderId, message.getReceiverId());

        // Validate sender
        User sender = getUser(senderId);
        User receiver = getUser(message.getReceiverId());

        // Get or create conversation
        Conversation conversation = getOrCreateConversation(senderId, message.getReceiverId(), message.getPostId());

        // Create and save message
        Message msg = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .receiver(receiver)
                .content(message.getContent())
                .mediaUrl(message.getAttachmentUrl())
                .type(MessageType.TEXT)
                .isRead(false)
                .build();

        msg = messageRepository.save(msg);

        // Update conversation
        String preview = message.getContent();
        if (preview != null && preview.length() > 100) {
            preview = preview.substring(0, 100) + "...";
        }
        conversation.updateLastMessage(preview, MessageType.TEXT);
        conversation.incrementUnreadForUser(message.getReceiverId());
        conversationRepository.save(conversation);

        // Build response message
        ChatMessage response = ChatMessage.builder()
                .type(ChatMessage.MessageType.CHAT)
                .conversationId(conversation.getId())
                .messageId(msg.getId())
                .senderId(senderId)
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .attachmentUrl(message.getAttachmentUrl())
                .postId(message.getPostId())
                .senderName(sender.getFullName())
                .senderAvatar(sender.getAvatarUrl())
                .timestamp(msg.getCreatedAt())
                .isRead(false)
                .isDelivered(true)
                .build();

        // Gửi cho người nhận (user-specific destination)
        sendToUser(message.getReceiverId(), response);

        // Gửi cho người gửi để đồng bộ (user-specific destination)
        sendToUser(senderId, response);

        return response;
    }

    @Override
    public void sendToUser(Long userId, ChatMessage message) {
        // Gửi tới user-specific destination: /user/{userId}/queue/messages
        if (message.getSenderId() != null && (message.getSenderName() == null || message.getSenderName().isEmpty())) {
            try {
                User sender = getUser(message.getSenderId());
                message.setSenderName(sender.getFullName());
                message.setSenderAvatar(sender.getAvatarUrl());
            } catch (Exception e) {
                log.warn("Failed to populate sender info for private message: {}", e.getMessage());
            }
        }
        String destination = "/queue/messages";
        messagingTemplate.convertAndSendToUser(userId.toString(), destination, message);
        log.debug("Sent message to user {}: messageId={}", userId, message.getMessageId());
    }

    @Override
    public void broadcastToConversation(Long conversationId, ChatMessage message) {
        // Broadcast tới tất cả subscribers của conversation: /topic/conversation/{id}
        String destination = "/topic/conversation/" + conversationId;
        messagingTemplate.convertAndSend(destination, message);
        log.debug("Broadcast message to conversation {}: messageId={}", conversationId, message.getMessageId());
    }

    // ==================== TYPING INDICATORS ====================

    @Override
    public void handleTypingIndicator(TypingIndicator indicator, Long senderId) {
        Long conversationId = indicator.getConversationId();
        Long receiverId = indicator.getReceiverId();

        if (indicator.isTyping()) {
            typingUsers.put(conversationId, senderId);
            // Auto-clear typing status sau 5 giây
            scheduleTypingClear(conversationId, senderId);
        } else {
            typingUsers.remove(conversationId);
        }

        sendTypingToUser(conversationId, receiverId, indicator);
    }

    @Override
    public void sendTypingToUser(Long conversationId, Long receiverId, TypingIndicator indicator) {
        String destination = "/topic/conversation/" + conversationId;
        messagingTemplate.convertAndSend(destination, indicator);
    }

    private void scheduleTypingClear(Long conversationId, Long senderId) {
        // Sử dụng Thread để clear typing status sau 5 giây
        Thread.ofVirtual().start(() -> {
            try {
                Thread.sleep(5000);
                if (typingUsers.get(conversationId) != null && typingUsers.get(conversationId).equals(senderId)) {
                    typingUsers.remove(conversationId);
                    TypingIndicator stopTyping = TypingIndicator.stopTyping(conversationId, senderId);
                    sendTypingToUser(conversationId, null, stopTyping);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }

    // ==================== READ RECEIPTS ====================

    @Override
    @Transactional
    public void handleReadReceipt(Long conversationId, Long messageId, Long readerId) {
        log.info("Handling read receipt: conversationId={}, messageId={}, readerId={}", 
                conversationId, messageId, readerId);

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MSG_001, "Conversation not found"));

        if (!conversation.hasParticipant(readerId)) {
            throw new BusinessException(ErrorCode.MSG_002, "Not authorized");
        }

        // Update message as read
        messageRepository.findById(messageId).ifPresent(message -> {
            message.markAsRead(readerId);
            messageRepository.save(message);
        });

        // Reset unread count
        conversation.resetUnreadForUser(readerId);
        conversationRepository.save(conversation);

        // Get message to find sender
        messageRepository.findById(messageId).ifPresent(message -> {
            ChatMessage readReceipt = ChatMessage.readReceipt(conversationId, messageId, readerId);
            sendToUser(message.getSender().getId(), readReceipt);
        });
    }

    @Override
    public void sendReadReceipt(Long conversationId, Long messageId, Long senderId, Long readerId) {
        ChatMessage readReceipt = ChatMessage.readReceipt(conversationId, messageId, readerId);
        sendToUser(senderId, readReceipt);
    }

    // ==================== ONLINE STATUS ====================

    @Override
    public void updateUserOnlineStatus(Long userId, boolean isOnline) {
        if (isOnline) {
            onlineUsers.add(userId);
            log.info("User {} is now ONLINE", userId);
        } else {
            onlineUsers.remove(userId);
            log.info("User {} is now OFFLINE", userId);
        }

        // Get user info
        User user = getUser(userId);
        int unreadCount = conversationRepository.findByUserId(userId).stream()
                .mapToInt(c -> c.getUnreadCountForUser(userId))
                .sum();

        // Create status
        OnlineStatus status;
        if (isOnline) {
            status = OnlineStatus.online(userId, user.getFullName(), user.getAvatarUrl(), unreadCount);
        } else {
            String lastSeen = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            status = OnlineStatus.offline(userId, user.getFullName(), user.getAvatarUrl(), lastSeen, unreadCount);
        }

        // Notify all contacts
        notifyContactsAboutStatus(userId, status);
    }

    @Override
    public Set<Long> getOnlineUsers() {
        return Set.copyOf(onlineUsers);
    }

    @Override
    public boolean isUserOnline(Long userId) {
        return onlineUsers.contains(userId);
    }

    @Override
    public OnlineStatus getUserOnlineStatus(Long userId) {
        User user = getUser(userId);
        boolean isOnline = onlineUsers.contains(userId);
        int unreadCount = conversationRepository.findByUserId(userId).stream()
                .mapToInt(c -> c.getUnreadCountForUser(userId))
                .sum();

        if (isOnline) {
            return OnlineStatus.online(userId, user.getFullName(), user.getAvatarUrl(), unreadCount);
        } else {
            String lastSeen = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            return OnlineStatus.offline(userId, user.getFullName(), user.getAvatarUrl(), lastSeen, unreadCount);
        }
    }

    @Override
    public void notifyContactsAboutStatus(Long userId, OnlineStatus status) {
        // Broadcast tới tất cả conversations của user
        conversationRepository.findByUserId(userId).forEach(conversation -> {
            Long otherUserId = conversation.getOtherParticipant(userId).getId();
            String destination = "/topic/user/" + otherUserId + "/status";
            messagingTemplate.convertAndSend(destination, status);
        });
    }

    // ==================== HELPER METHODS ====================

    private User getUser(Long userId) {
        return userCache.computeIfAbsent(userId, id -> 
            userRepository.findByIdAndDeletedAtIsNull(id)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"))
        );
    }

    private Conversation getOrCreateConversation(Long userId1, Long userId2, Long postId) {
        return conversationRepository.findByTwoUsers(userId1, userId2)
                .orElseGet(() -> {
                    User u1 = getUser(userId1);
                    User u2 = getUser(userId2);

                    Conversation newConversation = Conversation.builder()
                            .user1(u1)
                            .user2(u2)
                            .postId(postId)
                            .lastMessageAt(LocalDateTime.now())
                            .unreadCountUser1(0)
                            .unreadCountUser2(0)
                            .build();

                    return conversationRepository.save(newConversation);
                });
    }

    // Scheduled task để clean expired cache (chạy mỗi 30 phút)
    @Scheduled(fixedRate = 1800000)
    public void cleanExpiredCache() {
        userCache.clear();
        log.debug("Cleaned user cache");
    }
}
