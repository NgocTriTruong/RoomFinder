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

-- Phòng 1 near NLU - Khoảng cách: 0.31km - Giá: 1,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (1, 3, 'P.288', 'Số 87 Nguyễn Văn Bá, Phường Bình Thọ, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Bình Thọ', 10.868828, 106.790234, 14.0, 4, 2, 'WEST', true, false, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 138, 25, NOW() - INTERVAL '2 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 0.31, 0.14);

-- Tiện ích phòng 1
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 1
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 1 cho phòng 1 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (1, 3, 1, 'Phòng trọ mini giá rẻ sinh viên 14m2 cách NLU 0.31km - Nguyễn Văn Bá', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Nguyễn Văn Bá, Phường Bình Thọ, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Nông Lâm TP.HCM (NLU) khoảng 0.31km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 14m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,500,000 đ/tháng.
- Tiền đặt cọc: 1,500,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1500000.0, 1500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '4 days', 185, 33, 26, 2, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 0, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 2 near NLU - Khoảng cách: 1.09km - Giá: 3,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (2, 4, 'P.204', 'Số 55 Song Hành, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.86538, 106.796503, 28.0, 3, 3, 'SOUTH', true, true, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 233, 11, NOW() - INTERVAL '5 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 1.09, 0.3);

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
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 2 cho phòng 2 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (2, 4, 2, 'Căn hộ Studio gác lửng full nội thất 28m2 cách NLU 1.09km - Song Hành', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Song Hành, Phường Linh Trung, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Nông Lâm TP.HCM (NLU) khoảng 1.09km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 28m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,800,000 đ/tháng.
- Tiền đặt cọc: 3,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3800000.0, 3800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 136, 55, 7, 4, NOW() - INTERVAL '5 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 3 near NLU - Khoảng cách: 2.05km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (3, 2, 'P.193', 'Số 81 Đường số 5, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.857122, 106.801048, 27.0, 2, 6, 'SOUTH', true, false, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', false, false, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 99, 30, NOW() - INTERVAL '10 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 2.05, 0.29);

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
INSERT INTO room_images (room_id, image_url) VALUES (3, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 3 cho phòng 3 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (3, 2, 3, 'Sleepbox cao cấp tiện nghi, bảo mật 27m2 cách NLU 2.05km - Đường số 5', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường số 5, Phường Linh Trung, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Nông Lâm TP.HCM (NLU) khoảng 2.05km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 27m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,700,000 đ/tháng.
- Tiền đặt cọc: 1,700,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1700000.0, 1700000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 397, 56, 30, 6, NOW() - INTERVAL '3 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 0, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 4 near NLU - Khoảng cách: 3.73km - Giá: 2,100,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (4, 3, 'P.403', 'Số 111 Đường số 12, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.848925, 106.814249, 24.0, 2, 2, 'SOUTHEAST', true, true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 111, 26, NOW() - INTERVAL '8 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 3.73, 0.18);

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
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 4 cho phòng 4 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (4, 3, 4, 'Phòng trọ ban công thoáng mát gần trường 24m2 cách NLU 3.73km - Đường số 12', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường số 12, Phường Linh Trung, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Nông Lâm TP.HCM (NLU) khoảng 3.73km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 24m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,100,000 đ/tháng.
- Tiền đặt cọc: 2,100,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2100000.0, 2100000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 336, 58, 20, 7, NOW() - INTERVAL '3 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 0, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 5 near NLU - Khoảng cách: 5.02km - Giá: 5,100,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (5, 4, 'P.493', 'Số 68 Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 10.901988, 106.755231, 39.0, 5, 3, 'WEST', true, true, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 126, 27, NOW() - INTERVAL '8 days', NOW(), 0, 1, 'Trường Đại học Nông Lâm TP.HCM', 5.02, 0.24);

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
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 5 cho phòng 5 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (5, 4, 5, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 39m2 cách NLU 5.02km - Võ Văn Ngân', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Nông Lâm TP.HCM (NLU) khoảng 5.02km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 39m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 5,100,000 đ/tháng.
- Tiền đặt cọc: 10,200,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 5100000.0, 10200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 124, 58, 14, 4, NOW() - INTERVAL '2 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)
-- ==========================================

-- Phòng 6 near HCMUTE - Khoảng cách: 0.32km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (6, 2, 'P.287', 'Số 43 Lê Văn Chí, Phường Hiệp Phú, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Hiệp Phú', 10.854206, 106.771109, 18.0, 2, 2, 'EAST', true, false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 170, 15, NOW() - INTERVAL '3 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 0.32, 0.26);

-- Tiện ích phòng 6
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 6
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 6 cho phòng 6 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (6, 2, 6, 'Phòng trọ mini giá rẻ sinh viên 18m2 cách HCMUTE 0.32km - Lê Văn Chí', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Lê Văn Chí, Phường Hiệp Phú, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE) khoảng 0.32km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 18m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,700,000 đ/tháng.
- Tiền đặt cọc: 1,700,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1700000.0, 1700000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 415, 45, 20, 1, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 0, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 7 near HCMUTE - Khoảng cách: 1.0km - Giá: 3,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (7, 3, 'P.179', 'Số 82 Lê Văn Chí, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.844407, 106.777751, 26.0, 1, 3, 'NORTHWEST', true, true, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 98, 27, NOW() - INTERVAL '5 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 1.0, 0.16);

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
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 7 cho phòng 7 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (7, 3, 7, 'Căn hộ Studio gác lửng full nội thất 26m2 cách HCMUTE 1.0km - Lê Văn Chí', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Lê Văn Chí, Phường Linh Tây, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE) khoảng 1.00km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 26m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,900,000 đ/tháng.
- Tiền đặt cọc: 3,900,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3900000.0, 3900000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 330, 12, 14, 4, NOW() - INTERVAL '4 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 0, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 8 near HCMUTE - Khoảng cách: 2.28km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (8, 4, 'P.461', 'Số 45 Song Hành, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.868085, 106.759825, 26.0, 5, 6, 'NORTH', true, false, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', false, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 152, 22, NOW() - INTERVAL '9 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 2.28, 0.32);

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
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 8 cho phòng 8 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (8, 4, 8, 'Sleepbox cao cấp tiện nghi, bảo mật 26m2 cách HCMUTE 2.28km - Song Hành', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Song Hành, Phường Linh Tây, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE) khoảng 2.28km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 26m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,400,000 đ/tháng.
- Tiền đặt cọc: 1,400,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1400000.0, 1400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 335, 23, 32, 1, NOW() - INTERVAL '1 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 0, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 9 near HCMUTE - Khoảng cách: 3.31km - Giá: 2,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (9, 2, 'P.430', 'Số 90 Võ Văn Ngân, Phường Tăng Nhơn Phú A, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Tăng Nhơn Phú A', 10.843838, 106.801307, 21.0, 1, 2, 'WEST', true, true, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 72, 22, NOW() - INTERVAL '8 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 3.31, 0.26);

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
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 9 cho phòng 9 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (9, 2, 9, 'Phòng trọ ban công thoáng mát gần trường 21m2 cách HCMUTE 3.31km - Võ Văn Ngân', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Võ Văn Ngân, Phường Tăng Nhơn Phú A, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE) khoảng 3.31km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 21m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,500,000 đ/tháng.
- Tiền đặt cọc: 2,500,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2500000.0, 2500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 265, 19, 6, 3, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 10 near HCMUTE - Khoảng cách: 4.69km - Giá: 5,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (10, 3, 'P.396', 'Số 60 Nguyễn Văn Bá, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.834782, 106.732496, 39.0, 3, 3, 'NORTH', true, true, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 113, 11, NOW() - INTERVAL '3 days', NOW(), 0, 2, 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 4.69, 0.12);

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
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 10 cho phòng 10 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (10, 3, 10, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 39m2 cách HCMUTE 4.69km - Nguyễn Văn Bá', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Nguyễn Văn Bá, Phường Linh Trung, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE) khoảng 4.69km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 39m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 5,300,000 đ/tháng.
- Tiền đặt cọc: 10,600,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 5300000.0, 10600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 147, 41, 12, 4, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 0, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT)
-- ==========================================

-- Phòng 11 near UIT - Khoảng cách: 0.32km - Giá: 1,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (11, 4, 'P.245', 'Số 120 Đường số 12, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.867502, 106.801512, 15.0, 2, 2, 'NORTHEAST', true, false, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 145, 6, NOW() - INTERVAL '6 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 0.32, 0.21);

-- Tiện ích phòng 11
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (11, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 11
INSERT INTO room_images (room_id, image_url) VALUES (11, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (11, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (11, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 11 cho phòng 11 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (11, 4, 11, 'Phòng trọ mini giá rẻ sinh viên 15m2 cách UIT 0.32km - Đường số 12', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường số 12, Phường Linh Tây, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT) khoảng 0.32km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 15m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,500,000 đ/tháng.
- Tiền đặt cọc: 3,000,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1500000.0, 3000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 210, 54, 12, 1, NOW() - INTERVAL '6 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 0, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 12 near UIT - Khoảng cách: 1.07km - Giá: 3,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (12, 2, 'P.178', 'Số 119 Đường số 12, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.873126, 106.812331, 29.0, 2, 3, 'NORTH', true, true, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 92, 8, NOW() - INTERVAL '6 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 1.07, 0.14);

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
INSERT INTO room_images (room_id, image_url) VALUES (12, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (12, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 12 cho phòng 12 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (12, 2, 12, 'Căn hộ Studio gác lửng full nội thất 29m2 cách UIT 1.07km - Đường số 12', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường số 12, Phường Linh Trung, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT) khoảng 1.07km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 29m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,800,000 đ/tháng.
- Tiền đặt cọc: 3,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3800000.0, 3800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 408, 45, 5, 3, NOW() - INTERVAL '4 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (12, 0, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (12, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (12, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 13 near UIT - Khoảng cách: 2.25km - Giá: 1,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (13, 3, 'P.266', 'Số 9 Đường số 5, Phường Linh Trung, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Trung', 10.88308, 106.787257, 25.0, 5, 6, 'SOUTHEAST', true, false, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80', true, false, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 198, 30, NOW() - INTERVAL '10 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 2.25, 0.1);

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
INSERT INTO room_images (room_id, image_url) VALUES (13, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 13 cho phòng 13 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (13, 3, 13, 'Sleepbox cao cấp tiện nghi, bảo mật 25m2 cách UIT 2.25km - Đường số 5', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường số 5, Phường Linh Trung, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT) khoảng 2.25km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 25m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,500,000 đ/tháng.
- Tiền đặt cọc: 1,500,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1500000.0, 1500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '5 days', 173, 58, 12, 2, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (13, 0, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (13, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (13, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 14 near UIT - Khoảng cách: 3.91km - Giá: 2,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (14, 4, 'P.129', 'Số 53 Võ Văn Ngân, Phường Linh Tây, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Linh Tây', 10.88173, 106.769279, 19.0, 1, 2, 'SOUTHEAST', true, true, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 106, 13, NOW() - INTERVAL '2 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 3.91, 0.39);

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
INSERT INTO room_images (room_id, image_url) VALUES (14, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (14, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 14 cho phòng 14 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (14, 4, 14, 'Phòng trọ ban công thoáng mát gần trường 19m2 cách UIT 3.91km - Võ Văn Ngân', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Võ Văn Ngân, Phường Linh Tây, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT) khoảng 3.91km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 19m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,300,000 đ/tháng.
- Tiền đặt cọc: 4,600,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2300000.0, 4600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 443, 55, 10, 2, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (14, 0, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (14, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (14, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 15 near UIT - Khoảng cách: 5.47km - Giá: 5,100,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (15, 2, 'P.338', 'Số 76 Song Hành, Phường Tăng Nhơn Phú A, Thủ Đức, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Thủ Đức', 'Tăng Nhơn Phú A', 10.914829, 106.823708, 45.0, 2, 3, 'SOUTH', true, true, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 249, 12, NOW() - INTERVAL '2 days', NOW(), 0, 3, 'Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM', 5.47, 0.38);

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
INSERT INTO room_images (room_id, image_url) VALUES (15, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (15, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 15 cho phòng 15 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (15, 2, 15, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 45m2 cách UIT 5.47km - Song Hành', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Song Hành, Phường Tăng Nhơn Phú A, Thủ Đức.
- Chỉ cách khuôn viên trường Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM (UIT) khoảng 5.47km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 45m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 5,100,000 đ/tháng.
- Tiền đặt cọc: 5,100,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 5100000.0, 5100000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '7 days', 391, 60, 13, 8, NOW() - INTERVAL '8 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (15, 0, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (15, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (15, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT)
-- ==========================================

-- Phòng 16 near HCMUT - Khoảng cách: 0.29km - Giá: 1,700,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (16, 3, 'P.393', 'Số 13 Trần Hưng Đạo, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.881106, 106.80922, 14.0, 2, 2, 'SOUTH', true, false, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 118, 29, NOW() - INTERVAL '9 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 0.29, 0.22);

-- Tiện ích phòng 16
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (16, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 16
INSERT INTO room_images (room_id, image_url) VALUES (16, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (16, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (16, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 16 cho phòng 16 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (16, 3, 16, 'Phòng trọ mini giá rẻ sinh viên 14m2 cách HCMUT 0.29km - Trần Hưng Đạo', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Trần Hưng Đạo, Phường Tân Đông Hiệp, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT) khoảng 0.29km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 14m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,700,000 đ/tháng.
- Tiền đặt cọc: 1,700,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1700000.0, 1700000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 138, 54, 19, 5, NOW() - INTERVAL '4 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (16, 0, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (16, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (16, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 17 near HCMUT - Khoảng cách: 1.04km - Giá: 3,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (17, 4, 'P.378', 'Số 38 Đường ĐHQG, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.879104, 106.816109, 29.0, 2, 3, 'SOUTH', true, true, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 77, 17, NOW() - INTERVAL '7 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 1.04, 0.3);

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
INSERT INTO room_images (room_id, image_url) VALUES (17, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 17 cho phòng 17 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (17, 4, 17, 'Căn hộ Studio gác lửng full nội thất 29m2 cách HCMUT 1.04km - Đường ĐHQG', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường ĐHQG, Phường Đông Hòa, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT) khoảng 1.04km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 29m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,800,000 đ/tháng.
- Tiền đặt cọc: 7,600,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3800000.0, 7600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 189, 12, 9, 1, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (17, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (17, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (17, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 18 near HCMUT - Khoảng cách: 2.22km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (18, 2, 'P.319', 'Số 17 Tân Lập, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.894108, 106.821303, 33.0, 5, 6, 'NORTHWEST', true, false, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', false, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 194, 18, NOW() - INTERVAL '7 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 2.22, 0.33);

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
INSERT INTO room_images (room_id, image_url) VALUES (18, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (18, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 18 cho phòng 18 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (18, 2, 18, 'Sleepbox cao cấp tiện nghi, bảo mật 33m2 cách HCMUT 2.22km - Tân Lập', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Tân Lập, Phường Đông Hòa, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT) khoảng 2.22km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 33m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,400,000 đ/tháng.
- Tiền đặt cọc: 2,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1400000.0, 2800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 197, 27, 31, 2, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (18, 0, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (18, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (18, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 19 near HCMUT - Khoảng cách: 3.84km - Giá: 2,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (19, 3, 'P.432', 'Số 94 Bình Đường, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.846533, 106.799289, 21.0, 1, 2, 'EAST', true, true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 144, 11, NOW() - INTERVAL '5 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 3.84, 0.38);

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
INSERT INTO room_images (room_id, image_url) VALUES (19, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (19, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 19 cho phòng 19 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (19, 3, 19, 'Phòng trọ ban công thoáng mát gần trường 21m2 cách HCMUT 3.84km - Bình Đường', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Bình Đường, Phường Tân Đông Hiệp, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT) khoảng 3.84km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 21m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,400,000 đ/tháng.
- Tiền đặt cọc: 4,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2400000.0, 4800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 152, 31, 32, 3, NOW() - INTERVAL '3 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (19, 0, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (19, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (19, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 20 near HCMUT - Khoảng cách: 4.85km - Giá: 5,300,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (20, 4, 'P.203', 'Số 120 KDC Him Lam Phú Đông, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.886902, 106.762796, 42.0, 1, 3, 'SOUTHWEST', true, true, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', true, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 156, 13, NOW() - INTERVAL '7 days', NOW(), 0, 4, 'Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)', 4.85, 0.29);

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
VALUES (20, 4, 20, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 42m2 cách HCMUT 4.85km - KDC Him Lam Phú Đông', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: KDC Him Lam Phú Đông, Phường Đông Hòa, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUT) khoảng 4.85km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 42m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 5,300,000 đ/tháng.
- Tiền đặt cọc: 5,300,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 5300000.0, 5300000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 351, 14, 16, 8, NOW() - INTERVAL '8 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (20, 0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (20, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (20, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS)
-- ==========================================

-- Phòng 21 near HCMUS - Khoảng cách: 0.28km - Giá: 1,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (21, 2, 'P.464', 'Số 46 Tân Lập, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.876917, 106.801974, 15.0, 4, 2, 'SOUTHEAST', true, false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 155, 9, NOW() - INTERVAL '8 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 0.28, 0.11);

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
VALUES (21, 2, 21, 'Phòng trọ mini giá rẻ sinh viên 15m2 cách HCMUS 0.28km - Tân Lập', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Tân Lập, Phường Đông Hòa, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS) khoảng 0.28km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 15m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,600,000 đ/tháng.
- Tiền đặt cọc: 3,200,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1600000.0, 3200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 238, 35, 9, 5, NOW() - INTERVAL '2 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (21, 0, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (21, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (21, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 22 near HCMUS - Khoảng cách: 0.97km - Giá: 3,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (22, 3, 'P.468', 'Số 83 Tân Lập, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.868531, 106.794571, 30.0, 1, 3, 'WEST', true, true, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 197, 8, NOW() - INTERVAL '4 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 0.97, 0.29);

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
INSERT INTO room_images (room_id, image_url) VALUES (22, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (22, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 22 cho phòng 22 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (22, 3, 22, 'Căn hộ Studio gác lửng full nội thất 30m2 cách HCMUS 0.97km - Tân Lập', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Tân Lập, Phường An Bình, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS) khoảng 0.97km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 30m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,600,000 đ/tháng.
- Tiền đặt cọc: 7,200,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3600000.0, 7200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '5 days', 370, 29, 13, 2, NOW() - INTERVAL '6 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (22, 0, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (22, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (22, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 23 near HCMUS - Khoảng cách: 2.01km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (23, 4, 'P.302', 'Số 68 Trần Hưng Đạo, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.89072, 106.809931, 29.0, 5, 6, 'WEST', true, false, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', false, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 88, 10, NOW() - INTERVAL '2 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 2.01, 0.22);

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
INSERT INTO room_images (room_id, image_url) VALUES (23, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (23, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 23 cho phòng 23 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (23, 4, 23, 'Sleepbox cao cấp tiện nghi, bảo mật 29m2 cách HCMUS 2.01km - Trần Hưng Đạo', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Trần Hưng Đạo, Phường An Bình, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS) khoảng 2.01km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 29m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,400,000 đ/tháng.
- Tiền đặt cọc: 2,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1400000.0, 2800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '3 days', 432, 25, 6, 6, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (23, 0, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (23, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (23, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 24 near HCMUS - Khoảng cách: 3.42km - Giá: 2,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (24, 2, 'P.335', 'Số 9 Tân Lập, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.875697, 106.768439, 18.0, 2, 2, 'WEST', true, true, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', true, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 148, 9, NOW() - INTERVAL '4 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 3.42, 0.37);

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
INSERT INTO room_images (room_id, image_url) VALUES (24, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (24, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 24 cho phòng 24 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (24, 2, 24, 'Phòng trọ ban công thoáng mát gần trường 18m2 cách HCMUS 3.42km - Tân Lập', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Tân Lập, Phường Tân Đông Hiệp, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS) khoảng 3.42km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 18m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,500,000 đ/tháng.
- Tiền đặt cọc: 5,000,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2500000.0, 5000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '6 days', 387, 10, 21, 6, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (24, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (24, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (24, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 25 near HCMUS - Khoảng cách: 5.06km - Giá: 4,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (25, 3, 'P.129', 'Số 21 KDC Him Lam Phú Đông, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.843877, 106.832898, 38.0, 3, 3, 'NORTH', true, true, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 230, 14, NOW() - INTERVAL '6 days', NOW(), 0, 5, 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)', 5.06, 0.14);

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
INSERT INTO room_images (room_id, image_url) VALUES (25, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (25, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 25 cho phòng 25 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (25, 3, 25, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 38m2 cách HCMUS 5.06km - KDC Him Lam Phú Đông', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: KDC Him Lam Phú Đông, Phường Tân Đông Hiệp, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An) (HCMUS) khoảng 5.06km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 38m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 4,500,000 đ/tháng.
- Tiền đặt cọc: 9,000,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 4500000.0, 9000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '3 days', 197, 56, 23, 2, NOW() - INTERVAL '3 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (25, 0, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (25, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (25, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Quốc tế - ĐHQG TP.HCM (IU)
-- ==========================================

-- Phòng 26 near IU - Khoảng cách: 0.32km - Giá: 1,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (26, 4, 'P.280', 'Số 90 Tân Lập, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.875546, 106.799957, 14.0, 2, 2, 'SOUTHWEST', true, false, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 227, 9, NOW() - INTERVAL '6 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 0.32, 0.31);

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
VALUES (26, 4, 26, 'Phòng trọ mini giá rẻ sinh viên 14m2 cách IU 0.32km - Tân Lập', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Tân Lập, Phường Tân Đông Hiệp, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Quốc tế - ĐHQG TP.HCM (IU) khoảng 0.32km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 14m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,800,000 đ/tháng.
- Tiền đặt cọc: 3,600,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1800000.0, 3600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 375, 17, 27, 2, NOW() - INTERVAL '8 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (26, 0, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (26, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (26, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 27 near IU - Khoảng cách: 0.99km - Giá: 3,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (27, 2, 'P.439', 'Số 109 Trần Hưng Đạo, Phường Tân Đông Hiệp, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Tân Đông Hiệp', 10.869533, 106.804804, 25.0, 3, 3, 'NORTHWEST', true, true, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 160, 23, NOW() - INTERVAL '7 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 0.99, 0.24);

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
INSERT INTO room_images (room_id, image_url) VALUES (27, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (27, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 27 cho phòng 27 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (27, 2, 27, 'Căn hộ Studio gác lửng full nội thất 25m2 cách IU 0.99km - Trần Hưng Đạo', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Trần Hưng Đạo, Phường Tân Đông Hiệp, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Quốc tế - ĐHQG TP.HCM (IU) khoảng 0.99km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 25m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,900,000 đ/tháng.
- Tiền đặt cọc: 3,900,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3900000.0, 3900000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 242, 58, 21, 3, NOW() - INTERVAL '8 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (27, 0, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (27, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (27, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 28 near IU - Khoảng cách: 2.08km - Giá: 1,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (28, 3, 'P.481', 'Số 14 Tân Lập, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.866007, 106.81639, 29.0, 2, 6, 'NORTHWEST', true, false, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80', true, false, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 193, 8, NOW() - INTERVAL '6 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 2.08, 0.25);

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
INSERT INTO room_images (room_id, image_url) VALUES (28, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (28, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 28 cho phòng 28 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (28, 3, 28, 'Sleepbox cao cấp tiện nghi, bảo mật 29m2 cách IU 2.08km - Tân Lập', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Tân Lập, Phường An Bình, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Quốc tế - ĐHQG TP.HCM (IU) khoảng 2.08km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 29m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,600,000 đ/tháng.
- Tiền đặt cọc: 3,200,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1600000.0, 3200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '7 days', 418, 55, 8, 5, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (28, 0, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (28, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (28, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 29 near IU - Khoảng cách: 3.83km - Giá: 2,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (29, 4, 'P.185', 'Số 42 Đường ĐHQG, Phường Đông Hòa, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 10.911893, 106.79623, 19.0, 4, 2, 'EAST', true, true, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 79, 26, NOW() - INTERVAL '10 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 3.83, 0.14);

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
INSERT INTO room_images (room_id, image_url) VALUES (29, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 29 cho phòng 29 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (29, 4, 29, 'Phòng trọ ban công thoáng mát gần trường 19m2 cách IU 3.83km - Đường ĐHQG', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường ĐHQG, Phường Đông Hòa, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Quốc tế - ĐHQG TP.HCM (IU) khoảng 3.83km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 19m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,400,000 đ/tháng.
- Tiền đặt cọc: 4,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2400000.0, 4800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 411, 49, 10, 2, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (29, 0, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (29, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (29, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Phòng 30 near IU - Khoảng cách: 4.8km - Giá: 4,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (30, 2, 'P.230', 'Số 85 Bình Đường, Phường An Bình, Dĩ An, Bình Dương', 'Bình Dương', 'Dĩ An', 'An Bình', 10.87311, 106.845321, 36.0, 3, 3, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 179, 12, NOW() - INTERVAL '5 days', NOW(), 0, 6, 'Trường Đại học Quốc tế - ĐHQG TP.HCM', 4.8, 0.39);

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
INSERT INTO room_images (room_id, image_url) VALUES (30, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (30, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 30 cho phòng 30 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (30, 2, 30, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 36m2 cách IU 4.8km - Bình Đường', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Bình Đường, Phường An Bình, Dĩ An.
- Chỉ cách khuôn viên trường Trường Đại học Quốc tế - ĐHQG TP.HCM (IU) khoảng 4.80km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 36m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 4,600,000 đ/tháng.
- Tiền đặt cọc: 9,200,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 4600000.0, 9200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 229, 46, 5, 5, NOW() - INTERVAL '5 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (30, 0, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (30, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (30, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH)
-- ==========================================

-- Phòng 31 near UEH - Khoảng cách: 0.3km - Giá: 1,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (31, 3, 'P.107', 'Số 116 Cao Thắng, Phường Võ Thị Sáu, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.782244, 106.693448, 16.0, 5, 2, 'SOUTHEAST', true, false, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', true, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 54, 28, NOW() - INTERVAL '5 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 0.3, 0.18);

-- Tiện ích phòng 31
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 1) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 3) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 4) ON CONFLICT DO NOTHING;
INSERT INTO room_amenities (room_id, amenity_id) VALUES (31, 9) ON CONFLICT DO NOTHING;

-- Ảnh chi tiết phòng 31
INSERT INTO room_images (room_id, image_url) VALUES (31, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (31, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (31, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 31 cho phòng 31 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (31, 3, 31, 'Phòng trọ mini giá rẻ sinh viên 16m2 cách UEH 0.3km - Cao Thắng', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Cao Thắng, Phường Võ Thị Sáu, Quận 3.
- Chỉ cách khuôn viên trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH) khoảng 0.30km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 16m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,900,000 đ/tháng.
- Tiền đặt cọc: 1,900,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1900000.0, 1900000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 278, 35, 10, 5, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (31, 0, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (31, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (31, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 32 near UEH - Khoảng cách: 1.02km - Giá: 3,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (32, 4, 'P.108', 'Số 110 Cao Thắng, Phường 6, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 6', 10.791953, 106.696854, 25.0, 5, 3, 'NORTH', true, true, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 67, 12, NOW() - INTERVAL '4 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 1.02, 0.31);

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
INSERT INTO room_images (room_id, image_url) VALUES (32, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 32 cho phòng 32 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (32, 4, 32, 'Căn hộ Studio gác lửng full nội thất 25m2 cách UEH 1.02km - Cao Thắng', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Cao Thắng, Phường 6, Quận 3.
- Chỉ cách khuôn viên trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH) khoảng 1.02km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 25m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,800,000 đ/tháng.
- Tiền đặt cọc: 3,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3800000.0, 3800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 440, 48, 16, 1, NOW() - INTERVAL '3 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (32, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (32, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (32, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 33 near UEH - Khoảng cách: 2.02km - Giá: 1,400,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (33, 2, 'P.270', 'Số 19 Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.766778, 106.704848, 38.0, 1, 6, 'NORTH', true, false, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', false, false, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 78, 10, NOW() - INTERVAL '9 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 2.02, 0.13);

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
INSERT INTO room_images (room_id, image_url) VALUES (33, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (33, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 33 cho phòng 33 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (33, 2, 33, 'Sleepbox cao cấp tiện nghi, bảo mật 38m2 cách UEH 2.02km - Nguyễn Đình Chiểu', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3.
- Chỉ cách khuôn viên trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH) khoảng 2.02km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 38m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,400,000 đ/tháng.
- Tiền đặt cọc: 2,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1400000.0, 2800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 425, 48, 28, 5, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (33, 0, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (33, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (33, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 34 near UEH - Khoảng cách: 3.76km - Giá: 2,200,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (34, 3, 'P.230', 'Số 26 Điện Biên Phủ, Phường 6, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 6', 10.779267, 106.730345, 18.0, 1, 2, 'EAST', true, true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 42, 8, NOW() - INTERVAL '4 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 3.76, 0.33);

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
INSERT INTO room_images (room_id, image_url) VALUES (34, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (34, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 34 cho phòng 34 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (34, 3, 34, 'Phòng trọ ban công thoáng mát gần trường 18m2 cách UEH 3.76km - Điện Biên Phủ', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Điện Biên Phủ, Phường 6, Quận 3.
- Chỉ cách khuôn viên trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH) khoảng 3.76km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 18m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,200,000 đ/tháng.
- Tiền đặt cọc: 4,400,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2200000.0, 4400000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '7 days', 205, 37, 35, 6, NOW() - INTERVAL '2 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (34, 0, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (34, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (34, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 35 near UEH - Khoảng cách: 4.75km - Giá: 4,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (35, 4, 'P.186', 'Số 61 Võ Văn Tần, Phường 5, Quận 3, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Quận 3', 'Phường 5', 10.746756, 106.672728, 41.0, 1, 3, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 61, 12, NOW() - INTERVAL '6 days', NOW(), 0, 7, 'Trường Đại học Kinh tế TP.HCM (Cơ sở A)', 4.75, 0.19);

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
INSERT INTO room_images (room_id, image_url) VALUES (35, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (35, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 35 cho phòng 35 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (35, 4, 35, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 41m2 cách UEH 4.75km - Võ Văn Tần', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Võ Văn Tần, Phường 5, Quận 3.
- Chỉ cách khuôn viên trường Trường Đại học Kinh tế TP.HCM (Cơ sở A) (UEH) khoảng 4.75km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 41m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 4,500,000 đ/tháng.
- Tiền đặt cọc: 9,000,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 4500000.0, 9000000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 365, 25, 17, 7, NOW() - INTERVAL '1 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (35, 0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (35, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (35, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- ==========================================
-- PHÒNG TRỌ XUNG QUANH Trường Đại học Ngoại thương - Cơ sở 2 (FTU2)
-- ==========================================

-- Phòng 36 near FTU2 - Khoảng cách: 0.31km - Giá: 1,900,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (36, 2, 'P.488', 'Số 65 Điện Biên Phủ, Phường 17, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 17', 10.804522, 106.712955, 17.0, 1, 2, 'NORTHWEST', true, false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', false, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 233, 14, NOW() - INTERVAL '4 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 0.31, 0.19);

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
VALUES (36, 2, 36, 'Phòng trọ mini giá rẻ sinh viên 17m2 cách FTU2 0.31km - Điện Biên Phủ', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Điện Biên Phủ, Phường 17, Bình Thạnh.
- Chỉ cách khuôn viên trường Trường Đại học Ngoại thương - Cơ sở 2 (FTU2) khoảng 0.31km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 17m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,900,000 đ/tháng.
- Tiền đặt cọc: 3,800,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1900000.0, 3800000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 346, 37, 30, 5, NOW() - INTERVAL '5 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (36, 0, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (36, 1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (36, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 37 near FTU2 - Khoảng cách: 1.07km - Giá: 3,800,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (37, 3, 'P.179', 'Số 33 Ung Văn Khiêm, Phường 25, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 25', 10.793592, 106.718901, 30.0, 2, 3, 'NORTHEAST', true, true, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80', true, true, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 65, 5, NOW() - INTERVAL '9 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 1.07, 0.1);

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
INSERT INTO room_images (room_id, image_url) VALUES (37, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 37 cho phòng 37 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (37, 3, 37, 'Căn hộ Studio gác lửng full nội thất 30m2 cách FTU2 1.07km - Ung Văn Khiêm', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Ung Văn Khiêm, Phường 25, Bình Thạnh.
- Chỉ cách khuôn viên trường Trường Đại học Ngoại thương - Cơ sở 2 (FTU2) khoảng 1.07km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 30m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 3,800,000 đ/tháng.
- Tiền đặt cọc: 7,600,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 3800000.0, 7600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', true, NOW() + INTERVAL '4 days', 372, 53, 6, 8, NOW() - INTERVAL '7 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (37, 0, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (37, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (37, 2, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80');

-- Phòng 38 near FTU2 - Khoảng cách: 2.1km - Giá: 1,600,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (38, 4, 'P.262', 'Số 6 Đường D5, Phường 17, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 17', 10.785598, 106.705293, 36.0, 3, 6, 'NORTHEAST', true, false, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', true, false, NULL, 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 231, 28, NOW() - INTERVAL '8 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 2.1, 0.31);

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
INSERT INTO room_images (room_id, image_url) VALUES (38, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (38, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 38 cho phòng 38 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (38, 4, 38, 'Sleepbox cao cấp tiện nghi, bảo mật 36m2 cách FTU2 2.1km - Đường D5', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường D5, Phường 17, Bình Thạnh.
- Chỉ cách khuôn viên trường Trường Đại học Ngoại thương - Cơ sở 2 (FTU2) khoảng 2.10km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 36m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Khu vực giặt sấy/máy giặt tiện nghi

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ giấc ra vào tự do thoải mái, không chung chủ.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 1,600,000 đ/tháng.
- Tiền đặt cọc: 1,600,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 1600000.0, 1600000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 202, 48, 17, 1, NOW() - INTERVAL '5 days', NOW(), 0, 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (38, 0, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (38, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (38, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Phòng 39 near FTU2 - Khoảng cách: 3.57km - Giá: 2,500,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (39, 2, 'P.361', 'Số 39 Đường D5, Phường 17, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 17', 10.796841, 106.746714, 23.0, 5, 2, 'NORTH', true, true, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', false, true, '23:00', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 102, 23, NOW() - INTERVAL '5 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 3.57, 0.11);

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
INSERT INTO room_images (room_id, image_url) VALUES (39, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (39, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 39 cho phòng 39 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (39, 2, 39, 'Phòng trọ ban công thoáng mát gần trường 23m2 cách FTU2 3.57km - Đường D5', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường D5, Phường 17, Bình Thạnh.
- Chỉ cách khuôn viên trường Trường Đại học Ngoại thương - Cơ sở 2 (FTU2) khoảng 3.57km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 23m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 23:00 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 2,500,000 đ/tháng.
- Tiền đặt cọc: 2,500,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 2500000.0, 2500000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 253, 59, 29, 4, NOW() - INTERVAL '7 days', NOW(), 0, 'https://www.w3schools.com/html/movie.mp4', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (39, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (39, 1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (39, 2, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');

-- Phòng 40 near FTU2 - Khoảng cách: 4.82km - Giá: 5,200,000 đ
INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)
VALUES (40, 3, 'P.141', 'Số 20 Đường D5, Phường 17, Bình Thạnh, TP Hồ Chí Minh', 'TP Hồ Chí Minh', 'Bình Thạnh', 'Phường 17', 10.841522, 106.733048, 45.0, 4, 3, 'EAST', true, true, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', false, true, '22:30', 'Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn.', 209, 18, NOW() - INTERVAL '9 days', NOW(), 0, 8, 'Trường Đại học Ngoại thương - Cơ sở 2', 4.82, 0.26);

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
INSERT INTO room_images (room_id, image_url) VALUES (40, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO room_images (room_id, image_url) VALUES (40, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

-- Bài đăng 40 cho phòng 40 (Có video thực tế)
INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)
VALUES (40, 3, 40, 'Căn hộ dịch vụ 1PN sang trọng, an ninh 45m2 cách FTU2 4.82km - Đường D5', '**Vị trí thuận tiện và yên tĩnh**
- Địa chỉ: Đường D5, Phường 17, Bình Thạnh.
- Chỉ cách khuôn viên trường Trường Đại học Ngoại thương - Cơ sở 2 (FTU2) khoảng 4.82km. Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng.

**Thiết kế căn phòng**
- Diện tích sử dụng: 45m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.
- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo.
- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn.

**Các tiện ích lắp sẵn**
- Wifi internet tốc độ cao riêng biệt từng phòng
- Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện
- Hệ thống nước nóng lạnh an toàn
- Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo
- Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn
- Khu vực giặt sấy/máy giặt tiện nghi
- Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ

**An ninh và quy định**
- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.
- Giờ đóng cổng: 22:30 đêm nhằm đảm bảo trật tự chung.
- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự.

**Thông tin chi phí thuê**
- Giá thuê hàng tháng: 5,200,000 đ/tháng.
- Tiền đặt cọc: 5,200,000 đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).
- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế.', 5200000.0, 5200000.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', false, NULL, 294, 46, 22, 3, NOW() - INTERVAL '6 days', NOW(), 0, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (40, 0, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (40, 1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (40, 2, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');

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