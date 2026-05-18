-- ==============================================================================
-- PREMIUM SEED DATA: 8 UNIVERSITIES, 40 ROOMS CLUSTERED, 40 APPROVED POSTS WITH VIDEOS
-- VARYING DISTANCES: ~0.3km, ~1km, ~2km, ~3.5km, ~5km (4-5km) FOR PERFECT FILTER DEMOS
-- GENERATED AUTOMATICALLY BY ANTIGRAVITY WITH ACCURATE GEODETIC GPS MATH
-- ==============================================================================

BEGIN;

-- Xóa dữ liệu cũ để tránh xung đột khóa chính hoặc dữ liệu trùng lặp
TRUNCATE TABLE blacklist, view_history, transactions, reports, vouchers, messages, conversations, favorites, reviews, bookings, subscriptions, post_images, posts, packages, room_amenities, room_images, rooms, notifications, users, universities, amenities CASCADE;

-- Khởi tạo lại Gói dịch vụ đăng tin (Packages)
INSERT INTO packages (id, name, description, price, duration_days, max_posts, type, display_order, is_featured, is_active, created_at, version)
VALUES
  (1, 'Gói Cơ Bản', 'Đăng tối đa 3 tin, thời hạn 30 ngày', 99000.0, 30, 3, 'POST_BASIC', 1, false, true, NOW(), 0),
  (2, 'Gói Tiêu Chuẩn', 'Đăng tối đa 10 tin, thời hạn 90 ngày, hỗ trợ 24/7', 249000.0, 90, 10, 'POST_STANDARD', 2, true, true, NOW(), 0),
  (3, 'Gói VIP', 'Đăng không giới hạn, ưu tiên hiển thị, thời hạn 365 ngày', 899000.0, 365, 999, 'POST_PREMIUM', 3, false, true, NOW(), 0);
SELECT setval('packages_id_seq', 3);

