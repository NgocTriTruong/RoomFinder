# Hệ Thống Website Kết Nối Phòng Trọ - Backend Documentation

## Mục Lục
1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Business Flow & Workflow](#2-business-flow--workflow)
3. [Các Module và API Endpoints](#3-các-module-và-api-endpoints)
4. [Quy Tắc Nghiệp Vụ (Business Rules)](#4-quy-tắc-nghiệp-vụ-business-rules)
5. [Các Tầng (Layers)](#5-các-tầng-layers)
6. [Quy Tắc Code và Best Practices](#6-quy-tắc-code-và-best-practices)
7. [Database Design](#7-database-design)
8. [Security & Authentication](#8-security--authentication)
9. [Cấu Hình Hệ Thống](#9-cấu-hình-hệ-thống)
10. [Deployment & DevOps](#10-deployment--devops)
11. [Testing Strategy](#11-testing-strategy)
12. [Monitoring & Logging](#12-monitoring--logging)

---

## 1. Tổng Quan Kiến Trúc

### 1.1. Kiến Trúc Tổng Thể

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                          │
│                   Web (React) │ Mobile (Flutter/React Native)                │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────┴──────────────────────────────────────────────┐
│                            API GATEWAY (Spring Cloud Gateway)                   │
│                    Rate Limiting │ Authentication │ Routing                     │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
┌───────────────────────────────┴──────────────────────────────────────────────┐
│                              BACKEND (Monolithic)                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         PRESENTATION LAYER                              │  │
│  │    Controllers │ REST APIs │ Exception Handlers │ API Response Format   │  │
│  └────────────────────────────────┬────────────────────────────────────────┘  │
│  ┌────────────────────────────────┴────────────────────────────────────────┐  │
│  │                          APPLICATION LAYER                               │  │
│  │     Services │ Business Logic │ Transactions │ DTO Mapping │ Validation   │  │
│  └────────────────────────────────┬────────────────────────────────────────┘  │
│  ┌────────────────────────────────┴────────────────────────────────────────┐  │
│  │                            DOMAIN LAYER                                  │  │
│  │     Entities │ Value Objects │ Enums │ Domain Events │ Repository Interfaces│  │
│  └────────────────────────────────┬────────────────────────────────────────┘  │
│  ┌────────────────────────────────┴────────────────────────────────────────┐  │
│  │                        INFRASTRUCTURE LAYER                             │  │
│  │    JPA Repositories │ External Services │ File Storage │ Caching        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   PostgreSQL   │      │     Redis     │      │    MinIO/S3   │
│   (Primary)    │      │   (Cache)     │      │  (File Store) │
└───────────────┘      └───────────────┘      └───────────────┘
```

### 1.2. Cấu Trúc Package (DDD-Aligned)

```
src/main/java/fit/nlu/tmdt/
│
├── config/                         # Cấu hình Spring
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   ├── JpaConfig.java
│   ├── RedisConfig.java
│   ├── SwaggerConfig.java
│   └── WebConfig.java
│
├── common/                         # Shared components
│   ├── annotations/               # Custom annotations
│   │   ├── CurrentUser.java
│   │   ├── RequirePermission.java
│   │   └── LogExecutionTime.java
│   ├── bases/                     # Base classes
│   │   ├── BaseEntity.java
│   │   ├── BaseController.java
│   │   ├── BaseService.java
│   │   └── BaseRepository.java
│   ├── constants/                  # App constants
│   │   ├── AppConstants.java
│   │   ├── RoleConstants.java
│   │   └── CacheKeys.java
│   ├── exceptions/                 # Exception handling
│   │   ├── GlobalExceptionHandler.java
│   │   ├── BusinessException.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── UnauthorizedException.java
│   │   └── ErrorCode.java
│   └── utils/                      # Utilities
│       ├── DateTimeUtils.java
│       ├── StringUtils.java
│       └── ValidationUtils.java
│
├── modules/                        # DDD Modules (Package by Feature)
│   │
│   ├── auth/                       # Module: Authentication
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   └── impl/AuthServiceImpl.java
│   │   ├── repository/
│   │   │   └── AuthRepository.java
│   │   ├── dto/
│   │   │   ├── request/LoginRequest.java
│   │   │   ├── request/RegisterRequest.java
│   │   │   ├── request/ForgotPasswordRequest.java
│   │   │   └── response/AuthResponse.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   └── OAuth2SuccessHandler.java
│   │   └── entity/
│   │       ├── User.java
│   │       └── OtpVerification.java
│   │
│   ├── user/                       # Module: User Management
│   │   ├── controller/UserController.java
│   │   ├── service/UserService.java
│   │   ├── repository/UserRepository.java
│   │   ├── dto/
│   │   │   ├── request/UpdateProfileRequest.java
│   │   │   └── response/UserResponse.java
│   │   └── entity/
│   │       └── UserProfile.java
│   │
│   ├── post/                       # Module: Tin đăng phòng trọ
│   │   ├── controller/PostController.java
│   │   ├── service/PostService.java
│   │   ├── repository/PostRepository.java
│   │   ├── dto/
│   │   │   ├── request/CreatePostRequest.java
│   │   │   ├── request/UpdatePostRequest.java
│   │   │   ├── request/PostSearchRequest.java
│   │   │   └── response/PostResponse.java
│   │   ├── entity/
│   │   │   ├── Post.java
│   │   │   └── PostImage.java
│   │   └── event/
│   │       ├── PostCreatedEvent.java
│   │       └── PostApprovedEvent.java
│   │
│   ├── room/                       # Module: Room Management
│   │   ├── controller/RoomController.java
│   │   ├── service/RoomService.java
│   │   ├── repository/RoomRepository.java
│   │   ├── dto/
│   │   │   ├── request/CreateRoomRequest.java
│   │   │   └── response/RoomResponse.java
│   │   └── entity/
│   │       ├── Room.java
│   │       ├── Amenity.java
│   │       └── RoomAmenity.java
│   │
│   ├── booking/                    # Module: Lịch hẹn xem phòng
│   │   ├── controller/BookingController.java
│   │   ├── service/BookingService.java
│   │   ├── repository/BookingRepository.java
│   │   ├── dto/
│   │   │   ├── request/CreateBookingRequest.java
│   │   │   └── response/BookingResponse.java
│   │   └── entity/Booking.java
│   │
│   ├── payment/                    # Module: Thanh toán
│   │   ├── controller/PaymentController.java
│   │   ├── service/PaymentService.java
│   │   ├── repository/PaymentRepository.java
│   │   ├── dto/
│   │   │   ├── request/CreatePaymentRequest.java
│   │   │   └── response/PaymentResponse.java
│   │   ├── entity/
│   │   │   ├── Transaction.java
│   │   │   └── Payment.java
│   │   └── gateway/
│   │       └── VNPayGateway.java
│   │
│   ├── subscription/              # Module: Subscription
│   │   ├── controller/SubscriptionController.java
│   │   ├── service/SubscriptionService.java
│   │   ├── repository/SubscriptionRepository.java
│   │   ├── dto/
│   │   │   ├── request/CreateSubscriptionRequest.java
│   │   │   └── response/SubscriptionResponse.java
│   │   └── entity/
│   │       ├── Package.java
│   │       ├── Subscription.java
│   │       └── Boost.java
│   │
│   ├── notification/              # Module: Thông báo
│   │   ├── controller/NotificationController.java
│   │   ├── service/NotificationService.java
│   │   ├── dto/
│   │   │   └── NotificationResponse.java
│   │   └── entity/
│   │       └── Notification.java
│   │
│   ├── report/                    # Module: Báo cáo & Moderation
│   │   ├── controller/ReportController.java
│   │   ├── service/ModerationService.java
│   │   ├── dto/
│   │   │   ├── request/CreateReportRequest.java
│   │   │   └── response/ReportResponse.java
│   │   └── entity/
│   │       ├── Report.java
│   │       └── Blacklist.java
│   │
│   ├── review/                    # Module: Đánh giá
│   │   ├── controller/ReviewController.java
│   │   ├── service/ReviewService.java
│   │   ├── dto/
│   │   │   ├── request/CreateReviewRequest.java
│   │   │   └── response/ReviewResponse.java
│   │   └── entity/Review.java
│   │
│   ├── message/                   # Module: Chat
│   │   ├── controller/MessageController.java
│   │   ├── service/MessageService.java
│   │   ├── dto/
│   │   │   ├── request/SendMessageRequest.java
│   │   │   └── response/MessageResponse.java
│   │   └── entity/
│   │       ├── Message.java
│   │       └── Conversation.java
│   │
│   ├── favorite/                  # Module: Yêu thích
│   │   ├── controller/FavoriteController.java
│   │   ├── service/FavoriteService.java
│   │   └── entity/Favorite.java
│   │
│   ├── voucher/                   # Module: Voucher
│   │   ├── controller/VoucherController.java
│   │   ├── service/VoucherService.java
│   │   ├── dto/
│   │   │   ├── request/ApplyVoucherRequest.java
│   │   │   └── response/VoucherResponse.java
│   │   └── entity/Voucher.java
│   │
│   └── statistics/               # Module: Thống kê
│       ├── controller/StatisticsController.java
│       ├── service/StatisticsService.java
│       └── dto/
│           └── DashboardResponse.java
│
├── mapper/                         # MapStruct mappers
│   ├── UserMapper.java
│   ├── PostMapper.java
│   └── BookingMapper.java
│
└── TmdtApplication.java
```

### 1.3. Package by Feature vs Package by Layer

```
RECOMMENDED: Package by Feature (như cấu trúc trên)

Benefits:
✓ Dễ tìm code liên quan đến 1 feature
✓ Dễ tách module khi cần (Microservices)
✓ Dependencies rõ ràng hơn
✓ Dễ test từng feature

AVOID: Package by Layer (controller/, service/, repo/)
❌ Khó tìm code liên quan
❌ Dependencies phức tạp
❌ Khó tách service
```

---

## 2. Business Flow & Workflow

### 2.1. Luồng Đăng Tin (Post Creation Flow)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Landlord │     │  System  │     │ Landlord │     │  Admin   │     │ System   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. Create Post  │                │                │                │
     │──────────────► │                │                │                │
     │                │                │                │                │
     │ 2. Validate &  │                │                │                │
     │    Save (PENDING)               │                │                │
     │◄────────────── │                │                │                │
     │                │                │                │                │
     │ 3. Check Subscription            │                │                │
     │    (has remaining posts?)        │                │                │
     │◄────────────── │                │                │                │
     │                │                │                │                │
     │ 4. Notify Admin │                │                │                │
     │──────────────────────────────► │                │                │
     │                │                │                │                │
     │                │                │ 5. Review Post │                │
     │                │                │──────────────► │                │
     │                │                │                │                │
     │                │                │ 6. Approve/Reject              │
     │                │                │◄────────────── │                │
     │                │                │                │                │
     │ 7. Notification to Landlord      │                │                │
     │◄───────────────────────────────────────────────────────────────│
     │                │                │                │                │
     │ 8. If Approved: │                │                │                │
     │    - Post visible               │                │                │
     │    - Push Notification to matching users        │                │
     │                │                │                │                │
     │ 9. Deduct remaining posts from subscription     │                │
     │                │                │                │                │
     ▼                ▼                ▼                ▼                ▼
```

### 2.2. Luồng Thanh Toán (Payment Flow)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Landlord │     │   App    │     │  Backend │     │  VNPay   │     │  Backend │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. Buy Package  │                │                │                │
     │──────────────► │                │                │                │
     │                │                │                │                │
     │ 2. Create Transaction (PENDING) │                │                │
     │◄────────────── │                │                │                │
     │                │                │                │                │
     │ 3. Generate VNPay URL           │                │                │
     │◄──────────────────────────────── │                │                │
     │                │                │                │                │
     │ 4. Redirect to VNPay             │                │                │
     │──────────────────────────────► │                │                │
     │                │                │                │                │
     │ 5. User pays at VNPay           │                │                │
     │                │                │                │                │
     │ 6. VNPay returns with IPN       │                │                │
     │───────────────────────────────────────────────► │                │
     │                │                │                │                │
     │ 7. Validate IPN & Update Transaction            │                │
     │                │                │                │                │
     │ 8. If SUCCESS: │                │                │                │
     │    - Create/Extend Subscription   │                │                │
     │    - Send Receipt Email            │                │                │
     │◄───────────────────────────────────────────────────────────────│
     │                │                │                │                │
```

### 2.3. Luồng Đặt Lịch Hẹn (Booking Flow)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │     │  System  │     │ Landlord │     │   User   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. Create Booking              │                │
     │──────────────► │                │                │
     │                │                │                │
     │ 2. Validate:   │                │                │
     │    - Post available?            │                │
     │    - Time slot available?        │                │
     │◄────────────── │                │                │
     │                │                │                │
     │ 3. Send Notification to Landlord│                │
     │───────────────────────────────────────────────► │
     │                │                │                │
     │ 4. Landlord confirms/cancels    │                │
     │◄───────────────────────────────────────────────│
     │                │                │                │
     │ 5. Send Confirmation to User   │                │
     │◄──────────────────────────────────────────────│
     │                │                │                │
     │ 6. Reminder before appointment │                │
     │◄────────────── │                │                │
     │                │                │                │
     │ 7. Post-visit: Request Review   │                │
     │◄────────────── │                │                │
     │                │                │                │
```

### 2.4. Luồng Moderation (Kiểm Duyệt)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Reporter │     │  System  │     │  Admin   │     │ Landlord │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. Submit Report               │                │
     │──────────────► │                │                │
     │                │                │                │
     │ 2. Create Report (PENDING)     │                │
     │◄────────────── │                │                │
     │                │                │                │
     │ 3. Notify Admin (Dashboard)     │                │
     │───────────────────────────────────────────────► │
     │                │                │                │
     │ 4. Admin reviews report         │                │
     │◄──────────────────────────────────────────────│
     │                │                │                │
     │ 5. Admin actions:              │                │
     │    - Warn landlord             │                │
     │    - Remove post               │                │
     │    - Add to blacklist          │                │
     │◄──────────────────────────────────────────────│
     │                │                │                │
     │ 6. Update Report (RESOLVED)    │                │
     │    Notify reporter              │                │
     │◄──────────────────────────────────────────────│
     │                │                │                │
```

---

## 3. Các Module và API Endpoints

### 3.1. API Versioning Strategy

```
Base URL: /api/v1/

Benefits:
✓ Backward compatibility
✓ Smooth migration
✓ Clear deprecation timeline
```

### 3.2. Module Authentication

#### 3.2.1. Auth Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/v1/auth/register` | Đăng ký | Public |
| POST | `/api/v1/auth/login` | Đăng nhập | Public |
| POST | `/api/v1/auth/refresh` | Refresh token | Public |
| POST | `/api/v1/auth/logout` | Đăng xuất | Auth |
| POST | `/api/v1/auth/forgot-password` | Quên mật khẩu | Public |
| POST | `/api/v1/auth/reset-password` | Reset mật khẩu | Public |
| POST | `/api/v1/auth/verify-email` | Xác thực email | Auth |
| POST | `/api/v1/auth/resend-verify-email` | Gửi lại email xác thực | Auth |
| POST | `/api/v1/auth/change-password` | Đổi mật khẩu | Auth |
| POST | `/api/v1/auth/oauth2/google` | Login Google | Public |
| POST | `/api/v1/auth/oauth2/facebook` | Login Facebook | Public |

#### 3.2.2. Request/Response Examples

```java
// POST /api/v1/auth/register
// Request:
{
    "email": "landlord@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "fullName": "Nguyen Van A",
    "phone": "0909123456",
    "role": "LANDLORD",  // USER | LANDLORD
    "acceptTerms": true
}

// Response (201 Created):
{
    "success": true,
    "message": "Registration successful. Please verify your email.",
    "data": {
        "userId": "uuid-here",
        "email": "landlord@example.com",
        "role": "LANDLORD",
        "mustVerifyEmail": true
    }
}

// POST /api/v1/auth/login
// Request:
{
    "email": "landlord@example.com",
    "password": "SecurePass123!"
}

// Response (200 OK):
{
    "success": true,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
        "tokenType": "Bearer",
        "expiresIn": 900,        // 15 minutes
        "refreshExpiresIn": 604800, // 7 days
        "user": {
            "id": "uuid-here",
            "email": "landlord@example.com",
            "fullName": "Nguyen Van A",
            "role": "LANDLORD",
            "avatar": "https://..."
        }
    }
}
```

### 3.3. Module Post

#### 3.3.1. Post Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/posts` | Danh sách tin đăng | Public |
| GET | `/api/v1/posts/{id}` | Chi tiết tin đăng | Public |
| POST | `/api/v1/posts` | Tạo tin đăng mới | LANDLORD |
| PUT | `/api/v1/posts/{id}` | Cập nhật tin đăng | OWNER |
| DELETE | `/api/v1/posts/{id}` | Xóa tin đăng | OWNER |
| GET | `/api/v1/posts/my` | Tin đăng của tôi | LANDLORD |
| GET | `/api/v1/posts/{id}/stats` | Thống kê tin đăng | OWNER |
| PUT | `/api/v1/posts/{id}/boost` | Đẩy tin | LANDLORD |
| POST | `/api/v1/posts/{id}/extend` | Gia hạn tin | LANDLORD |

#### 3.3.2. Search & Filter Parameters

```java
// GET /api/v1/posts?minPrice=1000000&maxPrice=5000000&district=quan1
// &amenities=WI-FI,PARKING&nearbyUniversity=TonDucThang&page=0&size=10&sort=createdAt,desc

public class PostSearchParams {
    Double minPrice;
    Double maxPrice;
    String district;
    String city;
    List<Long> amenityIds;
    Double minArea;
    Double maxArea;
    Long nearbyUniversityId;
    Boolean petFriendly;
    Boolean nearBusStation;
    Integer minRating;
    LocalDate availableFrom;
    String keyword;  // Full-text search
    PostStatus status;
}
```

#### 3.3.3. Post Response with Optimizations

```java
// Response DTO - Flat structure để tránh N+1
@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String priceType;  // MONTHLY, QUARTERLY, YEARLY
    private Double deposit;
    private String status;

    // Pre-computed values (no additional queries)
    private Double averageRating;
    private Integer reviewCount;
    private Integer viewCount;
    private Integer favoriteCount;

    // Embedded data (fetched with JOIN)
    private RoomSummary room;
    private LandlordSummary landlord;

    // Counts only (not full objects)
    private Integer activeBookings;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isBoosted;
    private LocalDateTime boostedUntil;
}

@Data
@Builder
public class RoomSummary {
    private Long id;
    private Double area;
    private Integer floor;
    private Integer maxOccupancy;
    private String direction;  // NORTH, SOUTH, EAST, WEST
    private String thumbnailUrl;
    private String address;
    private Double latitude;
    private Double longitude;
    private List<AmenitySimple> amenities;  // Lightweight
}

@Data
@Builder
public class AmenitySimple {
    private Long id;
    private String name;
    private String icon;
}

@Data
@Builder
public class LandlordSummary {
    private Long id;
    private String fullName;
    private String avatar;
    private String phone;
    private Double averageRating;  // Landlord's rating
    private Boolean isVerified;
}
```

### 3.4. Module Booking

#### 3.4.1. Booking Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/bookings` | Danh sách lịch hẹn | Auth |
| GET | `/api/v1/bookings/{id}` | Chi tiết lịch hẹn | Auth |
| POST | `/api/v1/bookings` | Tạo lịch hẹn | USER |
| PUT | `/api/v1/bookings/{id}` | Cập nhật lịch hẹn | USER/LANDLORD |
| PUT | `/api/v1/bookings/{id}/confirm` | Xác nhận lịch hẹn | LANDLORD |
| PUT | `/api/v1/bookings/{id}/cancel` | Hủy lịch hẹn | USER/LANDLORD |
| PUT | `/api/v1/bookings/{id}/complete` | Hoàn thành lịch hẹn | LANDLORD |
| PUT | `/api/v1/bookings/{id}/no-show` | Đánh dấu không đến | LANDLORD |
| GET | `/api/v1/bookings/calendar` | Calendar view | LANDLORD |
| GET | `/api/v1/bookings/available-slots` | Slot trống | USER |

#### 3.4.2. Available Time Slots

```java
// GET /api/v1/bookings/available-slots?postId=1&date=2026-04-15
// Response:
{
    "success": true,
    "data": {
        "postId": 1,
        "date": "2026-04-15",
        "availableSlots": [
            {"time": "09:00", "available": true},
            {"time": "10:00", "available": true},
            {"time": "11:00", "available": false},  // Already booked
            {"time": "14:00", "available": true},
            {"time": "15:00", "available": true},
            {"time": "16:00", "available": false},
            {"time": "17:00", "available": true}
        ],
        "landlordPreferences": {
            "minBookingAdvanceHours": 2,
            "maxBookingAdvanceDays": 14,
            "workingHours": {
                "start": "08:00",
                "end": "18:00"
            }
        }
    }
}
```

### 3.5. Module Payment

#### 3.5.1. Payment Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/v1/payments/create-order` | Tạo order thanh toán | LANDLORD |
| GET | `/api/v1/payments/{transactionId}/url` | Lấy VNPay URL | LANDLORD |
| POST | `/api/v1/payments/vnpay/ipn` | VNPay IPN (Webhook) | Public |
| GET | `/api/v1/payments/vnpay/return` | VNPay Return | Public |
| GET | `/api/v1/payments/history` | Lịch sử thanh toán | Auth |
| GET | `/api/v1/payments/{id}` | Chi tiết giao dịch | Auth |
| POST | `/api/v1/payments/{id}/refund` | Yêu cầu hoàn tiền | ADMIN |

#### 3.5.2. Payment Flow

```java
// POST /api/v1/payments/create-order
// Request:
{
    "packageId": 1,
    "voucherCode": "PROMO2026",  // Optional
    "paymentMethod": "VNPAY"
}

// Response:
{
    "success": true,
    "data": {
        "transactionId": "uuid-here",
        "orderId": "ORDER-20260413-001",
        "amount": 299000.00,
        "originalAmount": 399000.00,
        "discountAmount": 100000.00,
        "paymentUrl": "https://sandbox.vnpayment.vn/...",
        "expiresAt": "2026-04-13T15:30:00Z"
    }
}
```

### 3.6. Module Subscription

#### 3.6.1. Subscription Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/subscriptions/current` | Gói hiện tại | LANDLORD |
| GET | `/api/v1/subscriptions/packages` | Danh sách gói | Public |
| GET | `/api/v1/subscriptions/history` | Lịch sử subscription | LANDLORD |
| POST | `/api/v1/subscriptions/purchase` | Mua gói mới | LANDLORD |
| PUT | `/api/v1/subscriptions/auto-renew` | Bật/tắt auto-renew | LANDLORD |

#### 3.6.2. Package Types

```java
public enum PackageType {
    POST_BASIC(1, "Gói Cơ Bản", 5, 30, 99000),
    POST_STANDARD(2, "Gói Tiêu Chuẩn", 15, 30, 199000),
    POST_PREMIUM(3, "Gói Cao Cấp", 50, 90, 499000),

    BOOST_DAILY(10, "Đẩy tin 1 ngày", 1, 1, 29000),
    BOOST_WEEKLY(11, "Đẩy tin 7 ngày", 7, 7, 99000),
    BOOST_MONTHLY(12, "Đẩy tin 30 ngày", 30, 30, 299000);

    private final int id;
    private final String name;
    private final int quantity;
    private final int durationDays;
    private final double price;
}
```

### 3.7. Module Review (Đánh giá)

#### 3.7.1. Review Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/reviews/post/{postId}` | Danh sách đánh giá theo tin đăng | Public |
| GET | `/api/v1/reviews/landlord/{landlordId}` | Đánh giá chủ trọ | Public |
| POST | `/api/v1/reviews` | Tạo đánh giá | USER |
| PUT | `/api/v1/reviews/{id}` | Cập nhật đánh giá | USER |
| DELETE | `/api/v1/reviews/{id}` | Xóa đánh giá | USER/ADMIN |

### 3.8. Module Favorite (Yêu thích)

#### 3.8.1. Favorite Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/favorites` | Danh sách phòng yêu thích | USER |
| POST | `/api/v1/favorites/{roomId}` | Thêm vào yêu thích | USER |
| DELETE | `/api/v1/favorites/{roomId}` | Xóa khỏi yêu thích | USER |
| GET | `/api/v1/favorites/check/{roomId}` | Kiểm tra đã yêu thích chưa | USER |

### 3.9. Module Message (Tin nhắn/Chat)

#### 3.9.1. Message Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/messages/conversations` | Danh sách cuộc trò chuyện | USER |
| GET | `/api/v1/messages/conversations/{userId}` | Tin nhắn với người dùng | USER |
| POST | `/api/v1/messages` | Gửi tin nhắn | USER |
| PUT | `/api/v1/messages/{id}/read` | Đánh dấu đã đọc | USER |
| GET | `/api/v1/messages/unread-count` | Số tin nhắn chưa đọc | USER |

### 3.10. Module Report (Báo cáo)

#### 3.10.1. Report Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/reports` | Danh sách báo cáo | ADMIN |
| GET | `/api/v1/reports/{id}` | Chi tiết báo cáo | ADMIN |
| POST | `/api/v1/reports` | Tạo báo cáo | USER |
| PUT | `/api/v1/reports/{id}/resolve` | Xử lý báo cáo | ADMIN |
| PUT | `/api/v1/reports/{id}/reject` | Từ chối báo cáo | ADMIN |

### 3.11. Module Voucher

#### 3.11.1. Voucher Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/vouchers` | Danh sách voucher | Public |
| GET | `/api/v1/vouchers/my` | Voucher của tôi | USER |
| POST | `/api/v1/vouchers/apply` | Áp dụng voucher | USER |
| GET | `/api/v1/vouchers/validate/{code}` | Kiểm tra voucher | USER |
| POST | `/api/v1/vouchers` | Tạo voucher | ADMIN |
| PUT | `/api/v1/vouchers/{id}` | Cập nhật voucher | ADMIN |
| DELETE | `/api/v1/vouchers/{id}` | Xóa voucher | ADMIN |

### 3.12. Module Room (Quản lý phòng)

#### 3.12.1. Room Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/rooms` | Danh sách phòng | Public |
| GET | `/api/v1/rooms/{id}` | Chi tiết phòng | Public |
| POST | `/api/v1/rooms` | Tạo phòng mới | LANDLORD |
| PUT | `/api/v1/rooms/{id}` | Cập nhật phòng | LANDLORD |
| DELETE | `/api/v1/rooms/{id}` | Xóa phòng | LANDLORD |
| GET | `/api/v1/rooms/my` | Danh sách phòng của tôi | LANDLORD |

### 3.13. Module Notification (Thông báo)

#### 3.13.1. Notification Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/notifications` | Danh sách thông báo | Auth |
| GET | `/api/v1/notifications/{id}` | Chi tiết thông báo | Auth |
| PUT | `/api/v1/notifications/{id}/read` | Đánh dấu đã đọc | Auth |
| PUT | `/api/v1/notifications/read-all` | Đánh dấu đã đọc tất cả | Auth |
| DELETE | `/api/v1/notifications/{id}` | Xóa thông báo | Auth |
| GET | `/api/v1/notifications/unread-count` | Số thông báo chưa đọc | Auth |

### 3.14. Module RoomHistory (Lịch sử xem phòng)

#### 3.14.1. RoomHistory Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/room-history` | Lịch sử xem phòng | USER |
| POST | `/api/v1/room-history/{postId}` | Ghi nhận đã xem | USER |
| DELETE | `/api/v1/room-history` | Xóa lịch sử | USER |

### 3.15. Module Blacklist (Danh sách đen)

#### 3.15.1. Blacklist Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/blacklist` | Danh sách đen | ADMIN |
| POST | `/api/v1/blacklist` | Thêm vào danh sách đen | ADMIN |
| DELETE | `/api/v1/blacklist/{id}` | Xóa khỏi danh sách đen | ADMIN |
| GET | `/api/v1/blacklist/check/{userId}` | Kiểm tra có trong danh sách đen không | ADMIN |

### 3.16. Module Statistics (Thống kê)

#### 3.16.1. Statistics Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/statistics/dashboard` | Dashboard thống kê | ADMIN |
| GET | `/api/v1/statistics/users` | Thống kê người dùng | ADMIN |
| GET | `/api/v1/statistics/posts` | Thống kê tin đăng | ADMIN |
| GET | `/api/v1/statistics/financial` | Thống kê tài chính | ADMIN |
| GET | `/api/v1/statistics/booking-rate` | Tỷ lệ thuê phòng | ADMIN |

### 3.17. Module Admin (Quản lý hệ thống)

#### 3.17.1. Admin Controller

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/v1/admin/users` | Danh sách người dùng | ADMIN |
| PUT | `/api/v1/admin/users/{id}/status` | Cập nhật trạng thái user | ADMIN |
| GET | `/api/v1/admin/posts/pending` | Tin đăng chờ duyệt | ADMIN |
| PUT | `/api/v1/admin/posts/{id}/approve` | Duyệt tin | ADMIN |
| PUT | `/api/v1/admin/posts/{id}/reject` | Từ chối tin | ADMIN |
| PUT | `/api/v1/admin/posts/{id}/remove` | Gỡ bỏ tin vi phạm | ADMIN |
| GET | `/api/v1/admin/vouchers` | Quản lý voucher | ADMIN |
| POST | `/api/v1/admin/vouchers` | Tạo voucher | ADMIN |
| PUT | `/api/v1/admin/vouchers/{id}` | Cập nhật voucher | ADMIN |
| DELETE | `/api/v1/admin/vouchers/{id}` | Xóa voucher | ADMIN |

---

### 3.18. APIs Còn Thiếu (Missing APIs)

Dựa trên use cases trong file drawio, các API sau cần được implement:

#### 3.18.1. Module Favorite - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/favorites/suggestions` | Danh sách phòng gợi ý | USER | HIGH |
| GET | `/api/v1/favorites/most-viewed` | Phòng được xem nhiều nhất | Public | HIGH |
| GET | `/api/v1/favorites/latest` | Phòng mới nhất | Public | HIGH |

#### 3.18.2. Module Room - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/rooms/recommended` | Phòng được đề xuất | USER | HIGH |
| GET | `/api/v1/rooms/trending` | Phòng xu hướng | Public | MEDIUM |
| GET | `/api/v1/rooms/nearby` | Phòng gần đây | USER | MEDIUM |
| POST | `/api/v1/rooms/{id}/images` | Upload hình ảnh phòng | LANDLORD | HIGH |
| DELETE | `/api/v1/rooms/{id}/images/{imageId}` | Xóa hình ảnh phòng | LANDLORD | MEDIUM |

#### 3.18.3. Module Post - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/posts/suggestions` | Tin đăng được gợi ý | USER | HIGH |
| GET | `/api/v1/posts/featured` | Tin nổi bật | Public | MEDIUM |
| PUT | `/api/v1/posts/{id}/images` | Upload hình ảnh tin đăng | LANDLORD | HIGH |

#### 3.18.4. Module Message - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| POST | `/api/v1/messages/{conversationId}/support` | Gửi yêu cầu hỗ trợ | USER | HIGH |
| GET | `/api/v1/messages/support/topics` | Danh sách chủ đề hỗ trợ | USER | MEDIUM |

#### 3.18.5. Module Review - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/reviews/landlord/{landlordId}` | Đánh giá chủ trọ | Public | HIGH |
| GET | `/api/v1/reviews/average/{postId}` | Lấy điểm trung bình | Public | MEDIUM |

#### 3.18.6. Module RoomHistory - APIs cần implement

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/room-history` | Lịch sử xem phòng | USER | HIGH |
| POST | `/api/v1/room-history/{postId}` | Ghi nhận đã xem phòng | USER | HIGH |
| DELETE | `/api/v1/room-history` | Xóa lịch sử xem phòng | USER | MEDIUM |

#### 3.18.7. Module Blacklist - APIs cần implement

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/blacklist` | Danh sách đen | ADMIN | HIGH |
| POST | `/api/v1/blacklist` | Thêm vào danh sách đen | ADMIN | HIGH |
| DELETE | `/api/v1/blacklist/{id}` | Xóa khỏi danh sách đen | ADMIN | MEDIUM |
| GET | `/api/v1/blacklist/check/{userId}` | Kiểm tra user trong blacklist | ADMIN | MEDIUM |

#### 3.18.8. Module Admin - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| POST | `/api/v1/admin/posts/{id}/remove` | Gỡ bỏ bài vi phạm | ADMIN | HIGH |
| GET | `/api/v1/admin/landlords/verify/{id}` | Xác thực chủ trọ | ADMIN | HIGH |
| PUT | `/api/v1/admin/landlords/{id}/status` | Cập nhật trạng thái chủ trọ | ADMIN | MEDIUM |

#### 3.18.9. Module Statistics - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/statistics/booking-rate` | Tỷ lệ thuê phòng | ADMIN | HIGH |
| GET | `/api/v1/statistics/financial` | Thống kê tài chính chi tiết | ADMIN | HIGH |

#### 3.18.10. Module Subscription - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/subscriptions/boosts/active` | Danh sách boost đang hoạt động | LANDLORD | HIGH |
| DELETE | `/api/v1/subscriptions/boosts/{id}` | Hủy boost | LANDLORD | MEDIUM |

#### 3.18.11. Module Booking - APIs thiếu

| Method | Endpoint | Mô tả | Auth | Priority |
|--------|----------|-------|------|----------|
| GET | `/api/v1/bookings/landlord` | Lịch hẹn của chủ trọ | LANDLORD | HIGH |
| GET | `/api/v1/bookings/reminders` | Lấy lịch hẹn nhắc nhở | LANDLORD | MEDIUM |

---

## 4. Quy Tắc Nghiệp Vụ (Business Rules)

### 4.1. User & Authentication Rules

```java
public class UserBusinessRules {

    // R1: Password Policy
    // - Tối thiểu 8 ký tự
    // - Có ít nhất 1 chữ hoa
    // - Có ít nhất 1 chữ thường
    // - Có ít nhất 1 số
    // - Có ít nhất 1 ký tự đặc biệt (!@#$%^&*)
    // - Không chứa email hoặc username

    // R2: Email Verification
    // - Mã OTP có hiệu lực trong 5 phút
    // - Tối đa 3 lần gửi lại trong 1 giờ
    // - Tài khoản bị khóa sau 5 lần nhập sai OTP

    // R3: Role-based Access
    // - USER: Xem phòng, đặt lịch, đánh giá, chat
    // - LANDLORD: CRUD phòng, quản lý booking, thanh toán
    // - ADMIN: Toàn quyền quản lý hệ thống
}
```

### 4.2. Post & Room Rules

```java
public class PostBusinessRules {

    // R4: Post Creation
    // - Landlord phải có subscription active
    // - Subscription còn remainingPosts > 0
    // - Mỗi phòng chỉ có 1 tin ACTIVE/BOOSTED
    // - Tin đăng phải qua kiểm duyệt trước khi hiển thị

    // R5: Post Content
    // - Title: 20-200 ký tự
    // - Description: tối thiểu 100 ký tự, tối đa 5000
    // - Hình ảnh: tối thiểu 3, tối đa 10, mỗi ảnh < 5MB
    // - Địa chỉ: phải có latitude, longitude hợp lệ

    // R6: Post Duration
    // - Tin mặc định có hiệu lực 30 ngày
    // - Có thể gia hạn trước 3 ngày hết hạn
    // - Tin vi phạm bị gỡ: 1st warning, 2nd: 7 days ban, 3rd: permanent

    // R7: Boost Rules
    // - Boost có hiệu lực ngay khi thanh toán thành công
    // - Boost hiển thị đầu tiên trong kết quả tìm kiếm
    // - Boost không gia hạn thời gian hiệu lực của tin
    // - 1 tin chỉ được boost 1 package tại 1 thời điểm

    // R8: Moderation
    // - Thời gian duyệt tin: trong 24 giờ
    // - Tiêu chí duyệt: hình ảnh rõ ràng, địa chỉ chính xác,
    //   nội dung không vi phạm chính sách
}
```

### 4.3. Booking Rules

```java
public class BookingBusinessRules {

    // R9: Booking Creation
    // - User chỉ đặt được lịch hẹn cho tin APPROVED
    // - Thời gian đặt: tối thiểu 2 giờ sau thời điểm hiện tại
    // - Thời gian đặt: tối đa 14 ngày trước
    // - Mỗi time slot chỉ có 1 booking (30 phút/slot)

    // R10: Booking Conflict
    // - Không cho phép đặt chồng lên nhau
    // - Landlord có thể chặn ngày không nhận lịch hẹn

    // R11: Booking Status Flow
    // PENDING → CONFIRMED (Landlord xác nhận)
    // PENDING → CANCELLED (User/Landlord hủy trước 1 giờ)
    // CONFIRMED → COMPLETED (Sau khi thăm phòng)
    // CONFIRMED → NO_SHOW (User không đến, Landlord đánh dấu)
    // CONFIRMED → CANCELLED (Hủy sau xác nhận, có phạt)

    // R12: Review Rules
    // - Chỉ được đánh giá sau khi booking COMPLETED
    // - Mỗi user chỉ đánh giá 1 lần/booking
    // - Có thể đánh giá trong vòng 30 ngày sau COMPLETED
    // - Rating: 1-5 sao
    // - Không thể sửa sau 24 giờ
}
```

### 4.4. Payment & Subscription Rules

```java
public class PaymentBusinessRules {

    // R13: Payment
    // - Thanh toán qua VNPay
    // - Transaction timeout: 15 phút
    // - Hoàn tiền trong 7 ngày cho gói chưa sử dụng
    // - Phí hoàn tiền: 10%

    // R14: Subscription
    // - Auto-renew: tự động gia hạn nếu đủ tiền
    // - Thông báo trước 3 ngày khi sắp hết hạn
    // - Khi hết subscription: tin đăng chuyển EXPIRED sau 24h

    // R15: Voucher
    // - Mã voucher: uppercase, 6-12 ký tự
    // - Giảm tối đa 50% giá trị đơn hàng
    // - Mỗi voucher chỉ sử dụng 1 lần/user
    // - Có thể kết hợp: 1 voucher giảm giá + 1 voucher free boost
}
```

### 4.5. Communication Rules

```java
public class CommunicationBusinessRules {

    // R16: Message
    // - User chỉ chat được với Landlord có tin đăng đã duyệt
    // - Không spam: tối đa 10 tin nhắn/phút
    // - Khóa chat nếu vi phạm 3 lần

    // R17: Report
    // - User phải có booking hoàn thành mới được report landlord
    // - Mỗi user tối đa 3 reports/ngày
    // - Admin xử lý trong 48 giờ

    // R18: Blacklist
    // - Thêm vào blacklist: vi phạm nghiêm trọng
    // - Blacklisted: không thể đăng ký/sử dụng dịch vụ
    // - Có thể kháng cáo sau 6 tháng
}
```

---

## 5. Các Tầng (Layers)

### 5.1. Controller Layer

```java
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Validated
@Slf4j
public class PostController {

    private final PostService postService;
    private final PostMapper postMapper;

    /**
     * Lấy danh sách tin đăng với filter & pagination
     * Cache: 5 phút cho kết quả không auth
     */
    @GetMapping
    @Cacheable(value = "posts", key = "#searchParams.hashCode()", unless = "#result == null")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPosts(
            @Valid @ModelAttribute PostSearchParams searchParams,
            @ParameterObject Pageable pageable,
            @CurrentUser UserPrincipal currentUser) {

        log.info("Getting posts with params: {}", searchParams);

        // Public: chỉ hiển thị APPROVED posts
        // Auth: có thể xem thêm posts của mình
        Page<PostResponse> posts = postService.searchPosts(searchParams, pageable, currentUser);

        return ApiResponse.success(PageResponse.of(posts));
    }

    /**
     * Chi tiết tin đăng
     * Tự động tăng view count
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDetailResponse>> getPostById(
            @PathVariable Long id,
            @CurrentUser(required = false) UserPrincipal currentUser) {

        PostDetailResponse post = postService.getPostDetail(id, currentUser);

        // Increment view count asynchronously
        postService.incrementViewCountAsync(id);

        return ApiResponse.success(post);
    }

    /**
     * Tạo tin đăng mới
     * Validation: post creation rules
     */
    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    @LogExecutionTime
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @CurrentUser UserPrincipal currentUser) {

        log.info("Creating post for landlord: {}", currentUser.getId());

        PostResponse post = postService.createPost(request, currentUser.getId());

        return ApiResponse.created(post, "Post created successfully and pending approval");
    }

    /**
     * Cập nhật tin đăng
     * Chỉ chủ sở hữu mới được sửa
     */
    @PutMapping("/{id}")
    @PreAuthorize("@postService.isOwner(#id, authentication)")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            @CurrentUser UserPrincipal currentUser) {

        PostResponse post = postService.updatePost(id, request, currentUser.getId());

        return ApiResponse.success(post, "Post updated successfully");
    }

    /**
     * Xóa tin đăng (Soft delete)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@postService.isOwner(#id, authentication)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {

        postService.deletePost(id, currentUser.getId());
    }
}
```

### 5.2. Service Layer

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PostMapper postMapper;
    private final PostSearchService searchService;
    private final NotificationService notificationService;
    private final EventPublisher eventPublisher;

    @Override
    public Page<PostResponse> searchPosts(PostSearchParams params, Pageable pageable, UserPrincipal currentUser) {
        // 1. Build query với criteria
        Specification<Post> spec = buildSpecification(params);

        // 2. Nếu là public user, chỉ lấy APPROVED
        if (currentUser == null) {
            spec = spec.and(PostSpecifications.isApproved());
        }

        // 3. Fetch với pagination (đã optimized query)
        Page<Post> posts = postRepository.findAll(spec, pageable);

        // 4. Map sang DTO (sử dụng projection để tránh N+1)
        return posts.map(postMapper::toListResponse);
    }

    @Override
    @Transactional
    public PostResponse createPost(CreatePostRequest request, Long landlordId) {
        // 1. Validate landlord subscription
        Subscription subscription = subscriptionRepository
                .findActiveByLandlordId(landlordId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.NO_ACTIVE_SUBSCRIPTION,
                        "Bạn cần mua gói đăng tin trước"));

        if (subscription.getRemainingPosts() <= 0) {
            throw new BusinessException(
                    ErrorCode.OUT_OF_POSTS,
                    "Bạn đã hết lượt đăng tin. Vui lòng mua thêm gói.");
        }

        // 2. Check if room already has active post
        if (postRepository.existsActivePostByRoomId(request.getRoomId())) {
            throw new BusinessException(
                    ErrorCode.ROOM_ALREADY_HAS_POST,
                    "Phòng này đã có tin đăng đang hoạt động");
        }

        // 3. Create post entity
        Post post = postMapper.toEntity(request);
        post.setLandlordId(landlordId);
        post.setStatus(PostStatus.PENDING);
        post.setViewCount(0);

        // 4. Save
        post = postRepository.save(post);

        // 5. Publish event for async processing
        eventPublisher.publish(new PostCreatedEvent(post.getId()));

        // 6. Notify admin for moderation
        notificationService.sendToAdmin(
                "Tin đăng mới cần duyệt: " + post.getTitle(),
                "/admin/posts/" + post.getId()
        );

        return postMapper.toResponse(post);
    }

    @Override
    @Transactional
    public void approvePost(Long postId, Long adminId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() != PostStatus.PENDING) {
            throw new BusinessException("Post is not in pending status");
        }

        // 1. Update status
        post.setStatus(PostStatus.APPROVED);
        post.setApprovedBy(adminId);
        post.setApprovedAt(LocalDateTime.now());
        postRepository.save(post);

        // 2. Decrement remaining posts
        subscriptionRepository.decrementRemainingPosts(post.getLandlordId());

        // 3. Index to search (Elasticsearch)
        searchService.indexPost(post);

        // 4. Notify landlord
        notificationService.sendToUser(
                post.getLandlordId(),
                "Tin đăng của bạn đã được duyệt!",
                "Tin: " + post.getTitle()
        );

        // 5. Publish event
        eventPublisher.publish(new PostApprovedEvent(post));
    }

    /**
     * Optimized query với EntityGraph
     * Tránh N+1 query
     */
    @Override
    @EntityGraph(attributePaths = {
            "landlord",
            "room",
            "room.amenities",
            "room.university"
    })
    public Optional<Post> findByIdWithDetails(Long id) {
        return postRepository.findWithDetailsById(id);
    }

    @Async
    public void incrementViewCountAsync(Long postId) {
        postRepository.incrementViewCount(postId);
    }

    // Security method for @PreAuthorize
    @Override
    public boolean isOwner(Long postId, Authentication authentication) {
        Long userId = extractUserId(authentication);
        return postRepository.isOwner(postId, userId);
    }
}
```

### 5.3. Repository Layer

```java
@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    // ===== BASIC QUERIES =====

    Optional<Post> findByIdAndStatus(Long id, PostStatus status);

    Page<Post> findByLandlordIdAndStatusIn(Long landlordId, List<PostStatus> statuses, Pageable pageable);

    boolean existsByRoomIdAndStatusIn(Long roomId, List<PostStatus> statuses);

    @Query("SELECT p FROM Post p WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Post> findLatestApproved(@Param("status") PostStatus status, Pageable pageable);

    // ===== OPTIMIZED QUERIES (EntityGraph) =====

    @EntityGraph(attributePaths = {
            "landlord",
            "room",
            "room.amenities",
            "room.university"
    })
    @Query("SELECT p FROM Post p WHERE p.id = :id")
    Optional<Post> findWithDetailsById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"landlord", "room", "room.amenities"})
    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.isBoosted = true")
    List<Post> findBoostedPosts();

    @EntityGraph(attributePaths = {"landlord", "room"})
    @Query("""
        SELECT p FROM Post p
        WHERE p.status = 'APPROVED'
        ORDER BY p.viewCount DESC
        """)
    Page<Post> findMostViewed(Pageable pageable);

    // ===== PROJECTION QUERIES (Lightweight) =====

    @Query("""
        SELECT p.id as id,
               p.title as title,
               p.price as price,
               r.thumbnailUrl as thumbnailUrl,
               AVG(rv.rating) as averageRating,
               COUNT(DISTINCT rv.id) as reviewCount
        FROM Post p
        LEFT JOIN p.room r
        LEFT JOIN p.reviews rv
        WHERE p.status = 'APPROVED'
        GROUP BY p.id, p.title, p.price, r.thumbnailUrl
        """)
    Page<PostListProjection> findPostListProjections(Pageable pageable);

    // ===== COUNT QUERIES (Avoid loading entities) =====

    @Query("SELECT COUNT(p) FROM Post p WHERE p.landlord.id = :landlordId AND p.status = :status")
    long countByLandlordIdAndStatus(@Param("landlordId") Long landlordId, @Param("status") PostStatus status);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.status = 'APPROVED'")
    long countApprovedPosts();

    // ===== SECURITY QUERIES =====

    @Query("SELECT CASE WHEN p.landlord.id = :userId THEN true ELSE false END FROM Post p WHERE p.id = :postId")
    boolean isOwner(@Param("postId") Long postId, @Param("userId") Long userId);

    // ===== STATISTICS QUERIES =====

    @Query("""
        SELECT p.status, COUNT(p)
        FROM Post p
        GROUP BY p.status
        """)
    List<Object[]> countByStatus();

    @Query("""
        SELECT FUNCTION('DATE', p.createdAt) as date, COUNT(p)
        FROM Post p
        WHERE p.createdAt >= :startDate
        GROUP BY FUNCTION('DATE', p.createdAt)
        ORDER BY date
        """)
    List<Object[]> countByDate(@Param("startDate") LocalDateTime startDate);

    // ===== MODIFYING QUERIES =====

    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Post p SET p.status = 'EXPIRED' WHERE p.expiredAt < CURRENT_TIMESTAMP AND p.status = 'APPROVED'")
    int markExpiredPosts();
}
```

### 5.4. Specification Pattern cho Search

```java
public class PostSpecifications {

    public static Specification<Post> withSearchParams(PostSearchParams params) {
        return Specification.where(hasStatus(PostStatus.APPROVED))
                .and(priceBetween(params.getMinPrice(), params.getMaxPrice()))
                .and(inDistrict(params.getDistrict()))
                .and(hasAmenities(params.getAmenityIds()))
                .and(areaBetween(params.getMinArea(), params.getMaxArea()))
                .and(nearUniversity(params.getNearbyUniversityId()))
                .and(isPetFriendly(params.getPetFriendly()))
                .and(hasKeyword(params.getKeyword()));
    }

    public static Specification<Post> hasStatus(PostStatus status) {
        return (root, query, cb) ->
            status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Post> priceBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min != null && max != null) {
                return cb.between(root.get("price"), min, max);
            }
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.lessThanOrEqualTo(root.get("price"), max);
        };
    }

    public static Specification<Post> hasAmenities(List<Long> amenityIds) {
        return (root, query, cb) -> {
            if (amenityIds == null || amenityIds.isEmpty()) return null;

            // Join với room -> amenities
            Join<Post, Room> room = root.join("room");
            Join<Room, RoomAmenity> roomAmenities = room.join("amenities");

            return roomAmenities.get("amenity").get("id").in(amenityIds);
        };
    }

    public static Specification<Post> nearUniversity(Long universityId) {
        return (root, query, cb) -> {
            if (universityId == null) return null;

            // Distance calculation - posts within 3km of university
            Join<Post, Room> room = root.join("room");
            Join<Room, University> university = room.join("nearbyUniversity");

            return cb.equal(university.get("id"), universityId);
        };
    }

    public static Specification<Post> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;

            // Full-text search trên title và description
            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("room").get("address")), pattern)
            );
        };
    }

    // Boosted posts luôn lên đầu
    public static Specification<Post> withBoostPriority() {
        return (root, query, cb) -> {
            query.orderBy(
                cb.desc(root.get("isBoosted")),
                cb.desc(root.get("createdAt"))
            );
            return null;
        };
    }
}
```

---

## 6. Quy Tắc Code và Best Practices

### 6.1. Tránh N+1 Query - Chi Tiết

```java
// ═══════════════════════════════════════════════════════════════════
// ❌ SAI - Vòng for gây N+1
// ═══════════════════════════════════════════════════════════════════

