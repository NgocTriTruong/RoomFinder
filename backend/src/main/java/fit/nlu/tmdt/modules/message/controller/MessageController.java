package fit.nlu.tmdt.modules.message.controller;

import fit.nlu.tmdt.common.annotations.CurrentUser;
import fit.nlu.tmdt.common.annotations.LogExecutionTime;
import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.message.dto.request.SendMessageRequest;
import fit.nlu.tmdt.modules.message.dto.request.SendMediaMessageRequest;
import fit.nlu.tmdt.modules.message.dto.response.ConversationResponse;
import fit.nlu.tmdt.modules.message.dto.response.MessageResponse;
import fit.nlu.tmdt.modules.message.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Message Controller
 */
@RestController
@RequestMapping("/v1/messages")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Message", description = "Messaging APIs")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @Operation(summary = "Send a message")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @CurrentUser Long senderId) {

        log.info("Send message from user: {}", senderId);
        MessageResponse response = messageService.sendMessage(request, senderId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Message sent", response));
    }

    @PostMapping("/media")
    @Operation(summary = "Send a media message", description = "Send message with image, video, audio, or document attachment")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<MessageResponse>> sendMediaMessage(
            @Valid @RequestBody SendMediaMessageRequest request,
            @CurrentUser Long senderId) {

        log.info("Send media message from user: {}", senderId);
        MessageResponse response = messageService.sendMediaMessage(request, senderId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Media message sent", response));
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get all conversations")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations(
            @CurrentUser Long userId) {

        log.info("Get conversations for user: {}", userId);
        List<ConversationResponse> conversations = messageService.getConversations(userId);
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }

    @GetMapping("/conversations/{otherUserId}")
    @Operation(summary = "Get or create conversation with user")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<ConversationResponse>> getOrCreateConversation(
            @PathVariable Long otherUserId,
            @CurrentUser Long userId) {

        log.info("Get/create conversation: user={}, otherUser={}", userId, otherUserId);
        ConversationResponse response = messageService.getOrCreateConversation(userId, otherUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversations/{otherUserId}/messages")
    @Operation(summary = "Get messages with a user")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessages(
            @PathVariable Long otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @CurrentUser Long userId) {

        log.info("Get messages: user={}, otherUser={}, page={}", userId, otherUserId, page);
        List<MessageResponse> messages = messageService.getConversation(userId, otherUserId, page, size);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @PutMapping("/conversations/{conversationId}/read")
    @Operation(summary = "Mark conversation as read")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long conversationId,
            @CurrentUser Long userId) {

        log.info("Mark as read: conversation={}, user={}", conversationId, userId);
        messageService.markAsRead(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread message count")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getUnreadCount(@CurrentUser Long userId) {

        log.info("Get unread count for user: {}", userId);
        int count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
    }

    @PostMapping("/{messageId}/report")
    @Operation(summary = "Report a message")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<Void>> reportMessage(
            @PathVariable Long messageId,
            @RequestBody Map<String, String> body,
            @CurrentUser Long userId) {

        String reason = body.get("reason");
        log.info("Report message: {} by user: {}", messageId, userId);
        messageService.reportMessage(messageId, reason, userId);
        return ResponseEntity.ok(ApiResponse.success("Message reported", null));
    }
}
