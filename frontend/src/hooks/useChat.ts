import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import chatWebSocket, {
  type WebSocketMessage,
  type MessageType,
} from '../services/chatWebSocket';
import messageService, {
  type ConversationResponse,
  type MessageResponse,
} from '../services/messageService';

export interface OnlineUsers {
  [userId: number]: boolean;
}

export interface TypingUsers {
  [conversationId: number]: {
    userId: number;
    userName: string;
  } | null;
}

export interface ChatState {
  conversations: ConversationResponse[];
  messages: { [conversationId: number]: MessageResponse[] };
  activeConversation: ConversationResponse | null;
  onlineUsers: OnlineUsers;
  typingUsers: TypingUsers;
  wsConnected: boolean;
  loading: boolean;
}

export function useChat() {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<ChatState>({
    conversations: [],
    messages: {},
    activeConversation: null,
    onlineUsers: {},
    typingUsers: {},
    wsConnected: false,
    loading: false,
  });

  const typingTimeoutRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const currentUserId = user?.id;

  // ─── WebSocket Connection ────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !user) {
      chatWebSocket.disconnect();
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    chatWebSocket.connect(token);

    const unsubConnection = chatWebSocket.onConnectionChange((connected) => {
      setState((prev) => ({ ...prev, wsConnected: connected }));
    });

    const unsubMessage = chatWebSocket.onMessage((msg: WebSocketMessage) => {
      handleIncomingMessage(msg);
    });

    return () => {
      unsubConnection();
      unsubMessage();
      chatWebSocket.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  // ─── Subscribe to active conversation ────────────────────────────────────
  useEffect(() => {
    const conv = state.activeConversation;
    if (!conv) return;

    chatWebSocket.subscribeConversation(conv.id);

    return () => {
      chatWebSocket.unsubscribeConversation(conv.id);
    };
  }, [state.activeConversation?.id]);

  // ─── Fetch Conversations ────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await messageService.getConversations();
      setState((prev) => ({
        ...prev,
        conversations: data,
        loading: false,
      }));
    } catch (err) {
      console.error('[useChat] Failed to fetch conversations:', err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // ─── Fetch Messages ──────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (conversationId: number, otherUserId: number) => {
    try {
      const data = await messageService.getMessages(otherUserId, 0, 100);
      setState((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: data.reverse(),
        },
      }));
      // Mark as read
      messageService.markAsRead(conversationId).catch(console.error);
      // Send read receipt via WS
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv && currentUserId) {
        const msgs = data;
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg) {
          chatWebSocket.sendReadReceipt(conversationId, lastMsg.senderId, lastMsg.id);
        }
      }
    } catch (err) {
      console.error('[useChat] Failed to fetch messages:', err);
    }
  }, [state.conversations, currentUserId]);

  // ─── Set Active Conversation ─────────────────────────────────────────────
  const setActiveConversation = useCallback(async (conv: ConversationResponse | null) => {
    setState((prev) => ({ ...prev, activeConversation: conv }));
    if (conv) {
      // Ensure messages are loaded
      setState((prev) => {
        if (!prev.messages[conv.id]) {
          fetchMessages(conv.id, conv.otherUserId);
        }
        return prev;
      });
    }
  }, [fetchMessages]);

  // ─── Send Message ───────────────────────────────────────────────────────
  const sendMessage = useCallback(async (conversationId: number, receiverId: number, content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      const newMsg = await messageService.sendMessage({
        receiverId,
        content: trimmed,
      });

      setState((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: [...(prev.messages[conversationId] || []), newMsg],
        },
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? ({
              ...c,
              lastMessage: newMsg,
              lastMessageAt: newMsg.createdAt
            } as ConversationResponse)
            : c
        ),
      }));

      chatWebSocket.sendMessage(conversationId, receiverId, trimmed);
    } catch (err) {
      console.error('[useChat] Failed to send message:', err);
    }
  }, []);

  // ─── Send Typing Indicator ──────────────────────────────────────────────
  const sendTyping = useCallback(
    (conversationId: number, receiverId: number, isTyping: boolean) => {
      chatWebSocket.sendTyping(conversationId, receiverId, isTyping);

      const key = `${conversationId}`;
      if (typingTimeoutRef.current[key]) {
        clearTimeout(typingTimeoutRef.current[key]);
      }

      if (isTyping) {
        typingTimeoutRef.current[key] = setTimeout(() => {
          chatWebSocket.sendTyping(conversationId, receiverId, false);
        }, 5000);
      }
    },
    []
  );

  // ─── Handle Incoming WebSocket Messages ─────────────────────────────────
  const handleIncomingMessage = useCallback((msg: WebSocketMessage) => {
    if (!currentUserId) return;

    switch (msg.type) {
      case 'CHAT': {
        const conversationId = msg.conversationId!;
        const isCurrentUser = msg.senderId === currentUserId;

        const newMsg: MessageResponse = {
          id: msg.messageId!,
          conversationId,
          senderId: msg.senderId!,
          senderName: msg.senderName || '',
          senderAvatar: msg.senderAvatar ?? null,
          content: msg.content || '',
          type: 'TEXT',
          createdAt: msg.timestamp || new Date().toISOString(),
          isRead: isCurrentUser || msg.isRead === true,
        };

        setState((prev) => {
          const existing = prev.messages[conversationId] || [];
          const alreadyExists = existing.some((m) => m.id === newMsg.id);

          return {
            ...prev,
            messages: {
              ...prev.messages,
              [conversationId]: alreadyExists
                ? existing
                : [...existing, newMsg],
            },
            conversations: prev.conversations.map((c) =>
              c.id === conversationId
                ? ({
                  ...c,
                  lastMessage: newMsg,
                  lastMessageAt: msg.timestamp || new Date().toISOString(),
                  unreadCount: c.unreadCount + (isCurrentUser ? 0 : 1),
                } as ConversationResponse)
                : c
            ),
            activeConversation:
              prev.activeConversation?.id === conversationId
                ? ({
                  ...prev.activeConversation,
                  lastMessageAt: msg.timestamp || new Date().toISOString(),
                } as ConversationResponse)
                : prev.activeConversation,
          };
        });

        // Auto-mark as read if currently viewing
        if (!isCurrentUser) {
          setState((prev) => {
            if (prev.activeConversation?.id === conversationId) {
              messageService.markAsRead(conversationId).catch(console.error);
              chatWebSocket.sendReadReceipt(
                conversationId,
                msg.senderId!,
                msg.messageId!
              );
            }
            return prev;
          });
        }
        break;
      }

      case 'TYPING': {
        const conversationId = msg.conversationId!;
        const isFromOther = msg.senderId !== currentUserId;

        if (isFromOther) {
          setState((prev) => ({
            ...prev,
            typingUsers: {
              ...prev.typingUsers,
              [conversationId]: {
                userId: msg.senderId!,
                userName: msg.senderName || '',
              },
            },
          }));

          // Auto-clear after 4 seconds
          const key = `typing-${conversationId}`;
          if (typingTimeoutRef.current[key]) {
            clearTimeout(typingTimeoutRef.current[key]);
          }
          typingTimeoutRef.current[key] = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              typingUsers: { ...prev.typingUsers, [conversationId]: null },
            }));
          }, 4000);
        }
        break;
      }

      case 'READ': {
        const conversationId = msg.conversationId!;
        const readerId = msg.senderId!;

        setState((prev) => ({
          ...prev,
          messages: {
            ...prev.messages,
            [conversationId]: (prev.messages[conversationId] || []).map((m) =>
              m.senderId === readerId ? { ...m, isRead: true } : m
            ),
          },
        }));
        break;
      }

      case 'ONLINE':
      case 'OFFLINE': {
        const userId = msg.senderId!;
        setState((prev) => ({
          ...prev,
          onlineUsers: {
            ...prev.onlineUsers,
            [userId]: msg.type === 'ONLINE',
          },
        }));
        break;
      }

      default:
        break;
    }
  }, [currentUserId]);

  // ─── Initial fetch ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);

  // Cleanup typing timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  return {
    ...state,
    fetchConversations,
    fetchMessages,
    setActiveConversation,
    sendMessage,
    sendTyping,
  };
}
