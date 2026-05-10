-- Data Seeding Script for Enhanced Property Visuals - V2
BEGIN;

DO $$
DECLARE
    r_id bigint;
    p_id bigint;
BEGIN
    -- 1. Phòng trọ mini cao cấp ngay cổng sau Đại học Nông Lâm
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, has_balcony, version)
    VALUES (NOW(), 'Số 12 Đường số 5, Phường Linh Trung, Thủ Đức', 20.5, 2, 10.8715, 106.7925, 2, 2, 'Đại học Nông Lâm TP.HCM', 'TP.HCM', 'Thủ Đức', 'Linh Trung', 2, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800', true, true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 2500000, 'MONTHLY', 'APPROVED', 'Phòng trọ mini cao cấp cực gần Nông Lâm - Mới xây', 'Phòng trọ sạch đẹp, vừa hoàn thiện ngay cổng sau Đại học Nông Lâm. Đầy đủ tiện nghi, giờ giấc tự do, bảo vệ 24/7.', 2, r_id, true, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 3), (r_id, 5);

    -- 2. Căn hộ studio full nội thất KDC Linh Trung
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, has_windows, version)
    VALUES (NOW(), '45 Lê Văn Chí, Phường Linh Trung, Thủ Đức', 30.0, 4, 10.8650, 106.7890, 3, 2, 'Đại học Nông Lâm TP.HCM', 'TP.HCM', 'Thủ Đức', 'Linh Trung', 3, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800', true, true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 4500000, 'MONTHLY', 'APPROVED', 'Studio full nội thất, cách Nông Lâm 500m', 'Căn hộ dịch vụ siêu xinh cho nhóm bạn, có giường tủ, máy giặt, tủ lạnh, bếp riêng biệt. Khu an ninh dân trí cao.', 3, r_id, false, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 6), (r_id, 7), (r_id, 9);

    -- 3. Phòng trọ giá rẻ cho sinh viên Tân Lập
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, version)
    VALUES (NOW(), '123 Tân Lập, Dĩ An, Bình Dương', 15.0, 1, 10.8780, 106.8000, 2, 2, 'Đại học Nông Lâm TP.HCM', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 4, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800', false, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 1500000, 'MONTHLY', 'APPROVED', 'Nhà trọ sinh viên giá tốt liền kề Làng Đại học', 'Thích hợp cho sinh viên Nông Lâm, CNTT. Giá rẻ, điện nước giá nhà nước, chủ nhà thân thiện dễ tính.', 4, r_id, false, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 4);

    -- 4. Chung cư mini Hoàng Diệu 2 - Gần Sư Phạm Kỹ Thuật
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, has_balcony, version)
    VALUES (NOW(), '89 Hoàng Diệu 2, Linh Chiểu, Thủ Đức', 25.0, 3, 10.8520, 106.7680, 2, 8, 'Đại học Sư phạm Kỹ thuật TP.HCM', 'TP.HCM', 'Thủ Đức', 'Linh Chiểu', 2, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800', true, true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 3200000, 'MONTHLY', 'APPROVED', 'Phòng trọ ban công thoáng mát - Cực gần SPKT', 'Vị trí đắc địa ngay đường Hoàng Diệu 2 nhộn nhịp, đi bộ ra cổng SPKT chỉ 5 phút. Ban công đón gió mát cả ngày.', 2, r_id, true, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 4), (r_id, 5);

    -- 5. KTX tư nhân cao cấp Võ Văn Ngân
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, is_pet_friendly, version)
    VALUES (NOW(), '202 Võ Văn Ngân, Bình Thọ, Thủ Đức', 40.0, 2, 10.8500, 106.7725, 6, 8, 'Đại học Sư phạm Kỹ thuật TP.HCM', 'TP.HCM', 'Thủ Đức', 'Bình Thọ', 3, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800', true, false, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 1800000, 'MONTHLY', 'APPROVED', 'SleepBox cao cấp đối diện Vincom Thủ Đức', 'Dạng hộp ngủ cá nhân đầy đủ chăn ga gối đệm, có rèm riêng tư. Dọn vệ sinh 2 lần/tuần, miễn phí dịch vụ.', 3, r_id, false, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 6), (r_id, 9);

    -- 6. Căn hộ 1PN Lê Văn Việt, Quận 9
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, has_windows, version)
    VALUES (NOW(), '15 Lê Văn Việt, Hiệp Phú, Quận 9', 35.0, 5, 10.8470, 106.7780, 3, 8, 'Đại học Sư phạm Kỹ thuật TP.HCM', 'TP.HCM', 'Thủ Đức', 'Hiệp Phú', 4, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800', true, true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 5000000, 'MONTHLY', 'APPROVED', 'Căn hộ 1PN ngã 4 Thủ Đức, view Landmark81', 'Phòng rộng, view tầng cao rất chill. Thang máy, vân tay bảo mật. Gần ga Metro và Đại học SPKT.', 4, r_id, false, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 3), (r_id, 6), (r_id, 7), (r_id, 8);

    -- 7. Phòng trọ lầu đúc, sạch đẹp Kha Vạn Cân
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, province, district, ward, landlord_id, thumbnail_url, is_parking_available, version)
    VALUES (NOW(), '788 Kha Vạn Cân, Linh Đông, Thủ Đức', 22.0, 2, 10.8530, 106.7520, 2, 'TP.HCM', 'Thủ Đức', 'Linh Đông', 2, 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800', true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 2200000, 'MONTHLY', 'APPROVED', 'Phòng trọ đúc giả kiên cố, yên tĩnh Kha Vạn Cân', 'Chuyên cho nữ thuê, giờ giấc an ninh tuyệt đối. Không chung chủ, ra vào khóa cổng điện tử.', 2, r_id, false, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 4), (r_id, 5);

    -- 8. Trọ gác cao ráo KDC Him Lam, gần QL1A
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, version)
    VALUES (NOW(), 'KDC Him Lam Phú Đông, Dĩ An', 28.0, 1, 10.8680, 106.7650, 3, 8, 'Đại học Sư phạm Kỹ thuật TP.HCM', 'Bình Dương', 'Dĩ An', 'An Bình', 3, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800', true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 2800000, 'MONTHLY', 'APPROVED', 'Nhà trọ có gác lửng cao KDC Him Lam', 'Trần cao thoáng, có gác đúc sạch sẽ, ban công giặt đồ riêng biệt. Cực kỳ thuận tiện đi chuyển về trung tâm Thủ Đức.', 3, r_id, true, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 4);

    -- 9. Phòng trọ Làng Đại Học mới toanh
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, nearby_university_id, nearby_university_name, province, district, ward, landlord_id, thumbnail_url, is_parking_available, has_windows, version)
    VALUES (NOW(), 'Làng Đại Học Quốc Gia, Đông Hòa, Dĩ An', 18.0, 3, 10.8730, 106.8020, 2, 4, 'Đại học Công nghệ thông tin', 'Bình Dương', 'Dĩ An', 'Đông Hòa', 4, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800', true, true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 2000000, 'MONTHLY', 'APPROVED', 'Trọ Làng Đại Học cho SV IT, Nông Lâm', 'Vị trí trung tâm làng ĐH, đi bộ ra KTX khu A, khu B, UIT hay Nông Lâm đều rất tiện lợi.', 4, r_id, false, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 4), (r_id, 5);

    -- 10. Penthouse mini view sông Xa Lộ Hà Nội
    INSERT INTO rooms (created_at, address, area, floor, latitude, longitude, max_occupancy, province, district, ward, landlord_id, thumbnail_url, is_parking_available, has_balcony, version)
    VALUES (NOW(), 'Song hành Xa Lộ Hà Nội, Hiệp Phú', 45.0, 7, 10.8420, 106.7820, 4, 'TP.HCM', 'Thủ Đức', 'Hiệp Phú', 2, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800', true, true, 1)
    RETURNING id INTO r_id;

    INSERT INTO posts (created_at, price, price_type, status, title, description, landlord_id, room_id, is_boosted, version)
    VALUES (NOW(), 6500000, 'MONTHLY', 'APPROVED', 'Căn hộ cao cấp 2PN view bao quát Quận 9', 'Dành cho gia đình nhỏ hoặc nhóm bạn 4 người. Đầy đủ máy lạnh 2 phòng, sofa, tivi, tủ lạnh thông minh.', 2, r_id, true, 1)
    RETURNING id INTO p_id;
    
    INSERT INTO room_amenities (room_id, amenity_id) VALUES (r_id, 1), (r_id, 2), (r_id, 3), (r_id, 6), (r_id, 7), (r_id, 8), (r_id, 9);
    
END $$;

COMMIT;
