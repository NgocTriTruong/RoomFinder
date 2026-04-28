import React from 'react';
import { Loader2 } from 'lucide-react';
import type { ConversationResponse } from '../../services/messageService';
import { createAvatarPlaceholder } from '../../utils/localImage';

interface ChatSidebarProps {
  conversations: ConversationResponse[];
  activeConversationId?: number;
  onSelectConversation: (conv: ConversationResponse) => void;
  loading?: boolean;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  loading = false,
}: ChatSidebarProps) {
  const formatLastTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getLastMessagePreview = (conv: ConversationResponse) => {
    if (conv.lastMessage?.content) return conv.lastMessage.content;
    if ((conv as any).lastMessage) return (conv as any).lastMessage;
    return 'Chưa có tin nhắn';
  };

  if (loading) {
    return (
      <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Tin nhắn</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Tin nhắn</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">Chưa có cuộc hội thoại nào</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeConversationId === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={
                    conv.otherUserAvatar ||
                    createAvatarPlaceholder(conv.otherUserName, 100)
                  }
                  alt={conv.otherUserName}
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </span>
                )}
              </div>

              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3
                    className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-800'
                      }`}
                  >
                    {conv.otherUserName}
                  </h3>
                  {conv.lastMessageAt && (
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {formatLastTime(conv.lastMessageAt)}
                    </span>
                  )}
                </div>
                {conv.postTitle && (
                  <p className="text-xs text-blue-600 truncate mb-0.5">
                    {conv.postTitle}
                  </p>
                )}
                <p
                  className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'
                    }`}
                >
                  {getLastMessagePreview(conv)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
