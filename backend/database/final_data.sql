-- ==============================================================================
-- SCRIPT KHỞI TẠO DỮ LIỆU MẪU (SEED DATA) - PHIÊN BẢN HỢP NHẤT TỐI ƯU
-- HỆ THỐNG: THƯƠNG MẠI ĐIỆN TỬ / CHO THUÊ PHÒNG TRỌ
-- ==============================================================================

SET client_encoding = 'UTF8';

BEGIN;

-- ==============================================================================
-- 0. DỌN DẸP DỮ LIỆU CŨ (CLEANUP)
-- Xóa theo thứ tự từ bảng tham chiếu đến bảng chính để tránh lỗi Foreign Key
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BẢNG USERS (Tài khoản người dùng)
-- Mật khẩu mặc định: 123456 (Đã băm bằng thuật toán BCrypt)
-- ------------------------------------------------------------------------------
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

-- Dữ liệu người dùng bổ sung phục vụ test thống kê báo cáo
INSERT INTO users (created_at, updated_at, email, password, full_name, phone, role, status, is_verified, verified_at, provider)
VALUES 
(NOW() - INTERVAL '25 days', NOW(), 'landlord4@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Phạm Hoàng Nam', '0987654321', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '20 days', NOW(), 'landlord5@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Vũ Minh Tuấn', '0987654322', 'LANDLORD', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '15 days', NOW(), 'user4@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Đỗ Thùy Linh', '0987654323', 'USER', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '10 days', NOW(), 'user5@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Bùi Xuân Huấn', '0987654324', 'USER', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '5 days', NOW(), 'user6@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Lê Tùng Vân', '0987654325', 'USER', 'ACTIVE', true, NOW(), 'LOCAL'),
(NOW() - INTERVAL '2 days', NOW(), 'user7@tmdt.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.5QeH/T7pBHH2p5y5y', 'Trần My', '0987654326', 'USER', 'ACTIVE', true, NOW(), 'LOCAL');

-- ------------------------------------------------------------------------------
-- 2. BẢNG AMENITIES (Danh mục Tiện ích) - Gồm 24 tiện ích
-- ------------------------------------------------------------------------------

-- Phân loại: Phòng tắm (Từ 1-5)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bồn rửa mặt', 'fa-sink', 'bathroom', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Vòi hoa sen', 'fa-shower', 'bathroom', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bồn cầu', 'fa-toilet', 'bathroom', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Nước nóng', 'fa-temperature-arrow-up', 'bathroom', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Máy sưởi', 'fa-fire-flame-curved', 'bathroom', true, 5);

-- Phân loại: Phòng ngủ (Từ 6-11)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Giường ngủ', 'fa-bed', 'bedroom', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Tủ quần áo', 'fa-shirt', 'bedroom', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bàn học', 'fa-table', 'bedroom', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Điều hòa', 'fa-snowflake', 'bedroom', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Quạt máy', 'fa-fan', 'bedroom', true, 5);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Cửa sổ', 'fa-window-maximize', 'bedroom', true, 6);

-- Phân loại: Nhà bếp (Từ 12-16)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bếp gas', 'fa-fire-burner', 'kitchen', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Tủ lạnh', 'fa-box', 'kitchen', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Lò vi sóng', 'fa-microwave', 'kitchen', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Khu bếp riêng', 'fa-utensils', 'kitchen', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Khu bếp chung', 'fa-fire', 'kitchen', true, 5);

-- Phân loại: An ninh (Từ 17-20)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Camera an ninh', 'fa-video', 'security', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Khóa cửa điện tử', 'fa-fingerprint', 'security', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'PCCC', 'fa-fire-extinguisher', 'security', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bảo vệ 24/7', 'fa-user-shield', 'security', true, 4);

-- Phân loại: Nội thất (Từ 21-24)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Sofa', 'fa-couch', 'furniture', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Tivi', 'fa-tv', 'furniture', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Kệ sách', 'fa-book', 'furniture', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Bàn ăn', 'fa-chair', 'furniture', true, 4);

-- Phân loại: Khác (Từ 25-29)
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'WiFi miễn phí', 'fa-wifi', 'other', true, 1);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Máy giặt', 'fa-socks', 'other', true, 2);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Chỗ để xe', 'fa-square-parking', 'other', true, 3);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Thang máy', 'fa-elevator', 'other', true, 4);
INSERT INTO amenities (created_at, updated_at, name, icon, category, is_active, display_order) VALUES (NOW(), NOW(), 'Cho nuôi thú cưng', 'fa-dog', 'other', true, 5);

