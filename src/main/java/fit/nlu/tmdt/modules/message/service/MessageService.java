package fit.nlu.tmdt.modules.message.service;

import fit.nlu.tmdt.modules.message.dto.request.SendMessageRequest;
import fit.nlu.tmdt.modules.message.dto.response.ConversationResponse;
import fit.nlu.tmdt.modules.message.dto.response.MessageResponse;

import java.util.List;

/**
 * Message Service Interface
 */
public interface MessageService {

    MessageResponse sendMessage(SendMessageRequest request, Long senderId);

    List<MessageResponse> getConversation(Long userId, Long otherUserId, int page, int size);

    List<ConversationResponse> getConversations(Long userId);

    ConversationResponse getOrCreateConversation(Long userId, Long otherUserId);

    void markAsRead(Long conversationId, Long userId);

    int getUnreadCount(Long userId);

    void reportMessage(Long messageId, String reason, Long userId);
}
