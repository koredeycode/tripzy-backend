-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_image_url TEXT,
    car_image_url TEXT, 
    car_seats INTEGER NOT NULL CHECK (car_seats > 0),
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rides (
    ride_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin_address VARCHAR(255) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    origin_latitude DECIMAL(9, 6) NOT NULL,
    origin_longitude DECIMAL(9, 6) NOT NULL,
    destination_latitude DECIMAL(9, 6) NOT NULL,
    destination_longitude DECIMAL(9, 6) NOT NULL,
    ride_time INTEGER NOT NULL,
    fare_price DECIMAL(10, 2) NOT NULL CHECK (fare_price >= 0),
    payment_status VARCHAR(20) NOT NULL,
    driver_id UUID REFERENCES drivers(id),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_preview TEXT,
    user_unread_count INTEGER DEFAULT 0,
    driver_unread_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, driver_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'driver')),
    sender_id UUID NOT NULL,
    
    message_text TEXT,
    image_url TEXT,
    message_type VARCHAR(20) DEFAULT 'text' 
        CHECK (message_type IN ('text', 'image')),
    
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CRITICAL INDEXES (these make everything fast)

-- 1. Find conversation between a specific user and driver instantly
CREATE UNIQUE INDEX idx_conversations_user_driver ON conversations(user_id, driver_id);
CREATE INDEX idx_conversations_driver_user ON conversations(driver_id, user_id);

-- 2. Conversation list for a user or driver (most recent first)
CREATE INDEX idx_conversations_user_recent 
    ON conversations(user_id, last_message_at DESC NULLS LAST);
CREATE INDEX idx_conversations_driver_recent 
    ON conversations(driver_id, last_message_at DESC NULLS LAST);

-- 3. Load messages in a conversation (pagination + newest first)
CREATE INDEX idx_messages_conversation_created 
    ON messages(conversation_id, created_at DESC);

-- 4. Find unread messages quickly (for badge counts)
CREATE INDEX idx_messages_unread 
    ON messages(conversation_id, is_read) 
    WHERE is_read = FALSE;

-- 5. Optional: find messages sent by a specific person (rarely needed but helpful)
CREATE INDEX idx_messages_sender 
    ON messages(sender_type, sender_id);