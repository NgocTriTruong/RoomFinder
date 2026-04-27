-- ================================================
-- TMDT Seed Data - Demo Database
-- Run: usql postgresql://admin:123456@localhost:5434/tmdt < seed_data.sql
-- ================================================

SET client_encoding = 'UTF8';

BEGIN;

-- ================================================
-- 1. USERS (delete old seed data first, then insert)
-- ================================================

DELETE FROM users WHERE email IN (
  'admin@gmail.com','landlord1@gmail.com','landlord2@gmail.com',
  'landlord3@gmail.com','user1@gmail.com','user2@gmail.com','user3@gmail.com'
);

INSERT INTO users (email, password, full_name, phone, role, status, is_verified, provider, created_at, updated_at, version, landlord_rating, total_reviews)
VALUES
  ('admin@gmail.com', '1', 'Quản Trị Viên', '0909123456', 'ADMIN', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0, 0),
  ('landlord1@gmail.com', '1', 'Nguyễn Văn A', '0901234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.5, 12),
  ('landlord2@gmail.com', '1', 'Trần Thị B', '0902234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.2, 8),
  ('landlord3@gmail.com', '1', 'Lê Hoàng C', '0903234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.8, 20),
  ('user1@gmail.com', '1', 'Phạm Minh D', '0904234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0, 0),
  ('user2@gmail.com', '1', 'Hoàng Thu E', '0905234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0, 0),
  ('user3@gmail.com', '1', 'Đặng Nam F', '0906234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0, 0);

-- ================================================
-- 2. AMENITIES
-- ================================================

DELETE FROM amenities WHERE name IN (
  'WiFi','Điều hòa','Nóng lạnh','Chỗ để xe','An ninh',
  'Tủ lạnh','Máy giặt','Tivi','Bếp','Gym','Thang máy','Camera an ninh'
);

INSERT INTO amenities (name, icon, category, is_active, display_order, created_at, updated_at, version)
VALUES
  ('WiFi', 'fa-wifi', 'other', true, 1, NOW(), NOW(), 0),
  ('Điều hòa', 'fa-snowflake', 'bedroom', true, 2, NOW(), NOW(), 0),
  ('Nóng lạnh', 'fa-shower', 'bathroom', true, 3, NOW(), NOW(), 0),
  ('Chỗ để xe', 'fa-car', 'security', true, 4, NOW(), NOW(), 0),
  ('An ninh', 'fa-shield-alt', 'security', true, 5, NOW(), NOW(), 0),
  ('Tủ lạnh', 'fa-box', 'kitchen', true, 6, NOW(), NOW(), 0),
  ('Máy giặt', 'fa-sync', 'other', true, 7, NOW(), NOW(), 0),
  ('Tivi', 'fa-tv', 'bedroom', true, 8, NOW(), NOW(), 0),
  ('Bếp', 'fa-utensils', 'kitchen', true, 9, NOW(), NOW(), 0),
  ('Gym', 'fa-dumbbell', 'other', true, 10, NOW(), NOW(), 0),
  ('Thang máy', 'fa-elevator', 'other', true, 11, NOW(), NOW(), 0),
  ('Camera an ninh', 'fa-video', 'security', true, 12, NOW(), NOW(), 0);

-- ================================================
-- 3. ROOMS (use subqueries for landlord_id)
-- ================================================

-- Xóa dữ liệu cũ theo landlord để tránh lỗi font không xóa được bằng địa chỉ
DELETE FROM rooms WHERE landlord_id IN (SELECT id FROM users WHERE email IN ('landlord1@gmail.com','landlord2@gmail.com','landlord3@gmail.com'));

INSERT INTO rooms (landlord_id, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), '123 Nguyễn Huệ, Quận 1', 'TP Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 10.7765, 106.7009, 25.0, 3, 2, 'EAST', true, false, 'https://picsum.photos/seed/room1/400/300', false, true, NULL, 'Không hút thuốc trong phòng', 150, 12, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), '45 Lê Lợi, Quận 1', 'TP Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 10.7795, 106.7035, 30.0, 5, 3, 'SOUTH', true, true, 'https://picsum.photos/seed/room2/400/300', false, true, NULL, 'Không nuôi thú cưng', 89, 7, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), '78 Pasteur, Quận 1', 'TP Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 10.7803, 106.6983, 35.0, 2, 4, 'WEST', true, true, 'https://picsum.photos/seed/room3/400/300', true, true, '22:00', 'Có giờ giới ngũ 22h', 200, 25, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord2@gmail.com'), '56 Đề Thám, Quận 3', 'TP Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7865, 106.6890, 22.0, 4, 2, 'NORTH', true, false, 'https://picsum.photos/seed/room4/400/300', false, false, NULL, NULL, 120, 10, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord2@gmail.com'), '90 Võ Văn Tần, Quận 3', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 6', 10.7880, 106.6910, 28.0, 6, 2, 'NORTHEAST', true, true, 'https://picsum.photos/seed/room5/400/300', false, true, NULL, 'Không hút thuốc', 75, 5, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), '201 Phạm Ngũ Lão, Quận 5', 'TP Hồ Chí Minh', 'Quận 5', 'Phường 3', 10.7540, 106.6790, 20.0, 1, 1, 'SOUTH', true, false, 'https://picsum.photos/seed/room6/400/300', false, false, NULL, NULL, 300, 45, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), '88 Trần Bình Trọng, Quận 5', 'TP Hồ Chí Minh', 'Quận 5', 'Phường 4', 10.7560, 106.6810, 32.0, 3, 3, 'EAST', true, true, 'https://picsum.photos/seed/room7/400/300', true, true, NULL, 'Cho phép nuôi thú cưng nhỏ', 180, 20, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), '15 Nguyễn Trãi, Quận 5', 'TP Hồ Chí Minh', 'Quận 5', 'Phường 2', 10.7510, 106.6750, 40.0, 8, 4, 'NORTHWEST', true, true, 'https://picsum.photos/seed/room8/400/300', false, true, '23:00', 'Có camera an ninh', 95, 8, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), '99 Trần Hưng Đạo, Quận 1', 'TP Hồ Chí Minh', 'Quận 1', 'Phường Cô Giang', 10.7610, 106.6940, 20.0, 2, 1, 'SOUTH', true, false, 'https://picsum.photos/seed/pending1/400/300', false, true, NULL, NULL, 0, 0, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord2@gmail.com'), '150 Cách Mạng Tháng 8, Quận 3', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 10', 10.7820, 106.6780, 45.0, 10, 4, 'EAST', true, true, 'https://picsum.photos/seed/pending2/400/300', false, true, NULL, NULL, 0, 0, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), '50 Hùng Vương, Quận 5', 'TP Hồ Chí Minh', 'Quận 5', 'Phường 9', 10.7580, 106.6710, 18.0, 1, 1, 'WEST', true, false, 'https://picsum.photos/seed/pending3/400/300', false, false, NULL, NULL, 0, 0, NOW(), NOW(), 0);

-- ================================================
-- 4. POSTS
-- ================================================

-- Xóa dữ liệu cũ theo landlord
DELETE FROM posts WHERE landlord_id IN (SELECT id FROM users WHERE email IN ('landlord1@gmail.com','landlord2@gmail.com','landlord3@gmail.com'));

INSERT INTO posts (landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'),
   (SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'),
   'Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2',
   'Phòng trọ cao cấp 25m2 tại trung tâm Quận 1, view đẹp, nội thất đầy đủ, gần trường ĐH Kinh tế. Thang máy, bảo vệ 24/7. Phù hợp cho sinh viên và người đi làm.',
   4500000.0, 9000000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', true, NOW() + INTERVAL '7 days', 350, 28, 15, 3, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord1@gmail.com'),
   (SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'),
   'Cho thuê phòng 30m2 quận 1 - full nội thất, wifi free',
   'Phòng 30m2 đầy đủ nội thất, wifi tốc độ cao miễn phí, gần siêu thị, trường học. Có ban công thoáng mát, view thành phố. An ninh tốt, có thẻ từ ra vào.',
   5500000.0, 11000000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', false, NULL, 180, 15, 8, 2, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord1@gmail.com'),
   (SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'),
   'Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ',
   'Phòng rộng 35m2 gần ĐH Y Dược, nội thất cao cấp, có gác lửng, bếp riêng. An ninh, có camera, thang máy. Phù hợp cho sinh viên y khoa.',
   6000000.0, 12000000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', true, NOW() + INTERVAL '14 days', 420, 52, 25, 8, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord2@gmail.com'),
   (SELECT id FROM rooms WHERE address='56 Đề Thám, Quận 3'),
   'Phòng trọ quận 3 - 22m2 gần BV Nhi Đồng 1, giá rẻ',
   'Phòng 22m2 gần Bệnh viện Nhi Đồng 1, khu vực yên tĩnh, an ninh tốt. Phù hợp cho sinh viên y, điều dưỡng. Có chỗ để xe máy.',
   3500000.0, 7000000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', false, NULL, 200, 18, 12, 4, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord2@gmail.com'),
   (SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'),
   'Thuê phòng 28m2 quận 3 - nội thất mới, gần ĐH Sư Phạm',
   'Phòng mới 100%, nội thất hiện đại, gần ĐH Sư Phạm, ĐH Khoa Học Tự Nhiên. Có điều hòa, nóng lạnh, wifi. An ninh 24/7.',
   4200000.0, 8400000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', false, NULL, 95, 8, 5, 1, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord3@gmail.com'),
   (SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'),
   'Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ',
   'Phòng nhỏ gọn 20m2, giá cực rẻ, gần chợ Bình Điền, siêu thị CoopMart. Phù hợp sinh viên kinh tế. Có chỗ để xe.',
   2500000.0, 5000000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', true, NOW() + INTERVAL '5 days', 500, 60, 30, 10, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord3@gmail.com'),
   (SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'),
   'Cho thuê phòng 32m2 quận 5 - pet friendly, có ban công',
   'Phòng rộng 32m2 có ban công, cho phép nuôi thú cưng nhỏ. Gần trường ĐH Bách Khoa, ĐH Kinh Tế. Đầy đủ tiện nghi, nội thất mới.',
   4800000.0, 9600000.0, 'MONTHLY', 'APPROVED', (SELECT id FROM users WHERE email='admin@gmail.com'), NOW(), NOW() + INTERVAL '30 days', false, NULL, 220, 30, 18, 6, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord3@gmail.com'),
   (SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'),
   'Thuê căn hộ mini 40m2 quận 5 - tầng cao view thành phố',
   'Căn hộ mini cao cấp 40m2, tầng 8 view thành phố, nội thất đầy đủ. Gần trường ĐH Y, ĐH Bách Khoa. Có thang máy, bảo vệ, camera.',
   7500000.0, 15000000.0, 'MONTHLY', 'PENDING', NULL, NULL, NOW() + INTERVAL '30 days', false, NULL, 30, 3, 2, 0, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord1@gmail.com'),
   (SELECT id FROM rooms WHERE address='99 Trần Hưng Đạo, Quận 1' ORDER BY id DESC LIMIT 1),
   'Phòng trọ giá sinh viên gần ĐH Văn Lang',
   'Phòng mới xây, thoáng mát, đầy đủ tiện nghi, gần trường ĐH Văn Lang CS1. Giờ giấc tự do, có chỗ để xe rộng rãi.',
   3000000.0, 3000000.0, 'MONTHLY', 'PENDING', NULL, NULL, NOW() + INTERVAL '30 days', false, NULL, 0, 0, 0, 0, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord2@gmail.com'),
   (SELECT id FROM rooms WHERE address='150 Cách Mạng Tháng 8, Quận 3' ORDER BY id DESC LIMIT 1),
   'Căn hộ dịch vụ cao cấp CMT8 full nội thất',
   'Căn hộ 45m2, 1 phòng ngủ, 1 phòng khách, bếp riêng. Tòa nhà có thang máy, bảo vệ 24/7. Nội thất cao cấp nhập khẩu.',
   12000000.0, 24000000.0, 'MONTHLY', 'PENDING', NULL, NULL, NOW() + INTERVAL '30 days', false, NULL, 0, 0, 0, 0, NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='landlord3@gmail.com'),
   (SELECT id FROM rooms WHERE address='50 Hùng Vương, Quận 5' ORDER BY id DESC LIMIT 1),
   'Ký túc xá máy lạnh gần ĐH Sư Phạm',
   'Phòng ở ghép nam/nữ riêng biệt, máy lạnh 24/24, có người dọn dép hàng tuần. Gần ĐH Sư Phạm, ĐH Sài Gòn.',
   1500000.0, 1500000.0, 'MONTHLY', 'PENDING', NULL, NULL, NOW() + INTERVAL '30 days', false, NULL, 0, 0, 0, 0, NOW(), NOW(), 0);

-- ================================================
-- 5. POST IMAGES
-- ================================================

DELETE FROM post_images WHERE post_id IN (SELECT id FROM posts);

INSERT INTO post_images (post_id, image_order, image_url)
VALUES
  ((SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'), 0, 'https://picsum.photos/seed/post1a/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'), 1, 'https://picsum.photos/seed/post1b/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'), 2, 'https://picsum.photos/seed/post1c/800/600'),
  ((SELECT id FROM posts WHERE title='Cho thuê phòng 30m2 quận 1 - full nội thất, wifi free'), 0, 'https://picsum.photos/seed/post2a/800/600'),
  ((SELECT id FROM posts WHERE title='Cho thuê phòng 30m2 quận 1 - full nội thất, wifi free'), 1, 'https://picsum.photos/seed/post2b/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'), 0, 'https://picsum.photos/seed/post3a/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'), 1, 'https://picsum.photos/seed/post3b/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'), 2, 'https://picsum.photos/seed/post3c/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'), 3, 'https://picsum.photos/seed/post3d/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ quận 3 - 22m2 gần BV Nhi Đồng 1, giá rẻ'), 0, 'https://picsum.photos/seed/post4a/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ quận 3 - 22m2 gần BV Nhi Đồng 1, giá rẻ'), 1, 'https://picsum.photos/seed/post4b/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê phòng 28m2 quận 3 - nội thất mới, gần ĐH Sư Phạm'), 0, 'https://picsum.photos/seed/post5a/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê phòng 28m2 quận 3 - nội thất mới, gần ĐH Sư Phạm'), 1, 'https://picsum.photos/seed/post5b/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ'), 0, 'https://picsum.photos/seed/post6a/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ'), 1, 'https://picsum.photos/seed/post6b/800/600'),
  ((SELECT id FROM posts WHERE title='Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ'), 2, 'https://picsum.photos/seed/post6c/800/600'),
  ((SELECT id FROM posts WHERE title='Cho thuê phòng 32m2 quận 5 - pet friendly, có ban công'), 0, 'https://picsum.photos/seed/post7a/800/600'),
  ((SELECT id FROM posts WHERE title='Cho thuê phòng 32m2 quận 5 - pet friendly, có ban công'), 1, 'https://picsum.photos/seed/post7b/800/600'),
  ((SELECT id FROM posts WHERE title='Thuê căn hộ mini 40m2 quận 5 - tầng cao view thành phố'), 0, 'https://picsum.photos/seed/post8a/800/600');

