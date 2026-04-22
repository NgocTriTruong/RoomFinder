import { createAvatarPlaceholder, createPlaceholderImage } from '../utils/localImage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'appointment' | 'message' | 'system';
}

export interface TenantBooking {
  id: string;
  roomTitle: string;
  thumbnail: string;
  dateTime: string;
  landlordName: string;
  status: 'pending' | 'confirmed' | 'viewed' | 'cancelled';
}

export interface Conversation {
  id: string;
  landlordName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface Message {
  id: string;
  senderId: 'tenant' | 'landlord';
  text: string;
  time: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Nhắc lịch hẹn xem phòng',
    message: 'Bạn có lịch hẹn xem phòng "Studio mini trung tâm Quận 1" vào ngày mai lúc 09:30.',
    time: '2 giờ trước',
    isRead: false,
    type: 'appointment',
  },
  {
    id: 'n2',
    title: 'Chủ trọ đã xác nhận lịch hẹn',
    message: 'Chủ trọ Nguyễn Văn A đã xác nhận lịch hẹn xem phòng của bạn.',
    time: '5 giờ trước',
    isRead: false,
    type: 'appointment',
  },
  {
    id: 'n3',
    title: 'Tin nhắn mới',
    message: 'Chủ trọ Lê Thị B: "Chào bạn, phòng vẫn còn nhé..."',
    time: '1 ngày trước',
    isRead: true,
    type: 'message',
  },
];

export const mockTenantBookings: TenantBooking[] = [
  {
    id: 'tb1',
    roomTitle: 'Studio mini trung tâm Quận 1, an ninh 24/7',
    thumbnail: createPlaceholderImage('Phòng 2', 100, 100),
    dateTime: '2023-10-25 09:30',
    landlordName: 'Nguyễn Văn A',
    status: 'confirmed',
  },
  {
    id: 'tb2',
    roomTitle: 'Phòng trọ cao cấp đầy đủ nội thất, ban công thoáng mát',
    thumbnail: createPlaceholderImage('Phòng 1', 100, 100),
    dateTime: '2023-10-26 15:00',
    landlordName: 'Lê Thị B',
    status: 'pending',
  },
  {
    id: 'tb3',
    roomTitle: 'Căn hộ dịch vụ 1PN, view thành phố cực đẹp',
    thumbnail: createPlaceholderImage('Phòng 4', 100, 100),
    dateTime: '2023-10-10 14:00',
    landlordName: 'Trần C',
    status: 'viewed',
  },
  {
    id: 'tb4',
    roomTitle: 'Phòng trọ giá rẻ cho sinh viên gần ĐH KHTN',
    thumbnail: createPlaceholderImage('Phòng 3', 100, 100),
    dateTime: '2023-10-05 10:00',
    landlordName: 'Phạm D',
    status: 'cancelled',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    landlordName: 'Nguyễn Văn A',
    avatar: createAvatarPlaceholder('Nguyễn Văn A', 100),
    lastMessage: 'Ok bạn, hẹn gặp bạn ngày mai nhé.',
    time: '10:30',
    unread: 2,
  },
  {
    id: 'c2',
    landlordName: 'Lê Thị B',
    avatar: createAvatarPlaceholder('Lê Thị B', 100),
    lastMessage: 'Phòng này cọc 1 tháng nha em.',
    time: 'Hôm qua',
    unread: 0,
  },
  {
    id: 'c3',
    landlordName: 'Trần C',
    avatar: createAvatarPlaceholder('Trần C', 100),
    lastMessage: 'Cảm ơn bạn đã quan tâm.',
    time: '12/10',
    unread: 0,
  },
];

export const mockMessages: Message[] = [
  { id: 'm1', senderId: 'tenant', text: 'Chào anh, phòng ở Quận 1 còn không ạ?', time: '10:00' },
  { id: 'm2', senderId: 'landlord', text: 'Chào bạn, phòng vẫn còn nhé.', time: '10:05' },
  { id: 'm3', senderId: 'tenant', text: 'Dạ, em muốn hẹn xem phòng vào sáng mai được không?', time: '10:10' },
  { id: 'm4', senderId: 'landlord', text: 'Được bạn nhé. Khoảng 9h30 sáng mai bạn qua địa chỉ trên tin đăng nha.', time: '10:25' },
  { id: 'm5', senderId: 'landlord', text: 'Ok bạn, hẹn gặp bạn ngày mai nhé.', time: '10:30' },
];
