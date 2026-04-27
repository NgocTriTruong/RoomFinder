-- =============================================
-- TMDT Seed Data - Chuẩn xác theo cấu trúc DB thực tế
-- =============================================

-- =============================================
-- 1. TÀI KHOẢN NGƯỜI DÙNG (Users)
-- Password: 123456 (BCrypt hashed)
-- =============================================

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'admin@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Quản Trị Viên', '0909123456', 'ADMIN', 'ACTIVE', true, NOW(), 'LOCAL');

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'landlord1@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Nguyễn Văn Minh', '0912345678', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL');

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'landlord2@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Trần Thị Lan', '0923456789', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL');

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'landlord3@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Lê Hoàng Nam', '0934567890', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL');

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'user1@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Phạm Thị Hương', '0945678901', 'USER', 'ACTIVE', true, NOW(), 'LOCAL');

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'user2@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Hoàng Đức Anh', '0956789012', 'USER', 'ACTIVE', true, NOW(), 'LOCAL');

INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES (NOW(), NOW(), 'user3@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Ngô Thu Minh', '0967890123', 'USER', 'ACTIVE', true, NOW(), 'LOCAL');

-- Additional users for statistics
INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES 
(NOW() - INTERVAL '25 days', NOW(), 'landlord4@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Phạm Hoàng Nam', '0987654321', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '20 days', NOW(), 'landlord5@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Vũ Minh Tuấn', '0987654322', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '15 days', NOW(), 'user4@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Đỗ Thùy Linh', '0987654323', 'USER', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '10 days', NOW(), 'user5@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Bùi Xuân Huấn', '0987654324', 'USER', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '5 days', NOW(), 'user6@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Lê Tùng Vân', '0987654325', 'USER', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '2 days', NOW(), 'user7@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Trần My', '0987654326', 'USER', 'ACTIVE', true, NOW(), 'LOCAL');

-- =============================================
-- 2. TIỆN ÍCH (Amenities) - 24 items
-- =============================================

-- Bathroom (1-5)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bồn rửa mặt', 'fa-sink', 'bathroom', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Vòi hoa sen', 'fa-shower', 'bathroom', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bồn cầu', 'fa-toilet', 'bathroom', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Nước nóng', 'fa-temperature-arrow-up', 'bathroom', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Máy sưởi', 'fa-fire-flame-curved', 'bathroom', true, 5);

-- Bedroom (6-11)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Giường ngủ', 'fa-bed', 'bedroom', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Tủ quần áo', 'fa-shirt', 'bedroom', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bàn học', 'fa-table', 'bedroom', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Điều hòa', 'fa-snowflake', 'bedroom', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Quạt máy', 'fa-fan', 'bedroom', true, 5);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Cửa sổ', 'fa-window-maximize', 'bedroom', true, 6);

-- Kitchen (12-16)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bếp gas', 'fa-fire-burner', 'kitchen', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Tủ lạnh', 'fa-box', 'kitchen', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Lò vi sóng', 'fa-microwave', 'kitchen', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Khu bếp riêng', 'fa-utensils', 'kitchen', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Khu bếp chung', 'fa-fire', 'kitchen', true, 5);

-- Security (17-20)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Camera an ninh', 'fa-video', 'security', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Khóa cửa điện tử', 'fa-fingerprint', 'security', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'PCCC', 'fa-fire-extinguisher', 'security', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bảo vệ 24/7', 'fa-user-shield', 'security', true, 4);

-- Furniture (21-24)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Sofa', 'fa-couch', 'furniture', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Tivi', 'fa-tv', 'furniture', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Kệ sách', 'fa-book', 'furniture', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bàn ăn', 'fa-chair', 'furniture', true, 4);

-- Other (25-29)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'WiFi miễn phí', 'fa-wifi', 'other', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Máy giặt', 'fa-socks', 'other', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Chỗ để xe', 'fa-square-parking', 'other', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Thang máy', 'fa-elevator', 'other', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Cho nuôi thú cưng', 'fa-dog', 'other', true, 5);

-- =============================================
-- 3. PHÒNG TRỌ (Rooms) - 10 phòng
-- =============================================

