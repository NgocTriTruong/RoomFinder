import { createPlaceholderImage } from '../utils/localImage';

export interface LandlordRoom {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'pending' | 'expired';
  views: number;
  leads: number;
  thumbnail: string;
  isVIP: boolean;
}

export interface Transaction {
  id: string;
  serviceType: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
}

export interface Booking {
  id: string;
  tenantName: string;
  phone: string;
  dateTime: string;
  roomTitle: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

export const mockLandlordRooms: LandlordRoom[] = [
  {
    id: '1',
    title: 'Phòng trọ cao cấp đầy đủ nội thất, ban công thoáng mát',
    price: 4500000,
    status: 'active',
    views: 1250,
    leads: 15,
    thumbnail: createPlaceholderImage('Phòng 1', 100, 100),
    isVIP: true,
  },
  {
    id: '2',
    title: 'Studio mini trung tâm Quận 1, an ninh 24/7',
    price: 6000000,
    status: 'pending',
    views: 0,
    leads: 0,
    thumbnail: createPlaceholderImage('Phòng 2', 100, 100),
    isVIP: false,
  },
  {
    id: '3',
    title: 'Phòng trọ giá rẻ cho sinh viên gần ĐH KHTN',
    price: 2500000,
    status: 'expired',
    views: 850,
    leads: 5,
    thumbnail: createPlaceholderImage('Phòng 3', 100, 100),
    isVIP: false,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TX123456',
    serviceType: 'Mua Gói VIP 30 ngày',
    amount: 500000,
    date: '2023-10-15 14:30',
    status: 'success',
  },
  {
    id: 'TX123457',
    serviceType: 'Đẩy tin VIP (Phòng trọ cao cấp...)',
    amount: 50000,
    date: '2023-10-10 09:15',
    status: 'success',
  },
  {
    id: 'TX123458',
    serviceType: 'Mua Gói Cơ Bản',
    amount: 100000,
    date: '2023-09-01 10:00',
    status: 'failed',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'B1',
    tenantName: 'Trần Thị B',
    phone: '0987654321',
    dateTime: '2023-10-20 15:00',
    roomTitle: 'Phòng trọ cao cấp đầy đủ nội thất...',
    status: 'pending',
  },
  {
    id: 'B2',
    tenantName: 'Lê Văn C',
    phone: '0912345678',
    dateTime: '2023-10-18 09:30',
    roomTitle: 'Phòng trọ giá rẻ cho sinh viên...',
    status: 'confirmed',
  },
  {
    id: 'B3',
    tenantName: 'Phạm Thị D',
    phone: '0933445566',
    dateTime: '2023-10-15 14:00',
    roomTitle: 'Studio mini trung tâm Quận 1...',
    status: 'cancelled',
  },
];

export const mockPackages: Package[] = [
  {
    id: 'basic',
    name: 'Gói Cơ Bản',
    price: 100000,
    features: ['Đăng tối đa 5 tin', 'Hiển thị tin thường', 'Hỗ trợ email'],
    isPopular: false,
  },
  {
    id: 'standard',
    name: 'Gói Tiêu Chuẩn',
    price: 250000,
    features: ['Đăng tối đa 15 tin', 'Tặng 2 lượt đẩy tin VIP', 'Hiển thị nổi bật hơn', 'Hỗ trợ ưu tiên'],
    isPopular: true,
  },
  {
    id: 'vip',
    name: 'Gói VIP',
    price: 500000,
    features: ['Đăng tin không giới hạn', 'Tặng 10 lượt đẩy tin VIP', 'Viền vàng nổi bật', 'Hỗ trợ 24/7 qua Zalo/Phone'],
    isPopular: false,
  },
];
