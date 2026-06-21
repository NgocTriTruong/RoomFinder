import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Phone, MoreVertical, ArrowLeft, MessageCircle, Loader2, Image as ImageIcon, PhoneOff, Mic, MicOff } from 'lucide-react';
import type { ConversationResponse, MessageResponse } from '../../services/messageService';
import { createAvatarPlaceholder } from '../../utils/localImage';

interface ChatWindowProps {
  conversation: ConversationResponse;
  messages: MessageResponse[];
  currentUserId: number;
  otherUserId: number;
  typingUserName?: string;
  wsConnected: boolean;
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  onBack?: () => void;

  // Call properties
  callState: 'idle' | 'calling' | 'incoming' | 'connected';
  callUser: {
    id: number;
    name: string;
    avatar: string | null;
  } | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  callDuration: number;
  startCall: (targetUserId: number, targetUserName: string, targetUserAvatar?: string, conversationId?: number) => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  otherUserId,
  typingUserName,
  wsConnected,
  onSendMessage,
  onTyping,
  onBack,

  // Call props destructuring
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
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch((err) => {
        console.error("Failed to play remote audio:", err);
      });
    }
  }, [remoteStream]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUserName]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      onTyping(true);

      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    },
    [onTyping]
  );

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || sending) return;

      setSending(true);
      setInput('');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping(false);

      try {
        onSendMessage(trimmed);
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    },
    [input, sending, onSendMessage, onTyping]
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hôm nay';
    if (isYesterday) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const sortedMessages = [...messages].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const getDateDividers = () => {
    const dividers: { date: string; label: string }[] = [];
    sortedMessages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!dividers.find((d) => d.date === dateKey)) {
        dividers.push({ date: dateKey, label: formatDateDivider(msg.createdAt) });
      }
    });
    return dividers;
  };

  const otherUserName = conversation.otherUserName;
  const otherUserAvatar = conversation.otherUserAvatar;
  const lastMessagePreview =
    conversation.lastMessage?.content ||
    (conversation as any).lastMessage ||
    '';
  const isOnline = false;

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden mr-3 text-gray-500 hover:text-gray-700 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <img
              src={otherUserAvatar || createAvatarPlaceholder(otherUserName, 100)}
              alt={otherUserName}
              className="w-10 h-10 rounded-full object-cover mr-3"
              referrerPolicy="no-referrer"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{otherUserName}</h3>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              {wsConnected ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Đang hoạt động
                </>
              ) : (
                <span className="text-gray-400">Kết nối lại...</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => startCall(otherUserId, otherUserName, otherUserAvatar || undefined, conversation.id)}
            disabled={callState !== 'idle'}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-blue-50 rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Gọi thoại trực tiếp"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {getDateDividers().map(({ date, label }) => (
          <div key={date}>
            <div className="text-center my-4">
              <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                {label}
              </span>
            </div>
            {sortedMessages
              .filter((msg) => new Date(msg.createdAt).toDateString() === date)
              .map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMine
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                        }`}
                    >
                      {msg.type === 'IMAGE' && msg.attachmentUrl && (
                        <img
                          src={msg.attachmentUrl}
                          alt="Attachment"
                          className="rounded-lg mb-2 max-w-[200px]"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'
                          }`}
                      >
                        <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                        {isMine && msg.isRead && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        {/* Typing indicator */}
        {typingUserName && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Gửi hình ảnh"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border-gray-300 rounded-full bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* WebRTC Calling Interface Overlay */}
      {callState !== 'idle' && (
        <div className="absolute inset-0 z-50 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-300">
          <div className="flex flex-col items-center mt-12 space-y-4">
            {/* Status Indicator Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-blue-300 uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {callState === 'calling' && 'Đang gọi đi...'}
              {callState === 'incoming' && 'Cuộc gọi đến...'}
              {callState === 'connected' && 'Đang kết nối'}
            </div>

            {/* Avatar & Ringing/Pulsing Visual Effect */}
            <div className="relative mt-8">
              {/* Inner Pulsing Rings */}
              {callState !== 'connected' ? (
                <>
                  <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping opacity-75" />
                  <div className="absolute -inset-8 rounded-full bg-blue-500/10 animate-pulse opacity-50" />
                </>
              ) : (
                <div className="absolute -inset-2 rounded-full bg-green-500/25 animate-pulse" />
              )}
              
              <img
                src={callUser?.avatar || createAvatarPlaceholder(callUser?.name || otherUserName, 150)}
                alt={callUser?.name || otherUserName}
                className={`w-32 h-32 rounded-full object-cover shadow-2xl border-4 ${
                  callState === 'connected' ? 'border-green-500' : 'border-blue-500'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* User Info */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-wide">{callUser?.name || otherUserName}</h2>
              {callState === 'connected' ? (
                <p className="text-sm font-semibold text-green-400 font-mono tracking-wider">
                  {formatCallDuration(callDuration)}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  {callState === 'calling' ? 'Đang đổ chuông máy đối phương...' : 'Đang chờ bạn trả lời...'}
                </p>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mb-12 flex items-center justify-center gap-6">
            {callState === 'incoming' ? (
              <>
                {/* Decline Button */}
                <button
                  onClick={declineCall}
                  className="w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-lg transition-all duration-200"
                  title="Từ chối cuộc gọi"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                {/* Accept Button */}
                <button
                  onClick={acceptCall}
                  className="w-16 h-16 flex items-center justify-center bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-full shadow-lg transition-all duration-200"
                  title="Chấp nhận cuộc gọi"
                >
                  <Phone className="w-7 h-7 animate-pulse" />
                </button>
              </>
            ) : (
              <>
                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className={`w-14 h-14 flex items-center justify-center rounded-full shadow-md transition-all duration-200 active:scale-95 ${
                    isMuted
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                  title={isMuted ? 'Bật micro' : 'Tắt micro'}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                {/* End Call Button */}
                <button
                  onClick={endCall}
                  className="w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-lg transition-all duration-200"
                  title="Kết thúc cuộc gọi"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hidden audio element for receiving remote stream */}
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
    </div>
  );
}
