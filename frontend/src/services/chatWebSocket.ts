import SockJS from 'sockjs-client';
import { Client, IMessage, IStompSocket } from '@stomp/stompjs';

const getWsUrl = () => {
  const envUrl = import.meta.env.VITE_WS_URL;
  if (envUrl) {
    return envUrl;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    if (window.location.port) {
      return `${protocol}//${window.location.hostname}:8080/ws`;
    }
    return `${protocol}//${window.location.host}/ws`;
  }
  return 'http://localhost:8080/ws';
};

const WS_BASE_URL = getWsUrl();

export type MessageType = 'CHAT' | 'TYPING' | 'READ' | 'ONLINE' | 'OFFLINE' | 'DELIVERED' | 'ERROR';

export interface WebSocketMessage {
  type: MessageType;
  conversationId?: number;
  senderId?: number;
  receiverId?: number;
  messageId?: number;
  content?: string;
  senderName?: string;
  senderAvatar?: string | null;
  receiverName?: string;
  receiverAvatar?: string | null;
  timestamp?: string;
  readAt?: string;
  isRead?: boolean;
  isDelivered?: boolean;
  isTyping?: boolean;
  errorCode?: string;
  errorMessage?: string;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (connected: boolean) => void;

class ChatWebSocketService {
  private client: Client | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers = new Set<MessageHandler>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private subscribedChannels = new Set<string>();
  private userQueueSubscribed = false;

  connect(token: string) {
    if (this.client?.connected) {
      return;
    }

    const socket = SockJS(WS_BASE_URL, undefined, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
    }) as IStompSocket;

    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 25000,
      heartbeatOutgoing: 25000,
      onConnect: () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        this.subscribeUserQueue();
        this.restoreChannels();
        console.log('[WS] Connected to WebSocket');
      },
      onDisconnect: () => {
        this.connected = false;
        this.userQueueSubscribed = false;
        this.notifyConnectionHandlers(false);
        console.log('[WS] Disconnected from WebSocket');
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('[WS] WebSocket error:', event);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.subscribedChannels.clear();
      this.userQueueSubscribed = false;
    }
  }

  private subscribeUserQueue() {
    if (!this.client || this.userQueueSubscribed) return;

    this.client.subscribe('/user/queue/messages', (message: IMessage) => {
      try {
        const payload: WebSocketMessage = JSON.parse(message.body);
        this.notifyHandlers(payload);
      } catch (e) {
        console.error('[WS] Failed to parse message:', e);
      }
    });

    this.userQueueSubscribed = true;
  }

  private restoreChannels() {
    this.subscribedChannels.forEach((channel) => {
      this.doSubscribe(channel);
    });
  }

  private doSubscribe(channel: string) {
    if (!this.client || !this.connected || !this.client.connected) return;

    this.client.subscribe(channel, (message: IMessage) => {
      try {
        const payload: WebSocketMessage = JSON.parse(message.body);
        this.notifyHandlers(payload);
      } catch (e) {
        console.error('[WS] Failed to parse message:', e);
      }
    });
  }

  subscribeConversation(conversationId: number) {
    const channel = `/topic/conversation/${conversationId}`;
    if (this.subscribedChannels.has(channel)) return;

    this.subscribedChannels.add(channel);
    this.doSubscribe(channel);
  }

  unsubscribeConversation(conversationId: number) {
    const channel = `/topic/conversation/${conversationId}`;
    this.subscribedChannels.delete(channel);
  }

  sendMessage(conversationId: number, receiverId: number, content: string) {
    if (!this.client?.connected) return;

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        type: 'CHAT',
        conversationId,
        receiverId,
        content,
      }),
    });
  }

  sendPrivateMessage(conversationId: number, receiverId: number, content: string) {
    if (!this.client?.connected) return;

    this.client.publish({
      destination: '/app/chat.private',
      body: JSON.stringify({
        type: 'CHAT',
        conversationId,
        receiverId,
        content,
      }),
    });
  }

  sendTyping(conversationId: number, receiverId: number, isTyping: boolean) {
    if (!this.client?.connected) return;

    this.client.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        type: 'TYPING',
        conversationId,
        receiverId,
        isTyping,
      }),
    });
  }

  sendReadReceipt(conversationId: number, senderId: number, messageId: number) {
    if (!this.client?.connected) return;

    this.client.publish({
      destination: '/app/chat.read',
      body: JSON.stringify({
        type: 'READ',
        conversationId,
        senderId,
        messageId,
      }),
    });
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (e) {
        console.error('[WS] Message handler error:', e);
      }
    });
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(connected);
      } catch (e) {
        console.error('[WS] Connection handler error:', e);
      }
    });
  }

  isConnected() {
    return this.connected;
  }
}

export const chatWebSocket = new ChatWebSocketService();
export default chatWebSocket;
