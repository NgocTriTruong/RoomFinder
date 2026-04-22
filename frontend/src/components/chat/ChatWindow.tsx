import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Phone, MoreVertical, ArrowLeft, MessageCircle, Loader2, Image as ImageIcon } from 'lucide-react';
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
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const getDateDividers = () => {
    const dividers: { date: string; label: string }[] = [];
    messages.forEach((msg) => {
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
    <div className="flex flex-col h-full">
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
          <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-full transition-colors">
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
            {messages
              .filter((msg) => new Date(msg.createdAt).toDateString() === date)
              .map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isMine
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
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          isMine ? 'text-blue-200' : 'text-gray-400'
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
    </div>
  );
}
