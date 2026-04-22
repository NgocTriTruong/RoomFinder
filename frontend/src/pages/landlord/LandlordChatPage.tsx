import React from 'react';
import { MessageCircle } from 'lucide-react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

export default function LandlordChatPage() {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    typingUsers,
    wsConnected,
    loading,
    setActiveConversation,
    sendMessage,
    sendTyping,
  } = useChat();

  const typingUserName = activeConversation
    ? typingUsers[activeConversation.id]?.userName
    : undefined;

  const handleSendMessage = (content: string) => {
    if (!activeConversation || !user) return;
    sendMessage(activeConversation.id, activeConversation.otherUserId, content);
  };

  const handleTyping = (isTyping: boolean) => {
    if (!activeConversation || !user) return;
    sendTyping(activeConversation.id, activeConversation.otherUserId, isTyping);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex h-[calc(100vh-12rem)] min-h-[500px]">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={setActiveConversation}
        loading={loading}
      />

      {activeConversation && user ? (
        <ChatWindow
          conversation={activeConversation}
          messages={messages[activeConversation.id] || []}
          currentUserId={user.id}
          otherUserId={activeConversation.otherUserId}
          typingUserName={typingUserName}
          wsConnected={wsConnected}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
        />
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Tin nhắn của bạn</h3>
            <p className="text-gray-500 mt-1">
              Chọn một cuộc hội thoại để bắt đầu trò chuyện
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