-- ------------------------------------------------------------------------------
-- 3. BẢNG ROOMS (Thông tin Phòng trọ) - Khởi tạo 10 phòng
-- ------------------------------------------------------------------------------

-- Chủ trọ 1 (id=2): Sở hữu 3 phòng
INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 2, 'P.101', '123 Đường Nguyễn Trãi, Quận 1', 'Hồ Chí Minh', 'Quận 1', 'Phường Nguyễn Cư Trinh', 10.7629, 106.6834, 25.0, 1, 2, 'EAST', true, false, 'https://picsum.photos/seed/room1/400/300', false, true, 150, 12);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 2, 'P.201', '123 Đường Nguyễn Trãi, Quận 1', 'Hồ Chí Minh', 'Quận 1', 'Phường Nguyễn Cư Trinh', 10.7630, 106.6835, 30.0, 2, 3, 'NORTH', true, true, 'https://picsum.photos/seed/room2/400/300', false, true, 200, 25);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 2, 'P.301', '123 Đường Nguyễn Trãi, Quận 1', 'Hồ Chí Minh', 'Quận 1', 'Phường Nguyễn Cư Trinh', 10.7631, 106.6836, 20.0, 3, 2, 'SOUTH', true, false, 'https://picsum.photos/seed/room3/400/300', false, false, 80, 8);

-- Chủ trọ 2 (id=3): Sở hữu 3 phòng
INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 3, 'P.101', '456 Đường Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7799, 106.6889, 28.0, 1, 2, 'WEST', true, true, 'https://picsum.photos/seed/room4/400/300', true, true, 300, 45);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 3, 'P.102', '456 Đường Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7800, 106.6890, 35.0, 1, 4, 'EAST', true, true, 'https://picsum.photos/seed/room5/400/300', false, true, 180, 20);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 3, 'P.202', '456 Đường Lê Văn Sỹ, Quận 3', 'Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 10.7801, 106.6891, 22.0, 2, 2, 'NORTH', true, false, 'https://picsum.photos/seed/room6/400/300', true, false, 120, 15);

-- Chủ trọ 3 (id=4): Sở hữu 4 phòng
INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.01', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7550, 106.6820, 40.0, 1, 5, 'SOUTH', true, true, 'https://picsum.photos/seed/room7/400/300', false, true, 250, 35);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.02', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7551, 106.6821, 32.0, 1, 3, 'NORTHEAST', true, true, 'https://picsum.photos/seed/room8/400/300', true, true, 190, 28);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.03', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7552, 106.6822, 25.0, 2, 2, 'NORTHWEST', true, false, 'https://picsum.photos/seed/room9/400/300', false, false, 95, 10);

INSERT INTO rooms (created_at, updated_at, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, view_count, favorite_count)
VALUES (NOW(), NOW(), 4, 'P.04', '789 Đường Trần Hưng Đạo, Quận 5', 'Hồ Chí Minh', 'Quận 5', 'Phường Cầu Kho', 10.7553, 106.6823, 50.0, 3, 6, 'SOUTHEAST', true, true, 'https://picsum.photos/seed/room10/400/300', false, true, 350, 55);

-- ------------------------------------------------------------------------------
-- 4. BẢNG ROOM_IMAGES (Thư viện ảnh của phòng)
-- ------------------------------------------------------------------------------

-- Phòng 1
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://picsum.photos/seed/room1a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (1, 'https://picsum.photos/seed/room1b/800/600');
-- Phòng 2
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://picsum.photos/seed/room2a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (2, 'https://picsum.photos/seed/room2b/800/600');
-- Phòng 3
INSERT INTO room_images (room_id, image_url) VALUES (3, 'https://picsum.photos/seed/room3a/800/600');
-- Phòng 4
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://picsum.photos/seed/room4a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://picsum.photos/seed/room4b/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (4, 'https://picsum.photos/seed/room4c/800/600');
-- Phòng 5
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://picsum.photos/seed/room5a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (5, 'https://picsum.photos/seed/room5b/800/600');
-- Phòng 6
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://picsum.photos/seed/room6a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (6, 'https://picsum.photos/seed/room6b/800/600');
-- Phòng 7
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://picsum.photos/seed/room7a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://picsum.photos/seed/room7b/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (7, 'https://picsum.photos/seed/room7c/800/600');
-- Phòng 8
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://picsum.photos/seed/room8a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (8, 'https://picsum.photos/seed/room8b/800/600');
-- Phòng 9
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://picsum.photos/seed/room9a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (9, 'https://picsum.photos/seed/room9b/800/600');
-- Phòng 10
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://picsum.photos/seed/room10a/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://picsum.photos/seed/room10b/800/600');
INSERT INTO room_images (room_id, image_url) VALUES (10, 'https://picsum.photos/seed/room10c/800/600');