-- Landlord 1 (id=2): 3 phòng
INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 2, 'P.101', '123 Đường Nguyễn Trãi, Quận 1', 'Hồ Chí Minh', 'Quận 1', 'Phường Nguyễn Cư Trinh', 10.7629, 106.6834, 25.0, 1, 2, 'EAST', true, false, 'https://picsum.photos/seed/room1/400/300', false, true, 150, 12);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 2, 'P.201', '123 Đường Nguyễn Trãi, Quận 1', 'Hồ Chí Minh', 'Quận 1', 'Phường Nguyễn Cư Trinh', 10.7630, 106.6835, 30.0, 2, 3, 'NORTH', true, true, 'https://picsum.photos/seed/room2/400/300', false, true, 200, 25);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 2, 'P.301', '123 Đường Nguyễn Trãi, Quận 1', 'Hồ Chí Minh', 'Quận 1', 'Phường Nguyễn Cư Trinh', 10.7631, 106.6836, 20.0, 3, 2, 'SOUTH', true, false, 'https://picsum.photos/seed/room3/400/300', false, false, 80, 8);

-- Landlord 2 (id=3): 3 phòng
INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 3, 'P.101', '456 Đường Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7799, 106.6889, 28.0, 1, 2, 'WEST', true, true, 'https://picsum.photos/seed/room4/400/300', true, true, 300, 45);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 3, 'P.102', '456 Đường Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7800, 106.6890, 35.0, 1, 4, 'EAST', true, true, 'https://picsum.photos/seed/room5/400/300', false, true, 180, 20);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 3, 'P.202', '456 Đường Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7801, 106.6891, 22.0, 2, 2, 'NORTH', true, false, 'https://picsum.photos/seed/room6/400/300', true, false, 120, 15);

-- Landlord 3 (id=4): 4 phòng
INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.01', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7550, 106.6820, 40.0, 1, 5, 'SOUTH', true, true, 'https://picsum.photos/seed/room7/400/300', false, true, 250, 35);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.02', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7551, 106.6821, 32.0, 1, 3, 'NORTHEAST', true, true, 'https://picsum.photos/seed/room8/400/300', true, true, 190, 28);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.03', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7552, 106.6822, 25.0, 2, 2, 'NORTHWEST', true, false, 'https://picsum.photos/seed/room9/400/300', false, false, 95, 10);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.04', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7553, 106.6823, 50.0, 3, 6, 'SOUTHEAST', true, true, 'https://picsum.photos/seed/room10/400/300', false, true, 350, 55);

-- =============================================
-- 4. ROOM IMAGES (không có image_order)
-- =============================================

-- Room 1
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://picsum.photos/seed/room1a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://picsum.photos/seed/room1b/800/600');

-- Room 2
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://picsum.photos/seed/room2a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://picsum.photos/seed/room2b/800/600');

-- Room 3
INSERT INTO room_images (room_id, image_url) VALUES (3, 'https://picsum.photos/seed/room3a/800/600');

-- Room 4
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://picsum.photos/seed/room4a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://picsum.photos/seed/room4b/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://picsum.photos/seed/room4c/800/600');

-- Room 5
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://picsum.photos/seed/room5a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://picsum.photos/seed/room5b/800/600');

-- Room 6
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://picsum.photos/seed/room6a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://picsum.photos/seed/room6b/800/600');

-- Room 7
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://picsum.photos/seed/room7a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://picsum.photos/seed/room7b/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://picsum.photos/seed/room7c/800/600');

-- Room 8
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://picsum.photos/seed/room8a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://picsum.photos/seed/room8b/800/600');

-- Room 9
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://picsum.photos/seed/room9a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://picsum.photos/seed/room9b/800/600');

-- Room 10
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://picsum.photos/seed/room10a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://picsum.photos/seed/room10b/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://picsum.photos/seed/room10c/800/600');

-- =============================================
-- 5. ROOM AMENITIES (Many-to-Many)
-- =============================================

-- Room 1: basic
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 10); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 26);

-- Room 2: full basic
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 8); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 11); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 12);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 26);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 27);

-- Room 3: budget
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 10); INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 25);

-- Room 4: premium pet-friendly
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 5); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 7); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 8);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 12); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 13);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 26);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 27); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 29);

