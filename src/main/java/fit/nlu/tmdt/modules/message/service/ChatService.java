package fit.nlu.tmdt.modules.message.service;

import fit.nlu.tmdt.modules.message.dto.websocket.ChatMessage;
import fit.nlu.tmdt.modules.message.dto.websocket.OnlineStatus;
import fit.nlu.tmdt.modules.message.dto.websocket.TypingIndicator;

import java.util.Set;

/**
 * Chat Service Interface
 * Service cho xử lý real-time messaging qua WebSocket
 */
public interface ChatService {

    // ==================== MESSAGE HANDLING ====================

    /**
     * Xử lý tin nhắn chat từ WebSocket
     * Lưu vào database và broadcast cho người nhận
     *
     * @param message Tin nhắn từ client
     * @param senderId ID của người gửi
     * @return ChatMessage đã được xử lý với ID
     */
    ChatMessage handleChatMessage(ChatMessage message, Long senderId);

    /**
     * Gửi tin nhắn tới người dùng cụ thể qua WebSocket
     *
     * @param userId ID người nhận
     * @param message Tin nhắn cần gửi
     */
    void sendToUser(Long userId, ChatMessage message);

    /**
     * Broadcast tin nhắn tới tất cả subscribers của một conversation
     *
     * @param conversationId ID cuộc trò chuyện
     * @param message Tin nhắn cần broadcast
     */
    void broadcastToConversation(Long conversationId, ChatMessage message);

    // ==================== TYPING INDICATORS ====================

    /**
     * Xử lý typing indicator
     *
     * @param indicator Typing indicator
     * @param senderId ID người gửi indicator
     */
    void handleTypingIndicator(TypingIndicator indicator, Long senderId);

    /**
     * Gửi typing indicator tới người nhận
     *
     * @param conversationId ID cuộc trò chuyện
     * @param receiverId ID người nhận
     * @param indicator Typing indicator
     */
    void sendTypingToUser(Long conversationId, Long receiverId, TypingIndicator indicator);

    // ==================== READ RECEIPTS ====================

    /**
     * Xử lý read receipt
     *
     * @param conversationId ID cuộc trò chuyện
     * @param messageId ID tin nhắn được đọc
     * @param readerId ID người đọc
     */
    void handleReadReceipt(Long conversationId, Long messageId, Long readerId);

    /**
     * Gửi read receipt tới người gửi tin nhắn
     *
     * @param conversationId ID cuộc trò chuyện
     * @param messageId ID tin nhắn
     * @param senderId ID người gửi (người nhận read receipt)
     * @param readerId ID người đọc
     */
    void sendReadReceipt(Long conversationId, Long messageId, Long senderId, Long readerId);

    // ==================== ONLINE STATUS ====================

    /**
     * Cập nhật trạng thái online của user
     *
     * @param userId ID user
     * @param isOnline true nếu online, false nếu offline
     */
    void updateUserOnlineStatus(Long userId, boolean isOnline);

    /**
     * Lấy danh sách user đang online
     *
     * @return Set các user ID đang online
     */
    Set<Long> getOnlineUsers();

    /**
     * Kiểm tra user có đang online không
     *
     * @param userId ID user
     * @return true nếu online
     */
    boolean isUserOnline(Long userId);

    /**
     * Lấy thông tin online status của một user
     *
     * @param userId ID user
     * @return OnlineStatus
     */
    OnlineStatus getUserOnlineStatus(Long userId);

    /**
     * Thông báo cho contacts khi user online/offline
     *
     * @param userId ID user
     * @param status Trạng thái online
     */
    void notifyContactsAboutStatus(Long userId, OnlineStatus status);
}