@Service
public class BadExampleService {

    public List<PostResponse> getFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);

        return favorites.stream()
                .map(fav -> {
                    // ⚠️ N+1: Lazy load Post
                    Post post = fav.getPost();
                    // ⚠️ N+1: Lazy load Landlord
                    User landlord = post.getLandlord();
                    // ⚠️ N+1: Lazy load Room
                    Room room = post.getRoom();
                    // ⚠️ N+1: Lazy load Amenities
                    List<Amenity> amenities = room.getAmenities();

                    return PostResponse.builder()
                            .id(post.getId())
                            .title(post.getTitle())
                            .landlordName(landlord.getFullName())  // N+1
                            .roomAddress(room.getAddress())       // N+1
                            .amenities(amenities)                 // N+1
                            .build();
                })
                .collect(Collectors.toList());
        // Result: 1 + N*4 queries
    }
}

// ═══════════════════════════════════════════════════════════════════
// ✅ ĐÚNG 1 - EntityGraph
// ═══════════════════════════════════════════════════════════════════

@EntityGraph(attributePaths = {
    "post",
    "post.landlord",
    "post.room",
    "post.room.amenities"
})
@Query("SELECT f FROM Favorite f WHERE f.user.id = :userId")
List<Favorite> findByUserIdWithDetails(@Param("userId") Long userId);

