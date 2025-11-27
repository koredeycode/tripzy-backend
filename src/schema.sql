CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    clerk_id VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_image_url TEXT,
    car_image_url TEXT,
    car_seats INTEGER NOT NULL CHECK (car_seats > 0),
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5)
);

CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    origin_address VARCHAR(255) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    origin_latitude DECIMAL(9, 6) NOT NULL,
    origin_longitude DECIMAL(9, 6) NOT NULL,
    destination_latitude DECIMAL(9, 6) NOT NULL,
    destination_longitude DECIMAL(9, 6) NOT NULL,
    ride_time INTEGER NOT NULL,
    fare_price DECIMAL(10, 2) NOT NULL CHECK (fare_price >= 0),
    payment_status VARCHAR(20) NOT NULL,
    driver_id INTEGER REFERENCES drivers(id),
    user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Conversations table
CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_preview TEXT,
    user_unread_count INTEGER DEFAULT 0,
    driver_unread_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, driver_id)
);

-- Messages table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'driver')),
    sender_id BIGINT NOT NULL,
    
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

-- seed drivers table
INSERT INTO drivers (id, first_name, last_name, profile_image_url, car_image_url, car_seats, rating)
VALUES 
('1', 'James', 'Wilson', 'https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/', 'https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/', 4, '4.80'),
('2', 'David', 'Brown', 'https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/', 'https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/', 5, '4.60'),
('3', 'Michael', 'Johnson', 'https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/', 'https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/', 4, '4.70'),
('4', 'Robert', 'Green', 'https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/', 'https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/', 4, '4.90');