-- ------------------------------------------------------------------------------
-- 5. BẢNG ROOM_AMENITIES (Bảng trung gian Phòng - Tiện ích)
-- ------------------------------------------------------------------------------

-- Phòng 1: Cấu hình cơ bản
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 10); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (1, 26);

-- Phòng 2: Cấu hình đầy đủ tiện nghi
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 8); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 11); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 12);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 26);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (2, 27);

-- Phòng 3: Cấu hình tiết kiệm (Budget)
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 10); INSERT INTO room_amenities (room_id, amenity_id) VALUES (3, 25);

-- Phòng 4: Cao cấp, cho phép nuôi thú cưng
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 5); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 7); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 8);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 12); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 13);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 26);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 27); INSERT INTO room_amenities (room_id, amenity_id) VALUES (4, 29);

-- Phòng 5: Thiết kế cho gia đình
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 8); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 11); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 15);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 13); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 25);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 26); INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 27);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (5, 28);

-- Phòng 6: Tiện ích thú cưng cơ bản
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 3);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 4); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (6, 29);

-- Phòng 7: Hạng Luxury sang trọng
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 5); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 7); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 8);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 15); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 13);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 14); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 17);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 25); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 26);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 27); INSERT INTO room_amenities (room_id, amenity_id) VALUES (7, 28);

-- Phòng 8: Dành cho gia đình nuôi thú cưng
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 15); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 25);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 26); INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 27);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (8, 29);

-- Phòng 9: Phòng tiết kiệm (Budget)
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 6);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 9); INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 11);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (9, 25);

-- Phòng 10: Dành cho gia đình hạng sang
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 1); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 2);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 3); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 4);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 6); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 7);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 8); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 9);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 11); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 15);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 13); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 25);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 26); INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 27);
INSERT INTO room_amenities (room_id, amenity_id) VALUES (10, 28);

-- ------------------------------------------------------------------------------
-- 6. BẢNG PACKAGES (Các gói tin đăng - Tạo trước Subscriptions)
-- ------------------------------------------------------------------------------

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

-- ------------------------------------------------------------------------------
-- 7. BẢNG POSTS (Bài đăng) - Gồm 10 bài đã duyệt & 1 bài chờ duyệt
-- ------------------------------------------------------------------------------

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

-- Bài đăng ở trạng thái PENDING để test tính năng duyệt của Admin
INSERT INTO posts (created_at, updated_at, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, expires_at)
VALUES (NOW(), NOW(), 2, 1,
'PHÒNG TEST PENDING - SẼ ĐƯỢC APPROVE BỞI ADMIN',
'Đây là bài đăng test đang chờ duyệt bởi admin.',
2200000.00, 4400000.00, 'MONTHLY', 'PENDING', NOW() + INTERVAL '30 days');

-- ------------------------------------------------------------------------------
-- 8. BẢNG POST_IMAGES (Thư viện ảnh bài đăng) - Có image_order
-- ------------------------------------------------------------------------------

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

-- ------------------------------------------------------------------------------
-- 9. BẢNG SUBSCRIPTIONS (Lịch sử đăng ký gói)
-- ------------------------------------------------------------------------------

INSERT INTO subscriptions (created_at, landlord_id, package_id, max_posts, remaining_posts, start_date, expires_at, auto_renew, is_active)
VALUES (NOW(), 2, 2, 3, 2, NOW(), NOW() + INTERVAL '30 days', true, true);

INSERT INTO subscriptions (created_at, landlord_id, package_id, max_posts, remaining_posts, start_date, expires_at, auto_renew, is_active)
VALUES (NOW(), 3, 3, 5, 4, NOW(), NOW() + INTERVAL '30 days', true, true);

