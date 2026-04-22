-- =============================================
-- TMDT Database Initialization
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

-- User Role
CREATE TYPE user_role AS ENUM ('USER', 'LANDLORD', 'ADMIN');

-- User Status
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'DELETED');

-- Post Status
CREATE TYPE post_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'REMOVED');

-- Booking Status
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- Payment Status
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- Report Status
CREATE TYPE report_status AS ENUM ('PENDING', 'PROCESSING', 'RESOLVED', 'DISMISSED');

-- Report Type
CREATE TYPE report_type AS ENUM ('SPAM', 'FAKE_POST', 'INAPPROPRIATE', 'HARASSMENT', 'FRAUD', 'OTHER');

-- OTP Type
CREATE TYPE otp_type AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_OTP');

-- Message Type
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'SYSTEM');

-- Package Type
CREATE TYPE package_type AS ENUM ('POST_BASIC', 'POST_STANDARD', 'POST_PREMIUM', 'BOOST_DAILY', 'BOOST_WEEKLY', 'BOOST_MONTHLY');

-- Price Type
CREATE TYPE price_type AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- Room Direction
CREATE TYPE room_direction AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST');

-- =============================================
-- INDEXES CREATED IN ENTITIES
-- =============================================

-- See entity annotations for index definitions
