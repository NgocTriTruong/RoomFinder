import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bot, X, Send, ChevronLeft, User, Sparkles, Mic, MicOff, Loader2 } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import postService from '../../services/postService';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import type { PostResponse } from '../../types';
import { useNavigate } from 'react-router-dom';
import { createPlaceholderImage } from '../../utils/localImage';

interface BotMessage {
    sender: 'user' | 'bot';
    text: string;
    rooms?: PostResponse[];
    timestamp: Date;
}

export default function FloatingChatWidget() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'bot' | null>(null);

    // AI Bot States
    const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
    const [botInput, setBotInput] = useState('');
    const [botLoading, setBotLoading] = useState(false);
    const [isBotListening, setIsBotListening] = useState(false);
    const botMessagesEndRef = useRef<HTMLDivElement>(null);
    const botRecognitionRef = useRef<any>(null);

    const {
        conversations,
        messages,
        activeConversation,
        setActiveConversation,
        sendMessage,
        sendTyping,
        wsConnected,
        loading,
        fetchConversations,
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
        toggleMute
    } = useChat();

    // Initialize bot messages
    useEffect(() => {
        if (user && botMessages.length === 0) {
            setBotMessages([
                {
                    sender: 'bot',
                    text: `Xin chào ${user.fullName.split(' ')[0]}! Tôi là RoomFinder, trợ lý AI thông minh của bạn.\n\nTôi có thể giúp bạn:\nTìm kiếm phòng trọ, căn hộ (ví dụ: "tìm phòng ở Quận 1 dưới 4 triệu")\nHướng dẫn đặt lịch hẹn xem phòng\nGiải đáp thông tin xác thực KYC & Tích xanh\n\nBạn muốn tôi hỗ trợ thông tin gì hôm nay?`,
                    timestamp: new Date()
                }
            ]);
        }
    }, [user]);

    // Auto-scroll inside bot messages
    useEffect(() => {
        botMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [botMessages, botLoading]);

    // Fetch conversation list when opening chat tab
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

    // --- Dynamic Smart AI Room Parser & Conversational Engine ---
    const processBotMessage = async (userInput: string) => {
        const textLower = userInput.toLowerCase();
        
        // 1. DYNAMIC ROOM SEARCH INTENT DETECTION
        const isSearchIntent = textLower.includes('tìm') || textLower.includes('phòng') || textLower.includes('căn hộ') || textLower.includes('nhà trọ') || textLower.includes('thuê');
        
        if (isSearchIntent) {
            let district = '';
            let maxPrice = 999999999;
            let category = '';

            // Detect Districts in TP.HCM
            if (textLower.includes('quận 1') || textLower.includes('q1')) district = 'Quận 1';
            else if (textLower.includes('quận 5') || textLower.includes('q5')) district = 'Quận 5';
            else if (textLower.includes('quận 9') || textLower.includes('q9')) district = 'Quận 9';
            else if (textLower.includes('bình thạnh') || textLower.includes('bình thạnh')) district = 'Quận Bình Thạnh';
            else if (textLower.includes('gò vấp') || textLower.includes('gò vấp')) district = 'Quận Gò Vấp';

            // Super-robust price extraction
            let foundPrice = false;
            
            // 1. Check for numeric patterns like "4.000.000", "4000000", "4.000.000đ"
            const millionNumericMatch = textLower.match(/(?:dưới|tầm|giá|khoảng)?\s*(\d[\d\.,]*)\s*(?:đồng|đ|d)/i) || textLower.match(/(\d[\d\.,]{5,})/);
            if (millionNumericMatch) {
                const cleanedNumber = millionNumericMatch[1].replace(/[\.,]/g, '');
                const parsedVal = parseInt(cleanedNumber);
                if (parsedVal > 100000) { // Make sure it's a valid big amount
                    maxPrice = parsedVal;
                    foundPrice = true;
                }
            }

            // 2. Check for text patterns like "4 triệu", "3.5 triệu", "3,5tr", "4tr"
            if (!foundPrice) {
                const millionTextMatch = textLower.match(/(?:dưới|tầm|giá|khoảng)?\s*(\d+[\.,]\d+|\d+)\s*(?:triệu|tr|trieu)/i);
                if (millionTextMatch) {
                    const numberStr = millionTextMatch[1].replace(',', '.');
                    const parsedVal = parseFloat(numberStr) * 1000000;
                    maxPrice = parsedVal;
                    foundPrice = true;
                }
            }

            try {
                // Fetch public rooms to filter
                const response = await postService.getPublicPosts({
                    page: 0,
                    size: 50,
                    keyword: district || undefined
                });

                let filteredRooms = response.content;

                if (district) {
                    filteredRooms = filteredRooms.filter(room => 
                        room.room.address.toLowerCase().includes(district.toLowerCase())
                    );
                }

                if (maxPrice) {
                    filteredRooms = filteredRooms.filter(room => room.price <= maxPrice);
                }

                // Slice to top 4 results
                const finalRooms = filteredRooms.slice(0, 4);

                if (finalRooms.length > 0) {
                    const priceLabel = maxPrice < 999999999 ? ` dưới ${(maxPrice / 1000000).toLocaleString('vi-VN')} triệu` : '';
                    const districtLabel = district ? ` tại ${district}` : '';
                    
                    return {
                        text: `Tôi đã tìm thấy ${finalRooms.length} phòng phù hợp với yêu cầu của bạn${districtLabel}${priceLabel}. Dưới đây là danh sách gợi ý dành cho bạn:`,
                        rooms: finalRooms
                    };
                } else {
                    return {
                        text: `Rất tiếc, hiện tại hệ thống chưa có phòng nào khớp hoàn toàn với yêu cầu tìm kiếm của bạn. Bạn có thể thử mở rộng khu vực tìm kiếm hoặc nâng mức giá trần xem sao nhé!`
                    };
                }
            } catch (err) {
                console.error('Error fetching rooms for bot:', err);
            }
        }

        // 2. CONVERSATIONAL KNOWLEDGE ROUTING (FAQ & HELP)
        if (textLower.includes('lịch hẹn') || textLower.includes('đặt lịch') || textLower.includes('booking')) {
            return {
                text: "**Hướng dẫn đặt lịch xem phòng:**\n\n1. Bạn nhấn vào phòng trọ mong muốn để mở trang chi tiết.\n2. Ở sidebar bên phải, kéo xuống phần **Đặt lịch hẹn xem phòng**.\n3. Chọn ngày xem phòng và click chọn khung giờ trống thích hợp.\n4. Nhấn **Đặt lịch ngay**.\n5. Bạn có thể xem và quản lý trạng thái lịch hẹn của mình tại **Lịch hẹn của tôi** (ở thanh menu tài khoản cá nhân)!"
            };
        }

        if (textLower.includes('kyc') || textLower.includes('xác thực') || textLower.includes('tích xanh') || textLower.includes('uy tín')) {
            return {
                text: "**Hệ thống xác thực KYC & Tích xanh uy tín:**\n\n* **Đối với Chủ trọ (Landlord):** Phải gửi tài liệu CCCD (mặt trước, mặt sau và ảnh selfie) tại trang *Xác thực tài khoản*. Khi Admin phê duyệt, tài khoản chủ trọ sẽ có biểu tượng **Tích xanh uy tín** kế bên tên của họ.\n* **Đối với Người thuê (Sinh viên):** Nếu bạn đăng ký tài khoản bằng **Gmail Sinh viên** (.edu.vn) và xác thực mã OTP thành công, tài khoản của bạn sẽ tự động được hệ thống KYC, thể hiện độ uy tín tối đa trong mắt chủ trọ!"
            };
        }

        if (textLower.includes('hotline') || textLower.includes('hỗ trợ') || textLower.includes('liên hệ') || textLower.includes('sđt') || textLower.includes('email')) {
            return {
                text: "**Thông tin hỗ trợ kỹ thuật:**\n\nBạn có thể liên hệ trực tiếp đội ngũ hỗ trợ qua:\n* **Hotline:** 1900 6868 (Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày)\n* **Email:** support@tmdt.vn\n* **Địa chỉ:** Trường Đại học Nông Lâm TP.HCM, Phường Linh Trung, Thành phố Thủ Đức."
            };
        }

        if (textLower.includes('vip') || textLower.includes('nổi bật') || textLower.includes('gói tin')) {
            try {
                const featured = await postService.getFeaturedPosts(4);
                return {
                    text: "**Danh sách phòng VIP nổi bật chất lượng cao trên hệ thống:**",
                    rooms: featured
                };
            } catch (e) {
                return {
                    text: "Các phòng nổi bật (VIP) là những phòng có tiện ích cao cấp nhất và được hiển thị ở vị trí ưu tiên hàng đầu trên trang chủ!"
                };
            }
        }

        if (textLower.includes('cảm ơn') || textLower.includes('thank')) {
            return {
                text: "Rất vui được hỗ trợ bạn! Chúc bạn nhanh chóng tìm được căn phòng ưng ý nhất và có những trải nghiệm tuyệt vời trên nền tảng của chúng tôi!"
            };
        }

        // 3. FREE ONLINE CONVERSATIONAL CHATBOT API (SIMSIMI VIETNAMESE)
        try {
            const response = await fetch('https://api.simsimi.vn/v1/simtalk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    text: userInput,
                    lc: 'vn'
                })
            });
            const data = await response.json();
            if (data && data.status === '200' && data.message) {
                return { text: data.message };
            }
        } catch (apiErr) {
            console.warn('Conversational API error or blocked by CORS. Using fallback responses.', apiErr);
        }

        // 4. INTELLIGENT FALLBACK CHAT RESPONDER
        const fallbacks = [
            "Tôi hiểu ý bạn. Tuy nhiên, tôi chuyên hỗ trợ về việc tìm phòng trọ, tư vấn đặt lịch và giải đáp thủ tục KYC tích xanh. Bạn có muốn tôi tìm phòng trọ giúp bạn không?",
            "Câu hỏi của bạn rất thú vị! Để có thông tin chi tiết hơn, bạn có thể hỏi tôi các câu như 'Tìm phòng Quận 1 dưới 3 triệu' hoặc 'Cách đặt lịch hẹn như thế nào' nhé!",
            "Cảm ơn câu hỏi của bạn. Hệ thống của chúng tôi hiện cung cấp các căn hộ dịch vụ, phòng trọ giá tốt cho sinh viên TP.HCM. Hãy hỏi tôi về vị trí hoặc khoảng giá bạn muốn tìm nhé!"
        ];
        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return { text: randomFallback };
    };

    const handleBotSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!botInput.trim()) return;

        const userMessageText = botInput.trim();
        setBotInput('');

        // Add user message to state
        setBotMessages(prev => [
            ...prev,
            { sender: 'user', text: userMessageText, timestamp: new Date() }
        ]);

        try {
            setBotLoading(true);
            
            // Wait 600ms to feel natural
            await new Promise(resolve => setTimeout(resolve, 600));

            // Process message and search DB or conversational API
            const reply = await processBotMessage(userMessageText);

            setBotMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: reply.text,
                    rooms: reply.rooms,
                    timestamp: new Date()
                }
            ]);
        } catch (error) {
            setBotMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: 'Rất tiếc, tôi đang gặp lỗi kết nối hệ thống. Vui lòng thử lại sau giây lát!',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setBotLoading(false);
        }
    };

    // --- INLINE VOICE VOICE SPEECH INPUT FOR BOT ---
    const startBotListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            alert('Trình duyệt của bạn không hỗ trợ tính năng giọng nói. Vui lòng dùng Chrome hoặc Edge.');
            return;
        }

        const rec = new SpeechRecognition();
        rec.lang = 'vi-VN';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
            setIsBotListening(true);
        };

        rec.onresult = (event: any) => {
            const speechToText = event.results[0][0].transcript;
            if (speechToText) {
                setBotInput(speechToText);
            }
        };

        rec.onerror = (event: any) => {
            console.error('Bot speech error', event);
            setIsBotListening(false);
        };

        rec.onend = () => {
            setIsBotListening(false);
        };

        rec.start();
        botRecognitionRef.current = rec;
    };

    const stopBotListening = () => {
        if (botRecognitionRef.current) {
            botRecognitionRef.current.stop();
        }
        setIsBotListening(false);
    };

    const handleQuickQuery = (query: string) => {
        setBotInput(query);
        // We set input then auto-trigger submit in next event loop
        setTimeout(() => {
            const btn = document.getElementById('bot-send-btn');
            btn?.click();
        }, 100);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
            {/* Widget Main Box */}
            {isOpen && (
                <div className="mb-4 w-[380px] sm:w-[420px] h-[550px] sm:h-[620px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className={`p-4 flex justify-between items-center text-white shrink-0 ${activeTab === 'bot' ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700' : 'bg-blue-600'}`}>
                        <div className="flex items-center gap-2">
                            {activeTab === 'bot' ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Trợ lý RoomFinder</h3>
                                        <span className="text-[10px] text-indigo-100 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-ping"></span>
                                            Trực tuyến • Hỗ trợ giọng nói
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="font-bold">Trò chuyện trực tuyến</span>
                                </div>
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
                            !user?.isVerified ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white space-y-4">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 animate-bounce">
                                        <Bot className="w-9 h-9" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900">Trợ lý RoomFinder đang khóa</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
                                            Tính năng tìm phòng thông minh bằng giọng nói với **RoomFinder** yêu cầu tài khoản sinh viên đã xác thực **KYC tích xanh**.
                                        </p>
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-800 text-left space-y-1 w-full">
                                            <p className="font-bold flex items-center gap-1">Cách mở khóa tích xanh:</p>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>Đăng nhập bằng <strong className="font-semibold">Google Email Sinh viên (.edu.vn)</strong></li>
                                            <li>Gửi ảnh thẻ sinh viên/CCCD tại trang xác thực tài khoản.</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-2 w-full pt-2">
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/login');
                                            }}
                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer transition-colors"
                                        >
                                            Đăng nhập Google
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate(user?.role === 'LANDLORD' ? '/landlord/verification' : '/tenant/verification');
                                            }}
                                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                                        >
                                            Xác thực ngay
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col overflow-hidden relative">
                                    
                                    {/* Messages Container */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {botMessages.map((msg, index) => (
                                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    {/* Avatar */}
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                                                        msg.sender === 'user' ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
                                                    }`}>
                                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                    </div>

                                                    {/* Text & Rooms Bubble */}
                                                    <div className="space-y-3">
                                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                                                            msg.sender === 'user' 
                                                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                                        }`}>
                                                            {msg.text}
                                                        </div>

                                                        {/* Smart Interactive Room Cards */}
                                                        {msg.rooms && msg.rooms.length > 0 && (
                                                            <div className="space-y-2 mt-2">
                                                                {msg.rooms.map((room) => (
                                                                    <div 
                                                                        key={room.id}
                                                                        onClick={() => {
                                                                            navigate(`/room/${room.id}`);
                                                                            setIsOpen(false);
                                                                        }}
                                                                        className="flex gap-3 bg-white p-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                                                                    >
                                                                        <img 
                                                                            src={resolveMediaUrl(room.room?.thumbnailUrl || room.images?.[0]) || createPlaceholderImage(room.title, 200, 150)} 
                                                                            alt={room.title}
                                                                            className="w-16 h-16 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                                                                        />
                                                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                                            <h4 className="text-xs font-bold text-gray-900 truncate">{room.title}</h4>
                                                                            <span className="text-[10px] text-gray-500 truncate">{room.room.address.split(',').slice(-2).join(', ')}</span>
                                                                            <div className="flex justify-between items-center mt-1">
                                                                                <span className="text-xs font-extrabold text-blue-600">{room.price.toLocaleString('vi-VN')}đ/tháng</span>
                                                                                {room.landlord.isVerified && (
                                                                                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wide">Đã KYC</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Loading indicator */}
                                        {botLoading && (
                                            <div className="flex justify-start">
                                                <div className="flex gap-2 items-center text-indigo-600 bg-white px-4 py-2.5 rounded-2xl border border-indigo-100 shadow-sm text-xs font-medium">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    RoomFinder đang xử lý dữ liệu...
                                                </div>
                                            </div>
                                        )}
                                        <div ref={botMessagesEndRef} />
                                    </div>

                                    {/* Suggested Chips for quick questions */}
                                    <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide border-t border-gray-100 bg-white">
                                        <button 
                                            onClick={() => handleQuickQuery('Tìm phòng Quận 1 dưới 3 triệu')}
                                            className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 px-3 py-1.5 rounded-full transition-all shrink-0"
                                        >
                                            Tìm phòng Q1 &lt; 3tr
                                        </button>
                                        <button 
                                            onClick={() => handleQuickQuery('Hướng dẫn đặt lịch hẹn')}
                                            className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 px-3 py-1.5 rounded-full transition-all shrink-0"
                                        >
                                            Đặt lịch xem phòng
                                        </button>
                                        <button 
                                            onClick={() => handleQuickQuery('Chính sách KYC tích xanh')}
                                            className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 px-3 py-1.5 rounded-full transition-all shrink-0"
                                        >
                                            KYC Tích Xanh là gì?
                                        </button>
                                    </div>

                                    {/* Chatbot Input bar */}
                                    <div className="p-3 border-t border-gray-100 bg-white shrink-0">
                                        <form onSubmit={handleBotSend} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all shadow-inner">
                                            <input
                                                type="text"
                                                value={botInput}
                                                onChange={(e) => setBotInput(e.target.value)}
                                                placeholder={isBotListening ? "Đang ghi âm giọng nói..." : "Hãy hỏi tôi bất cứ điều gì..."}
                                                className="flex-1 text-sm outline-none px-2 bg-transparent text-gray-800"
                                                disabled={botLoading}
                                            />
                                            
                                            {/* Glow pulsing Microphone for Speech Input */}
                                            <button
                                                type="button"
                                                onClick={isBotListening ? stopBotListening : startBotListening}
                                                disabled={botLoading}
                                                className={`p-2 rounded-lg transition-all ${
                                                    isBotListening 
                                                        ? 'bg-rose-500 text-white animate-pulse shadow-md ring-4 ring-rose-100' 
                                                        : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'
                                                }`}
                                                title="Nói với RoomFinder"
                                            >
                                                <Mic className="w-4 h-4" />
                                            </button>

                                            <button
                                                type="submit"
                                                id="bot-send-btn"
                                                disabled={botLoading || !botInput.trim()}
                                                className={`p-2 rounded-lg transition-all ${
                                                    botInput.trim() 
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>

                                </div>
                            )
                        ) : (
                            !user?.isVerified ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white space-y-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 animate-bounce">
                                        <MessageCircle className="w-9 h-9" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900">Tính năng Trò chuyện đang khóa</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
                                        Để bảo vệ người dùng, tính năng **Trò chuyện trực tuyến với chủ trọ** yêu cầu tài khoản sinh viên đã xác thực **KYC tích xanh**.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-800 text-left space-y-1 w-full">
                                        <p className="font-bold flex items-center gap-1">Cách mở khóa tích xanh:</p>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>Đăng nhập bằng <strong className="font-semibold">Google Email Sinh viên (.edu.vn)</strong></li>
                                            <li>Gửi ảnh thẻ sinh viên/CCCD tại trang xác thực tài khoản.</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-2 w-full pt-2">
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/login');
                                            }}
                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer transition-colors"
                                        >
                                            Đăng nhập Google
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/landlord/verification');
                                            }}
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                                        >
                                            Xác thực ngay
                                        </button>
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
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Float Action Buttons (Messaging & Bot Toggle) */}
            <div className="flex flex-col gap-3">
                {/* Chatbot Button */}
                <button
                    onClick={() => toggleWidget('bot')}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${activeTab === 'bot' && isOpen
                        ? 'bg-indigo-600 text-white rotate-90 ring-4 ring-indigo-100'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-50'
                        }`}
                    aria-label="RoomFinder Assistant"
                >
                    {activeTab === 'bot' && isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-bounce" />}
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