INSERT INTO subscriptions (created_at, landlord_id, package_id, max_posts, remaining_posts, start_date, expires_at, auto_renew, is_active)
VALUES (NOW(), 4, 2, 3, 1, NOW(), NOW() + INTERVAL '30 days', false, true);

-- ------------------------------------------------------------------------------
-- 10. BẢNG BOOKINGS (Lịch đặt xem phòng)
-- ------------------------------------------------------------------------------

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

-- ------------------------------------------------------------------------------
-- 11. BẢNG REVIEWS (Đánh giá)
-- ------------------------------------------------------------------------------

INSERT INTO reviews (created_at, updated_at, user_id, post_id, landlord_id, booking_id, rating, comment, helpful_count, is_approved, is_visible)
VALUES (NOW(), NOW(), 5, 1, 2, NULL, 5, 'Phòng rất đẹp, sạch sẽ, chủ nhà thân thiện. Điều hòa mát, nước nóng ok. Gần trường, tiện đi học. Sẽ ở lâu dài!', 12, true, true);

INSERT INTO reviews (created_at, updated_at, user_id, post_id, landlord_id, booking_id, rating, comment, helpful_count, is_approved, is_visible)
VALUES (NOW(), NOW(), 6, 4, 3, NULL, 4, 'Căn hộ đẹp, nội thất tốt, khu vực yên tĩnh. Có gym rất tiện lợi. Gần siêu thị, tiện mua sắm. Giá hơi cao nhưng xứng đáng.', 8, true, true);

INSERT INTO reviews (created_at, updated_at, user_id, post_id, landlord_id, booking_id, rating, comment, landlord_response, landlord_response_at, helpful_count, is_approved, is_visible)
VALUES (NOW(), NOW(), 7, 7, 4, NULL, 5, 'Phòng luxury thực sự! Đầy đủ tiện nghi, view đẹp. Nhân viên bảo vệ chu đáo. Perfect!',
'Cảm ơn bạn đã đánh giá tích cực! Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho khách thuê.', NOW(), 25, true, true);

-- ------------------------------------------------------------------------------
-- 12. BẢNG FAVORITES (Tin đăng yêu thích)
-- ------------------------------------------------------------------------------