-- ================================================
-- 6. ROOM IMAGES
-- ================================================

DELETE FROM room_images WHERE room_id IN (SELECT id FROM rooms);

INSERT INTO room_images (room_id, image_url)
VALUES
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), 'https://picsum.photos/seed/room1a/800/600'),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), 'https://picsum.photos/seed/room1b/800/600'),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), 'https://picsum.photos/seed/room2a/800/600'),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), 'https://picsum.photos/seed/room3a/800/600'),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), 'https://picsum.photos/seed/room3b/800/600'),
  ((SELECT id FROM rooms WHERE address='56 Đề Thám, Quận 3'), 'https://picsum.photos/seed/room4a/800/600'),
  ((SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'), 'https://picsum.photos/seed/room5a/800/600'),
  ((SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'), 'https://picsum.photos/seed/room6a/800/600'),
  ((SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'), 'https://picsum.photos/seed/room6b/800/600'),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), 'https://picsum.photos/seed/room7a/800/600'),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), 'https://picsum.photos/seed/room8a/800/600');

-- ================================================
-- 7. ROOM AMENITIES
-- ================================================

DELETE FROM room_amenities WHERE room_id IN (SELECT id FROM rooms);

INSERT INTO room_amenities (room_id, amenity_id)
VALUES
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='Điều hòa')),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='Chỗ để xe')),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='An ninh')),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='Tủ lạnh')),
  ((SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), (SELECT id FROM amenities WHERE name='Máy giặt')),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), (SELECT id FROM amenities WHERE name='Điều hòa')),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), (SELECT id FROM amenities WHERE name='An ninh')),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), (SELECT id FROM amenities WHERE name='Tủ lạnh')),
  ((SELECT id FROM rooms WHERE address='45 Lê Lợi, Quận 1'), (SELECT id FROM amenities WHERE name='Tivi')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Điều hòa')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Chỗ để xe')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='An ninh')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Tủ lạnh')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Máy giặt')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Tivi')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Bếp')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Gym')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Thang máy')),
  ((SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), (SELECT id FROM amenities WHERE name='Camera an ninh')),
  ((SELECT id FROM rooms WHERE address='56 Đề Thám, Quận 3'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='56 Đề Thám, Quận 3'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='56 Đề Thám, Quận 3'), (SELECT id FROM amenities WHERE name='Chỗ để xe')),
  ((SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'), (SELECT id FROM amenities WHERE name='Điều hòa')),
  ((SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'), (SELECT id FROM amenities WHERE name='An ninh')),
  ((SELECT id FROM rooms WHERE address='90 Võ Văn Tần, Quận 3'), (SELECT id FROM amenities WHERE name='Tivi')),
  ((SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'), (SELECT id FROM amenities WHERE name='Chỗ để xe')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='Điều hòa')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='Chỗ để xe')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='An ninh')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='Tủ lạnh')),
  ((SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), (SELECT id FROM amenities WHERE name='Tivi')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='WiFi')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Điều hòa')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Nóng lạnh')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Chỗ để xe')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='An ninh')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Tủ lạnh')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Máy giặt')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Tivi')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Bếp')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Gym')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Thang máy')),
  ((SELECT id FROM rooms WHERE address='15 Nguyễn Trãi, Quận 5'), (SELECT id FROM amenities WHERE name='Camera an ninh'));

-- ================================================
-- 8. REVIEWS
-- ================================================

DELETE FROM reviews WHERE comment LIKE 'Phòng rất đẹp%' OR comment LIKE 'Phòng tốt%' OR comment LIKE 'Phòng trọ tuyệt vời%'
  OR comment LIKE 'Phòng nhỏ nhưng%' OR comment LIKE 'Phòng giá rẻ nhất%' OR comment LIKE 'Phòng rộng rãi%';

INSERT INTO reviews (user_id, post_id, landlord_id, booking_id, rating, comment, is_approved, is_visible, helpful_count, report_count, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='user1@gmail.com'),
   (SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'), NULL, 5,
   'Phòng rất đẹp, đúng như hình. Chủ nhà thân thiện, hỗ trợ nhiệt tình. Sẽ giới thiệu cho bạn bè!',
   true, true, 12, 0, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', 0),

  ((SELECT id FROM users WHERE email='user2@gmail.com'),
   (SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'), NULL, 4,
   'Phòng tốt, vị trí thuận tiện. Giá hơi cao so với khu vực nhưng xứng đáng.',
   true, true, 5, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', 0),

  ((SELECT id FROM users WHERE email='user1@gmail.com'),
   (SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'), NULL, 5,
   'Phòng trọ tuyệt vời! Gần trường Y, nội thất đầy đủ, an ninh tốt. Đặc biệt có thang máy rất tiện lợi.',
   true, true, 20, 0, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 0),

  ((SELECT id FROM users WHERE email='user3@gmail.com'),
   (SELECT id FROM posts WHERE title='Phòng trọ quận 3 - 22m2 gần BV Nhi Đồng 1, giá rẻ'),
   (SELECT id FROM users WHERE email='landlord2@gmail.com'), NULL, 4,
   'Phòng nhỏ nhưng sạch sẽ, chủ nhà tốt. Phù hợp sinh viên. Gần Bệnh viện Nhi Đồng thuận tiện đi thực tập.',
   true, true, 8, 0, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 0),

  ((SELECT id FROM users WHERE email='user2@gmail.com'),
   (SELECT id FROM posts WHERE title='Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ'),
   (SELECT id FROM users WHERE email='landlord3@gmail.com'), NULL, 5,
   'Phòng giá rẻ nhất mà chất lượng vẫn tốt. Gần chợ Bình Điền tiện mua sắm. Rất hài lòng!',
   true, true, 15, 0, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 0),

  ((SELECT id FROM users WHERE email='user3@gmail.com'),
   (SELECT id FROM posts WHERE title='Cho thuê phòng 32m2 quận 5 - pet friendly, có ban công'),
   (SELECT id FROM users WHERE email='landlord3@gmail.com'), NULL, 4,
   'Phòng rộng rãi, có ban công thoáng mát. Được nuôi mèo nên rất vui! Chủ nhà cho gia hạn linh hoạt.',
   true, true, 7, 0, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', 0);

-- ================================================
-- 9. BOOKINGS
-- ================================================

DELETE FROM bookings WHERE note LIKE 'Muốn xem phòng%' OR note LIKE 'Hẹn xem phòng%' OR note LIKE 'Sinh viên mới%' OR note LIKE 'Có thú cưng%';

INSERT INTO bookings (user_id, post_id, landlord_id, booking_time, end_time, status, note, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='user1@gmail.com'),
   (SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'),
   NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 30 minutes', 'CONFIRMED',
   'Muốn xem phòng vào buổi sáng', NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='user2@gmail.com'),
   (SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'),
   NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 30 minutes', 'CONFIRMED',
   'Hẹn xem phòng chiều', NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='user3@gmail.com'),
   (SELECT id FROM posts WHERE title='Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ'),
   (SELECT id FROM users WHERE email='landlord3@gmail.com'),
   NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 30 minutes', 'PENDING',
   'Sinh viên mới, muốn xem phòng giá rẻ', NOW(), NOW(), 0),

  ((SELECT id FROM users WHERE email='user1@gmail.com'),
   (SELECT id FROM posts WHERE title='Cho thuê phòng 32m2 quận 5 - pet friendly, có ban công'),
   (SELECT id FROM users WHERE email='landlord3@gmail.com'),
   NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 30 minutes', 'CONFIRMED',
   'Có thú cưng, muốn hỏi kỹ quy định', NOW(), NOW(), 0);

-- ================================================
-- 10. FAVORITES
-- ================================================

DELETE FROM favorites WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('user1@gmail.com','user2@gmail.com','user3@gmail.com')
);

INSERT INTO favorites (user_id, room_id, created_at)
VALUES
  ((SELECT id FROM users WHERE email='user1@gmail.com'), (SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), NOW()),
  ((SELECT id FROM users WHERE email='user1@gmail.com'), (SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), NOW()),
  ((SELECT id FROM users WHERE email='user1@gmail.com'), (SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'), NOW()),
  ((SELECT id FROM users WHERE email='user1@gmail.com'), (SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), NOW()),
  ((SELECT id FROM users WHERE email='user2@gmail.com'), (SELECT id FROM rooms WHERE address='123 Nguyễn Huệ, Quận 1'), NOW()),
  ((SELECT id FROM users WHERE email='user2@gmail.com'), (SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), NOW()),
  ((SELECT id FROM users WHERE email='user2@gmail.com'), (SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), NOW()),
  ((SELECT id FROM users WHERE email='user3@gmail.com'), (SELECT id FROM rooms WHERE address='78 Pasteur, Quận 1'), NOW()),
  ((SELECT id FROM users WHERE email='user3@gmail.com'), (SELECT id FROM rooms WHERE address='201 Phạm Ngũ Lão, Quận 5'), NOW()),
  ((SELECT id FROM users WHERE email='user3@gmail.com'), (SELECT id FROM rooms WHERE address='88 Trần Bình Trọng, Quận 5'), NOW());

-- ================================================
-- 11. VOUCHERS
-- ================================================

DELETE FROM vouchers WHERE code IN ('WELCOME50','SUMMER2026','FIRSTBOOKING','VIPROOM');

INSERT INTO vouchers (code, name, description, discount_type, discount, min_order_amount, max_discount_amount, valid_from, expires_at, total_quantity, remaining_quantity, used_count, is_active, created_at, updated_at, version)
VALUES
  ('WELCOME50', 'Chào mừng sinh viên mới', 'Giảm 50K cho đơn từ 500K', 'FIXED', 50000.0, 500000.0, 50000.0, NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days', 100, 100, 0, true, NOW(), NOW(), 0),
  ('SUMMER2026', 'Khuyến mãi mùa hè', 'Giảm 10% cho tất cả phòng', 'PERCENTAGE', 10.0, 0.0, 200000.0, NOW() - INTERVAL '5 days', NOW() + INTERVAL '60 days', 200, 200, 0, true, NOW(), NOW(), 0),
  ('FIRSTBOOKING', 'Lần đầu đặt lịch', 'Giảm 100K cho lần đặt lịch đầu tiên', 'FIXED', 100000.0, 0.0, 100000.0, NOW(), NOW() + INTERVAL '90 days', 500, 500, 0, true, NOW(), NOW(), 0),
  ('VIPROOM', 'Phòng VIP giảm 15%', 'Giảm 15% cho phòng VIP', 'PERCENTAGE', 15.0, 1000000.0, 500000.0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '15 days', 50, 50, 0, true, NOW(), NOW(), 0);

-- ================================================
-- 12. PACKAGES
-- ================================================

DELETE FROM packages WHERE name IN ('Gói Cơ Bản','Gói Tiêu Chuẩn','Gói VIP');

INSERT INTO packages (name, description, price, duration_days, max_posts, type, display_order, is_featured, is_active, created_at, version)
VALUES
  ('Gói Cơ Bản', 'Đăng tối đa 3 tin, thời hạn 30 ngày', 99000.0, 30, 3, 'POST_BASIC', 1, false, true, NOW(), 0),
  ('Gói Tiêu Chuẩn', 'Đăng tối đa 10 tin, thời hạn 90 ngày, hỗ trợ 24/7', 249000.0, 90, 10, 'POST_STANDARD', 2, true, true, NOW(), 0),
  ('Gói VIP', 'Đăng không giới hạn, ưu tiên hiển thị, thời hạn 365 ngày', 899000.0, 365, 999, 'POST_PREMIUM', 3, false, true, NOW(), 0);

-- ================================================
-- 13. SUBSCRIPTIONS
-- ================================================

DELETE FROM subscriptions WHERE landlord_id IN (
  SELECT id FROM users WHERE email IN ('landlord1@gmail.com','landlord2@gmail.com','landlord3@gmail.com')
);

INSERT INTO subscriptions (landlord_id, package_id, start_date, expires_at, is_active, remaining_posts, used_posts, max_posts, auto_renew, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), (SELECT id FROM packages WHERE name='Gói Tiêu Chuẩn'), NOW(), NOW() + INTERVAL '90 days', true, 8, 2, 10, true, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord2@gmail.com'), (SELECT id FROM packages WHERE name='Gói Cơ Bản'), NOW(), NOW() + INTERVAL '30 days', true, 2, 1, 3, false, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), (SELECT id FROM packages WHERE name='Gói VIP'), NOW(), NOW() + INTERVAL '365 days', true, 995, 5, 999, true, NOW(), NOW(), 0);

-- ================================================
-- 14. VIEW HISTORY
-- ================================================

DELETE FROM view_history WHERE landlord_id IN (
  SELECT id FROM users WHERE email IN ('landlord1@gmail.com','landlord2@gmail.com','landlord3@gmail.com')
);

INSERT INTO view_history (post_id, landlord_id, view_date, view_count, contact_count, created_at, updated_at, version)
VALUES
  ((SELECT id FROM posts WHERE title='Phòng trọ cao cấp view sông Sài Gòn, gần quận 1 - 25m2'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'), CURRENT_DATE, 1, 0, NOW(), NOW(), 0),
  ((SELECT id FROM posts WHERE title='Thuê phòng trọ 35m2 Pasteur - gần trường Y, tiện nghi đầy đủ'),
   (SELECT id FROM users WHERE email='landlord1@gmail.com'), CURRENT_DATE, 1, 0, NOW(), NOW(), 0),
  ((SELECT id FROM posts WHERE title='Phòng trọ 20m2 quận 5 - rẻ nhất khu vực, gần chợ'),
   (SELECT id FROM users WHERE email='landlord3@gmail.com'), CURRENT_DATE, 1, 0, NOW(), NOW(), 0),
  ((SELECT id FROM posts WHERE title='Cho thuê phòng 32m2 quận 5 - pet friendly, có ban công'),
   (SELECT id FROM users WHERE email='landlord3@gmail.com'), CURRENT_DATE, 1, 0, NOW(), NOW(), 0);

-- ================================================
-- 15. NOTIFICATIONS
-- ================================================

DELETE FROM notifications WHERE title IN ('Lịch xem phòng được xác nhận', 'Có phòng mới phù hợp', 'Có lịch xem phòng mới', 'Phòng được yêu thích nhiều');
INSERT INTO notifications (user_id, title, content, type, is_read, created_at)
VALUES
  ((SELECT id FROM users WHERE email='user1@gmail.com'), 'Lịch xem phòng được xác nhận', 'Lịch xem phòng tại 123 Nguyễn Huệ vào ngày mai đã được xác nhận.', 'BOOKING', false, NOW()),
  ((SELECT id FROM users WHERE email='user2@gmail.com'), 'Có phòng mới phù hợp', 'Phòng trọ 35m2 Pasteur vừa được đăng, phù hợp với tiêu chí của bạn!', 'POST', false, NOW()),
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), 'Có lịch xem phòng mới', 'Người dùng Phạm Minh D muốn xem phòng tại 123 Nguyễn Huệ.', 'BOOKING', false, NOW()),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), 'Phòng được yêu thích nhiều', 'Phòng của bạn tại quận 5 vừa được thêm vào yêu thích.', 'FAVORITE', false, NOW());

-- ================================================
-- 16. BLACKLIST
-- ================================================

-- 1. Xóa các bảng tham chiếu đến User vi phạm trước (để tránh lỗi Khóa ngoại)
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email IN ('baduser1@gmail.com', 'baduser2@gmail.com'));
DELETE FROM blacklist WHERE user_id IN (SELECT id FROM users WHERE email IN ('baduser1@gmail.com', 'baduser2@gmail.com'));
-- 2. Xóa User cũ (nếu có)
DELETE FROM users WHERE email IN ('baduser1@gmail.com', 'baduser2@gmail.com');
-- 3. Chèn lại User mới
INSERT INTO users (email, password, full_name, phone, role, status, is_verified, provider, created_at, updated_at, version)
VALUES 
  ('baduser1@gmail.com', '1', 'Kẻ Gian Lận 1', '0999111222', 'USER', 'LOCKED', true, 'LOCAL', NOW(), NOW(), 0),
  ('baduser2@gmail.com', '1', 'Kẻ Gian Lận 2', '0999333444', 'LANDLORD', 'LOCKED', true, 'LOCAL', NOW(), NOW(), 0);
-- 4. Chèn vào Blacklist
INSERT INTO blacklist (user_id, reason, type, is_permanent, expires_at, added_by, is_active, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='baduser1@gmail.com'), 'Spam tin nhắn lừa đảo người dùng khác', 'PERMANENT', true, NULL, (SELECT id FROM users WHERE email='admin@gmail.com'), true, NOW() - INTERVAL '2 days', NOW(), 0),
  ((SELECT id FROM users WHERE email='baduser2@gmail.com'), 'Đăng tin giả mạo, không đúng thực tế nhiều lần', 'TEMPORARY', false, NOW() + INTERVAL '30 days', (SELECT id FROM users WHERE email='admin@gmail.com'), true, NOW() - INTERVAL '1 day', NOW(), 0);
COMMIT;

-- ================================================
-- VERIFY
-- ================================================

SELECT 'Users:' as info, COUNT(*) as count FROM users
UNION ALL SELECT 'Blacklist:', COUNT(*) FROM blacklist
UNION ALL SELECT 'Landlords:', COUNT(*) FROM users WHERE role = 'LANDLORD'
UNION ALL SELECT 'Posts:', COUNT(*) FROM posts
UNION ALL SELECT 'Approved Posts:', COUNT(*) FROM posts WHERE status = 'APPROVED'
UNION ALL SELECT 'Rooms:', COUNT(*) FROM rooms
UNION ALL SELECT 'Amenities:', COUNT(*) FROM amenities
UNION ALL SELECT 'Reviews:', COUNT(*) FROM reviews
UNION ALL SELECT 'Bookings:', COUNT(*) FROM bookings
UNION ALL SELECT 'Favorites:', COUNT(*) FROM favorites
UNION ALL SELECT 'Vouchers:', COUNT(*) FROM vouchers
UNION ALL SELECT 'Packages:', COUNT(*) FROM packages
UNION ALL SELECT 'Subscriptions:', COUNT(*) FROM subscriptions;

-- Show admin account
SELECT email, full_name, role, status FROM users WHERE email = 'admin@gmail.com';