-- Room 5: family
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 8); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 11); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 15);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 13); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 25);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 26); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 27);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 28);

-- Room 6: pet-friendly
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 3);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 4); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 29);

-- Room 7: luxury
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 5); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 7); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 8);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 15); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 13);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 14); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 17);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 26);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 27); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 28);

-- Room 8: family pet-friendly
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 15); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 25);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 26); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 27);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 29);

-- Room 9: budget
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 25);

-- Room 10: premium family
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 8); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 11); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 15);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 13); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 25);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 26); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 27);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 28);

-- =============================================
-- 6. PACKAGES (trước subscriptions)
-- =============================================

INSERT INTO packages (created_at, name, type, max_posts, duration_days, boost_days, price, is_active, is_featured, display_order, discount_percent)
VALUES (NOW(), 'Gói Cơ Bản', 'POST_BASIC', 1, 30, 0, 99000.00, true, false, 1, 0);

INSERT INTO packages (created_at, name, type, max_posts, duration_days, boost_days, price, is_active, is_featured, display_order, discount_percent)
VALUES (NOW(), 'Gói Tiêu Chuẩn', 'POST_STANDARD', 3, 30, 7, 199000.00, true, true, 2, 0);

INSERT INTO packages (created_at, name, type, max_posts, duration_days, boost_days, price, is_active, is_featured, display_order, discount_percent)
VALUES (NOW(), 'Gói Premium', 'POST_PREMIUM', 5, 30, 14, 399000.00, true, true, 3, 0);

INSERT INTO packages (created_at, name, type, max_posts, duration_days, boost_days, price, is_active, is_featured, display_order, discount_percent)
VALUES (NOW(), 'Tăng Boosts 1 Ngày', 'BOOST_DAILY', 0, 1, 1, 29000.00, true, false, 4, 0);

INSERT INTO packages (created_at, name, type, max_posts, duration_days, boost_days, price, is_active, is_featured, display_order, discount_percent)
VALUES (NOW(), 'Tăng Boosts 1 Tuần', 'BOOST_WEEKLY', 0, 7, 7, 99000.00, true, false, 5, 0);

INSERT INTO packages (created_at, name, type, max_posts, duration_days, boost_days, price, is_active, is_featured, display_order, discount_percent)
VALUES (NOW(), 'Tăng Boosts 1 Tháng', 'BOOST_MONTHLY', 0, 30, 30, 299000.00, true, true, 6, 0);