// Service
public List<PostResponse> getFavorites(Long userId) {
    List<Favorite> favorites = favoriteRepository.findByUserIdWithDetails(userId);
    // Result: 1 query với JOIN FETCH
    return favorites.stream()
            .map(this::toResponse)  // Không còn N+1
            .collect(Collectors.toList());
}

// ═══════════════════════════════════════════════════════════════════
// ✅ ĐÚNG 2 - DTO Projection (Tốt nhất cho read-only)
// ═══════════════════════════════════════════════════════════════════

public interface FavoriteProjection {
    Long getPostId();
    String getPostTitle();
    Double getPostPrice();
    String getLandlordName();
    String getLandlordAvatar();
    String getRoomAddress();
    String getThumbnailUrl();
    List<String> getAmenityNames();
}

// Repository
@Query("""
    SELECT f.post.id as postId,
           p.title as postTitle,
           p.price as postPrice,
           u.fullName as landlordName,
           u.avatar as landlordAvatar,
           r.address as roomAddress,
           r.thumbnailUrl as thumbnailUrl,
           FUNCTION('GROUP_CONCAT', a.name) as amenityNames
    FROM Favorite f
    JOIN f.post p
    JOIN p.landlord u
    JOIN p.room r
    LEFT JOIN r.amenities a
    WHERE f.user.id = :userId
    GROUP BY f.post.id
    """)
