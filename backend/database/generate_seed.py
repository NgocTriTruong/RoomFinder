import random
import math

# Haversine formula to calculate distance between two coordinates in km
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

# Coordinate generator near a center point (at a specific distance in meters)
def generate_coordinate_at_distance(lat, lon, target_distance_meters):
    # Earth's radius in meters
    r_earth = 6371000.0
    
    # Introduce small random variation around the target distance (e.g. +/- 10%)
    distance = target_distance_meters * random.uniform(0.9, 1.1)
    angle = random.uniform(0, 2 * math.pi)
    
    # Offsets in radians
    delta_lat = (distance * math.cos(angle)) / r_earth
    delta_lon = (distance * math.sin(angle)) / (r_earth * math.cos(math.radians(lat)))
    
    new_lat = lat + math.degrees(delta_lat)
    new_lon = lon + math.degrees(delta_lon)
    return round(new_lat, 6), round(new_lon, 6)

# Unsplash premium image categories for rooms
room_images_pool = [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", # Bedroom cozy
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80", # Studio modern
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", # Simple neat
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80", # Balcony bedroom
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80", # Sleepbox loft
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", # Clean light
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80", # Modern studio blue
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80", # Attic cozy room
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", # Student desk bedroom
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80", # Wooden style studio
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", # Cozy warm bed
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", # Scandinavian minimalist
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80", # Modern grey bedroom
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80", # Living area room
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"  # Bohemian room
]

additional_images_pool = [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", # Bathroom clean
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80", # Cozy room corner
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", # Kitchen stove
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"  # Small clean kitchen
]

