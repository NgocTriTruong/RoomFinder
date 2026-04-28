import React, { useState, useEffect } from 'react';
import { MessageCircle, Bot, X, Send, ChevronLeft, User, Sparkles } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import messageService from '../../services/messageService';

export default function FloatingChatWidget() {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'bot' | null>(null);

    const {
        conversations,
        messages,
        activeConversation,
        setActiveConversation,
        sendMessage,
        sendTyping,
        wsConnected,
        loading,
        fetchConversations
    } = useChat();

    // Tự động load danh sách khi mở tab chat
    useEffect(() => {
        if (activeTab === 'chat' && isOpen) {
            fetchConversations();
        }
    }, [activeTab, isOpen, fetchConversations]);

    if (!isAuthenticated) return null;

    const unreadTotal = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

    const toggleWidget = (tab: 'chat' | 'bot') => {
        if (activeTab === tab && isOpen) {
            setIsOpen(false);
            setActiveTab(null);
        } else {
            setActiveTab(tab);
            setIsOpen(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
            {/* Cửa sổ Chat/Bot Panel */}
            {isOpen && (
                <div className="mb-4 w-[380px] sm:w-[400px] h-[550px] sm:h-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className={`p-4 flex justify-between items-center text-white shrink-0 ${activeTab === 'bot' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-blue-600'}`}>
                        <div className="flex items-center gap-2">
                            {activeTab === 'bot' ? (
                                <>
                                    <Bot className="w-5 h-5" />
                                    <span className="font-bold"> Nova AI Assistant</span>
                                </>
                            ) : (
                                <>
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="font-bold">Trò chuyện trực tuyến</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
                        {activeTab === 'bot' ? (
                            <div className="flex-1 flex flex-col p-6">
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                                        <Sparkles className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chào {user?.fullName?.split(' ')[0]}!</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Tôi là Nova, trợ lý AI của bạn. Tôi có thể giúp bạn tìm phòng, xem giá và trả lời các thắc mắc về hợp đồng.
                                    </p>
                                    <div className="mt-6 p-3 bg-indigo-50 rounded-lg text-indigo-700 text-xs font-medium border border-indigo-100">
                                        Sắp ra mắt: Tính năng tìm phòng bằng giọng nói!
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                        <input
                                            type="text"
                                            placeholder="Hãy hỏi tôi bất cứ điều gì..."
                                            className="flex-1 text-sm outline-none px-2"
                                            disabled
                                        />
                                        <button className="p-2 bg-gray-100 text-gray-400 rounded-lg">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {!activeConversation ? (
                                    <div className="flex-1 overflow-y-auto">
                                        {conversations.length > 0 ? (
                                            <ChatSidebar
                                                conversations={conversations}
                                                activeConversationId={null}
                                                onSelectConversation={setActiveConversation}
                                                loading={loading}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                                    <MessageCircle className="w-8 h-8" />
                                                </div>
                                                <p className="text-gray-500 text-sm">Bạn chưa có cuộc trò truyện nào.</p>
                                                <p className="text-xs text-gray-400 mt-2">Hãy nhấn vào nút 'Nhắn tin' ở trang chi tiết phòng để bắt đầu!</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col overflow-hidden relative">
                                        <button
                                            onClick={() => setActiveConversation(null)}
                                            className="absolute top-3 left-3 z-[100] p-1.5 bg-white shadow-md rounded-full text-gray-600 hover:text-blue-600 transition-all border border-gray-100"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <ChatWindow
                                            conversation={activeConversation}
                                            messages={messages[activeConversation.id] || []}
                                            currentUserId={user?.id || 0}
                                            otherUserId={activeConversation.otherUserId}
                                            wsConnected={wsConnected}
                                            onSendMessage={(content) => sendMessage(activeConversation.id, activeConversation.otherUserId, content)}
                                            onTyping={(isTyping) => sendTyping(activeConversation.id, activeConversation.otherUserId, isTyping)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                {/* Chatbot Button */}
                <button
                    onClick={() => toggleWidget('bot')}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${activeTab === 'bot' && isOpen
                        ? 'bg-indigo-600 text-white rotate-90 ring-4 ring-indigo-100'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-50'
                        }`}
                    aria-label="Nova AI Assistant"
                >
                    {activeTab === 'bot' && isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </button>

                {/* Messaging Button */}
                <button
                    onClick={() => toggleWidget('chat')}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${activeTab === 'chat' && isOpen
                        ? 'bg-blue-600 text-white rotate-90 ring-4 ring-blue-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    aria-label="Messenger"
                >
                    {activeTab === 'chat' && isOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <>
                            <MessageCircle className="w-6 h-6" />
                            {unreadTotal > 0 && (
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                    {unreadTotal > 99 ? '99+' : unreadTotal}
                                </span>
                            )}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