List<FavoriteProjection> findFavoritesProjection(@Param("userId") Long userId);

// ═══════════════════════════════════════════════════════════════════
// ✅ ĐÚNG 3 - Batch Fetching (Cho trường hợp phức tạp)
// ═══════════════════════════════════════════════════════════════════

@Entity
@BatchSize(size = 25)  // Batch fetch 25 entities at a time
public class Post {
    @ManyToOne(fetch = FetchType.LAZY)
    private User landlord;
}

// Hoặc cấu hình global trong application.yml:
// spring.jpa.properties.hibernate.default_batch_fetch_size = 25
```

### 6.2. Pagination Best Practices

```java
// ═══════════════════════════════════════════════════════════════════
// Cursor-based Pagination (Tốt cho large datasets)
// ═══════════════════════════════════════════════════════════════════

public class CursorPageRequest {
    private Long cursor;      // ID của record cuối
    private int limit = 20;  // Default 20
    private LocalDateTime after;  // Timestamp
}

// Service
public CursorPageResponse<PostResponse> getPostsCursor(CursorPageRequest request) {
    List<Post> posts = postRepository.findNextBatch(
            request.getCursor(),
            request.getLimit() + 1  // Fetch 1 extra to check hasMore
    );

    boolean hasMore = posts.size() > request.getLimit();
    if (hasMore) {
        posts = posts.subList(0, request.getLimit());
    }

    Long nextCursor = posts.isEmpty() ? null : posts.get(posts.size() - 1).getId();

    return CursorPageResponse.<PostResponse>builder()
            .content(postMapper.toListResponse(posts))
            .nextCursor(nextCursor)
            .hasMore(hasMore)
            .build();
}