-- =============================================
-- 7. BÀI ĐĂNG (Posts) - 10 approved + 1 pending
-- =============================================

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 2, 1,
'PHÒNG TRỌ MỚI XÂY - GẦN TRƯỜNG ĐH BÁCH KHOA',
'Phòng trọ mới xây, sạch sẽ, thoáng mát. Gần trường ĐH Bách Khoa, đi bộ chỉ 5 phút. Khu vực an ninh, yên tĩnh, phù hợp cho sinh viên và người đi làm. Có đầy đủ tiện nghi: điều hòa, nước nóng, wifi free.',
2500000.00, 5000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 150, 12, 45, 8);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 2, 2,
'PHÒNG RỘNG 30M2 - CÓ BAN CÔNG - VIEW ĐẸP',
'Phòng rộng rãi 30m2, có ban công view đẹp, đầy đủ nội thất. Tầng cao thoáng mát, không ẩm mốc. Gần chợ, siêu thị, tiện lợi mua sắm. Chỗ để xe rộng rãi, có camera an ninh 24/7.',
3500000.00, 7000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 200, 25, 60, 12);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 2, 3,
'PHÒNG TRỌ GIÁ RẺ - SINH VIÊN ƯU TIÊN',
'Phòng trọ giá rẻ, phù hợp cho sinh viên. Có quạt máy, wifi, nhà vệ sinh riêng. Khu vực yên tĩnh, gần trường học. Chủ nhà thân thiện, hỗ trợ sinh viên.',
1500000.00, 3000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 80, 8, 30, 5);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 3, 4,
'CĂN HỘ MINI CAO CẤP - TRUNG TÂM QUẬN 3',
'Căn hộ mini cao cấp ngay trung tâm Quận 3, thiết kế hiện đại, sang trọng. Đầy đủ tiện nghi: điều hòa, nước nóng, bếp riêng, tủ lạnh, máy giặt. Có thang máy, gym. CHO PHÉP NUÔI THÚ CƯNG. Chỗ để xe free.',
4500000.00, 9000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', true, NOW() + INTERVAL '7 days', 300, 45, 85, 18);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 3, 5,
'PHÒNG GIA ĐÌNH 35M2 - NỘI THẤT ĐẦY ĐỦ',
'Phòng rộng 35m2, phù hợp cho gia đình 3-4 người. Có bếp riêng, phòng khách riêng. Nội thất cao cấp, mới 100%. Khu vực an ninh, gần trường học, bệnh viện. Điều hòa 2 chiều, nước nóng trung tâm.',
5000000.00, 10000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 180, 20, 55, 10);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 3, 6,
'PHÒNG PET FRIENDLY - SÂN THƯỢNG RIÊNG',
'Phòng trọ thân thiện với thú cưng, có sân thượng riêng cho thú cưng vui chơi. Không gian xanh, thoáng đãng. Gần công viên, khu vực dạo chơi cho thú cưng. Phù hợp với người yêu động vật.',
2800000.00, 5600000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 120, 15, 40, 7);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 4, 7,
'PHÒNG LUXURY - THANG MÁY, GYM, SÂN THƯỢNG',
'Phòng luxury full tiện nghi: gym, thang máy, sân thượng. Thiết kế hiện đại, view đẹp. Gần trung tâm thương mại, siêu thị. An ninh 24/7, có bảo vệ. Phù hợp người có thu nhập cao.',
8000000.00, 16000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', true, NOW() + INTERVAL '14 days', 350, 55, 100, 22);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 4, 8,
'PHÒNG GIA ĐÌNH RỘNG 32M2 - PET ALLOWED',
'Phòng rộng 32m2 cho gia đình, cho phép nuôi thú cưng. Có bếp riêng, ban công. Khu vực yên tĩnh, gần trường học. Nội thất đầy đủ, mới mua. Chỗ để xe có camera.',
4200000.00, 8400000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 190, 28, 65, 14);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 4, 9,
'PHÒNG TRỌ TIẾT KIỆM - CHO SINH VIÊN',
'Phòng trọ tiết kiệm chi phí, dành cho sinh viên. Có điều hòa, wifi, nhà vệ sinh riêng. Khu vực an ninh, gần ĐH Y Dược. Chủ nhà tốt bụng, hỗ trợ sinh viên.',
1800000.00, 3600000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', 95, 10, 35, 6);

INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count)
VALUES (NOW(), NOW(), 4, 10,
'PHÒNG VIP 50M2 - PHÙ HỢP NHÓM 5-6 NGƯỜI',
'Phòng VIP rộng 50m2, phù hợp cho nhóm 5-6 người thuê chung. Có 2 phòng ngủ, 1 phòng khách, 1 bếp. Full nội thất cao cấp. Tầng cao view đẹp, có thang máy. Tiết kiệm chi phí khi ở nhiều người.',
6500000.00, 13000000.00, 'MONTHLY', 'APPROVED', 1, NOW(), NOW() + INTERVAL '30 days', true, NOW() + INTERVAL '7 days', 250, 35, 70, 15);

-- Pending post for admin testing
INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, expires_at)
VALUES (NOW(), NOW(), 2, 1,
'PHÒNG TEST PENDING - SẼ ĐƯỢC APPROVE BỞI ADMIN',
'Đây là bài đăng test đang chờ duyệt bởi admin.',
2200000.00, 4400000.00, 'MONTHLY', 'PENDING', NOW() + INTERVAL '30 days');

-- =============================================
-- 8. POST IMAGES (có image_order)
-- =============================================

INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 0, 'https://picsum.photos/seed/post1a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (1, 1, 'https://picsum.photos/seed/post1b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 0, 'https://picsum.photos/seed/post2a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (2, 1, 'https://picsum.photos/seed/post2b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (3, 0, 'https://picsum.photos/seed/post3a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 0, 'https://picsum.photos/seed/post4a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 1, 'https://picsum.photos/seed/post4b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (4, 2, 'https://picsum.photos/seed/post4c/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 0, 'https://picsum.photos/seed/post5a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (5, 1, 'https://picsum.photos/seed/post5b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (6, 0, 'https://picsum.photos/seed/post6a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 0, 'https://picsum.photos/seed/post7a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (7, 1, 'https://picsum.photos/seed/post7b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 0, 'https://picsum.photos/seed/post8a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (8, 1, 'https://picsum.photos/seed/post8b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (9, 0, 'https://picsum.photos/seed/post9a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 0, 'https://picsum.photos/seed/post10a/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (10, 1, 'https://picsum.photos/seed/post10b/800/600');
INSERT INTO post_images (post_id, image_order, image_url) VALUES (11, 0, 'https://picsum.photos/seed/post11a/800/600');

-- =============================================
-- 9. SUBSCRIPTIONS (phải có package_id trước)
-- =============================================

INSERT INTO subscriptions (created_at, landlord_id, package_id, max_posts, remaining_posts, start_date, expires_at, auto_renew, is_active)
VALUES (NOW(), 2, 2, 3, 2, NOW(), NOW() + INTERVAL '30 days', true, true);

INSERT INTO subscriptions (created_at, landlord_id, package_id, max_posts, remaining_posts, start_date, expires_at, auto_renew, is_active)
VALUES (NOW(), 3, 3, 5, 4, NOW(), NOW() + INTERVAL '30 days', true, true);

INSERT INTO subscriptions (created_at, landlord_id, package_id, max_posts, remaining_posts, start_date, expires_at, auto_renew, is_active)
VALUES (NOW(), 4, 2, 3, 1, NOW(), NOW() + INTERVAL '30 days', false, true);

-- =============================================
-- 10. BOOKINGS
-- =============================================

INSERT INTO bookings (created_at, updated_at, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note)
VALUES (NOW() + INTERVAL '1 hour', NOW(), 5, 2, 1, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 'PENDING', 'BK001ABC', 'Tôi muốn xem phòng vào giờ hành chính');

