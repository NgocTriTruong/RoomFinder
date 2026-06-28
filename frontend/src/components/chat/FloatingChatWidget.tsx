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
                    text: `Xin chào ${user.fullName.split(' ')[0]}! Tôi là RoomFinder, trợ lý AI thông minh của bạn.\n\nTôi có thể giúp bạn:\n- Tìm kiếm phòng trọ, căn hộ (ví dụ: "tìm phòng ở Quận 1 dưới 4 triệu")\n- Hướng dẫn đặt lịch hẹn xem phòng\n- Giải đáp thông tin xác thực KYC & Tích xanh\n\nBạn muốn tôi hỗ trợ thông tin gì hôm nay?`,
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
        
        // University Map to detect university intents
        const universityMap = [
            { id: 1, name: 'Trường Đại học Nông Lâm TP.HCM', abbreviation: 'NLU', keywords: ['nlu', 'nông lâm', 'nong lam'] },
            { id: 2, name: 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', abbreviation: 'HCMUTE', keywords: ['hcmute', 'sư phạm kỹ thuật', 'su pham ky thuat', 'spkt'] },
            { id: 3, name: 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', abbreviation: 'UIT', keywords: ['uit', 'công nghệ thông tin', 'cong nghe thong tin', 'cntt'] },
            { id: 4, name: 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', abbreviation: 'HCMUT', keywords: ['hcmut', 'bách khoa', 'bach khoa', 'bk'] },
            { id: 5, name: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', abbreviation: 'HCMUS', keywords: ['hcmus', 'khoa học tự nhiên', 'khoa hoc tu nhien', 'khtn'] },
            { id: 6, name: 'Trường Đại học Quốc tế - ĐHQG TP.HCM', abbreviation: 'IU', keywords: ['iu', 'quốc tế', 'quoc te'] },
            { id: 7, name: 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', abbreviation: 'UEH', keywords: ['ueh', 'kinh tế', 'kinh te'] },
            { id: 8, name: 'Trường Đại học Ngoại thương - Cơ sở 2', abbreviation: 'FTU2', keywords: ['ftu', 'ngoại thương', 'ngoai thuong'] }
        ];

        let nearbyUniversityId: number | undefined = undefined;
        let nearbyUniversityName = '';
        for (const uni of universityMap) {
            if (uni.keywords.some(kw => textLower.includes(kw))) {
                nearbyUniversityId = uni.id;
                nearbyUniversityName = uni.abbreviation;
                break;
            }
        }

        // 1. AI-POWERED SUMMARIZATION INTENT
        const isSummaryRequest = textLower.includes('tại sao nên thuê') || 
                                 textLower.includes('tai sao nen thue') ||
                                 textLower.includes('tại sao tôi nên thuê') || 
                                 textLower.includes('tai sao toi nen thue') ||
                                 textLower.includes('tóm tắt') || 
                                 textLower.includes('tom tat') ||
                                 textLower.includes('có gì tốt') || 
                                 textLower.includes('co gi tot') ||
                                 textLower.includes('sao nên thuê') || 
                                 textLower.includes('sao nen thue') ||
                                 textLower.includes('tại sao phải thuê') ||
                                 textLower.includes('tai sao phai thue') ||
                                 (textLower.includes('thuê') && textLower.includes('căn')) ||
                                 (textLower.includes('thue') && textLower.includes('can')) ||
                                 (textLower.includes('thuê') && textLower.includes('phòng')) ||
                                 (textLower.includes('thue') && textLower.includes('phong'));

        if (isSummaryRequest) {
            // Find the last recommended rooms from the bot message history
            const lastBotMessageWithRooms = [...botMessages]
                .reverse()
                .find(msg => msg.sender === 'bot' && msg.rooms && msg.rooms.length > 0);
            
            const recommendedRooms = lastBotMessageWithRooms?.rooms || [];
            let targetRoomId: number | string | null = null;
            let targetIndex: number | null = null;

            if (recommendedRooms.length > 0) {
                if (
                    textLower.includes('căn số 1') || textLower.includes('căn 1') || textLower.includes('phòng 1') ||
                    textLower.includes('căn thứ 1') || textLower.includes('căn thứ nhất') || textLower.includes('căn đầu tiên') ||
                    textLower.includes('căn đầu') || textLower.includes('căn số một') || textLower.includes('phòng số 1') ||
                    textLower.includes('phòng thứ 1') || textLower.includes('phòng thứ nhất') || textLower.includes('phòng đầu tiên') ||
                    textLower.includes('phòng số một')
                ) {
                    targetIndex = 0;
                } else if (
                    textLower.includes('căn số 2') || textLower.includes('căn 2') || textLower.includes('phòng 2') ||
                    textLower.includes('căn thứ 2') || textLower.includes('căn thứ hai') || textLower.includes('căn số hai') ||
                    textLower.includes('phòng số 2') || textLower.includes('phòng thứ 2') || textLower.includes('phòng thứ hai') ||
                    textLower.includes('phòng số hai')
                ) {
                    targetIndex = 1;
                } else if (
                    textLower.includes('căn số 3') || textLower.includes('căn 3') || textLower.includes('phòng 3') ||
                    textLower.includes('căn thứ 3') || textLower.includes('căn thứ ba') || textLower.includes('căn số ba') ||
                    textLower.includes('phòng số 3') || textLower.includes('phòng thứ 3') || textLower.includes('phòng thứ ba') ||
                    textLower.includes('phòng số ba')
                ) {
                    targetIndex = 2;
                } else if (
                    textLower.includes('căn số 4') || textLower.includes('căn 4') || textLower.includes('phòng 4') ||
                    textLower.includes('căn thứ 4') || textLower.includes('căn thứ tư') || textLower.includes('căn số bốn') ||
                    textLower.includes('phòng số 4') || textLower.includes('phòng thứ 4') || textLower.includes('phòng thứ tư') ||
                    textLower.includes('phòng số bốn')
                ) {
                    targetIndex = 3;
                }
            }

            if (targetIndex !== null && recommendedRooms[targetIndex]) {
                targetRoomId = recommendedRooms[targetIndex].id;
            } else {
                const roomDetailMatch = window.location.pathname.match(/\/room\/(\d+)/);
                targetRoomId = roomDetailMatch ? roomDetailMatch[1] : null;
            }

            if (!targetRoomId) {
                return {
                    text: "Tôi rất sẵn lòng tóm tắt thông tin phòng trọ cho bạn! Tuy nhiên, bạn vui lòng truy cập vào trang chi tiết của căn hộ/phòng trọ bạn đang quan tâm, hoặc tìm kiếm phòng trước để tôi có thể hỗ trợ tóm tắt thông tin chi tiết và đưa ra lý do khuyên dùng cho bạn nhé!"
                };
            }

            try {
                const post = await postService.getPostById(targetRoomId);
                if (!post) {
                    return {
                        text: "Không tìm thấy thông tin phòng trọ hiện tại để tóm tắt. Vui lòng tải lại trang và thử lại!"
                    };
                }

                const priceFormatted = post.price.toLocaleString('vi-VN');
                const area = post.room?.area || 0;
                const address = post.room?.address || "Chưa cập nhật";
                const university = post.room?.nearbyUniversityName || "";
                const distance = post.room?.distanceToUniversity;
                const parking = post.room?.hasParking;
                const balcony = post.room?.hasBalcony;
                const amenities = post.room?.amenities || [];
                const landlordName = post.landlord?.fullName || "Chủ trọ";
                const isKyc = post.landlord?.isVerified;

                const cleanDesc = post.description
                    ? post.description
                        .replace(/<[^>]*>/g, '') 
                        .replace(/\s+/g, ' ') 
                        .trim()
                    : "Chưa có mô tả chi tiết từ chủ trọ.";
                
                const sentences = cleanDesc.split(/[.!?]\s+/);
                const descSummary = sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '...' : '');

                let text = `**Dưới đây là tóm tắt những lý do nổi bật bạn nên thuê căn hộ "${post.title}":**\n\n`;

                if (university) {
                    text += `- **Vị trí lý tưởng**: Nằm tại **${address}**, rất gần trường **${university}** ${distance ? `(chỉ cách khoảng **${distance} km**)` : ''}. Vị trí này sẽ giúp bạn tiết kiệm đáng kể thời gian và chi phí di chuyển đi học/đi làm hàng ngày.\n\n`;
                } else {
                    text += `- **Vị trí**: Nằm tại khu vực an ninh thuộc **${address}**.\n\n`;
                }

                text += `- **Chi phí & Không gian**: Giá thuê là **${priceFormatted} đ/tháng** cho không gian rộng rãi **${area} m²** ${post.room?.floor ? `(tầng ${post.room.floor})` : ''}. Đây là mức giá rất cạnh tranh trong phân khúc khu vực.\n\n`;

                if (amenities.length > 0) {
                    const amenityNames = amenities.map(a => a.name).join(', ');
                    text += `- **Trang bị sẵn có**: Phòng có đầy đủ các tiện ích thiết yếu giúp bạn dọn vào ở ngay mà không cần sắm sửa nhiều: **${amenityNames}**.\n\n`;
                }

                const details = [];
                if (balcony) details.push('có ban công rộng thoáng');
                if (parking) details.push('chỗ để xe an toàn');
                if (details.length > 0) {
                    text += `- **Đặc điểm phòng**: Phòng ${details.join(', ')}.\n\n`;
                }

                text += `- **Độ uy tín**: Được đăng bởi chủ trọ **${landlordName}** ${isKyc ? '(đã xác thực KYC tích xanh uy tín)' : '(chưa xác thực KYC)'}, giúp bạn an tâm tuyệt đối khi giao dịch và đặt cọc.\n\n`;

                text += `- **Mô tả chi tiết**: *"${descSummary}"*\n\n`;

                text += `- *Nếu bạn muốn đi xem phòng trực tiếp, hãy click vào nút **Đặt lịch hẹn xem phòng** ở phần bên phải màn hình nhé!*`;

                return { text };
            } catch (err) {
                console.error('Error fetching room detail for bot summary:', err);
                return {
                    text: "Rất tiếc, tôi gặp lỗi khi tải thông tin căn hộ này để tóm tắt. Vui lòng kiểm tra lại kết nối mạng!"
                };
            }
        }

        // 2. DYNAMIC ROOM SEARCH INTENT DETECTION
        const isSearchIntent = textLower.includes('tìm') || 
                               textLower.includes('phòng') || 
                               textLower.includes('căn hộ') || 
                               textLower.includes('nhà trọ') || 
                               textLower.includes('thuê') ||
                               nearbyUniversityId !== undefined;
        
        if (isSearchIntent) {
            let district = '';
            let maxPrice = 999999999;

            // Detect Districts in TP.HCM
            if (textLower.includes('quận 1') || textLower.includes('q1')) district = 'Quận 1';
            else if (textLower.includes('quận 5') || textLower.includes('q5')) district = 'Quận 5';
            else if (textLower.includes('quận 9') || textLower.includes('q9')) district = 'Quận 9';
            else if (textLower.includes('bình thạnh') || textLower.includes('bình thạnh')) district = 'Quận Bình Thạnh';
            else if (textLower.includes('gò vấp') || textLower.includes('gò vấp')) district = 'Quận Gò Vấp';
            else if (textLower.includes('thủ đức') || textLower.includes('thủ đức')) district = 'Thủ Đức';

            // Super-robust price extraction
            let foundPrice = false;
            
            // 1. Check for numeric patterns like "4.000.000", "4000000", "4.000.000đ"
            const millionNumericMatch = textLower.match(/(?:dưới|tầm|giá|khoảng)?\s*(\d[\d\.,]*)\s*(?:đồng|đ|d)/i) || textLower.match(/(\d[\d\.,]{5,})/);
            if (millionNumericMatch) {
                const cleanedNumber = millionNumericMatch[1].replace(/[\.,]/g, '');
                const parsedVal = parseInt(cleanedNumber);
                if (parsedVal > 100000) { 
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
                // Fetch public rooms using direct API filtering parameters
                const response = await postService.getPublicPosts({
                    page: 0,
                    size: 4,
                    district: district || undefined,
                    nearbyUniversityId: nearbyUniversityId,
                    maxPrice: maxPrice < 999999999 ? maxPrice : undefined
                });

                const finalRooms = response.content;

                if (finalRooms.length > 0) {
                    const priceLabel = maxPrice < 999999999 ? ` dưới ${(maxPrice / 1000000).toLocaleString('vi-VN')} triệu` : '';
                    const districtLabel = district ? ` tại ${district}` : '';
                    const uniLabel = nearbyUniversityName ? ` gần trường ${nearbyUniversityName}` : '';
                    
                    return {
                        text: `Tôi đã tìm thấy ${response.totalElements} phòng phù hợp với yêu cầu của bạn${uniLabel}${districtLabel}${priceLabel}. Dưới đây là danh sách gợi ý dành cho bạn:`,
                        rooms: finalRooms
                    };
                } else {
                    const priceLabel = maxPrice < 999999999 ? ` dưới ${(maxPrice / 1000000).toLocaleString('vi-VN')} triệu` : '';
                    const districtLabel = district ? ` tại ${district}` : '';
                    const uniLabel = nearbyUniversityName ? ` gần trường ${nearbyUniversityName}` : '';
                    return {
                        text: `Rất tiếc, hiện tại hệ thống chưa có phòng nào khớp hoàn toàn với yêu cầu tìm kiếm của bạn${uniLabel}${districtLabel}${priceLabel}. Bạn có thể thử mở rộng khu vực tìm kiếm hoặc nâng mức giá trần xem sao nhé!`
                    };
                }
            } catch (err) {
                console.error('Error fetching rooms for bot:', err);
                return {
                    text: "Rất tiếc, tôi gặp lỗi khi kết nối máy chủ để tìm kiếm phòng trọ. Vui lòng thử lại sau!"
                };
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
                text: "**Hệ thống xác thực KYC & Tích xanh uy tín:**\n\n- **Đối với Chủ trọ (Landlord):** Phải gửi tài liệu CCCD (mặt trước, mặt sau và ảnh selfie) tại trang *Xác thực tài khoản*. Khi Admin phê duyệt, tài khoản chủ trọ sẽ có biểu tượng **Tích xanh uy tín** kế bên tên của họ.\n- **Đối với Người thuê (Sinh viên):** Nếu bạn đăng ký tài khoản bằng **Gmail Sinh viên** (.edu.vn) và xác thực mã OTP thành công, tài khoản của bạn sẽ tự động được hệ thống KYC, thể hiện độ uy tín tối đa trong mắt chủ trọ!"
            };
        }

        if (textLower.includes('hotline') || textLower.includes('hỗ trợ') || textLower.includes('liên hệ') || textLower.includes('sđt') || textLower.includes('email')) {
            return {
                text: "**Thông tin hỗ trợ kỹ thuật:**\n\nBạn có thể liên hệ trực tiếp đội ngũ hỗ trợ qua:\n- **Hotline:** 1900 6868 (Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày)\n- **Email:** support@tmdt.vn\n- **Địa chỉ:** Trường Đại học Nông Lâm TP.HCM, Phường Linh Trung, Thành phố Thủ Đức."
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