// ═══════════════════════════════════════════════════════════════════
// Offset Pagination (Spring Data Pageable)
// ═══════════════════════════════════════════════════════════════════

@GetMapping
public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPosts(
        @ParameterObject PageRequest pageRequest) {

    // LIMIT 10 OFFSET 20 (Càng page lớn càng chậm)
    Page<Post> posts = postRepository.findAll(PageRequest.of(20, 10));

    return ApiResponse.success(PageResponse.of(posts.map(postMapper)));
}
```

### 6.3. Caching Strategy

```java
// ═══════════════════════════════════════════════════════════════════
// Cache Configuration
// ═══════════════════════════════════════════════════════════════════

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .serializeValuesWith(SerializationPair.fromSerializer(
                        new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration("posts",
                        defaultConfig.entryTtl(Duration.ofMinutes(5)))
                .withCacheConfiguration("posts-detail",
                        defaultConfig.entryTtl(Duration.ofMinutes(10)))
                .withCacheConfiguration("amenities",
                        defaultConfig.entryTtl(Duration.ofHours(1)))
                .withCacheConfiguration("packages",
                        defaultConfig.entryTtl(Duration.ofHours(24)))
                .withCacheConfiguration("user-profile",
                        defaultConfig.entryTtl(Duration.ofMinutes(15)))
                .build();
    }
}