# Premium video pool (fast, public streaming direct MP4 links with high-res Unsplash thumbnails)
video_pool = [
    {
        "url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        "thumbnail": "https://images.unsplash.com/photo-1502672260266-1c1ef2d95280?auto=format&fit=crop&w=800&q=80"
    },
    {
        "url": "https://www.w3schools.com/html/mov_bbb.mp4",
        "thumbnail": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
    },
    {
        "url": "https://www.w3schools.com/html/movie.mp4",
        "thumbnail": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    },
    {
        "url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        "thumbnail": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    }
]

# 8 Universities Data
universities = [
    {
        "name": "Trường Đại học Nông Lâm TP.HCM",
        "abbreviation": "NLU",
        "address": "Đường số 6, Phường Linh Trung, Thủ Đức, TP.HCM",
        "province": "TP Hồ Chí Minh",
        "district": "Thủ Đức",
        "latitude": 10.870020,
        "longitude": 106.787687,
        "website": "https://www.nlu.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/c/c7/Logo_Nong_Lam_University.svg",
        "email_domain": "nlu.edu.vn"
    },
    {
        "name": "Trường Đại học Sư phạm Kỹ thuật TP.HCM",
        "abbreviation": "HCMUTE",
        "address": "1 Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP.HCM",
        "province": "TP Hồ Chí Minh",
        "district": "Thủ Đức",
        "latitude": 10.851419,
        "longitude": 106.771970,
        "website": "https://hcmute.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/2/25/Logo_HCMUTE.png",
        "email_domain": "hcmute.edu.vn"
    },
    {
        "name": "Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM",
        "abbreviation": "UIT",
        "address": "Đường Hàn Thuyên, Khu phố 6, Phường Linh Trung, Thủ Đức, TP.HCM",
        "province": "TP Hồ Chí Minh",
        "district": "Thủ Đức",
        "latitude": 10.870009,
        "longitude": 106.803027,
        "website": "https://www.uit.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/1/15/Logo_UIT.png",
        "email_domain": "uit.edu.vn"
    },
    {
        "name": "Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)",
        "abbreviation": "HCMUT",
        "address": "Đường Tạ Quang Bửu, Khu phố Tân Lập, Dĩ An, Bình Dương",
        "province": "Bình Dương",
        "district": "Dĩ An",
        "latitude": 10.880312,
        "longitude": 106.806660,
        "website": "https://www.hcmut.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/1/1b/Logo_HCMUT.svg",
        "email_domain": "hcmut.edu.vn"
    },
    {
        "name": "Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)",
        "abbreviation": "HCMUS",
        "address": "Khu đô thị ĐHQG TP.HCM, Dĩ An, Bình Dương",
        "province": "Bình Dương",
        "district": "Dĩ An",
        "latitude": 10.875647,
        "longitude": 106.799732,
        "website": "https://www.hcmus.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/b/b3/Logo_HCMUS.svg",
        "email_domain": "hcmus.edu.vn"
    },
    {
        "name": "Trường Đại học Quốc tế - ĐHQG TP.HCM",
        "abbreviation": "IU",
        "address": "Khu đô thị ĐHQG TP.HCM, Dĩ An, Bình Dương",
        "province": "Bình Dương",
        "district": "Dĩ An",
        "latitude": 10.877893,
        "longitude": 106.801648,
        "website": "https://hcmiu.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/a/a2/Logo_HCMIU.png",
        "email_domain": "hcmiu.edu.vn"
    },
    {
        "name": "Trường Đại học Kinh tế TP.HCM (Cơ sở A)",
        "abbreviation": "UEH",
        "address": "59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM",
        "province": "TP Hồ Chí Minh",
        "district": "Quận 3",
        "latitude": 10.782787,
        "longitude": 106.696120,
        "website": "https://www.ueh.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/d/d4/Logo_UEH.svg",
        "email_domain": "ueh.edu.vn"
    },
    {
        "name": "Trường Đại học Ngoại thương - Cơ sở 2",
        "abbreviation": "FTU2",
        "address": "15 Đường D5, Phường 25, Quận Bình Thạnh, TP.HCM",
        "province": "TP Hồ Chí Minh",
        "district": "Bình Thạnh",
        "latitude": 10.802194,
        "longitude": 106.714498,
        "website": "https://cs2.ftu.edu.vn",
        "logo_url": "https://upload.wikimedia.org/wikipedia/vi/f/f5/Logo_FTU.png",
        "email_domain": "ftu.edu.vn"
    }
]

# Wards for districts
wards_map = {
    "Thủ Đức": ["Linh Trung", "Linh Chiểu", "Linh Tây", "Tăng Nhơn Phú A", "Hiệp Phú", "Bình Thọ"],
    "Dĩ An": ["Đông Hòa", "An Bình", "Tân Đông Hiệp"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 5", "Phường 6"],
    "Bình Thạnh": ["Phường 25", "Phường 26", "Phường 17"]
}

# Street list for address generation
streets_map = {
    "Thủ Đức": ["Nguyễn Văn Bá", "Hoàng Diệu 2", "Võ Văn Ngân", "Lê Văn Chí", "Đường số 5", "Đường số 12", "Song Hành"],
    "Dĩ An": ["Tân Lập", "KDC Him Lam Phú Đông", "Đường ĐHQG", "Bình Đường", "Trần Hưng Đạo"],
    "Quận 3": ["Nguyễn Đình Chiểu", "Võ Văn Tần", "Điện Biên Phủ", "Bàn Cờ", "Cao Thắng"],
    "Bình Thạnh": ["Đường D5", "Đường D2 (Nguyễn Gia Trí)", "Xô Viết Nghệ Tĩnh", "Ung Văn Khiêm", "Điện Biên Phủ"]
}

# Distance tiers for rooms:
# Room 1: ~300m (Very Close)
# Room 2: ~1.0km (Close / 1km demo)
# Room 3: ~2.1km (Medium)
# Room 4: ~3.6km (Far)
# Room 5: ~5.0km (Very Far / 4-5km demo)
distance_tiers_meters = [300, 1000, 2100, 3600, 5000]

room_types = [
    {
        "type_name": "Phòng trọ mini giá rẻ sinh viên",
        "area_range": (14, 18),
        "price_base": 1400000,
        "price_var": 400000,
        "occupancy": 2,
        "has_balcony": False,
        "has_windows": True,
        "amenity_ids": [1, 3, 4, 9] # WiFi, Nóng lạnh, Chỗ để xe, Bếp
    },
    {
        "type_name": "Căn hộ Studio gác lửng full nội thất",
        "area_range": (24, 30),
        "price_base": 3300000,
        "price_var": 800000,
        "occupancy": 3,
        "has_balcony": True,
        "has_windows": True,
        "amenity_ids": [1, 2, 3, 4, 5, 6, 7, 9, 12] # WiFi, Đh, Nl, Xe, An ninh, Tủ lạnh, Mgiặt, Bếp, Camera
    },
    {
        "type_name": "Sleepbox cao cấp tiện nghi, bảo mật",
        "area_range": (25, 38),
        "price_base": 1300000,
        "price_var": 500000,
        "occupancy": 6,
        "has_balcony": False,
        "has_windows": True,
        "amenity_ids": [1, 2, 3, 4, 5, 7, 11, 12] # Shared style: wifi, aircon, security, camera, elevator
    },
    {
        "type_name": "Phòng trọ ban công thoáng mát gần trường",
        "area_range": (18, 24),
        "price_base": 2300000,
        "price_var": 700000,
        "occupancy": 2,
        "has_balcony": True,
        "has_windows": True,
        "amenity_ids": [1, 2, 3, 4, 5, 6, 9] # wifi, aircon, hotwater, parking, kitchen
    },
    {
        "type_name": "Căn hộ dịch vụ 1PN sang trọng, an ninh",
        "area_range": (35, 45),
        "price_base": 4800000,
        "price_var": 1500000,
        "occupancy": 3,
        "has_balcony": True,
        "has_windows": True,
        "amenity_ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] # Full option
    }
]

def get_room_description(template, area, price, deposit, distance, uni_name, uni_abbr, street, ward, district, curfew):
    type_name = template["type_name"]
    price_str = f"{price:,}"
    deposit_str = f"{deposit:,}"
    
    # 1. Location details
    loc_desc = (
        f"**Vị trí thuận tiện và yên tĩnh**\n"
        f"- Địa chỉ: {street}, {ward if 'Phường' in ward or 'Xã' in ward or 'Thị trấn' in ward else 'Phường ' + ward}, {district}.\n"
        f"- Chỉ cách khuôn viên trường {uni_name} ({uni_abbr}) khoảng {distance:.2f}km. "
        f"Việc đi học hàng ngày cực kỳ thuận tiện và nhanh chóng bằng xe máy, xe buýt hoặc đi bộ. "
        f"Khu vực xung quanh cao ráo, không bị ngập nước, đường sá thông thoáng."
    )
    
    # 2. Design specifications
    design_desc = (
        f"**Thiết kế căn phòng**\n"
        f"- Diện tích sử dụng: {area}m2. Thiết kế tối ưu không gian, sạch sẽ, thoáng mát, thích hợp cho việc học tập lâu dài.\n"
        f"- Sở hữu cửa sổ lớn đón ánh sáng tự nhiên tốt, giữ phòng luôn khô ráo."
    )
    if template.get("has_balcony"):
        design_desc += "\n- Có ban công riêng đón gió mát mẻ, thuận tiện cho việc phơi đồ hoặc làm góc thư giãn."
        
    # 3. Embedded amenities
    amenities_list = []
    if 1 in template["amenity_ids"]:
        amenities_list.append("Wifi internet tốc độ cao riêng biệt từng phòng")
    if 2 in template["amenity_ids"]:
        amenities_list.append("Máy điều hòa nhiệt độ Inverter hoạt động êm ái, tiết kiệm điện")
    if 3 in template["amenity_ids"]:
        amenities_list.append("Hệ thống nước nóng lạnh an toàn")
    if 4 in template["amenity_ids"]:
        amenities_list.append("Chỗ để xe máy rộng rãi dưới tầng trệt, an ninh đảm bảo")
    if 6 in template["amenity_ids"]:
        amenities_list.append("Tủ lạnh dung tích lớn tiện lợi lưu trữ đồ ăn")
    if 7 in template["amenity_ids"]:
        amenities_list.append("Khu vực giặt sấy/máy giặt tiện nghi")
    if 9 in template["amenity_ids"]:
        amenities_list.append("Kệ bếp nấu ăn thoáng khí, tủ bếp sạch sẽ")
        
    if amenities_list:
        amenities_str = "\n".join([f"- {amen}" for amen in amenities_list])
        amen_desc = f"**Các tiện ích lắp sẵn**\n{amenities_str}"
    else:
        amen_desc = f"**Các tiện ích lắp sẵn**\n- Đầy đủ trang thiết bị cơ bản phục vụ nhu cầu sinh hoạt hàng ngày."
        
    # 4. Security
    curfew_str = f"Giờ đóng cổng: {curfew} đêm nhằm đảm bảo trật tự chung." if curfew != "Tự do" else "Giờ giấc ra vào tự do thoải mái, không chung chủ."
    sec_desc = (
        f"**An ninh và quy định**\n"
        f"- Hệ thống cửa cổng kiểm soát bằng khóa vân tay bảo mật cao kết hợp camera giám sát 24/7.\n"
        f"- {curfew_str}\n"
        f"- Môi trường sống văn minh, hàng xóm chủ yếu là sinh viên ngoan ngoãn và nhân viên văn phòng lịch sự."
    )
    
    # 5. Financial details
    price_desc = (
        f"**Thông tin chi phí thuê**\n"
        f"- Giá thuê hàng tháng: {price_str} đ/tháng.\n"
        f"- Tiền đặt cọc: {deposit_str} đ (cam kết hoàn trả đầy đủ khi kết thúc hợp đồng theo đúng thỏa thuận).\n"
        f"- Chỉ số điện nước tính theo đồng hồ riêng gắn trước cửa phòng, cam kết thu đúng chỉ số tiêu thụ thực tế."
    )
    
    full_desc = f"{loc_desc}\n\n{design_desc}\n\n{amen_desc}\n\n{sec_desc}\n\n{price_desc}"
    return full_desc

# Generate premium seed script content
def generate_sql():
    sql = []
    sql.append("-- ==============================================================================")
    sql.append("-- PREMIUM SEED DATA: 8 UNIVERSITIES, 40 ROOMS CLUSTERED, 40 APPROVED POSTS WITH VIDEOS")
    sql.append("-- VARYING DISTANCES: ~0.3km, ~1km, ~2km, ~3.5km, ~5km (4-5km) FOR PERFECT FILTER DEMOS")
    sql.append("-- GENERATED AUTOMATICALLY BY ANTIGRAVITY WITH ACCURATE GEODETIC GPS MATH")
    sql.append("-- ==============================================================================")
    sql.append("\nBEGIN;")
    
    # 1. Truncate existing university data if any
    sql.append("\n-- Xóa dữ liệu cũ để tránh xung đột khóa chính hoặc dữ liệu trùng lặp")
    sql.append("TRUNCATE TABLE blacklist, view_history, transactions, reports, vouchers, messages, conversations, favorites, reviews, bookings, subscriptions, post_images, posts, packages, room_amenities, room_images, rooms, notifications, users, universities, amenities CASCADE;")
    
    # Re-insert packages
    sql.append("\n-- Khởi tạo lại Gói dịch vụ đăng tin (Packages)")
    sql.append("INSERT INTO packages (id, name, description, price, duration_days, max_posts, type, display_order, is_featured, is_active, created_at, version)")
    sql.append("VALUES")
    sql.append("  (1, 'Gói Cơ Bản', 'Đăng tối đa 3 tin, thời hạn 30 ngày', 99000.0, 30, 3, 'POST_BASIC', 1, false, true, NOW(), 0),")
    sql.append("  (2, 'Gói Tiêu Chuẩn', 'Đăng tối đa 10 tin, thời hạn 90 ngày, hỗ trợ 24/7', 249000.0, 90, 10, 'POST_STANDARD', 2, true, true, NOW(), 0),")
    sql.append("  (3, 'Gói VIP', 'Đăng không giới hạn, ưu tiên hiển thị, thời hạn 365 ngày', 899000.0, 365, 999, 'POST_PREMIUM', 3, false, true, NOW(), 0);")
    sql.append("SELECT setval('packages_id_seq', 3);")

    # Re-insert users
    sql.append("\n-- Khởi tạo lại Người dùng (Users)")
    sql.append("INSERT INTO users (id, email, password, full_name, phone, role, status, is_verified, provider, created_at, updated_at, version, landlord_rating, total_reviews)")
    sql.append("VALUES")
    sql.append("  (1, 'admin@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Quản Trị Viên', '0909123456', 'ADMIN', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0),")
    sql.append("  (2, 'landlord1@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Nguyễn Văn Minh', '0901234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.8, 12),")
    sql.append("  (3, 'landlord2@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Trần Thị Lan', '0902234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.6, 8),")
    sql.append("  (4, 'landlord3@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Lê Hoàng Nam', '0903234567', 'LANDLORD', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 4.9, 20),")
    sql.append("  (5, 'user1@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Phạm Minh Đức', '0904234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0),")
    sql.append("  (6, 'user2@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Hoàng Thu Thảo', '0905234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0),")
    sql.append("  (7, 'user3@gmail.com', '$2a$10$yew8gr48YgnQJaIJcASiO.ZWa0YTYCRELRmnZi4PRd4adJYbaGY3O', 'Đặng Nam Khánh', '0906234567', 'USER', 'ACTIVE', true, 'LOCAL', NOW(), NOW(), 0, 0.0, 0);")
    sql.append("SELECT setval('users_id_seq', 7);")

    # Re-insert Subscriptions
    sql.append("\n-- Khởi tạo lại Đăng ký tin của chủ trọ (Subscriptions)")
    sql.append("INSERT INTO subscriptions (landlord_id, package_id, start_date, expires_at, is_active, remaining_posts, used_posts, max_posts, auto_renew, created_at, updated_at, version)")
    sql.append("VALUES")
    sql.append("  (2, 3, NOW(), NOW() + INTERVAL '365 days', true, 999, 15, 999, true, NOW(), NOW(), 0),")
    sql.append("  (3, 3, NOW(), NOW() + INTERVAL '365 days', true, 999, 15, 999, true, NOW(), NOW(), 0),")
    sql.append("  (4, 3, NOW(), NOW() + INTERVAL '365 days', true, 999, 15, 999, true, NOW(), NOW(), 0);")

    # Re-insert amenities
    sql.append("\n-- Khởi tạo lại Tiện ích (Amenities) - 12 tiện ích chính")
    sql.append("INSERT INTO amenities (id, name, icon, category, is_active, display_order, created_at, updated_at, version)")
    sql.append("VALUES")
    sql.append("  (1, 'WiFi', 'fa-wifi', 'other', true, 1, NOW(), NOW(), 0),")
    sql.append("  (2, 'Điều hòa', 'fa-snowflake', 'bedroom', true, 2, NOW(), NOW(), 0),")
    sql.append("  (3, 'Nóng lạnh', 'fa-shower', 'bathroom', true, 3, NOW(), NOW(), 0),")
    sql.append("  (4, 'Chỗ để xe', 'fa-car', 'security', true, 4, NOW(), NOW(), 0),")
    sql.append("  (5, 'An ninh', 'fa-shield-alt', 'security', true, 5, NOW(), NOW(), 0),")
    sql.append("  (6, 'Tủ lạnh', 'fa-box', 'kitchen', true, 6, NOW(), NOW(), 0),")
    sql.append("  (7, 'Máy giặt', 'fa-sync', 'other', true, 7, NOW(), NOW(), 0),")
    sql.append("  (8, 'Tivi', 'fa-tv', 'bedroom', true, 8, NOW(), NOW(), 0),")
    sql.append("  (9, 'Bếp', 'fa-utensils', 'kitchen', true, 9, NOW(), NOW(), 0),")
    sql.append("  (10, 'Gym', 'fa-dumbbell', 'other', true, 10, NOW(), NOW(), 0),")
    sql.append("  (11, 'Thang máy', 'fa-elevator', 'other', true, 11, NOW(), NOW(), 0),")
    sql.append("  (12, 'Camera an ninh', 'fa-video', 'security', true, 12, NOW(), NOW(), 0);")
    sql.append("SELECT setval('amenities_id_seq', 12);")

    # 2. Insert 8 Universities
    sql.append("\n-- 2. BẢNG UNIVERSITIES (8 trường đại học)")
    sql.append("INSERT INTO universities (id, created_at, updated_at, name, abbreviation, address, province, district, latitude, longitude, website, logo_url, email_domain, is_active, version)")
    sql.append("VALUES")
    for i, uni in enumerate(universities, 1):
        sql.append(f"  ({i}, NOW(), NOW(), '{uni['name']}', '{uni['abbreviation']}', '{uni['address']}', '{uni['province']}', '{uni['district']}', {uni['latitude']}, {uni['longitude']}, '{uni['website']}', '{uni['logo_url']}', '{uni['email_domain']}', true, 0){',' if i < len(universities) else ';'}")
    sql.append(f"SELECT setval('universities_id_seq', {len(universities)});")

    # 3. Insert 40 Rooms and 40 Posts
    sql.append("\n-- 3. BẢNG ROOMS VÀ POSTS (5 phòng + bài đăng cho mỗi trường với khoảng cách và giá khác nhau)")
    
    room_id_counter = 1
    post_id_counter = 1
    
    # Store room and post variables to assign images/amenities easily
    for uni_idx, uni in enumerate(universities, 1):
        uni_abbr = uni['abbreviation']
        uni_name = uni['name']
        province = uni['province']
        district = uni['district']
        
        # Get wards and streets
        wards = wards_map.get(district, ["Phường 1", "Phường 2"])
        streets = streets_map.get(district, ["Đường chính"])
        
        sql.append(f"\n-- ==========================================\n-- PHÒNG TRỌ XUNG QUANH {uni_name} ({uni_abbr})\n-- ==========================================")
        
        for room_idx in range(5):
            # Select target distance tier
            target_dist_m = distance_tiers_meters[room_idx]
            
            # Select room template
            template = room_types[room_idx]
            type_name = template["type_name"]
            
            # Generate area and price with variations
            area = random.randint(template["area_range"][0], template["area_range"][1])
            
            # Base price + dynamic random offset
            price = template["price_base"] + random.randint(0, template["price_var"])
            # Adjust price slightly based on distance (closer to campus = slightly higher, further = slightly cheaper)
            if target_dist_m < 500:
                price = int(price * 1.1)
            elif target_dist_m > 3000:
                price = int(price * 0.9)
                
            price = (price // 100000) * 100000  # round to hundred thousands
            deposit = price * random.choice([1, 2])
            
            # Generate coordinate at precise distance tier from university
            room_lat, room_lon = generate_coordinate_at_distance(uni['latitude'], uni['longitude'], target_dist_m)
            distance = haversine_distance(uni['latitude'], uni['longitude'], room_lat, room_lon)
            
            # Generate address detail
            ward = random.choice(wards)
            street = random.choice(streets)
            house_num = random.randint(5, 120)
            full_address = f"Số {house_num} {street}, {ward if 'Phường' in ward else 'Phường ' + ward}, {district}, {province}"
            
            # Distribute landlord
            landlord_id = (room_id_counter % 3) + 2 # distributes to 2, 3, 4
            
            # Room specs
            room_num = f"P.{random.randint(101, 508)}"
            floor = random.randint(1, 5)
            direction = random.choice(['EAST', 'WEST', 'NORTH', 'SOUTH', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'])
            
            # Curfew
            curfew = random.choice(["23:00", "22:30", "Tự do"])
            if curfew == "Tự do":
                curfew_val = "NULL"
            else:
                curfew_val = f"'{curfew}'"
                
            rules = f"Giữ trật tự chung sau 22h, dọn dẹp vệ sinh phòng sạch sẽ, PCCC an toàn."
            
            # Thumbnail image (Unsplash)
            thumbnail = room_images_pool[(room_id_counter - 1) % len(room_images_pool)]
            
            # Pick a premium video + matching video thumbnail
            video_data = video_pool[(room_id_counter - 1) % len(video_pool)]
            video_url = video_data["url"]
            video_thumbnail = video_data["thumbnail"]
            
            # 3.1 Insert Room
            sql.append(f"\n-- Phòng {room_id_counter} near {uni_abbr} - Khoảng cách: {distance}km - Giá: {price:,} đ")
            sql.append(f"INSERT INTO rooms (id, landlord_id, room_number, address, province, district, ward, latitude, longitude, area, floor, max_occupancy, direction, has_windows, has_balcony, thumbnail_url, is_pet_friendly, is_parking_available, curfew, rules, view_count, favorite_count, created_at, updated_at, version, nearby_university_id, nearby_university_name, distance_to_university, nearest_bus_station)")
            sql.append(f"VALUES ({room_id_counter}, {landlord_id}, '{room_num}', '{full_address}', '{province}', '{district}', '{ward}', {room_lat}, {room_lon}, {area}.0, {floor}, {template['occupancy']}, '{direction}', {str(template['has_windows']).lower()}, {str(template['has_balcony']).lower()}, '{thumbnail}', {str(random.choice([True, False])).lower()}, {str(template['type_name'] != 'Sleepbox cao cấp tiện nghi, bảo mật').lower()}, {curfew_val}, '{rules}', {random.randint(40, 250)}, {random.randint(5, 30)}, NOW() - INTERVAL '{random.randint(2, 10)} days', NOW(), 0, {uni_idx}, '{uni_name}', {distance}, {round(random.uniform(0.1, 0.4), 2)});")
            
            # 3.2 Insert Room Amenities (Many to Many)
            sql.append(f"\n-- Tiện ích phòng {room_id_counter}")
            for amen_id in template["amenity_ids"]:
                sql.append(f"INSERT INTO room_amenities (room_id, amenity_id) VALUES ({room_id_counter}, {amen_id}) ON CONFLICT DO NOTHING;")
                
            # 3.3 Insert Room Images
            # Take thumbnail and 2 random additional images
            sql.append(f"\n-- Ảnh chi tiết phòng {room_id_counter}")
            sql.append(f"INSERT INTO room_images (room_id, image_url) VALUES ({room_id_counter}, '{thumbnail}');")
            add_imgs = random.sample(additional_images_pool, 2)
            for add_img in add_imgs:
                sql.append(f"INSERT INTO room_images (room_id, image_url) VALUES ({room_id_counter}, '{add_img}');")
                
            # 3.4 Insert Post (Adding video_url and video_thumbnail!)
            post_title = f"{type_name} {area}m2 cách {uni_abbr} {distance}km - {street}"
            if len(post_title) < 20: # Ensure validation passes
                post_title = f"Cho thuê {type_name.lower()} {area}m2 cách {uni_abbr} {distance}km tuyệt đẹp"
            
            desc = get_room_description(template, area, price, deposit, distance, uni_name, uni_abbr, street, ward, district, curfew).replace("'", "''")
            
            views = random.randint(100, 450)
            favs = random.randint(10, 60)
            contacts = random.randint(5, 35)
            bookings = random.randint(1, 8)
            is_boosted = random.random() < 0.20 # 20% boosted
            boost_until_val = f"NOW() + INTERVAL '{random.randint(3, 7)} days'" if is_boosted else "NULL"
            
            sql.append(f"\n-- Bài đăng {post_id_counter} cho phòng {room_id_counter} (Có video thực tế)")
            sql.append(f"INSERT INTO posts (id, landlord_id, room_id, title, description, price, deposit_amount, price_type, status, approved_by, approved_at, expires_at, is_boosted, boosted_until, view_count, favorite_count, contact_count, booking_count, created_at, updated_at, version, video_url, video_thumbnail)")
            sql.append(f"VALUES ({post_id_counter}, {landlord_id}, {room_id_counter}, '{post_title}', '{desc}', {price}.0, {deposit}.0, 'MONTHLY', 'APPROVED', 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', {str(is_boosted).lower()}, {boost_until_val}, {views}, {favs}, {contacts}, {bookings}, NOW() - INTERVAL '{random.randint(1, 8)} days', NOW(), 0, '{video_url}', '{video_thumbnail}');")
            
            # 3.5 Insert Post Images
            sql.append(f"INSERT INTO post_images (post_id, image_order, image_url) VALUES ({post_id_counter}, 0, '{thumbnail}');")
            for order, add_img in enumerate(add_imgs, 1):
                sql.append(f"INSERT INTO post_images (post_id, image_order, image_url) VALUES ({post_id_counter}, {order}, '{add_img}');")
                
            room_id_counter += 1
            post_id_counter += 1
            
    sql.append(f"\nSELECT setval('rooms_id_seq', {room_id_counter - 1});")
    sql.append(f"SELECT setval('posts_id_seq', {post_id_counter - 1});")
    
    # 4. Insert Reviews, Bookings, Transactions for rich analytics
    sql.append("\n-- 4. BỔ SUNG ĐÁNH GIÁ (REVIEWS) VÀ LỊCH ĐẶT (BOOKINGS) CHO CHÂN THỰC")
    sql.append("INSERT INTO bookings (id, user_id, landlord_id, post_id, booking_time, end_time, status, confirmation_code, note, created_at, updated_at, version)")
    sql.append("VALUES")
    sql.append("  (1, 5, 2, 1, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour', 'CONFIRMED', 'BK-NLU-001', 'Hẹn xem phòng lúc chiều tối mát mẻ', NOW(), NOW(), 0),")
    sql.append("  (2, 6, 3, 6, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 1 hour', 'PENDING', 'BK-UTE-002', 'Cho em hỏi phòng có ban công ngắm cảnh được không', NOW(), NOW(), 0),")
    sql.append("  (3, 7, 4, 11, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', 'COMPLETED', 'BK-UIT-003', 'Đã đến xem và chốt cọc luôn!', NOW() - INTERVAL '2 days', NOW(), 0);")
    sql.append("SELECT setval('bookings_id_seq', 3);")
    
    sql.append("\nINSERT INTO reviews (id, user_id, post_id, landlord_id, booking_id, rating, comment, is_approved, is_visible, helpful_count, created_at, updated_at, version)")
    sql.append("VALUES")
    sql.append("  (1, 5, 1, 2, NULL, 5, 'Phòng trọ rất đẹp sạch sẽ, gần Đại học Nông Lâm đi bộ rất tiện. Chủ nhà nhiệt tình hỗ trợ.', true, true, 10, NOW() - INTERVAL '1 day', NOW(), 0),")
    sql.append("  (2, 6, 6, 3, NULL, 4, 'Chung cư mini an ninh cực tốt đối diện SPKT. Tiện nghi đầy đủ, wifi siêu nhanh.', true, true, 5, NOW() - INTERVAL '3 days', NOW(), 0),")
    sql.append("  (3, 7, 11, 4, NULL, 5, 'Gần UIT cực kỳ luôn, phòng sạch thoáng và mát mẻ, đặc biệt là landlord thân thiện vô cùng!', true, true, 15, NOW() - INTERVAL '5 days', NOW(), 0);")
    sql.append("SELECT setval('reviews_id_seq', 3);")
    
    sql.append("\nCOMMIT;")
    sql.append("\nSELECT 'PREMIUM SEED DATA WITH VIDEOS AND VARIED DISTANCES LOADED SUCCESSFULLY! 8 Universities, 40 Rooms, 40 Posts created.' as status;")
    
    return "\n".join(sql)

if __name__ == '__main__':
    import os
    sql_content = generate_sql()
    
    # Write to root
    with open('premium_seed_data.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
        
    # Write to backend/database if it exists
    db_seed_path = os.path.join('backend', 'database', 'premium_seed_data.sql')
    if os.path.exists(os.path.dirname(db_seed_path)):
        with open(db_seed_path, 'w', encoding='utf-8') as f:
            f.write(sql_content)
            
    print("premium_seed_data.sql generated successfully in root and backend/database/!")
