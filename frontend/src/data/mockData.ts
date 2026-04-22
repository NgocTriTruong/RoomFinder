import { createPlaceholderImage } from '../utils/localImage';

export interface Room {
  id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  district: string;
  amenities: string[];
  thumbnail: string;
  isVIP: boolean;
}

export const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Phòng trọ cao cấp đầy đủ nội thất, ban công thoáng mát',
    price: 4500000,
    area: 25,
    location: '123 Nguyễn Văn Cừ, Phường 4, Quận 5',
    district: 'Quận 5',
    amenities: ['Wifi', 'Máy lạnh', 'Chỗ để xe', 'Máy giặt'],
    thumbnail: createPlaceholderImage('Phòng 1', 600, 400),
    isVIP: true,
  },
  {
    id: '2',
    title: 'Studio mini trung tâm Quận 1, an ninh 24/7',
    price: 6000000,
    area: 30,
    location: '45 Lê Lợi, Bến Nghé, Quận 1',
    district: 'Quận 1',
    amenities: ['Wifi', 'Máy lạnh', 'Chỗ để xe', 'Thang máy', 'Bảo vệ'],
    thumbnail: createPlaceholderImage('Phòng 2', 600, 400),
    isVIP: true,
  },
  {
    id: '3',
    title: 'Phòng trọ giá rẻ cho sinh viên gần ĐH KHTN',
    price: 2500000,
    area: 15,
    location: '227 Nguyễn Văn Cừ, Phường 4, Quận 5',
    district: 'Quận 5',
    amenities: ['Wifi', 'Chỗ để xe'],
    thumbnail: createPlaceholderImage('Phòng 3', 600, 400),
    isVIP: false,
  },
  {
    id: '4',
    title: 'Căn hộ dịch vụ 1PN, view thành phố cực đẹp',
    price: 8000000,
    area: 45,
    location: '88 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh',
    district: 'Bình Thạnh',
    amenities: ['Wifi', 'Máy lạnh', 'Chỗ để xe', 'Thang máy', 'Hồ bơi'],
    thumbnail: createPlaceholderImage('Phòng 4', 600, 400),
    isVIP: true,
  },
  {
    id: '5',
    title: 'Phòng trọ có gác lửng, giờ giấc tự do',
    price: 3500000,
    area: 20,
    location: '12/5 Phan Văn Trị, Phường 7, Gò Vấp',
    district: 'Gò Vấp',
    amenities: ['Wifi', 'Chỗ để xe', 'Tự do'],
    thumbnail: createPlaceholderImage('Phòng 5', 600, 400),
    isVIP: false,
  },
  {
    id: '6',
    title: 'Phòng trọ mới xây, sạch sẽ khu dân cư yên tĩnh',
    price: 3000000,
    area: 18,
    location: '55 Lê Văn Việt, Hiệp Phú, Quận 9',
    district: 'Quận 9',
    amenities: ['Wifi', 'Chỗ để xe', 'Máy lạnh'],
    thumbnail: createPlaceholderImage('Phòng 6', 600, 400),
    isVIP: false,
  },
];