// ═══════════════════════════════════════════════════════════════════
// Cache Usage
// ═══════════════════════════════════════════════════════════════════

@Service
@RequiredArgsConstructor
public class PostService {

    @Cacheable(value = "posts", key = "#searchParams.hashCode()", unless = "#result == null")
    public Page<PostResponse> searchPosts(PostSearchParams searchParams, Pageable pageable) {
        // Cache key dựa trên search params
        // Không cache nếu result null
    }

    @Cacheable(value = "posts-detail", key = "#id", unless = "#result == null")
    public PostDetailResponse getPostDetail(Long id) {
        // Cache chi tiết post 10 phút
    }

    @CacheEvict(value = {"posts", "posts-detail"}, key = "#postId")
    @Transactional
    public void updatePost(Long postId, UpdatePostRequest request) {
        // Xóa cache khi cập nhật
    }

    @CacheEvict(value = {"posts", "posts-detail"}, allEntries = true)
    @Transactional
    public void approvePost(Long postId) {
        // Xóa toàn bộ cache posts khi approve
    }
}
```

### 6.4. Async Processing & Events

```java
// ═══════════════════════════════════════════════════════════════════
// Event Classes
// ═══════════════════════════════════════════════════════════════════

@Data
@Builder
public class PostCreatedEvent {
    private Long postId;
    private Long landlordId;
    private LocalDateTime createdAt;
}

@Data
@Builder
public class PostApprovedEvent {
    private Long postId;
    private String title;
    private String address;
    private Double latitude;
    private Double longitude;
}

// ═══════════════════════════════════════════════════════════════════
// Event Publisher
// ═══════════════════════════════════════════════════════════════════

@Service
@RequiredArgsConstructor
public class PostEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public void publish(PostCreatedEvent event) {
        log.info("Publishing PostCreatedEvent for post: {}", event.getPostId());
        eventPublisher.publishEvent(event);
    }

    public void publish(PostApprovedEvent event) {
        log.info("Publishing PostApprovedEvent for post: {}", event.getPostId());
        eventPublisher.publishEvent(event);
    }
}

// ═══════════════════════════════════════════════════════════════════
// Event Listeners (Async)
// ═══════════════════════════════════════════════════════════════════

@Component
@RequiredArgsConstructor
@Slf4j
public class PostEventListener {

    private final SearchService searchService;
    private final NotificationService notificationService;

    @Async("taskExecutor")
    @EventListener
    public void handlePostCreated(PostCreatedEvent event) {
        log.info("Processing PostCreatedEvent: {}", event.getPostId());

        // Index to Elasticsearch
        searchService.indexPost(event.getPostId());

        // Send notification to admin
        notificationService.sendToAdmin(
                "Có tin đăng mới cần duyệt",
                "/admin/posts/" + event.getPostId()
        );
    }

    @Async("taskExecutor")
    @EventListener
    public void handlePostApproved(PostApprovedEvent event) {
        log.info("Processing PostApprovedEvent: {}", event.getPostId());

        // Notify matching users (nearby, preference match)
        notificationService.notifyNearbyUsers(event);

        // Update search index
        searchService.updatePost(event.getPostId());
    }
}

// ═══════════════════════════════════════════════════════════════════
// Async Configuration
// ═══════════════════════════════════════════════════════════════════

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }
}
```

### 6.5. Transaction Management

```java
// ═══════════════════════════════════════════════════════════════════
// Transaction Patterns
// ═══════════════════════════════════════════════════════════════════

@Service
@RequiredArgsConstructor
public class BookingService {