INSERT INTO bookings (created_at, updated_at, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note)
VALUES (NOW() + INTERVAL '2 hours', NOW(), 6, 3, 4, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours', 'CONFIRMED', 'BK002DEF', 'Gọi điện trước khi đến');

INSERT INTO bookings (created_at, updated_at, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note)
VALUES (NOW() - INTERVAL '3 days', NOW(), 7, 4, 7, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days 2 hours', 'COMPLETED', 'BK003GHI', 'Đã xem phòng rất hài lòng');

INSERT INTO bookings (created_at, updated_at, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, cancellation_reason)
VALUES (NOW() - INTERVAL '5 days', NOW(), 5, 2, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days 2 hours', 'CANCELLED', 'BK004JKL', 'Đã tìm được phòng khác gần hơn');

INSERT INTO bookings (created_at, updated_at, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note)
VALUES (NOW() - INTERVAL '1 day', NOW(), 6, 2, 1, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours', 'PENDING', 'BK005MNO', 'Cần xem thêm tiện ích');

INSERT INTO bookings (created_at, updated_at, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note)
VALUES (NOW() - INTERVAL '2 days', NOW(), 5, 3, 4, NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 2 hours', 'CONFIRMED', 'BK006PQR', 'Đã chốt ngày xem');

-- =============================================
-- 11. REVIEWS
-- =============================================

INSERT INTO reviews (created_at, updated_at, user_id, post_id, landlord_id, booking_id, rating, comment, helpful_count, is_approved, is_visible)
VALUES (NOW(), NOW(), 5, 1, 2, NULL, 5, 'Phòng rất đẹp, sạch sẽ, chủ nhà thân thiện. Điều hòa mát, nước nóng ok. Gần trường, tiện đi học. Sẽ ở lâu dài!', 12, true, true);

INSERT INTO reviews (created_at, updated_at, user_id, post_id, landlord_id, booking_id, rating, comment, helpful_count, is_approved, is_visible)
VALUES (NOW(), NOW(), 6, 4, 3, NULL, 4, 'Căn hộ đẹp, nội thất tốt, khu vực yên tĩnh. Có gym rất tiện lợi. Gần siêu thị, tiện mua sắm. Giá hơi cao nhưng xứng đáng.', 8, true, true);

INSERT INTO reviews (created_at, updated_at, user_id, post_id, landlord_id, booking_id, rating, comment, landlord_response, landlord_response_at, helpful_count, is_approved, is_visible)
VALUES (NOW(), NOW(), 7, 7, 4, NULL, 5, 'Phòng luxury thực sự! Đầy đủ tiện nghi, view đẹp. Nhân viên bảo vệ chu đáo. Perfect!',
'Cảm ơn bạn đã đánh giá tích cực! Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho khách thuê.', NOW(), 25, true, true);

-- =============================================
-- 12. FAVORITES
-- =============================================

INSERT INTO favorites (user_id, room_id, created_at) VALUES (5, 2, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (5, 4, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (5, 7, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (6, 1, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (6, 5, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (7, 4, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (7, 8, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (7, 10, NOW());

-- =============================================
-- 13. CONVERSATIONS & MESSAGES
-- =============================================

INSERT INTO conversations (user1_id, user2_id, last_message_at, last_message_preview, last_message_type, unread_count_user1, unread_count_user2, created_at)
VALUES (5, 2, NOW(), 'Bạn muốn đặt lịch xem phòng không?', 0, 0, 1, NOW());

INSERT INTO conversations (user1_id, user2_id, last_message_at, last_message_preview, last_message_type, unread_count_user1, unread_count_user2, created_at)
VALUES (6, 3, NOW(), 'OK, tôi sẽ đến xem phòng P.202', 0, 0, 0, NOW());

INSERT INTO conversations (user1_id, user2_id, last_message_at, last_message_preview, last_message_type, unread_count_user1, unread_count_user2, created_at)
VALUES (7, 4, NOW(), 'Mình sẽ hỗ trợ nhiệt tình!', 0, 0, 2, NOW());

-- Messages for conversation 1
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (1, 5, 2, 'TEXT', 'Xin chào, tôi muốn hỏi về phòng P.201', true, NOW() - INTERVAL '2 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (1, 2, 5, 'TEXT', 'Xin chào! Phòng P.201 còn trống. Bạn muốn đặt lịch xem phòng không?', false, NOW() - INTERVAL '1 hour');

-- Messages for conversation 2
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (2, 6, 3, 'TEXT', 'Cho tôi hỏi, phòng có nuôi chó được không?', true, NOW() - INTERVAL '5 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (2, 3, 6, 'TEXT', 'Phòng P.101 và P.202 cho phép nuôi thú cưng. Phòng P.102 thì không.', true, NOW() - INTERVAL '4 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (2, 6, 3, 'TEXT', 'OK, tôi sẽ đến xem phòng P.202 vào ngày mai.', false, NOW() - INTERVAL '3 hours');

-- Messages for conversation 3
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (3, 7, 4, 'TEXT', 'Tôi muốn thuê phòng VIP 50m2. Có thể ở được 5 người không?', true, NOW() - INTERVAL '1 day');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (3, 4, 7, 'TEXT', 'Được ạ! Phòng 50m2 có thể ở 5-6 người thoải mái. Có 2 phòng ngủ riêng.', false, NOW() - INTERVAL '20 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (3, 4, 7, 'TEXT', 'Bạn có thể đặt lịch xem phòng qua ứng dụng. Mình sẽ hỗ trợ nhiệt tình!', false, NOW() - INTERVAL '19 hours');

-- =============================================
-- 14. VOUCHERS
-- =============================================

INSERT INTO vouchers (created_at, code, name, discount_type, discount, max_discount_amount, min_order_amount, total_quantity, remaining_quantity, expires_at, is_active)
VALUES (NOW(), 'WELCOME50', 'Chào mừng thành viên mới', 'PERCENTAGE', 10.00, 50000.00, 0.00, 100, 95, NOW() + INTERVAL '90 days', true);

INSERT INTO vouchers (created_at, code, name, discount_type, discount, max_discount_amount, min_order_amount, total_quantity, remaining_quantity, expires_at, is_active)
VALUES (NOW(), 'SUMMER2026', 'Khuyến mãa mùa hè', 'PERCENTAGE', 15.00, 100000.00, 100000.00, 50, 45, NOW() + INTERVAL '60 days', true);

INSERT INTO vouchers (created_at, code, name, discount_type, discount, max_discount_amount, min_order_amount, total_quantity, remaining_quantity, expires_at, is_active)
VALUES (NOW(), 'FLAT100K', 'Giảm 100K', 'FIXED', 100000.00, 0.00, 500000.00, 200, 180, NOW() + INTERVAL '45 days', true);

-- =============================================
-- 15. BÁO CÁO VI PHẠM (Reports)
-- =============================================

INSERT INTO reports (created_at, updated_at, reporter_id, target_id, target_type, type, reason, status)
VALUES (NOW() - INTERVAL '1 day', NOW(), 5, 1, 'POST', 'SPAM', 'Tin đăng trùng lặp nhiều lần', 'PENDING');

INSERT INTO reports (created_at, updated_at, reporter_id, target_id, target_type, type, reason, status)
VALUES (NOW() - INTERVAL '2 days', NOW(), 6, 4, 'POST', 'FAKE_POST', 'Phòng không giống như trong ảnh', 'PENDING');

INSERT INTO reports (created_at, updated_at, reporter_id, target_id, target_type, type, reason, status, handled_by, handled_at, handled_note, action_taken)
VALUES (NOW() - INTERVAL '5 days', NOW(), 7, 2, 'POST', 'FRAUD', 'Yêu cầu chuyển khoản đặt cọc trước khi xem phòng', 'RESOLVED', 1, NOW() - INTERVAL '4 days', 'Đã xác minh và gỡ bỏ tin đăng', 'REMOVE_POST');

-- =============================================
-- 16. GIAO DỊCH (Transactions) - Cho biểu đồ doanh thu
-- =============================================

INSERT INTO transactions (created_at, updated_at, user_id, order_id, order_type, order_description, amount, original_amount, payment_method, status, paid_at, expires_at)
VALUES 
(NOW() - INTERVAL '29 days', NOW(), 2, 'ORD-20260401-0001', 'PACKAGE_PURCHASE', 'Mua Gói Tiêu Chuẩn', 199000, 199000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '29 days', NOW()),
(NOW() - INTERVAL '27 days', NOW(), 3, 'ORD-20260403-0002', 'PACKAGE_PURCHASE', 'Mua Gói Premium', 399000, 399000, 'MOMO', 'SUCCESS', NOW() - INTERVAL '27 days', NOW()),
(NOW() - INTERVAL '25 days', NOW(), 4, 'ORD-20260405-0003', 'BOOST_PURCHASE', 'Đẩy tin 7 ngày', 99000, 99000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '25 days', NOW()),
(NOW() - INTERVAL '23 days', NOW(), 2, 'ORD-20260407-0004', 'BOOST_PURCHASE', 'Đẩy tin 1 ngày', 29000, 29000, 'ZALOPAY', 'SUCCESS', NOW() - INTERVAL '23 days', NOW()),
(NOW() - INTERVAL '21 days', NOW(), 3, 'ORD-20260409-0005', 'PACKAGE_PURCHASE', 'Mua Gói Tiêu Chuẩn', 199000, 199000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '21 days', NOW()),
(NOW() - INTERVAL '19 days', NOW(), 4, 'ORD-20260411-0006', 'BOOST_PURCHASE', 'Đẩy tin 30 ngày', 299000, 299000, 'MOMO', 'SUCCESS', NOW() - INTERVAL '19 days', NOW()),
(NOW() - INTERVAL '17 days', NOW(), 2, 'ORD-20260413-0007', 'PACKAGE_PURCHASE', 'Mua Gói Cơ Bản', 99000, 99000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '17 days', NOW()),
(NOW() - INTERVAL '15 days', NOW(), 3, 'ORD-20260415-0008', 'BOOST_PURCHASE', 'Đẩy tin 7 ngày', 99000, 99000, 'ZALOPAY', 'SUCCESS', NOW() - INTERVAL '15 days', NOW()),
(NOW() - INTERVAL '13 days', NOW(), 4, 'ORD-20260417-0009', 'PACKAGE_PURCHASE', 'Mua Gói Premium', 399000, 399000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '13 days', NOW()),
(NOW() - INTERVAL '11 days', NOW(), 2, 'ORD-20260419-0010', 'BOOST_PURCHASE', 'Đẩy tin 1 ngày', 29000, 29000, 'MOMO', 'SUCCESS', NOW() - INTERVAL '11 days', NOW()),
(NOW() - INTERVAL '9 days', NOW(), 3, 'ORD-20260421-0011', 'PACKAGE_PURCHASE', 'Mua Gói Tiêu Chuẩn', 199000, 199000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '9 days', NOW()),
(NOW() - INTERVAL '7 days', NOW(), 4, 'ORD-20260423-0012', 'BOOST_PURCHASE', 'Đẩy tin 7 ngày', 99000, 99000, 'ZALOPAY', 'SUCCESS', NOW() - INTERVAL '7 days', NOW()),
(NOW() - INTERVAL '5 days', NOW(), 2, 'ORD-20260425-0013', 'PACKAGE_PURCHASE', 'Mua Gói Premium', 399000, 399000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '5 days', NOW()),
(NOW() - INTERVAL '4 days', NOW(), 3, 'ORD-20260426-0014', 'BOOST_PURCHASE', 'Đẩy tin 30 ngày', 299000, 299000, 'MOMO', 'SUCCESS', NOW() - INTERVAL '4 days', NOW()),
(NOW() - INTERVAL '3 days', NOW(), 4, 'ORD-20260427-0015', 'PACKAGE_PURCHASE', 'Mua Gói Tiêu Chuẩn', 199000, 199000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '3 days', NOW()),
(NOW() - INTERVAL '2 days', NOW(), 2, 'ORD-20260428-0016', 'BOOST_PURCHASE', 'Đẩy tin 1 ngày', 29000, 29000, 'ZALOPAY', 'SUCCESS', NOW() - INTERVAL '2 days', NOW()),
(NOW() - INTERVAL '1 day', NOW(), 3, 'ORD-20260429-0017', 'PACKAGE_PURCHASE', 'Mua Gói Cơ Bản', 99000, 99000, 'VNPAY', 'SUCCESS', NOW() - INTERVAL '1 day', NOW()),
(NOW(), NOW(), 4, 'ORD-20260430-0018', 'BOOST_PURCHASE', 'Đẩy tin 7 ngày', 99000, 99000, 'MOMO', 'SUCCESS', NOW(), NOW());

INSERT INTO transactions (created_at, updated_at, user_id, order_id, order_type, order_description, amount, original_amount, payment_method, status, failed_at, failed_reason, expires_at)
VALUES 
(NOW() - INTERVAL '10 days', NOW(), 2, 'ORD-FAIL-001', 'PACKAGE_PURCHASE', 'Mua Gói Premium', 399000, 399000, 'VNPAY', 'FAILED', NOW() - INTERVAL '10 days', 'Người dùng hủy thanh toán', NOW()),
(NOW() - INTERVAL '2 days', NOW(), 3, 'ORD-FAIL-002', 'BOOST_PURCHASE', 'Đẩy tin 30 ngày', 299000, 299000, 'MOMO', 'FAILED', NOW() - INTERVAL '2 days', 'Hết hạn thanh toán', NOW());

-- =============================================
-- XÁC NHẬN
-- =============================================

SELECT 'Seed data inserted successfully!' as status;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Amenities: ' || COUNT(*) FROM amenities;
SELECT 'Rooms: ' || COUNT(*) FROM rooms;
SELECT 'Posts: ' || COUNT(*) FROM posts;
SELECT 'Bookings: ' || COUNT(*) FROM bookings;
SELECT 'Reviews: ' || COUNT(*) FROM reviews;
SELECT 'Favorites: ' || COUNT(*) FROM favorites;
SELECT 'Messages: ' || COUNT(*) FROM messages;
SELECT 'Packages: ' || COUNT(*) FROM packages;
SELECT 'Subscriptions: ' || COUNT(*) FROM subscriptions;
SELECT 'Vouchers: ' || COUNT(*) FROM vouchers;
SELECT 'Reports: ' || COUNT(*) FROM reports;
SELECT 'Transactions: ' || COUNT(*) FROM transactions;