INSERT INTO favorites (user_id, room_id, created_at) VALUES (5, 2, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (5, 4, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (5, 7, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (6, 1, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (6, 5, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (7, 4, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (7, 8, NOW());
INSERT INTO favorites (user_id, room_id, created_at) VALUES (7, 10, NOW());

-- ------------------------------------------------------------------------------
-- 13. BẢNG CONVERSATIONS & MESSAGES (Trò chuyện & Tin nhắn)
-- ------------------------------------------------------------------------------

-- Dữ liệu Conversations (Hội thoại)
INSERT INTO conversations (user1_id, user2_id, last_message_at, last_message_preview, last_message_type, unread_count_user1, unread_count_user2, created_at)
VALUES (5, 2, NOW(), 'Bạn muốn đặt lịch xem phòng không?', 0, 0, 1, NOW());

INSERT INTO conversations (user1_id, user2_id, last_message_at, last_message_preview, last_message_type, unread_count_user1, unread_count_user2, created_at)
VALUES (6, 3, NOW(), 'OK, tôi sẽ đến xem phòng P.202', 0, 0, 0, NOW());

INSERT INTO conversations (user1_id, user2_id, last_message_at, last_message_preview, last_message_type, unread_count_user1, unread_count_user2, created_at)
VALUES (7, 4, NOW(), 'Mình sẽ hỗ trợ nhiệt tình!', 0, 0, 2, NOW());

-- Dữ liệu Messages (Tin nhắn chi tiết trong Conversation 1)
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (1, 5, 2, 'TEXT', 'Xin chào, tôi muốn hỏi về phòng P.201', true, NOW() - INTERVAL '2 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (1, 2, 5, 'TEXT', 'Xin chào! Phòng P.201 còn trống. Bạn muốn đặt lịch xem phòng không?', false, NOW() - INTERVAL '1 hour');

-- Dữ liệu Messages (Tin nhắn chi tiết trong Conversation 2)
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (2, 6, 3, 'TEXT', 'Cho tôi hỏi, phòng có nuôi chó được không?', true, NOW() - INTERVAL '5 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (2, 3, 6, 'TEXT', 'Phòng P.101 và P.202 cho phép nuôi thú cưng. Phòng P.102 thì không.', true, NOW() - INTERVAL '4 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (2, 6, 3, 'TEXT', 'OK, tôi sẽ đến xem phòng P.202 vào ngày mai.', false, NOW() - INTERVAL '3 hours');

-- Dữ liệu Messages (Tin nhắn chi tiết trong Conversation 3)
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (3, 7, 4, 'TEXT', 'Tôi muốn thuê phòng VIP 50m2. Có thể ở được 5 người không?', true, NOW() - INTERVAL '1 day');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (3, 4, 7, 'TEXT', 'Được ạ! Phòng 50m2 có thể ở 5-6 người thoải mái. Có 2 phòng ngủ riêng.', false, NOW() - INTERVAL '20 hours');
INSERT INTO messages (conversation_id, sender_id, receiver_id, type, content, is_read, created_at) VALUES (3, 4, 7, 'TEXT', 'Bạn có thể đặt lịch xem phòng qua ứng dụng. Mình sẽ hỗ trợ nhiệt tình!', false, NOW() - INTERVAL '19 hours');

-- ------------------------------------------------------------------------------
-- 14. BẢNG VOUCHERS (Mã giảm giá)
-- ------------------------------------------------------------------------------

INSERT INTO vouchers (created_at, code, name, discount_type, discount, max_discount_amount, min_order_amount, total_quantity, remaining_quantity, expires_at, is_active)
VALUES (NOW(), 'WELCOME50', 'Chào mừng thành viên mới', 'PERCENTAGE', 10.00, 50000.00, 0.00, 100, 95, NOW() + INTERVAL '90 days', true);

INSERT INTO vouchers (created_at, code, name, discount_type, discount, max_discount_amount, min_order_amount, total_quantity, remaining_quantity, expires_at, is_active)
VALUES (NOW(), 'SUMMER2026', 'Khuyến mãa mùa hè', 'PERCENTAGE', 15.00, 100000.00, 100000.00, 50, 45, NOW() + INTERVAL '60 days', true);

INSERT INTO vouchers (created_at, code, name, discount_type, discount, max_discount_amount, min_order_amount, total_quantity, remaining_quantity, expires_at, is_active)
VALUES (NOW(), 'FLAT100K', 'Giảm 100K', 'FIXED', 100000.00, 0.00, 500000.00, 200, 180, NOW() + INTERVAL '45 days', true);

-- ------------------------------------------------------------------------------
-- 15. BẢNG REPORTS (Báo cáo vi phạm)
-- ------------------------------------------------------------------------------

INSERT INTO reports (created_at, updated_at, reporter_id, target_id, target_type, type, reason, status)
VALUES (NOW() - INTERVAL '1 day', NOW(), 5, 1, 'POST', 'SPAM', 'Tin đăng trùng lặp nhiều lần', 'PENDING');

INSERT INTO reports (created_at, updated_at, reporter_id, target_id, target_type, type, reason, status)
VALUES (NOW() - INTERVAL '2 days', NOW(), 6, 4, 'POST', 'FAKE_POST', 'Phòng không giống như trong ảnh', 'PENDING');

INSERT INTO reports (created_at, updated_at, reporter_id, target_id, target_type, type, reason, status, handled_by, handled_at, handled_note, action_taken)
VALUES (NOW() - INTERVAL '5 days', NOW(), 7, 2, 'POST', 'FRAUD', 'Yêu cầu chuyển khoản đặt cọc trước khi xem phòng', 'RESOLVED', 1, NOW() - INTERVAL '4 days', 'Đã xác minh và gỡ bỏ tin đăng', 'REMOVE_POST');

-- ------------------------------------------------------------------------------
-- 16. BẢNG TRANSACTIONS (Giao dịch - Phục vụ biểu đồ doanh thu)
-- ------------------------------------------------------------------------------

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


-- ==============================================================================
-- PHẦN 2: TẬP DỮ LIỆU MẪU SỐ 2
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BẢNG USERS (Xóa dữ liệu cũ trùng lặp và thêm mới)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. BẢNG AMENITIES (Xóa dữ liệu cũ và cập nhật tiện ích mới)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. BẢNG ROOMS (Sử dụng subquery để map landlord_id theo email)
-- ------------------------------------------------------------------------------
-- Xóa dữ liệu cũ dựa theo id của landlord để tránh lỗi font địa chỉ
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

-- ------------------------------------------------------------------------------
-- 4. BẢNG POSTS (Thông tin các Bài đăng)
-- ------------------------------------------------------------------------------
-- Xóa dữ liệu cũ theo landlord để đồng bộ
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

-- ------------------------------------------------------------------------------
-- 5. BẢNG POST_IMAGES (Ảnh thuộc về Bài đăng)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. BẢNG ROOM_IMAGES (Thư viện ảnh đính kèm Phòng trọ)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 7. BẢNG ROOM_AMENITIES (Tiện ích theo phòng ở tập 2)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 8. BẢNG REVIEWS (Làm sạch và thêm dữ liệu đánh giá)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 9. BẢNG BOOKINGS (Thiết lập Lịch xem phòng)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 10. BẢNG FAVORITES (Mục yêu thích của User)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 11. BẢNG VOUCHERS (Chương trình Khuyến mãi bổ sung)
-- ------------------------------------------------------------------------------
DELETE FROM vouchers WHERE code IN ('WELCOME50','SUMMER2026','FIRSTBOOKING','VIPROOM');

INSERT INTO vouchers (code, name, description, discount_type, discount, min_order_amount, max_discount_amount, valid_from, expires_at, total_quantity, remaining_quantity, used_count, is_active, created_at, updated_at, version)
VALUES
  ('WELCOME50', 'Chào mừng sinh viên mới', 'Giảm 50K cho đơn từ 500K', 'FIXED', 50000.0, 500000.0, 50000.0, NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days', 100, 100, 0, true, NOW(), NOW(), 0),
  ('SUMMER2026', 'Khuyến mãi mùa hè', 'Giảm 10% cho tất cả phòng', 'PERCENTAGE', 10.0, 0.0, 200000.0, NOW() - INTERVAL '5 days', NOW() + INTERVAL '60 days', 200, 200, 0, true, NOW(), NOW(), 0),
  ('FIRSTBOOKING', 'Lần đầu đặt lịch', 'Giảm 100K cho lần đặt lịch đầu tiên', 'FIXED', 100000.0, 0.0, 100000.0, NOW(), NOW() + INTERVAL '90 days', 500, 500, 0, true, NOW(), NOW(), 0),
  ('VIPROOM', 'Phòng VIP giảm 15%', 'Giảm 15% cho phòng VIP', 'PERCENTAGE', 15.0, 1000000.0, 500000.0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '15 days', 50, 50, 0, true, NOW(), NOW(), 0);

-- ------------------------------------------------------------------------------
-- 12. BẢNG PACKAGES (Cấu hình Gói đăng tin bổ sung)
-- ------------------------------------------------------------------------------
DELETE FROM packages WHERE name IN ('Gói Cơ Bản','Gói Tiêu Chuẩn','Gói VIP');

INSERT INTO packages (name, description, price, duration_days, max_posts, type, display_order, is_featured, is_active, created_at, version)
VALUES
  ('Gói Cơ Bản', 'Đăng tối đa 3 tin, thời hạn 30 ngày', 99000.0, 30, 3, 'POST_BASIC', 1, false, true, NOW(), 0),
  ('Gói Tiêu Chuẩn', 'Đăng tối đa 10 tin, thời hạn 90 ngày, hỗ trợ 24/7', 249000.0, 90, 10, 'POST_STANDARD', 2, true, true, NOW(), 0),
  ('Gói VIP', 'Đăng không giới hạn, ưu tiên hiển thị, thời hạn 365 ngày', 899000.0, 365, 999, 'POST_PREMIUM', 3, false, true, NOW(), 0);

-- ------------------------------------------------------------------------------
-- 13. BẢNG SUBSCRIPTIONS (Quản lý Chủ trọ mua gói)
-- ------------------------------------------------------------------------------
DELETE FROM subscriptions WHERE landlord_id IN (
  SELECT id FROM users WHERE email IN ('landlord1@gmail.com','landlord2@gmail.com','landlord3@gmail.com')
);

INSERT INTO subscriptions (landlord_id, package_id, start_date, expires_at, is_active, remaining_posts, used_posts, max_posts, auto_renew, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), (SELECT id FROM packages WHERE name='Gói Tiêu Chuẩn'), NOW(), NOW() + INTERVAL '90 days', true, 8, 2, 10, true, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord2@gmail.com'), (SELECT id FROM packages WHERE name='Gói Cơ Bản'), NOW(), NOW() + INTERVAL '30 days', true, 2, 1, 3, false, NOW(), NOW(), 0),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), (SELECT id FROM packages WHERE name='Gói VIP'), NOW(), NOW() + INTERVAL '365 days', true, 995, 5, 999, true, NOW(), NOW(), 0);

-- ------------------------------------------------------------------------------
-- 14. BẢNG VIEW_HISTORY (Lịch sử xem tin)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 15. BẢNG NOTIFICATIONS (Hệ thống Thông báo)
-- ------------------------------------------------------------------------------
DELETE FROM notifications WHERE title IN ('Lịch xem phòng được xác nhận', 'Có phòng mới phù hợp', 'Có lịch xem phòng mới', 'Phòng được yêu thích nhiều');
INSERT INTO notifications (user_id, title, content, type, is_read, created_at)
VALUES
  ((SELECT id FROM users WHERE email='user1@gmail.com'), 'Lịch xem phòng được xác nhận', 'Lịch xem phòng tại 123 Nguyễn Huệ vào ngày mai đã được xác nhận.', 'BOOKING', false, NOW()),
  ((SELECT id FROM users WHERE email='user2@gmail.com'), 'Có phòng mới phù hợp', 'Phòng trọ 35m2 Pasteur vừa được đăng, phù hợp với tiêu chí của bạn!', 'POST', false, NOW()),
  ((SELECT id FROM users WHERE email='landlord1@gmail.com'), 'Có lịch xem phòng mới', 'Người dùng Phạm Minh D muốn xem phòng tại 123 Nguyễn Huệ.', 'BOOKING', false, NOW()),
  ((SELECT id FROM users WHERE email='landlord3@gmail.com'), 'Phòng được yêu thích nhiều', 'Phòng của bạn tại quận 5 vừa được thêm vào yêu thích.', 'FAVORITE', false, NOW());

-- ------------------------------------------------------------------------------
-- 16. BẢNG BLACKLIST (Danh sách đen - Xử lý vi phạm)
-- ------------------------------------------------------------------------------

-- Bước 1: Xóa các bảng có tham chiếu khóa ngoại tới User vi phạm
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email IN ('baduser1@gmail.com', 'baduser2@gmail.com'));
DELETE FROM blacklist WHERE user_id IN (SELECT id FROM users WHERE email IN ('baduser1@gmail.com', 'baduser2@gmail.com'));

-- Bước 2: Xóa User cũ (Nếu có)
DELETE FROM users WHERE email IN ('baduser1@gmail.com', 'baduser2@gmail.com');

-- Bước 3: Thêm lại tài khoản User vi phạm
INSERT INTO users (email, password, full_name, phone, role, status, is_verified, provider, created_at, updated_at, version)
VALUES 
  ('baduser1@gmail.com', '1', 'Kẻ Gian Lận 1', '0999111222', 'USER', 'LOCKED', true, 'LOCAL', NOW(), NOW(), 0),
  ('baduser2@gmail.com', '1', 'Kẻ Gian Lận 2', '0999333444', 'LANDLORD', 'LOCKED', true, 'LOCAL', NOW(), NOW(), 0);

-- Bước 4: Cập nhật thông tin vào Blacklist
INSERT INTO blacklist (user_id, reason, type, is_permanent, expires_at, added_by, is_active, created_at, updated_at, version)
VALUES
  ((SELECT id FROM users WHERE email='baduser1@gmail.com'), 'Spam tin nhắn lừa đảo người dùng khác', 'PERMANENT', true, NULL, (SELECT id FROM users WHERE email='admin@gmail.com'), true, NOW() - INTERVAL '2 days', NOW(), 0),
  ((SELECT id FROM users WHERE email='baduser2@gmail.com'), 'Đăng tin giả mạo, không đúng thực tế nhiều lần', 'TEMPORARY', false, NOW() + INTERVAL '30 days', (SELECT id FROM users WHERE email='admin@gmail.com'), true, NOW() - INTERVAL '1 day', NOW(), 0);

-- ==============================================================================
-- HOÀN THÀNH - COMMIT THAY ĐỔI
-- ==============================================================================
COMMIT;

-- Trích xuất thông tin Admin sau khi seed xong
SELECT email, full_name, role, status FROM users WHERE email = 'admin@gmail.com';