    /**
     * REQUIRED: Sử dụng transaction hiện tại hoặc tạo mới
     * rollbackFor: Rollback nếu có exception
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        // 1. Validate (throw exception = rollback)
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // 2. Business logic
        if (!post.isBookable()) {
            throw new BusinessException("Post is not available for booking");
        }

        // 3. Save
        Booking booking = bookingRepository.save(booking);

        // 4. Gọi async notification (trong cùng transaction)
        // Nếu notification fail, booking vẫn được lưu
        notificationService.sendBookingConfirmationAsync(booking);

        return bookingMapper.toResponse(booking);
    }

    /**
     * REQUIRES_NEW: Luôn tạo transaction mới
     * Dùng cho các operation độc lập cần commit riêng
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processPaymentAndCreateBooking(Long bookingId, Long transactionId) {
        // Tạo booking trong transaction riêng
    }

    /**
     * READ_ONLY: Chỉ đọc, không cần transaction
     * Tối ưu performance
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Booking> getBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable);
    }
}
```

### 6.6. Exception Handling Chi Tiết

```java
// ═══════════════════════════════════════════════════════════════════
// Error Codes
// ═══════════════════════════════════════════════════════════════════

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // Authentication (AUTH_xxx)
    AUTH_001("AUTH_001", "Invalid credentials", HttpStatus.UNAUTHORIZED),
    AUTH_002("AUTH_002", "Account is locked", HttpStatus.FORBIDDEN),
    AUTH_003("AUTH_003", "Email not verified", HttpStatus.FORBIDDEN),
    AUTH_004("AUTH_004", "Token expired", HttpStatus.UNAUTHORIZED),
    AUTH_005("AUTH_005", "Invalid refresh token", HttpStatus.UNAUTHORIZED),

    // User (USER_xxx)
    USER_001("USER_001", "User not found", HttpStatus.NOT_FOUND),
    USER_002("USER_002", "Email already exists", HttpStatus.CONFLICT),
    USER_003("USER_003", "Invalid password", HttpStatus.BAD_REQUEST),
    USER_004("USER_004", "Cannot delete own account", HttpStatus.BAD_REQUEST),

    // Post (POST_xxx)
    POST_001("POST_001", "Post not found", HttpStatus.NOT_FOUND),
    POST_002("POST_002", "No active subscription", HttpStatus.BAD_REQUEST),
    POST_003("POST_003", "Out of posts quota", HttpStatus.BAD_REQUEST),
    POST_004("POST_004", "Room already has active post", HttpStatus.CONFLICT),
    POST_005("POST_005", "Post is not in pending status", HttpStatus.BAD_REQUEST),
    POST_006("POST_006", "Cannot edit approved post", HttpStatus.BAD_REQUEST),

    // Booking (BOOK_xxx)
    BOOK_001("BOOK_001", "Booking not found", HttpStatus.NOT_FOUND),
    BOOK_002("BOOK_002", "Time slot not available", HttpStatus.CONFLICT),
    BOOK_003("BOOK_003", "Cannot book own post", HttpStatus.BAD_REQUEST),
    BOOK_004("BOOK_004", "Booking deadline passed", HttpStatus.BAD_REQUEST),

    // Payment (PAY_xxx)
    PAY_001("PAY_001", "Payment failed", HttpStatus.BAD_REQUEST),
    PAY_002("PAY_002", "Transaction not found", HttpStatus.NOT_FOUND),
    PAY_003("PAY_003", "Payment timeout", HttpStatus.BAD_REQUEST),
    PAY_004("PAY_004", "Amount mismatch", HttpStatus.BAD_REQUEST),

    // Generic
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed", HttpStatus.BAD_REQUEST),
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}

// ═══════════════════════════════════════════════════════════════════
// Custom Exceptions
// ═══════════════════════════════════════════════════════════════════

@Data
@EqualsAndHashCode(callSuper = true)
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;
    private final Map<String, String> details;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.details = null;
    }

    public BusinessException(ErrorCode errorCode, String customMessage) {
        super(customMessage);
        this.errorCode = errorCode;
        this.details = null;
    }

    public BusinessException(ErrorCode errorCode, Map<String, String> details) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.details = details;
    }
}

// ═══════════════════════════════════════════════════════════════════
// Global Exception Handler
// ═══════════════════════════════════════════════════════════════════

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {} - {}", ex.getErrorCode().getCode(), ex.getMessage());

        return ResponseEntity
                .status(ex.getErrorCode().getHttpStatus())
                .body(ApiResponse.error(ex.getMessage(), ex.getErrorCode().getCode()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage()));

        log.warn("Validation failed: {}", errors);

        return ResponseEntity.badRequest()
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Validation failed")
                        .errorCode(ErrorCode.VALIDATION_ERROR.getCode())
                        .data(errors)
                        .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Access denied", "ACCESS_DENIED"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Internal server error",
                        ErrorCode.INTERNAL_ERROR.getCode()));
    }
}
```

### 6.7. API Response Format Chuẩn

```java
// ═══════════════════════════════════════════════════════════════════
// Standard API Response
// ═══════════════════════════════════════════════════════════════════

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String errorCode;
    private LocalDateTime timestamp;
    private String requestId;  // For debugging
    private PaginationMeta pagination;  // For paginated responses

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(now())
                .build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Created successfully")
                .data(data)
                .timestamp(now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .timestamp(now())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(errorCode.getMessage())
                .errorCode(errorCode.getCode())
                .timestamp(now())
                .build();
    }
}

// ═══════════════════════════════════════════════════════════════════
// Pagination Response
// ═══════════════════════════════════════════════════════════════════

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
    private boolean hasNext;
    private boolean hasPrevious;

    public static <T> PageResponse<T> of(org.springframework.data.domain.Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}

// ═══════════════════════════════════════════════════════════════════
// Error Response
// ═══════════════════════════════════════════════════════════════════

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String errorCode;
    private String message;
    private String path;
    private LocalDateTime timestamp;
    private Map<String, String> fieldErrors;
    private String stackTrace;  // Chỉ hiển thị trong dev mode
}
```

---

## 7. Database Design

### 7.1. Database Conventions

```yaml
# application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Không tự động tạo schema
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
        generate_statistics: false  # Bật khi debug
        default_batch_fetch_size: 25
    open-in-view: false  # LUÔN = false
```

### 7.2. Index Strategy

```sql
-- ═══════════════════════════════════════════════════════════════════
-- Core Indexes
-- ═══════════════════════════════════════════════════════════════════

-- Posts: Thường xuyên query theo status và landlord
CREATE INDEX idx_post_status ON posts(status);
CREATE INDEX idx_post_landlord_status ON posts(landlord_id, status);
CREATE INDEX idx_post_created_at ON posts(created_at DESC);

-- Posts: Tìm kiếm theo giá và vị trí
CREATE INDEX idx_post_price ON posts(price);
CREATE INDEX idx_post_location ON posts(latitude, longitude);

-- Posts: Boosted posts (priority search)
CREATE INDEX idx_post_boosted ON posts(is_boosted, boosted_until) WHERE is_boosted = true;

-- Posts: Full-text search (nếu không dùng Elasticsearch)
CREATE INDEX idx_post_title_search ON posts USING gin(to_tsvector('vietnamese', title));
CREATE INDEX idx_post_description_search ON posts USING gin(to_tsvector('vietnamese', description));

-- Bookings: Query theo thời gian và trạng thái
CREATE INDEX idx_booking_user_status ON bookings(user_id, status);
CREATE INDEX idx_booking_landlord_status ON bookings(landlord_id, status);
CREATE INDEX idx_booking_time ON bookings(booking_time);
CREATE INDEX idx_booking_post_time ON bookings(post_id, booking_time);  -- Unique constraint

-- Messages: Conversation queries
CREATE INDEX idx_message_conversation ON messages(sender_id, receiver_id);
CREATE INDEX idx_message_created_at ON messages(created_at DESC);

-- Favorites: User's favorites
CREATE INDEX idx_favorite_user_room ON favorites(user_id, room_id);  -- Unique

-- Reviews: Query theo post và rating
CREATE INDEX idx_review_post ON reviews(post_id, created_at DESC);
CREATE INDEX idx_review_rating ON reviews(rating);

-- ═══════════════════════════════════════════════════════════════════
-- Soft Delete Support
-- ═══════════════════════════════════════════════════════════════════

-- Thêm deleted_at cho soft delete
ALTER TABLE posts ADD COLUMN deleted_at TIMESTAMP;

-- Query filter
CREATE INDEX idx_post_deleted ON posts(deleted_at) WHERE deleted_at IS NOT NULL;
```

### 7.3. Entity Base Class

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Version
    private Long version;  // Optimistic locking

    // Soft delete
    @Getter(AccessLevel.NONE)
    private boolean deleted = false;

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.deleted = true;
    }

    public boolean isActive() {
        return !deleted && deletedAt == null;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 7.4. Sample Entity

```java
@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_post_status", columnList = "status"),
        @Index(name = "idx_post_landlord", columnList = "landlord_id"),
        @Index(name = "idx_post_created", columnList = "created_at DESC")
})
@NamedEntityGraph(name = "Post.withDetails",
        attributeNodes = {
                @NamedAttributeNode("landlord"),
                @NamedAttributeNode("room"),
                @NamedAttributeNode("room.amenities")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "deposit_amount")
    private Double deposit;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private PriceType priceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @Column(name = "is_boosted")
    private Boolean isBoosted = false;

    @Column(name = "boosted_until")
    private LocalDateTime boostedUntil;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "post")
    private List<Review> reviews;

    @OneToMany(mappedBy = "post")
    private List<Booking> bookings;

    // Business methods
    public boolean isBookable() {
        return status == PostStatus.APPROVED && isActive() && !isExpired();
    }

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    public boolean isBoostActive() {
        return isBoosted && boostedUntil != null && boostedUntil.isAfter(LocalDateTime.now());
    }
}
```

---

## 8. Security & Authentication

### 8.1. Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CorsConfigProperties corsConfig;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/v1/payments/vnpay/**")  // Webhook
            )

            // CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Session Management
            .sessionManagement(session -> session
                .sessionCreationPolicy(STATELESS)
                .sessionFixation().migrateSession()
            )

            // Exception Handling
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                .accessDeniedHandler(new CustomAccessDeniedHandler())
            )

            // Authorization
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/posts").permitAll()
                .requestMatchers("/api/v1/posts/{id}").permitAll()
                .requestMatchers("/api/v1/amenities/**").permitAll()
                .requestMatchers("/api/v1/packages/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Landlord only
                .requestMatchers("/api/v1/posts/my/**").hasRole("LANDLORD")
                .requestMatchers("/api/v1/bookings/calendar").hasRole("LANDLORD")
                .requestMatchers("/api/v1/subscriptions/**").hasRole("LANDLORD")
                .requestMatchers("/api/v1/payments/**").hasRole("LANDLORD")

                // Admin only
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // Authenticated users
                .anyRequest().authenticated()
            )

            // OAuth2
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(authorization ->
                    authorization.baseUri("/api/v1/auth/oauth2/authorization"))
                .redirectionEndpoint(redirection ->
                    redirection.baseUri("/api/v1/auth/oauth2/callback/*"))
                .successHandler(oAuth2SuccessHandler)
            )

            // JWT
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(corsConfig.getAllowedOrigins());
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        config.setExposedHeaders(Arrays.asList("X-Total-Count", "X-Page-Count"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### 8.2. JWT Configuration

```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getAccessTokenExpiration());

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getRefreshTokenExpiration());

        String refreshToken = Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();

        // Store refresh token hash in database
        userRepository.updateRefreshToken(user.getId(), hashToken(refreshToken));

        return refreshToken;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Long.parseLong(claims.getSubject());
    }
}
```

### 8.3. Rate Limiting

```java
@Configuration
public class RateLimitingConfig {

    @Bean
    public FilterRegistrationBean<RateLimitingFilter> rateLimitingFilter() {
        FilterRegistrationBean<RateLimitingFilter> registrationBean =
                new FilterRegistrationBean<>();

        registrationBean.setFilter(new RateLimitingFilter());
        registrationBean.addUrlPatterns("/api/*");
        registrationBean.setOrder(1);

        return registrationBean;
    }
}

@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, String> redisTemplate;
    private final RateLimitProperties rateLimitProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientId = getClientId(request);
        String endpoint = request.getRequestURI();
        String key = "rate_limit:" + clientId + ":" + endpoint;

        Long currentCount = redisTemplate.opsForValue().increment(key);

        if (currentCount == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(1));
        }

        // Get limit for this endpoint
        int limit = getLimitForEndpoint(endpoint);

        if (currentCount > limit) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Too many requests\",\"errorCode\":\"RATE_LIMIT_EXCEEDED\"}"
            );
            return;
        }

        // Add rate limit headers
        response.setHeader("X-RateLimit-Limit", String.valueOf(limit));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(limit - currentCount));

        filterChain.doFilter(request, response);
    }

    private int getLimitForEndpoint(String endpoint) {
        if (endpoint.contains("/auth/login")) return 10; // 10 requests/min
        if (endpoint.contains("/messages")) return 60;    // 60 requests/min
        if (endpoint.contains("/bookings")) return 20;     // 20 requests/min
        return 100;                                         // Default 100/min
    }
}
```

---

## 9. Cấu Hình Hệ Thống

### 9.1. Application Configuration

```yaml
# application.yml
spring:
  application:
    name: tmdt-backend

  datasource:
    url: jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

  data:
    redis:
      host: ${REDIS_HOST}
      port: ${REDIS_PORT}
      password: ${REDIS_PASSWORD}

  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 50MB

  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null

server:
  port: ${APP_PORT:8080}
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain

jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: 900000      # 15 minutes
  refresh-token-expiration: 604800000  # 7 days

vnpay:
  tmn-code: ${VNPAY_TMN_CODE}
  hash-secret: ${VNPAY_HASH_SECRET}
  url: ${VNPAY_URL:https://sandbox.vnpayment.vn/}

file:
  upload-dir: ${UPLOAD_DIR:/data/uploads}
  max-size: 5242880  # 5MB

rate-limit:
  default: 100
  login: 10
  messages: 60
  bookings: 20
```

### 9.2. Logging Configuration

```yaml
# logback-spring.xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <springProperty scope="context" name="appName" fromSpringProperty="spring.application.name"/>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/${appName}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/${appName}-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Async appender for performance -->
    <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
        <queueSize>512</queueSize>
        <discardingThreshold>0</discardingThreshold>
        <includeCallerData>true</includeCallerData>
        <appender-ref ref="FILE"/>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="ASYNC_FILE"/>
    </root>

    <logger name="fit.nlu.tmdt" level="DEBUG"/>
    <logger name="org.springframework.web" level="INFO"/>
    <logger name="org.hibernate.SQL" level="DEBUG"/>
    <logger name="org.hibernate.type.descriptor.sql.BasicBinder" level="TRACE"/>
</configuration>
```

---

## 10. Deployment & DevOps

### 10.1. Docker Configuration

```dockerfile
# Dockerfile
FROM eclipse-temurin:21-jdk-alpine as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Xms512m", "-Xmx1024m", "-XX:+UseG1GC", "app.jar"]
```

### 10.2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: tmdt
      POSTGRES_USER: tmdt_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tmdt_user -d tmdt"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### 10.3. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop, main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'
          cache: 'maven'

      - name: Cache Maven packages
        uses: actions/cache@v3
        with:
          path: ~/.m2/repository
          key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
          restore-keys: ${{ runner.os }}-maven-

      - name: Run tests
        run: ./mvnw test

      - name: Run integration tests
        run: ./mvnw verify -Dspring.profiles.active=test
        env:
          DB_HOST: localhost

      - name: Build
        run: ./mvnw package -DskipTests

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: app
          path: target/*.jar

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to staging
        run: |
          # Deployment commands here
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
```

---

## 11. Testing Strategy

### 11.1. Test Configuration

```java
@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
class BaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("tmdt_test")
            .withUsername("test")
            .withPassword("test");

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }
}
```

### 11.2. Unit Test Example

```java
@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private PostServiceImpl postService;

    @Test
    @DisplayName("Should throw exception when landlord has no active subscription")
    void createPost_NoSubscription_ThrowsException() {
        // Given
        Long landlordId = 1L;
        CreatePostRequest request = CreatePostRequest.builder()
                .title("Test Post")
                .roomId(1L)
                .price(2000000.0)
                .build();

        when(subscriptionRepository.findActiveByLandlordId(landlordId))
                .thenReturn(Optional.empty());

        // When/Then
        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> postService.createPost(request, landlordId)
        );

        assertEquals(ErrorCode.NO_ACTIVE_SUBSCRIPTION, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should create post successfully when landlord has subscription")
    void createPost_WithSubscription_Success() {
        // Given
        Long landlordId = 1L;
        Subscription subscription = Subscription.builder()
                .remainingPosts(5)
                .build();

        Post savedPost = Post.builder()
                .id(1L)
                .title("Test Post")
                .status(PostStatus.PENDING)
                .build();

        when(subscriptionRepository.findActiveByLandlordId(landlordId))
                .thenReturn(Optional.of(subscription));
        when(postRepository.existsActivePostByRoomId(anyLong())).thenReturn(false);
        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        // When
        PostResponse result = postService.createPost(request, landlordId);

        // Then
        assertNotNull(result);
        assertEquals(PostStatus.PENDING, result.getStatus());
        verify(subscriptionRepository).decrementRemainingPosts(landlordId);
    }
}
```

### 11.3. Controller Test

```java
@WebMvcTest(PostController.class)
@Import(TestSecurityConfig.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @WithMockUser(roles = "LANDLORD")
    @Test
    void createPost_ValidRequest_Returns201() throws Exception {
        CreatePostRequest request = CreatePostRequest.builder()
                .title("Test Post Title")
                .description("Test description with enough characters")
                .roomId(1L)
                .price(2000000.0)
                .amenityIds(List.of(1L, 2L))
                .build();

        PostResponse response = PostResponse.builder()
                .id(1L)
                .title("Test Post Title")
                .status(PostStatus.PENDING)
                .build();

        when(postService.createPost(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("Should return 400 when validation fails")
    void createPost_InvalidRequest_Returns400() throws Exception {
        CreatePostRequest request = CreatePostRequest.builder()
                .title("Short")  // Too short
                .roomId(1L)
                .price(-1000.0)  // Negative price
                .build();

        mockMvc.perform(post("/api/v1/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }
}
```

---

## 12. Monitoring & Logging

### 12.1. Actuator Configuration

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /actuator

  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true

  health:
    db:
      enabled: true
    redis:
      enabled: true

  metrics:
    tags:
      application: ${spring.application.name}

# Custom metrics
```

### 12.2. Custom Metrics

```java
@Service
@RequiredArgsConstructor
public class MetricsService {

    private final MeterRegistry meterRegistry;

    public void recordPostCreation(Long landlordId) {
        Counter.builder("posts.created")
                .tag("landlord_id", landlordId.toString())
                .description("Number of posts created")
                .register(meterRegistry)
                .increment();
    }

    public void recordBookingCreated(String status) {
        Counter.builder("bookings.created")
                .tag("status", status)
                .description("Number of bookings created")
                .register(meterRegistry)
                .increment();
    }

    public void recordPaymentAmount(double amount, String paymentMethod) {
        DistributionSummary.builder("payments.amount")
                .tag("method", paymentMethod)
                .description("Payment amounts")
                .register(meterRegistry)
                .record(amount);
    }

    public Timer.Sample startTimer() {
        return Timer.start(meterRegistry);
    }

    public void stopTimer(Timer.Sample sample, String operation) {
        sample.stop(Timer.builder("operations.duration")
                .tag("operation", operation)
                .register(meterRegistry));
    }
}
```

### 12.3. Request Logging Filter

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = UUID.randomUUID().toString();
        request.setAttribute("requestId", requestId);

        long startTime = System.currentTimeMillis();

        // Log request
        log.info("[{}] {} {} - Started",
                requestId,
                request.getMethod(),
                request.getRequestURI());

        try {
            filterChain.doFilter(request, response);

            long duration = System.currentTimeMillis() - startTime;

            // Log response
            log.info("[{}] {} {} - Completed in {}ms with status {}",
                    requestId,
                    request.getMethod(),
                    request.getRequestURI(),
                    duration,
                    response.getStatus());

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;

            log.error("[{}] {} {} - Failed after {}ms: {}",
                    requestId,
                    request.getMethod(),
                    request.getRequestURI(),
                    duration,
                    e.getMessage());

            throw e;
        }
    }
}
```

---

## Tổng Kết Checklist

### Trước Khi Commit Code

- [ ] **Architecture**
  - [ ] Code đặt trong module đúng
  - [ ] Không vi phạm nguyên tắc Layer
  - [ ] Tuân thủ DDD structure

- [ ] **Performance**
  - [ ] Không có N+1 query (kiểm tra với Hibernate Statistics)
  - [ ] Sử dụng Pageable cho tất cả list endpoints
  - [ ] Cache được apply nơi cần thiết
  - [ ] Async processing cho các tác vụ không cần sync

- [ ] **Business Rules**
  - [ ] Tất cả business rules được implement đúng
  - [ ] Validation đầy đủ cho input
  - [ ] Error codes rõ ràng và có message

- [ ] **Security**
  - [ ] Authorization check cho mọi endpoint
  - [ ] Input sanitization
  - [ ] Không log sensitive data
  - [ ] Rate limiting configured

- [ ] **Testing**
  - [ ] Unit tests cho business logic
  - [ ] Integration tests cho repository queries
  - [ ] Controller tests cho API endpoints

- [ ] **Documentation**
  - [ ] API endpoints được document
  - [ ] Swagger annotations đầy đủ
  - [ ] Comments cho logic phức tạp
