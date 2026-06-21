import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import messageService from '../../services/messageService';

export default function ChatUI() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const receiverIdParam = searchParams.get('receiverId');

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
    fetchConversations,

    // Call properties
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
  } = useChat();

  // Handle receiverId from URL
  useEffect(() => {
    const initConversation = async () => {
      if (receiverIdParam && user) {
        const rId = parseInt(receiverIdParam);

        // Find existing conversation
        const existing = conversations.find(c => c.otherUserId === rId);

        if (existing) {
          setActiveConversation(existing);
          searchParams.delete('receiverId');
          setSearchParams(searchParams);
        } else {
          // If not found locally, or list is empty, try API
          try {
            const newConv = await messageService.getOrCreateConversation(rId);
            if (newConv) {
              await fetchConversations();
              setActiveConversation(newConv);
              searchParams.delete('receiverId');
              setSearchParams(searchParams);
            }
          } catch (err) {
            console.error("Failed to init conversation:", err);
          }
        }
      }
    };

    initConversation();
  }, [receiverIdParam, user, conversations.length, setActiveConversation, fetchConversations, searchParams, setSearchParams]);

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

  if (user && !user.isVerified) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center h-[calc(100vh-12rem)] min-h-[500px] text-center max-w-2xl mx-auto my-4 space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 animate-bounce">
          <MessageCircle className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Tính năng Trò chuyện đang bị khóa</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md">
          Nhằm bảo vệ cộng đồng sinh viên khỏi các tin nhắn rác hoặc hành vi lừa đảo, hệ thống yêu cầu tài khoản của bạn phải được xác thực **KYC tích xanh** trước khi nhắn tin trao đổi với các chủ trọ.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 text-left space-y-2 max-w-md">
          <p className="font-bold flex items-center gap-1">Làm sao để mở khóa?</p>
          <ul className="list-disc pl-4 space-y-1 font-medium">
            <li>Đăng nhập bằng <strong className="font-semibold">Google Email Sinh viên (.edu.vn)</strong> để tự động nhận tích xanh KYC ngay lập tức.</li>
            <li>Hoặc truy cập trang xác thực để gửi thông tin thẻ sinh viên/CCCD để được duyệt.</li>
          </ul>
        </div>
        <div className="flex gap-4 w-full max-w-sm pt-2">
          <a
            href="/login"
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-semibold transition-colors flex justify-center items-center"
          >
            Đăng nhập Google
          </a>
          <a
            href={user?.role === 'LANDLORD' ? "/landlord/verification" : "/tenant/verification"}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex justify-center items-center shadow-sm"
          >
            Xác thực ngay
          </a>
        </div>
      </div>
    );
  }

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
          callState={callState}
          callUser={callUser}
          localStream={localStream}
          remoteStream={remoteStream}
          isMuted={isMuted}
          callDuration={callDuration}
          startCall={startCall}
          acceptCall={acceptCall}
          declineCall={declineCall}
          endCall={endCall}
          toggleMute={toggleMute}
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
