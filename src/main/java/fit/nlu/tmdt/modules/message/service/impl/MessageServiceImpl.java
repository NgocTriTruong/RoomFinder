package fit.nlu.tmdt.modules.message.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.message.dto.request.SendMessageRequest;
import fit.nlu.tmdt.modules.message.dto.response.ConversationResponse;
import fit.nlu.tmdt.modules.message.dto.response.MessageResponse;
import fit.nlu.tmdt.modules.message.entity.Conversation;
import fit.nlu.tmdt.modules.message.entity.Message;
import fit.nlu.tmdt.modules.message.entity.enums.MessageType;
import fit.nlu.tmdt.modules.message.repository.ConversationRepository;
import fit.nlu.tmdt.modules.message.repository.MessageRepository;
import fit.nlu.tmdt.modules.message.service.MessageService;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Message Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, Long senderId) {
        log.info("Send message from user: {} to user: {}", senderId, request.getReceiverId());

        User sender = userRepository.findByIdAndDeletedAtIsNull(senderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "Sender not found"));

        User receiver = userRepository.findByIdAndDeletedAtIsNull(request.getReceiverId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "Receiver not found"));

        Conversation conversation = getOrCreateConversationEntity(senderId, request.getReceiverId(), request.getPostId());

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .mediaUrl(request.getAttachmentUrl())
                .type(MessageType.TEXT)
                .isRead(false)
                .build();

        if (request.getPostId() != null) {
            Post post = postRepository.findByIdActive(request.getPostId()).orElse(null);
            if (post != null) {
                message.setMediaUrl(request.getAttachmentUrl());
            }
        }

        message = messageRepository.save(message);

        conversation.updateLastMessage(
                request.getContent().length() > 100 
                    ? request.getContent().substring(0, 100) + "..." 
                    : request.getContent(),
                MessageType.TEXT
        );
        conversation.incrementUnreadForUser(request.getReceiverId());
        conversationRepository.save(conversation);

        return toMessageResponse(message);
    }

    @Override
    public List<MessageResponse> getConversation(Long userId, Long otherUserId, int page, int size) {
        Conversation conversation = conversationRepository.findByTwoUsers(userId, otherUserId)
                .orElseThrow(() -> new BusinessException("MSG_001", "Conversation not found"));

        if (!conversation.hasParticipant(userId)) {
            throw new BusinessException("MSG_002", "Not authorized to access this conversation");
        }

        return messageRepository.findByConversationId(
                conversation.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        ).getContent().stream()
                .filter(m -> !m.isDeletedFor(userId))
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConversationResponse> getConversations(Long userId) {
        return conversationRepository.findByUserId(userId).stream()
                .filter(c -> !c.isHiddenForUser(userId))
                .map(c -> toConversationResponse(c, userId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationResponse getOrCreateConversation(Long userId, Long otherUserId) {
        Conversation conversation = getOrCreateConversationEntity(userId, otherUserId, null);
        return toConversationResponse(conversation);
    }

    @Override
    @Transactional
    public void markAsRead(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new BusinessException("MSG_001", "Conversation not found"));

        if (!conversation.hasParticipant(userId)) {
            throw new BusinessException("MSG_002", "Not authorized");
        }

        conversation.resetUnreadForUser(userId);
        conversationRepository.save(conversation);
    }

    @Override
    public int getUnreadCount(Long userId) {
        return conversationRepository.findByUserId(userId).stream()
                .mapToInt(c -> c.getUnreadCountForUser(userId))
                .sum();
    }

    @Override
    @Transactional
    public void reportMessage(Long messageId, String reason, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new BusinessException("MSG message not found"));

        log.info("Message reported: {} by user: {}, reason: {}", messageId, userId, reason);
    }

    private Conversation getOrCreateConversationEntity(Long userId1, Long userId2, Long postId) {
        return conversationRepository.findByTwoUsers(userId1, userId2)
                .orElseGet(() -> {
                    User u1 = userRepository.findByIdAndDeletedAtIsNull(userId1)
                            .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));
                    User u2 = userRepository.findByIdAndDeletedAtIsNull(userId2)
                            .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

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

    private MessageResponse toMessageResponse(Message message) {
        Post post = null;
        if (message.getConversation().getPostId() != null) {
            post = postRepository.findById(message.getConversation().getPostId()).orElse(null);
        }

        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .senderAvatar(message.getSender().getAvatarUrl())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFullName())
                .receiverAvatar(message.getReceiver().getAvatarUrl())
                .content(message.getContent())
                .attachmentUrl(message.getMediaUrl())
                .postId(message.getConversation().getPostId())
                .postTitle(post != null ? post.getTitle() : null)
                .isRead(message.getIsRead())
                .readAt(message.getReadAt())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private ConversationResponse toConversationResponse(Conversation conversation) {
        return toConversationResponse(conversation, null);
    }

    private ConversationResponse toConversationResponse(Conversation conversation, Long currentUserId) {
        User otherUser = conversation.getUser1();
        if (currentUserId != null && otherUser != null && otherUser.getId().equals(currentUserId)) {
            otherUser = conversation.getUser2();
        }

        Post post = null;
        if (conversation.getPostId() != null) {
            post = postRepository.findById(conversation.getPostId()).orElse(null);
        }

        String thumbnail = post != null && post.getRoom() != null ? post.getRoom().getThumbnailUrl() : null;

        return ConversationResponse.builder()
                .id(conversation.getId())
                .otherUserId(otherUser != null ? otherUser.getId() : null)
                .otherUserName(otherUser != null ? otherUser.getFullName() : null)
                .otherUserAvatar(otherUser != null ? otherUser.getAvatarUrl() : null)
                .otherUserPhone(otherUser != null ? otherUser.getPhone() : null)
                .postId(conversation.getPostId())
                .postTitle(post != null ? post.getTitle() : null)
                .postThumbnail(thumbnail)
                .lastMessage(null)
                .unreadCount(conversation.getUnreadCountForUser(currentUserId))
                .createdAt(conversation.getCreatedAt())
                .lastMessageAt(conversation.getLastMessageAt())
                .build();
    }
}
