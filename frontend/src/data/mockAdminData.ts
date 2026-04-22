import { createAvatarPlaceholder, createPlaceholderImage } from '../utils/localImage';

export interface AdminPost {
  id: string;
  title: string;
  landlordName: string;
  date: string;
  status: 'pending' | 'active' | 'hidden';
  thumbnail: string;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  reason: string;
  targetType: 'post' | 'user';
  targetName: string;
  status: 'unresolved' | 'resolved' | 'ignored';
  date: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'landlord';
  status: 'active' | 'locked';
  avatar: string;
  joinDate: string;
}

export interface AdminPackage {
  id: string;
  name: string;
  price: number;
  postLimit: number;
  vipPushes: number;
  status: 'active' | 'inactive';
}

export const mockAdminPosts: AdminPost[] = [
  {
    id: 'p1',
    title: 'Phòng trọ cao cấp trung tâm Quận 1, full nội thất',
    landlordName: 'Nguyễn Văn A',
    date: '2023-10-26',
    status: 'pending',
    thumbnail: createPlaceholderImage('Tin 1', 100, 100),
  },
  {
    id: 'p2',
    title: 'Studio mini giá rẻ cho sinh viên gần ĐH Bách Khoa',
    landlordName: 'Lê Thị B',
    date: '2023-10-25',
    status: 'pending',
    thumbnail: createPlaceholderImage('Tin 2', 100, 100),
  },
  {
    id: 'p3',
    title: 'Căn hộ dịch vụ 2PN view Landmark 81',
    landlordName: 'Trần C',
    date: '2023-10-24',
    status: 'active',
    thumbnail: createPlaceholderImage('Tin 3', 100, 100),
  },
  {
    id: 'p4',
    title: 'Phòng trọ an ninh, giờ giấc tự do Gò Vấp',
    landlordName: 'Phạm D',
    date: '2023-10-23',
    status: 'hidden',
    thumbnail: createPlaceholderImage('Tin 4', 100, 100),
  },
];

export const mockAdminReports: AdminReport[] = [
  {
    id: 'r1',
    reporterName: 'Trần Thị B',
    reason: 'Tin giả / Không đúng thực tế',
    targetType: 'post',
    targetName: 'Phòng trọ cao cấp trung tâm Quận 1...',
    status: 'unresolved',
    date: '2023-10-26 14:30',
  },
  {
    id: 'r2',
    reporterName: 'Lê Văn C',
    reason: 'Lừa đảo tiền cọc',
    targetType: 'user',
    targetName: 'Nguyễn Văn A (Chủ trọ)',
    status: 'unresolved',
    date: '2023-10-25 09:15',
  },
  {
    id: 'r3',
    reporterName: 'Phạm Thị D',
    reason: 'Môi giới trá hình',
    targetType: 'post',
    targetName: 'Studio mini giá rẻ cho sinh viên...',
    status: 'resolved',
    date: '2023-10-20 16:45',
  },
  {
    id: 'r4',
    reporterName: 'Hoàng E',
    reason: 'Phòng đã cho thuê nhưng không gỡ',
    targetType: 'post',
    targetName: 'Căn hộ dịch vụ 2PN view Landmark 81',
    status: 'ignored',
    date: '2023-10-18 10:00',
  },
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'landlord',
    status: 'active',
    avatar: createAvatarPlaceholder('Nguyễn Văn A', 100),
    joinDate: '2023-01-15',
  },
  {
    id: 'u2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    role: 'tenant',
    status: 'active',
    avatar: createAvatarPlaceholder('Trần Thị B', 100),
    joinDate: '2023-05-20',
  },
  {
    id: 'u3',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    role: 'tenant',
    status: 'locked',
    avatar: createAvatarPlaceholder('Lê Văn C', 100),
    joinDate: '2023-08-10',
  },
  {
    id: 'u4',
    name: 'Phạm D',
    email: 'phamd@example.com',
    role: 'landlord',
    status: 'active',
    avatar: createAvatarPlaceholder('Phạm D', 100),
    joinDate: '2023-09-05',
  },
];

export const mockAdminPackages: AdminPackage[] = [
  {
    id: 'pkg1',
    name: 'Gói Cơ Bản',
    price: 100000,
    postLimit: 5,
    vipPushes: 0,
    status: 'active',
  },
  {
    id: 'pkg2',
    name: 'Gói Tiêu Chuẩn',
    price: 250000,
    postLimit: 15,
    vipPushes: 2,
    status: 'active',
  },
  {
    id: 'pkg3',
    name: 'Gói VIP',
    price: 500000,
    postLimit: 999,
    vipPushes: 10,
    status: 'active',
  },
  {
    id: 'pkg4',
    name: 'Gói Sinh Viên (Khuyến mãi)',
    price: 50000,
    postLimit: 2,
    vipPushes: 0,
    status: 'inactive',
  },
];