-- Khởi tạo lại Người dùng (Users)
INSERT INTO users (id, email, password, full_name, phone, role, status, is_verified, provider, created_at, updated_at, version, landlord_rating, total_reviews)
VALUES
  (1, 'admin@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Quản Trị Viên', '0909123456', 'ADMIN', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0),
  (2, 'landlord1@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Nguyễn Văn Minh', '0901234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.8, 12),
  (3, 'landlord2@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Trần Thị Lan', '0902234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.6, 8),
  (4, 'landlord3@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Lê Hoàng Nam', '0903234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.9, 20),
  (5, 'user1@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Phạm Minh Đức', '0904234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0),
  (6, 'user2@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Hoàng Thu Thảo', '0905234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0),
  (7, 'user3@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Đặng Nam Khánh', '0906234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0);
SELECT setval('users_id_seq', 7);

-- Khởi tạo lại Đăng ký tin của chủ trọ (Subscriptions)
INSERT INTO subscriptions (landlord_id, package_id, start_date, expires_at, is_active, remaining_posts, used_posts, max_posts, auto_renew, created_at, updated_at, version)
VALUES
  (2, 3, NOW(), NOW() + INTERVAL '365 days', true, 999, 15, 999, true, NOW(), NOW(), 0),
  (3, 3, NOW(), NOW() + INTERVAL '365 days', true, 999, 15, 999, true, NOW(), NOW(), 0),
  (4, 3, NOW(), NOW() + INTERVAL '365 days', true, 999, 15, 999, true, NOW(), NOW(), 0);

-- Khởi tạo lại Tiện ích (Amenities) - 12 tiện ích chính
INSERT INTO amenities (id, name, icon, category, is_active, display_order, created_at, updated_at, version)
VALUES
  (1, 'WiFi', 'fa-wifi', 'other', true, 1, NOW(), NOW(), 0),
  (2, 'Điều hòa', 'fa-snowflake', 'bedroom', true, 2, NOW(), NOW(), 0),
  (3, 'Nóng lạnh', 'fa-shower', 'bathroom', true, 3, NOW(), NOW(), 0),
  (4, 'Chỗ để xe', 'fa-car', 'security', true, 4, NOW(), NOW(), 0),
  (5, 'An ninh', 'fa-shield-alt', 'security', true, 5, NOW(), NOW(), 0),
  (6, 'Tủ lạnh', 'fa-box', 'kitchen', true, 6, NOW(), NOW(), 0),
  (7, 'Máy giặt', 'fa-sync', 'other', true, 7, NOW(), NOW(), 0),
  (8, 'Tivi', 'fa-tv', 'bedroom', true, 8, NOW(), NOW(), 0),
  (9, 'Bếp', 'fa-utensils', 'kitchen', true, 9, NOW(), NOW(), 0),
  (10, 'Gym', 'fa-dumbbell', 'other', true, 10, NOW(), NOW(), 0),
  (11, 'Thang máy', 'fa-elevator', 'other', true, 11, NOW(), NOW(), 0),
  (12, 'Camera an ninh', 'fa-video', 'security', true, 12, NOW(), NOW(), 0);
SELECT setval('amenities_id_seq', 12);

-- 2. BẢNG UNIVERSITIES (8 trường đại học)
INSERT INTO universities (id, created_at, updated_at, name, abbreviation, address, province, district, latitude, longitude, website, logo_url, email_domain, is_active, version)
VALUES
  (1, NOW(), NOW(), 'Trường Đại học Nông Lâm TP.HCM', 'NLU', 'Đường số 6, Phường Linh Trung, Thủ Đức, TP.HCM', 'TP Hồ Chí Minh', 'Thủ Đức', 10.87002, 106.787687, 'https://www.nlu.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/c/c7/Logo_Nong_Lam_University.svg', 'nlu.edu.vn', true, 0),
  (2, NOW(), NOW(), 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 'HCMUTE', '1 Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP.HCM', 'TP Hồ Chí Minh', 'Thủ Đức', 10.851419, 106.77197, 'https://hcmute.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/2/25/Logo_HCMUTE.png', 'hcmute.edu.vn', true, 0),
  (3, NOW(), NOW(), 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 'UIT', 'Đường Hàn Thuyên, Khu phố 6, Phường Linh Trung, Thủ Đức, TP.HCM', 'TP Hồ Chí Minh', 'Thủ Đức', 10.870009, 106.803027, 'https://www.uit.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/1/15/Logo_UIT.png', 'uit.edu.vn', true, 0),
  (4, NOW(), NOW(), 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 'HCMUT', 'Đường Tạ Quang Bửu, Khu phố Tân Lập, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 10.880312, 106.80666, 'https://www.hcmut.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/1/1b/Logo_HCMUT.svg', 'hcmut.edu.vn', true, 0),
  (5, NOW(), NOW(), 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 'HCMUS', 'Khu đô thị ĐHQG TP.HCM, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 10.875647, 106.799732, 'https://www.hcmus.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/b/b3/Logo_HCMUS.svg', 'hcmus.edu.vn', true, 0),
  (6, NOW(), NOW(), 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 'IU', 'Khu đô thị ĐHQG TP.HCM, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 10.877893, 106.801648, 'https://hcmiu.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/a/a2/Logo_HCMIU.png', 'hcmiu.edu.vn', true, 0),
  (7, NOW(), NOW(), 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 'UEH', '59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM', 'TP Hồ Chí Minh', 'Quận 3', 10.782787, 106.69612, 'https://www.ueh.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/d/d4/Logo_UEH.svg', 'ueh.edu.vn', true, 0),
  (8, NOW(), NOW(), 'Trường Đại học Ngoại thương - Cơ sở 2', 'FTU2', '15 Đường D5, Phường 25, Quận Bình Thạnh, TP.HCM', 'TP Hồ Chí Minh', 'Bình Thạnh', 10.802194, 106.714498, 'https://cs2.ftu.edu.vn', 'https://upload.wikimedia.org/wikipedia/vi/f/f5/Logo_FTU.png', 'ftu.edu.vn', true, 0);
SELECT setval('universities_id_seq', 8);

-- 3. BẢNG ROOMS VÀ POSTS (5 phòng + bài đăng cho mỗi trường với khoảng cách và giá khác nhau)

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Nông Lâm TP.HCM (NLU)
-- ==========================================

-- Phòng 1 near NLU - Khoảng cách: 0.3km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (1, 3, 'P.457', 'Số 99 Lê Văn Chí, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.867722, 106.789093, 18.0, 2, 2, 'EAST', true, false, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 64, 11, NOW() - INTERVAL '9 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 0.3, 0.27);

-- Tiện ích phòng 1
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 1
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 1 cho phòng 1 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (1, 3, 1, 'Phòng trọ mini giá rẻ sinh viên 18m2 cách NLU 0.3km - Lê Văn Chí', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 18m2 cách trường Trường Đại học Nông Lâm TP.HCM khoảng 0.3km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1700000.0, 1700000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 209, 28, 24, 2, NOW() - INTERVAL '7 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 0, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 2 near NLU - Khoảng cách: 1.09km - Giá: 3,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (2, 4, 'P.488', 'Số 115 Song Hành, Phường Bình Thọ, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Bình Thọ', 10.861983, 106.781908, 24.0, 4, 3, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80', true, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 107, 24, NOW() - INTERVAL '9 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 1.09, 0.29);

-- Tiện ích phòng 2
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 2
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 2 cho phòng 2 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (2, 4, 2, 'Căn hộ Studio gác lửng full nội thất 24m2 cách NLU 1.09km - Song Hành', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 24m2 cách trường Trường Đại học Nông Lâm TP.HCM khoảng 1.09km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3900000.0, 3900000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 298, 51, 24, 7, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 3 near NLU - Khoảng cách: 2.07km - Giá: 1,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (3, 2, 'P.494', 'Số 13 Lê Văn Chí, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.854666, 106.798365, 34.0, 3, 6, 'EAST', true, false, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', false, false, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 78, 27, NOW() - INTERVAL '8 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 2.07, 0.23);

-- Tiện ích phòng 3
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 3
INSERT INTO room_images (room_id, image_url) VALUES (3, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (3, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (3, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 3 cho phòng 3 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (3, 2, 3, 'Sleepbox cao cấp tiện nghi, bảo mật 34m2 cách NLU 2.07km - Lê Văn Chí', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 34m2 cách trường Trường Đại học Nông Lâm TP.HCM khoảng 2.07km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1600000.0, 3200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 146, 25, 18, 3, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 0, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 4 near NLU - Khoảng cách: 3.89km - Giá: 2,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (4, 3, 'P.134', 'Số 117 Nguyễn Văn Bá, Phường Hiệp Phú, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Hiệp Phú', 10.87632, 106.822735, 20.0, 2, 2, 'NORTH', true, true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', true, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 180, 12, NOW() - INTERVAL '2 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 3.89, 0.25);

-- Tiện ích phòng 4
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 4
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 4 cho phòng 4 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (4, 3, 4, 'Phòng trọ ban công thoáng mát gần trường 20m2 cách NLU 3.89km - Nguyễn Văn Bá', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 20m2 cách trường Trường Đại học Nông Lâm TP.HCM khoảng 3.89km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2500000.0, 2500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 149, 37, 6, 1, NOW() - INTERVAL '4 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 0, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 5 near NLU - Khoảng cách: 4.77km - Giá: 5,000,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (5, 4, 'P.324', 'Số 13 Đường số 12, Phường Bình Thọ, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Bình Thọ', 10.858277, 106.745651, 36.0, 3, 3, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', true, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 229, 6, NOW() - INTERVAL '4 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 4.77, 0.18);

-- Tiện ích phòng 5
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 5
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 5 cho phòng 5 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (5, 4, 5, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 36m2 cách NLU 4.77km - Đường số 12', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 36m2 cách trường Trường Đại học Nông Lâm TP.HCM khoảng 4.77km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 5000000.0, 10000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 223, 21, 20, 2, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)
-- ==========================================

-- Phòng 6 near HCMUTE - Khoảng cách: 0.31km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (6, 2, 'P.467', 'Số 108 Lê Văn Chí, Phường Linh Chiểu, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 10.849038, 106.770562, 18.0, 3, 2, 'SOUTHWEST', true, false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 212, 25, NOW() - INTERVAL '4 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 0.31, 0.16);

-- Tiện ích phòng 6
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 6
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 6 cho phòng 6 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (6, 2, 6, 'Phòng trọ mini giá rẻ sinh viên 18m2 cách HCMUTE 0.31km - Lê Văn Chí', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 18m2 cách trường Trường Đại học Sư phạm Kỹ thuật TP.HCM khoảng 0.31km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1700000.0, 3400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 365, 48, 31, 6, NOW() - INTERVAL '4 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 0, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 7 near HCMUTE - Khoảng cách: 1.06km - Giá: 4,000,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (7, 3, 'P.243', 'Số 115 Nguyễn Văn Bá, Phường Linh Chiểu, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 10.843807, 106.777843, 26.0, 5, 3, 'SOUTH', true, true, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 93, 5, NOW() - INTERVAL '9 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 1.06, 0.37);

-- Tiện ích phòng 7
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 7
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 7 cho phòng 7 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (7, 3, 7, 'Căn hộ Studio gác lửng full nội thất 26m2 cách HCMUTE 1.06km - Nguyễn Văn Bá', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 26m2 cách trường Trường Đại học Sư phạm Kỹ thuật TP.HCM khoảng 1.06km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 4000000.0, 8000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 431, 16, 32, 7, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 0, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 8 near HCMUTE - Khoảng cách: 1.89km - Giá: 1,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (8, 4, 'P.182', 'Số 78 Võ Văn Ngân, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.857434, 106.755777, 36.0, 2, 6, 'NORTHWEST', true, false, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', true, false, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 177, 30, NOW() - INTERVAL '9 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 1.89, 0.39);

-- Tiện ích phòng 8
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 8
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 8 cho phòng 8 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (8, 4, 8, 'Sleepbox cao cấp tiện nghi, bảo mật 36m2 cách HCMUTE 1.89km - Võ Văn Ngân', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 36m2 cách trường Trường Đại học Sư phạm Kỹ thuật TP.HCM khoảng 1.89km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1300000.0, 1300000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 412, 43, 18, 7, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 0, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 9 near HCMUTE - Khoảng cách: 3.81km - Giá: 2,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (9, 2, 'P.295', 'Số 85 Đường số 12, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.842563, 106.738262, 24.0, 3, 2, 'WEST', true, true, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 198, 27, NOW() - INTERVAL '5 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 3.81, 0.12);

-- Tiện ích phòng 9
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 9
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 9 cho phòng 9 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (9, 2, 9, 'Phòng trọ ban công thoáng mát gần trường 24m2 cách HCMUTE 3.81km - Đường số 12', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 24m2 cách trường Trường Đại học Sư phạm Kỹ thuật TP.HCM khoảng 3.81km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2300000.0, 4600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 398, 47, 10, 4, NOW() - INTERVAL '3 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 10 near HCMUTE - Khoảng cách: 5.21km - Giá: 5,000,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (10, 3, 'P.392', 'Số 32 Song Hành, Phường Linh Chiểu, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 10.817779, 106.805164, 36.0, 2, 3, 'NORTHWEST', true, true, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 71, 13, NOW() - INTERVAL '8 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 5.21, 0.33);

-- Tiện ích phòng 10
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 10
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 10 cho phòng 10 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (10, 3, 10, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 36m2 cách HCMUTE 5.21km - Song Hành', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 36m2 cách trường Trường Đại học Sư phạm Kỹ thuật TP.HCM khoảng 5.21km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 5000000.0, 10000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '3 days', 208, 10, 29, 4, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 0, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT)
-- ==========================================

-- Phòng 11 near UIT - Khoảng cách: 0.32km - Giá: 1,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (11, 4, 'P.468', 'Số 88 Nguyễn Văn Bá, Phường Bình Thọ, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Bình Thọ', 10.868295, 106.800676, 17.0, 5, 2, 'NORTHEAST', true, false, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 248, 10, NOW() - INTERVAL '7 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 0.32, 0.23);

-- Tiện ích phòng 11
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 11
INSERT INTO room_images (room_id, image_url) VALUES (11, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (11, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (11, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 11 cho phòng 11 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (11, 4, 11, 'Phòng trọ mini giá rẻ sinh viên 17m2 cách UIT 0.32km - Nguyễn Văn Bá', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 17m2 cách trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM khoảng 0.32km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1500000.0, 3000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 414, 32, 30, 5, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 0, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 12 near UIT - Khoảng cách: 1.05km - Giá: 3,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (12, 2, 'P.358', 'Số 87 Nguyễn Văn Bá, Phường Bình Thọ, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Bình Thọ', 10.867276, 106.812212, 26.0, 5, 3, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 75, 30, NOW() - INTERVAL '9 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 1.05, 0.36);

-- Tiện ích phòng 12
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (12, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 12
INSERT INTO room_images (room_id, image_url) VALUES (12, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (12, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (12, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 12 cho phòng 12 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (12, 2, 12, 'Căn hộ Studio gác lửng full nội thất 26m2 cách UIT 1.05km - Nguyễn Văn Bá', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 26m2 cách trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM khoảng 1.05km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3900000.0, 3900000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '5 days', 316, 12, 11, 8, NOW() - INTERVAL '4 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (12, 0, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (12, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (12, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 13 near UIT - Khoảng cách: 2.17km - Giá: 1,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (13, 3, 'P.466', 'Số 31 Song Hành, Phường Linh Chiểu, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 10.853963, 106.791718, 30.0, 4, 6, 'SOUTH', true, false, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80', false, false, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 117, 22, NOW() - INTERVAL '6 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 2.17, 0.11);

-- Tiện ích phòng 13
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (13, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 13
INSERT INTO room_images (room_id, image_url) VALUES (13, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (13, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (13, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 13 cho phòng 13 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (13, 3, 13, 'Sleepbox cao cấp tiện nghi, bảo mật 30m2 cách UIT 2.17km - Song Hành', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 30m2 cách trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM khoảng 2.17km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1500000.0, 1500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 409, 40, 22, 7, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (13, 0, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (13, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (13, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 14 near UIT - Khoảng cách: 3.41km - Giá: 2,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (14, 4, 'P.276', 'Số 22 Hoàng Diệu 2, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.843895, 106.786597, 22.0, 3, 2, 'SOUTHEAST', true, true, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 191, 8, NOW() - INTERVAL '10 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 3.41, 0.25);

-- Tiện ích phòng 14
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (14, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 14
INSERT INTO room_images (room_id, image_url) VALUES (14, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (14, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (14, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 14 cho phòng 14 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (14, 4, 14, 'Phòng trọ ban công thoáng mát gần trường 22m2 cách UIT 3.41km - Hoàng Diệu 2', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 22m2 cách trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM khoảng 3.41km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2300000.0, 4600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 447, 10, 25, 1, NOW() - INTERVAL '6 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (14, 0, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (14, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (14, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 15 near UIT - Khoảng cách: 4.61km - Giá: 4,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (15, 2, 'P.507', 'Số 103 Đường số 12, Phường Tăng Nhơn Phú A, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Tăng Nhơn Phú A', 10.83826, 106.830182, 40.0, 2, 3, 'EAST', true, true, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 42, 23, NOW() - INTERVAL '5 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 4.61, 0.11);

-- Tiện ích phòng 15
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (15, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 15
INSERT INTO room_images (room_id, image_url) VALUES (15, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (15, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (15, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 15 cho phòng 15 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (15, 2, 15, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 40m2 cách UIT 4.61km - Đường số 12', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 40m2 cách trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM khoảng 4.61km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 4400000.0, 8800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '6 days', 279, 39, 22, 1, NOW() - INTERVAL '5 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (15, 0, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (15, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (15, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT)
-- ==========================================

-- Phòng 16 near HCMUT - Khoảng cách: 0.27km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (16, 3, 'P.311', 'Số 46 Bình Đường, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.877908, 106.807071, 16.0, 2, 2, 'NORTHEAST', true, false, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 227, 20, NOW() - INTERVAL '4 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 0.27, 0.12);

-- Tiện ích phòng 16
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 16
INSERT INTO room_images (room_id, image_url) VALUES (16, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (16, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (16, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 16 cho phòng 16 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (16, 3, 16, 'Phòng trọ mini giá rẻ sinh viên 16m2 cách HCMUT 0.27km - Bình Đường', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 16m2 cách trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 0.27km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1700000.0, 3400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 374, 48, 18, 1, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (16, 0, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (16, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (16, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 17 near HCMUT - Khoảng cách: 1.02km - Giá: 3,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (17, 4, 'P.450', 'Số 68 Trần Hưng Đạo, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.888206, 106.801921, 27.0, 1, 3, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 113, 24, NOW() - INTERVAL '5 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 1.02, 0.11);

-- Tiện ích phòng 17
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (17, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 17
INSERT INTO room_images (room_id, image_url) VALUES (17, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (17, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (17, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 17 cho phòng 17 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (17, 4, 17, 'Căn hộ Studio gác lửng full nội thất 27m2 cách HCMUT 1.02km - Trần Hưng Đạo', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 27m2 cách trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 1.02km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3700000.0, 3700000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '6 days', 253, 27, 5, 1, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (17, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (17, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (17, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 18 near HCMUT - Khoảng cách: 2.0km - Giá: 1,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (18, 2, 'P.497', 'Số 96 Đường ĐHQG, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.89811, 106.804269, 28.0, 5, 6, 'NORTHWEST', true, false, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', true, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 173, 17, NOW() - INTERVAL '4 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 2.0, 0.18);

-- Tiện ích phòng 18
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (18, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 18
INSERT INTO room_images (room_id, image_url) VALUES (18, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (18, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (18, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 18 cho phòng 18 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (18, 2, 18, 'Sleepbox cao cấp tiện nghi, bảo mật 28m2 cách HCMUT 2.0km - Đường ĐHQG', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 28m2 cách trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 2.0km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1300000.0, 1300000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 447, 34, 22, 6, NOW() - INTERVAL '5 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (18, 0, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (18, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (18, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 19 near HCMUT - Khoảng cách: 3.53km - Giá: 2,100,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (19, 3, 'P.322', 'Số 23 Trần Hưng Đạo, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.911238, 106.799407, 20.0, 1, 2, 'EAST', true, true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 90, 29, NOW() - INTERVAL '9 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 3.53, 0.4);

-- Tiện ích phòng 19
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (19, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 19
INSERT INTO room_images (room_id, image_url) VALUES (19, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (19, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (19, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 19 cho phòng 19 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (19, 3, 19, 'Phòng trọ ban công thoáng mát gần trường 20m2 cách HCMUT 3.53km - Trần Hưng Đạo', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 20m2 cách trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 3.53km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2100000.0, 2100000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 423, 23, 20, 1, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (19, 0, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (19, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (19, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 20 near HCMUT - Khoảng cách: 4.7km - Giá: 5,100,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (20, 4, 'P.351', 'Số 21 Trần Hưng Đạo, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.876158, 106.763806, 36.0, 1, 3, 'EAST', true, true, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 49, 13, NOW() - INTERVAL '3 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 4.7, 0.4);

-- Tiện ích phòng 20
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (20, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 20
INSERT INTO room_images (room_id, image_url) VALUES (20, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (20, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (20, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 20 cho phòng 20 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (20, 4, 20, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 36m2 cách HCMUT 4.7km - Trần Hưng Đạo', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 36m2 cách trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 4.7km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 5100000.0, 10200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '6 days', 318, 34, 32, 5, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (20, 0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (20, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (20, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS)
-- ==========================================

-- Phòng 21 near HCMUS - Khoảng cách: 0.3km - Giá: 1,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (21, 2, 'P.256', 'Số 20 Đường ĐHQG, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.875995, 106.802416, 17.0, 5, 2, 'SOUTHWEST', true, false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 118, 30, NOW() - INTERVAL '9 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 0.3, 0.27);

-- Tiện ích phòng 21
INSERT INTO room_amenities (room_id, amenity_id) VALUES (21, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (21, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (21, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (21, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 21
INSERT INTO room_images (room_id, image_url) VALUES (21, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (21, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (21, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 21 cho phòng 21 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (21, 2, 21, 'Phòng trọ mini giá rẻ sinh viên 17m2 cách HCMUS 0.3km - Đường ĐHQG', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 17m2 cách trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 0.3km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1800000.0, 3600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '5 days', 213, 60, 29, 8, NOW() - INTERVAL '7 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (21, 0, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (21, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (21, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 22 near HCMUS - Khoảng cách: 1.05km - Giá: 3,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (22, 3, 'P.119', 'Số 103 Tân Lập, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.868776, 106.793116, 25.0, 5, 3, 'NORTHWEST', true, true, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 102, 6, NOW() - INTERVAL '4 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 1.05, 0.38);

-- Tiện ích phòng 22
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (22, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 22
INSERT INTO room_images (room_id, image_url) VALUES (22, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (22, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (22, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 22 cho phòng 22 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (22, 3, 22, 'Căn hộ Studio gác lửng full nội thất 25m2 cách HCMUS 1.05km - Tân Lập', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 25m2 cách trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 1.05km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3600000.0, 3600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 400, 21, 21, 6, NOW() - INTERVAL '6 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (22, 0, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (22, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (22, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 23 near HCMUS - Khoảng cách: 2.29km - Giá: 1,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (23, 4, 'P.340', 'Số 44 Tân Lập, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.861767, 106.784253, 37.0, 5, 6, 'SOUTHWEST', true, false, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', true, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 88, 16, NOW() - INTERVAL '10 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 2.29, 0.25);

-- Tiện ích phòng 23
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (23, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 23
INSERT INTO room_images (room_id, image_url) VALUES (23, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (23, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (23, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 23 cho phòng 23 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (23, 4, 23, 'Sleepbox cao cấp tiện nghi, bảo mật 37m2 cách HCMUS 2.29km - Tân Lập', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 37m2 cách trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 2.29km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1300000.0, 1300000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 405, 42, 9, 6, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (23, 0, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (23, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (23, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 24 near HCMUS - Khoảng cách: 3.59km - Giá: 2,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (24, 2, 'P.501', 'Số 107 Bình Đường, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.844315, 106.791642, 19.0, 2, 2, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 173, 13, NOW() - INTERVAL '9 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 3.59, 0.14);

-- Tiện ích phòng 24
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (24, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 24
INSERT INTO room_images (room_id, image_url) VALUES (24, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (24, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (24, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 24 cho phòng 24 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (24, 2, 24, 'Phòng trọ ban công thoáng mát gần trường 19m2 cách HCMUS 3.59km - Bình Đường', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 19m2 cách trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 3.59km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2500000.0, 2500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 381, 46, 7, 1, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (24, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (24, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (24, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 25 near HCMUS - Khoảng cách: 5.16km - Giá: 5,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (25, 3, 'P.130', 'Số 40 Trần Hưng Đạo, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.89845, 106.75857, 36.0, 1, 3, 'SOUTH', true, true, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 42, 27, NOW() - INTERVAL '2 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 5.16, 0.22);

-- Tiện ích phòng 25
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (25, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 25
INSERT INTO room_images (room_id, image_url) VALUES (25, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (25, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (25, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 25 cho phòng 25 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (25, 3, 25, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 36m2 cách HCMUS 5.16km - Trần Hưng Đạo', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 36m2 cách trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) khoảng 5.16km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 5300000.0, 10600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 240, 27, 23, 7, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (25, 0, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (25, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (25, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Quốc tế - ĐHQG TP.HCM (IU)
-- ==========================================

-- Phòng 26 near IU - Khoảng cách: 0.3km - Giá: 1,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (26, 4, 'P.274', 'Số 62 KDC Him Lam Phú Đông, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.87969, 106.803754, 17.0, 3, 2, 'SOUTHEAST', true, false, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 169, 17, NOW() - INTERVAL '5 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 0.3, 0.36);

-- Tiện ích phòng 26
INSERT INTO room_amenities (room_id, amenity_id) VALUES (26, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (26, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (26, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (26, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 26
INSERT INTO room_images (room_id, image_url) VALUES (26, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (26, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (26, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 26 cho phòng 26 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (26, 4, 26, 'Phòng trọ mini giá rẻ sinh viên 17m2 cách IU 0.3km - KDC Him Lam Phú Đông', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 17m2 cách trường Trường Đại học Quốc tế - ĐHQG TP.HCM khoảng 0.3km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1600000.0, 3200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 366, 14, 11, 4, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (26, 0, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (26, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (26, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 27 near IU - Khoảng cách: 0.99km - Giá: 3,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (27, 2, 'P.387', 'Số 33 Tân Lập, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.877451, 106.810701, 27.0, 5, 3, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 213, 20, NOW() - INTERVAL '5 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 0.99, 0.24);

-- Tiện ích phòng 27
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (27, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 27
INSERT INTO room_images (room_id, image_url) VALUES (27, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (27, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (27, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 27 cho phòng 27 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (27, 2, 27, 'Căn hộ Studio gác lửng full nội thất 27m2 cách IU 0.99km - Tân Lập', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 27m2 cách trường Trường Đại học Quốc tế - ĐHQG TP.HCM khoảng 0.99km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3900000.0, 3900000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 289, 23, 10, 8, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (27, 0, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (27, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (27, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 28 near IU - Khoảng cách: 1.9km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (28, 3, 'P.230', 'Số 110 Trần Hưng Đạo, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.886202, 106.816887, 29.0, 1, 6, 'WEST', true, false, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80', false, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 194, 6, NOW() - INTERVAL '9 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 1.9, 0.27);

-- Tiện ích phòng 28
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (28, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 28
INSERT INTO room_images (room_id, image_url) VALUES (28, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (28, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (28, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 28 cho phòng 28 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (28, 3, 28, 'Sleepbox cao cấp tiện nghi, bảo mật 29m2 cách IU 1.9km - Trần Hưng Đạo', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 29m2 cách trường Trường Đại học Quốc tế - ĐHQG TP.HCM khoảng 1.9km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1400000.0, 2800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 199, 30, 21, 4, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (28, 0, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (28, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (28, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 29 near IU - Khoảng cách: 3.7km - Giá: 2,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (29, 4, 'P.109', 'Số 28 Đường ĐHQG, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.875815, 106.767838, 21.0, 3, 2, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 144, 12, NOW() - INTERVAL '5 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 3.7, 0.4);

-- Tiện ích phòng 29
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (29, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 29
INSERT INTO room_images (room_id, image_url) VALUES (29, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (29, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (29, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 29 cho phòng 29 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (29, 4, 29, 'Phòng trọ ban công thoáng mát gần trường 21m2 cách IU 3.7km - Đường ĐHQG', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 21m2 cách trường Trường Đại học Quốc tế - ĐHQG TP.HCM khoảng 3.7km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2400000.0, 4800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 331, 37, 21, 4, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (29, 0, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (29, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (29, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 30 near IU - Khoảng cách: 4.77km - Giá: 4,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (30, 2, 'P.431', 'Số 62 Đường ĐHQG, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.918909, 106.814385, 35.0, 4, 3, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 213, 24, NOW() - INTERVAL '9 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 4.77, 0.27);

-- Tiện ích phòng 30
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (30, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 30
INSERT INTO room_images (room_id, image_url) VALUES (30, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (30, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (30, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 30 cho phòng 30 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (30, 2, 30, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 35m2 cách IU 4.77km - Đường ĐHQG', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 35m2 cách trường Trường Đại học Quốc tế - ĐHQG TP.HCM khoảng 4.77km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 4400000.0, 4400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 296, 20, 28, 6, NOW() - INTERVAL '3 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (30, 0, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (30, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (30, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH)
-- ==========================================

-- Phòng 31 near UEH - Khoảng cách: 0.32km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (31, 3, 'P.365', 'Số 45 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.779959, 106.696568, 17.0, 1, 2, 'NORTH', true, false, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 208, 28, NOW() - INTERVAL '2 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 0.32, 0.2);

-- Tiện ích phòng 31
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 31
INSERT INTO room_images (room_id, image_url) VALUES (31, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (31, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (31, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 31 cho phòng 31 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (31, 3, 31, 'Phòng trọ mini giá rẻ sinh viên 17m2 cách UEH 0.32km - Võ Văn Tần', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 17m2 cách trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) khoảng 0.32km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1700000.0, 1700000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 343, 56, 32, 5, NOW() - INTERVAL '5 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (31, 0, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (31, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (31, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 32 near UEH - Khoảng cách: 0.92km - Giá: 3,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (32, 4, 'P.398', 'Số 36 Nguyễn Đình Chiểu, Phường 5, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 5', 10.787294, 106.689075, 28.0, 1, 3, 'WEST', true, true, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 213, 6, NOW() - INTERVAL '6 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 0.92, 0.16);

-- Tiện ích phòng 32
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (32, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 32
INSERT INTO room_images (room_id, image_url) VALUES (32, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (32, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (32, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 32 cho phòng 32 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (32, 4, 32, 'Căn hộ Studio gác lửng full nội thất 28m2 cách UEH 0.92km - Nguyễn Đình Chiểu', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 28m2 cách trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) khoảng 0.92km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3700000.0, 7400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '3 days', 126, 56, 35, 5, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (32, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (32, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (32, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 33 near UEH - Khoảng cách: 2.25km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (33, 2, 'P.475', 'Số 82 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 6', 10.764069, 106.688179, 38.0, 1, 6, 'NORTH', true, false, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', true, false, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 217, 14, NOW() - INTERVAL '8 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 2.25, 0.37);

-- Tiện ích phòng 33
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (33, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 33
INSERT INTO room_images (room_id, image_url) VALUES (33, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (33, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (33, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 33 cho phòng 33 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (33, 2, 33, 'Sleepbox cao cấp tiện nghi, bảo mật 38m2 cách UEH 2.25km - Nguyễn Đình Chiểu', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 38m2 cách trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) khoảng 2.25km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1400000.0, 2800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '4 days', 289, 18, 21, 2, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (33, 0, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (33, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (33, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 34 near UEH - Khoảng cách: 3.59km - Giá: 2,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (34, 3, 'P.279', 'Số 25 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.813464, 106.706243, 19.0, 4, 2, 'SOUTHEAST', true, true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 249, 23, NOW() - INTERVAL '3 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 3.59, 0.27);

-- Tiện ích phòng 34
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (34, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 34
INSERT INTO room_images (room_id, image_url) VALUES (34, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (34, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (34, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 34 cho phòng 34 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (34, 3, 34, 'Phòng trọ ban công thoáng mát gần trường 19m2 cách UEH 3.59km - Võ Văn Tần', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 19m2 cách trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) khoảng 3.59km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2400000.0, 4800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '7 days', 374, 21, 6, 8, NOW() - INTERVAL '4 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (34, 0, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (34, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (34, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 35 near UEH - Khoảng cách: 5.24km - Giá: 5,100,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (35, 4, 'P.181', 'Số 63 Điện Biên Phủ, Phường 5, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 5', 10.812796, 106.733153, 41.0, 5, 3, 'SOUTHEAST', true, true, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', true, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 168, 7, NOW() - INTERVAL '4 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 5.24, 0.21);

-- Tiện ích phòng 35
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (35, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 35
INSERT INTO room_images (room_id, image_url) VALUES (35, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (35, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (35, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 35 cho phòng 35 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (35, 4, 35, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 41m2 cách UEH 5.24km - Điện Biên Phủ', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 41m2 cách trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) khoảng 5.24km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 5100000.0, 10200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 221, 51, 29, 8, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (35, 0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (35, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (35, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Ngoại thương - Cơ sở 2 (FTU2)
-- ==========================================

-- Phòng 36 near FTU2 - Khoảng cách: 0.3km - Giá: 1,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (36, 2, 'P.285', 'Số 114 Đường D5, Phường 26, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 26', 10.801938, 106.711759, 14.0, 4, 2, 'NORTH', true, false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 138, 28, NOW() - INTERVAL '8 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 0.3, 0.29);

-- Tiện ích phòng 36
INSERT INTO room_amenities (room_id, amenity_id) VALUES (36, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (36, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (36, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (36, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 36
INSERT INTO room_images (room_id, image_url) VALUES (36, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (36, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (36, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 36 cho phòng 36 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (36, 2, 36, 'Phòng trọ mini giá rẻ sinh viên 14m2 cách FTU2 0.3km - Đường D5', 'Cho thuê phòng trọ mini giá rẻ sinh viên diện tích 14m2 cách trường Trường Đại học Ngoại thương - Cơ sở 2 khoảng 0.3km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1600000.0, 3200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 281, 24, 22, 7, NOW() - INTERVAL '2 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (36, 0, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (36, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (36, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 37 near FTU2 - Khoảng cách: 0.92km - Giá: 3,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (37, 3, 'P.255', 'Số 71 Điện Biên Phủ, Phường 25, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 25', 10.810482, 106.714499, 25.0, 4, 3, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 216, 16, NOW() - INTERVAL '8 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 0.92, 0.22);

-- Tiện ích phòng 37
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (37, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 37
INSERT INTO room_images (room_id, image_url) VALUES (37, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (37, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (37, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 37 cho phòng 37 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (37, 3, 37, 'Căn hộ Studio gác lửng full nội thất 25m2 cách FTU2 0.92km - Điện Biên Phủ', 'Cho thuê căn hộ studio gác lửng full nội thất diện tích 25m2 cách trường Trường Đại học Ngoại thương - Cơ sở 2 khoảng 0.92km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 3400000.0, 3400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 289, 27, 9, 7, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (37, 0, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (37, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (37, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 38 near FTU2 - Khoảng cách: 2.3km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (38, 4, 'P.111', 'Số 100 Ung Văn Khiêm, Phường 26, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 26', 10.789298, 106.730939, 32.0, 4, 6, 'NORTHWEST', true, false, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', false, false, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 87, 23, NOW() - INTERVAL '3 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 2.3, 0.37);

-- Tiện ích phòng 38
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (38, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 38
INSERT INTO room_images (room_id, image_url) VALUES (38, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (38, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (38, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 38 cho phòng 38 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (38, 4, 38, 'Sleepbox cao cấp tiện nghi, bảo mật 32m2 cách FTU2 2.3km - Ung Văn Khiêm', 'Cho thuê sleepbox cao cấp tiện nghi, bảo mật diện tích 32m2 cách trường Trường Đại học Ngoại thương - Cơ sở 2 khoảng 2.3km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 1400000.0, 1400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 309, 10, 9, 2, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (38, 0, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (38, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (38, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 39 near FTU2 - Khoảng cách: 3.51km - Giá: 2,200,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (39, 2, 'P.382', 'Số 103 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 25', 10.798465, 106.68255, 24.0, 2, 2, 'NORTH', true, true, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 203, 27, NOW() - INTERVAL '8 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 3.51, 0.25);

-- Tiện ích phòng 39
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (39, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 39
INSERT INTO room_images (room_id, image_url) VALUES (39, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (39, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (39, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 39 cho phòng 39 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (39, 2, 39, 'Phòng trọ ban công thoáng mát gần trường 24m2 cách FTU2 3.51km - Xô Viết Nghệ Tĩnh', 'Cho thuê phòng trọ ban công thoáng mát gần trường diện tích 24m2 cách trường Trường Đại học Ngoại thương - Cơ sở 2 khoảng 3.51km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 2200000.0, 2200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 245, 24, 12, 1, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (39, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (39, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (39, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 40 near FTU2 - Khoảng cách: 4.74km - Giá: 4,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (40, 3, 'P.427', 'Số 49 Ung Văn Khiêm, Phường 17, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 17', 10.767423, 106.739544, 35.0, 1, 3, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 113, 20, NOW() - INTERVAL '9 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 4.74, 0.2);

-- Tiện ích phòng 40
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 2) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 5) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 6) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 7) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 8) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 9) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 10) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 11) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (40, 12) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 40
INSERT INTO room_images (room_id, image_url) VALUES (40, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (40, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (40, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 40 cho phòng 40 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (40, 3, 40, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 35m2 cách FTU2 4.74km - Ung Văn Khiêm', 'Cho thuê căn hộ dịch vụ 1pn sang trọng, an ninh diện tích 35m2 cách trường Trường Đại học Ngoại thương - Cơ sở 2 khoảng 4.74km. Phòng trọ cực kỳ tiện lợi, thoáng mát và sạch sẽ, thích hợp cho việc học tập lâu dài của sinh viên. Đầy đủ tiện nghi hiện đại gồm hệ thống đèn led thông minh, ổ khoá vân tay bảo mật, khu giặt sấy tiện lợi. Video thực tế của phòng được đính kèm ở bài đăng.', 4700000.0, 9400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 415, 45, 35, 3, NOW() - INTERVAL '7 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (40, 0, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (40, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (40, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

SELECT setval('rooms_id_seq', 40);
SELECT setval('posts_id_seq', 40);

-- 4. BỔ SUNG ĐÁNH GIÁ (REVIEWS) VÀ LỊCH ĐẶT (BOOKINGS) CHO CHÂN THỰC
INSERT INTO bookings (id, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note, created_at, updated_at, version)
VALUES
  (1, 5, 2, 1, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour', 'CONFIRMED', 'BK-NLU-001', 'Hẹn xem phòng lúc chiều tối mát mẻ', NOW(), NOW(), 0),
  (2, 6, 3, 6, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 1 hour', 'PENDING', 'BK-UTE-002', 'Cho em hỏi phòng có ban công ngắm cảnh được không', NOW(), NOW(), 0),
  (3, 7, 4, 11, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', 'COMPLETED', 'BK-UIT-003', 'Đã đến xem và chốt cọc luôn!', NOW() - INTERVAL '2 days', NOW(), 0);
SELECT setval('bookings_id_seq', 3);

INSERT INTO reviews (id, user_id, post_id, landlord_id, booking_id, rating, comment, is_approved, is_visible, helpful_count, created_at, updated_at, version)
VALUES
  (1, 5, 1, 2, NULL, 5, 'Phòng trọ rất đẹp sạch sẽ, gần Đại học Nông Lâm đi bộ rất tiện. Chủ nhà nhiệt tình hỗ trợ.', true, true, 10, NOW() - INTERVAL '1 day', NOW(), 0),
  (2, 6, 6, 3, NULL, 4, 'Chung cư mini an ninh cực tốt đối diện SPKT. Tiện nghi đầy đủ, wifi siêu nhanh.', true, true, 5, NOW() - INTERVAL '3 days', NOW(), 0),
  (3, 7, 11, 4, NULL, 5, 'Gần UIT cực kỳ luôn, phòng sạch thoáng và mát mẻ, đặc biệt là landlord thân thiện vô cùng!', true, true, 15, NOW() - INTERVAL '5 days', NOW(), 0);
SELECT setval('reviews_id_seq', 3);

COMMIT;

SELECT 'PREMIUM SEED DATA WITH VIDEOS AND VARIED DISTANCES LOADED SUCCESSFULLY! 8 Universities, 40 Rooms, 40 Posts created.' as status;