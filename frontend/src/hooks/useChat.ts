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

// ─── Sound Effects Synthesizer using Web Audio API ──────────────────────────
class SoundEffects {
  private audioCtx: AudioContext | null = null;
  private intervalId: any = null;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playRingback() {
    this.stop();
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const playTone = () => {
        if (!this.audioCtx) return;
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        osc2.frequency.setValueAtTime(480, this.audioCtx.currentTime);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.8);

        osc1.start();
        osc2.start();
        osc1.stop(this.audioCtx.currentTime + 2.0);
        osc2.stop(this.audioCtx.currentTime + 2.0);
      };

      playTone();
      this.intervalId = setInterval(playTone, 4000);
    } catch (e) {
      console.warn('Web Audio playRingback failed', e);
    }
  }

  playRingtone() {
    this.stop();
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const playTone = () => {
        if (!this.audioCtx) return;
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.frequency.setValueAtTime(453, this.audioCtx.currentTime);
        osc2.frequency.setValueAtTime(600, this.audioCtx.currentTime);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

        osc1.start();
        osc2.start();
        osc1.stop(this.audioCtx.currentTime + 1.4);
        osc2.stop(this.audioCtx.currentTime + 1.4);
      };

      playTone();
      this.intervalId = setInterval(playTone, 3000);
    } catch (e) {
      console.warn('Web Audio playRingtone failed', e);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
const callSounds = new SoundEffects();

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

  // ─── WebRTC Call States ──────────────────────────────────────────────────
  const [callState, setCallState] = useState<'idle' | 'calling' | 'incoming' | 'connected'>('idle');
  const [callUser, setCallUser] = useState<{ id: number; name: string; avatar: string | null } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // ─── WebRTC Refs ─────────────────────────────────────────────────────────
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const callStateRef = useRef<'idle' | 'calling' | 'incoming' | 'connected'>('idle');
  const pendingOfferRef = useRef<RTCSessionDescription | null>(null);
  const pendingConversationIdRef = useRef<number | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);

  // Update Call State and synchronized ref
  const updateCallState = (newState: 'idle' | 'calling' | 'incoming' | 'connected') => {
    setCallState(newState);
    callStateRef.current = newState;
  };

  // ─── WebRTC Call Cleanup ─────────────────────────────────────────────────
  const cleanupCall = useCallback(() => {
    callSounds.stop();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    updateCallState('idle');
    setCallUser(null);
    setIsMuted(false);
    setCallDuration(0);
    pendingOfferRef.current = null;
    pendingConversationIdRef.current = null;
    pendingCandidatesRef.current = [];
  }, []);

  // ─── WebRTC Connection Helper ────────────────────────────────────────────
  const createPeerConnection = useCallback((receiverId: number, conversationId: number) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        chatWebSocket.sendPrivateMessage(
          conversationId,
          receiverId,
          `__CALL_ICE__:${JSON.stringify(event.candidate)}`
        );
      }
    };

    pc.ontrack = (event) => {
      console.log('[WebRTC] Got remote track:', event.streams[0]);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        remoteStreamRef.current = event.streams[0];
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE state change:', pc.iceConnectionState);
      if (
        pc.iceConnectionState === 'disconnected' ||
        pc.iceConnectionState === 'failed' ||
        pc.iceConnectionState === 'closed'
      ) {
        cleanupCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [cleanupCall]);

  // ─── WebRTC Call Controls ────────────────────────────────────────────────
  const startCall = useCallback(async (receiverId: number, receiverName: string, receiverAvatar: string | null, conversationId: number) => {
    if (callStateRef.current !== 'idle') return;

    updateCallState('calling');
    setCallUser({ id: receiverId, name: receiverName, avatar: receiverAvatar });
    pendingConversationIdRef.current = conversationId;
    callSounds.playRingback();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;

      const pc = createPeerConnection(receiverId, conversationId);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      chatWebSocket.sendPrivateMessage(conversationId, receiverId, `__CALL_OFFER__:${offer.sdp}`);
    } catch (err) {
      console.error('Failed to start call:', err);
      cleanupCall();
      alert('Không thể truy cập Microphone của bạn');
    }
  }, [createPeerConnection, cleanupCall]);

  const acceptCall = useCallback(async () => {
    if (
      callStateRef.current !== 'incoming' ||
      !pendingOfferRef.current ||
      !pendingConversationIdRef.current ||
      !callUser
    ) {
      return;
    }

    callSounds.stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;

      const pc = createPeerConnection(callUser.id, pendingConversationIdRef.current);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(pendingOfferRef.current);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Add queued ICE candidates
      for (const cand of pendingCandidatesRef.current) {
        await pc.addIceCandidate(cand).catch(console.error);
      }
      pendingCandidatesRef.current = [];

      chatWebSocket.sendPrivateMessage(
        pendingConversationIdRef.current,
        callUser.id,
        `__CALL_ANSWER__:${answer.sdp}`
      );

      updateCallState('connected');
    } catch (err) {
      console.error('Failed to accept call:', err);
      // Decline on failure
      if (callUser && pendingConversationIdRef.current) {
        chatWebSocket.sendPrivateMessage(pendingConversationIdRef.current, callUser.id, '__CALL_DECLINE__');
      }
      cleanupCall();
    }
  }, [callUser, createPeerConnection, cleanupCall]);

  const declineCall = useCallback(() => {
    callSounds.stop();
    if (callUser && pendingConversationIdRef.current) {
      chatWebSocket.sendPrivateMessage(
        pendingConversationIdRef.current,
        callUser.id,
        '__CALL_DECLINE__'
      );
    }
    cleanupCall();
  }, [callUser, cleanupCall]);

  const endCall = useCallback(() => {
    callSounds.stop();
    if (callUser && (callStateRef.current === 'connected' || callStateRef.current === 'calling')) {
      const convId = pendingConversationIdRef.current || state.activeConversation?.id;
      if (convId) {
        chatWebSocket.sendPrivateMessage(
          convId,
          callUser.id,
          '__CALL_HANGUP__'
        );
      }
    }
    cleanupCall();
  }, [callUser, state.activeConversation?.id, cleanupCall]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // ─── Call Timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    let timerId: any = null;
    if (callState === 'connected') {
      timerId = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [callState]);

  // ─── Call Signaling Handler ──────────────────────────────────────────────
  const handleCallSignaling = useCallback(async (msg: WebSocketMessage) => {
    const content = msg.content || '';
    const senderId = msg.senderId!;
    const conversationId = msg.conversationId!;

    if (content.startsWith('__CALL_OFFER__:')) {
      if (callStateRef.current !== 'idle') {
        chatWebSocket.sendPrivateMessage(conversationId, senderId, '__CALL_BUSY__');
        return;
      }

      const sdp = content.substring('__CALL_OFFER__:'.length);
      pendingOfferRef.current = new RTCSessionDescription({ type: 'offer', sdp });
      pendingConversationIdRef.current = conversationId;

      setCallUser({
        id: senderId,
        name: msg.senderName || 'Người dùng',
        avatar: msg.senderAvatar ?? null,
      });
      updateCallState('incoming');
      callSounds.playRingtone();
    } 
    else if (content.startsWith('__CALL_ANSWER__:')) {
      if (callStateRef.current !== 'calling') return;

      const sdp = content.substring('__CALL_ANSWER__:'.length);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp })
        );
        callSounds.stop();
        updateCallState('connected');
      }
    } 
    else if (content.startsWith('__CALL_ICE__:')) {
      const candidateStr = content.substring('__CALL_ICE__:'.length);
      try {
        const candidate = new RTCIceCandidate(JSON.parse(candidateStr));
        if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    } 
    else if (content === '__CALL_DECLINE__') {
      cleanupCall();
      alert('Cuộc gọi bị từ chối');
    } 
    else if (content === '__CALL_BUSY__') {
      cleanupCall();
      alert('Người nhận đang bận');
    } 
    else if (content === '__CALL_HANGUP__') {
      cleanupCall();
    }
  }, [cleanupCall]);

  // ─── Handle Incoming WebSocket Messages ─────────────────────────────────
  const handleIncomingMessage = useCallback((msg: WebSocketMessage) => {
    if (!currentUserId) return;

    switch (msg.type) {
      case 'CHAT': {
        const conversationId = msg.conversationId!;
        const isCurrentUser = msg.senderId === currentUserId;

        // Check for WebRTC signaling message
        const content = msg.content || '';
        if (content.startsWith('__CALL_')) {
          handleCallSignaling(msg);
          return;
        }

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
  }, [currentUserId, handleCallSignaling]);

  // Use a mutable ref to handleIncomingMessage to avoid stale closures in WS listener
  const messageHandlerRef = useRef<(msg: WebSocketMessage) => void>(handleIncomingMessage);
  messageHandlerRef.current = handleIncomingMessage;

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
      messageHandlerRef.current?.(msg);
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

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      cleanupCall();
    };
  }, [cleanupCall]);

  return {
    ...state,
    fetchConversations,
    fetchMessages,
    setActiveConversation,
    sendMessage,
    sendTyping,

    // Call Exports
    callState,
    callUser,
    localStream,
    remoteStream,
    isMuted,
    callDuration,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    toggleMute,
  };
}
