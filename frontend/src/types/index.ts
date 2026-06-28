// ============================================
// Base Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string | null;
  data: T | null;
  errorCode: string | null;
  timestamp: string;
  requestId: string | null;
}

export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
  role: 'USER' | 'LANDLORD';
  acceptTerms: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  status: string;
  isVerified: boolean;
  verificationStatus?: string;
  frontIdCardUrl?: string;
  backIdCardUrl?: string;
  selfieUrl?: string;
  businessLicenseUrl?: string;
  verifiedAt: string | null;
  dateOfBirth: string | null;
  address: string | null;
  bio: string | null;
  universityId: number | null;
  universityName?: string | null;
  landlordRating: number | null;
  totalReviews: number | null;
  adminNote?: string;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  requiresVerification?: boolean;
  user: UserResponse;
}

export type UserRole = 'USER' | 'LANDLORD' | 'ADMIN';

// ============================================
// Post Types
// ============================================

export interface PostResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  priceType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  status: PostStatus;
  images: string[];
  viewCount: number;
  favoriteCount: number;
  room: RoomResponse;
  landlord: {
    id: number;
    fullName: string;
    avatar: string | null;
    phone: string | null;
    rating: number | null;
    totalReviews: number | null;
    isVerified?: boolean;
  };
  isBoosted: boolean;
  boostedUntil: string | null;
  rejectionReason?: string | null;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomResponse {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  area: number;
  floor?: number | null;
  direction?: string | null;
  thumbnailUrl?: string | null;
  images: string[];
  amenities: AmenityResponse[];
  landlord: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  nearbyUniversityId?: string | number | null;
  nearbyUniversityName?: string | null;
  distanceToUniversity?: number | null;
  district?: string | null;
  province?: string | null;
  hasParking?: boolean | null;
  hasBalcony?: boolean | null;
}

export interface AmenityResponse {
  id: number;
  name: string;
  icon: string | null;
  category: string;
}

// ============================================
// Room Types (Full)
// ============================================

export interface RoomDetailResponse {
  id: number;
  roomNumber: string | null;
  address: string;
  province: string | null;
  district: string | null;
  ward: string | null;
  latitude: number;
  longitude: number;
  area: number;
  floor: number;
  maxOccupancy: number;
  direction: RoomDirection | null;
  hasWindows: boolean;
  hasBalcony: boolean;
  thumbnailUrl: string | null;
  images: string[];
  amenities: AmenityResponse[];
  nearbyUniversityId: number | null;
  nearbyUniversityName: string | null;
  distanceToUniversity: number | null;
  nearestBusStation: number | null;
  isPetFriendly: boolean;
  isParkingAvailable: boolean;
  curfew: string | null;
  rules: string | null;
  viewCount: number;
  favoriteCount: number;
  landlord: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export type RoomDirection = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | 'NORTHEAST' | 'NORTHWEST' | 'SOUTHEAST' | 'SOUTHWEST';

// ============================================
// Create/Update Request Types
// ============================================

export interface CreateRoomRequest {
  roomNumber?: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
  area: number;
  floor: number;
  maxOccupancy: number;
  direction?: RoomDirection;
  hasWindows?: boolean;
  hasBalcony?: boolean;
  thumbnailUrl?: string;
  images: string[];
  amenityIds?: number[];
  amenities?: number[];
  nearbyUniversityId?: number;
  nearbyUniversityName?: string;
  distanceToUniversity?: number;
  nearestBusStation?: number;
  isPetFriendly?: boolean;
  isParkingAvailable?: boolean;
  curfew?: string;
  rules?: string;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> { }

export interface CreatePostRequest {
  roomId: number;
  title: string;
  description: string;
  price: number;
  priceType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  deposit?: number;
  images: string[];
  videoUrl?: string;
  durationDays?: number;
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  price?: number;
  priceType?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  deposit?: number;
  images?: string[];
  videoUrl?: string;
  isAutoRenew?: boolean;
}

export type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface PostStatsResponse {
  postId: number;
  viewCount: number;
  favoriteCount: number;
  contactCount: number;
  bookingCount: number;
  completedBookings: number;
}

// ============================================
// Booking Types
// ============================================

export interface BookingResponse {
  id: number;
  bookingTime: string;
  endTime: string;
  guestCount: number;
  note: string | null;
  landlordNote: string | null;
  status: BookingStatus;
  totalPrice: number;
  post: {
    id: number;
    title: string;
    thumbnailUrl: string | null;
    address: string | null;
  };
  user: {
    id: number;
    fullName: string;
    phone: string | null;
    avatar: string | null;
    isVerified?: boolean;
  };
  landlord: {
    id: number;
    fullName: string;
    phone: string | null;
    avatar: string | null;
    isVerified?: boolean;
  };
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  confirmationCode: string | null;
  isReviewed?: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

// ============================================
// Review Types
// ============================================

export interface ReviewResponse {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  postId: number;
  postTitle: string;
  rating: number;
  comment: string;
  images: string[];
  landlordRating: number | null;
  landlordComment: string | null;
  isVisible: boolean;
  helpfulCount: number;
  reportCount: number;
  landlordResponse: string | null;
  landlordResponseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Voucher Types
// ============================================

export interface VoucherResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  totalQuantity: number;
  remainingQuantity: number;
  maxPerUser: number;
  validFrom: string;
  expiresAt: string;
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  applicableTypes: string;
  applicablePackageIds: number[];
  usedCount: number;
}

// ============================================
// Statistics Types
// ============================================

export interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  recentPosts: PostResponse[];
  recentBookings: BookingResponse[];
}

export interface LandlordDashboardStats {
  totalPosts: number;
  activePosts: number;
  totalViews: number;
  totalBookings: number;
  pendingBookings: number;
  totalContacts: number;
  totalServiceCost: number;
  conversionRate: number;
  totalFavorites: number;
  completedBookings: number;
  cancelledBookings: number;
  topPosts: {
    id: number;
    title: string;
    views: number;
    bookings: number;
    contacts: number;
  }[];
  recentActivity: {
    date: string;
    views: number;
    contacts: number;
    serviceCost: number;
  }[];
}
