-- Upsert: create if not exists, return the conversation ID
INSERT INTO conversations (user_id, driver_id)
VALUES (123, 45)
ON CONFLICT (user_id, driver_id) DO UPDATE 
   SET last_message_at = CURRENT_TIMESTAMP
RETURNING id;

-- send a message (and update conversation metadata)
WITH new_message AS (
    INSERT INTO messages (
        conversation_id,
        sender_type,
        sender_id,
        message_text,
        image_url,
        message_type
    ) VALUES (
        987,               -- conversation_id
        'user',            -- or 'driver'
        123,               -- actual user.id or driver.id
        'Hey, are you available tomorrow?', 
        NULL,
        'text'
    )
    RETURNING conversation_id, created_at, message_text
)
UPDATE conversations c
SET 
    last_message_at = CURRENT_TIMESTAMP,
    last_message_preview = (SELECT SUBSTRING(message_text FROM 1 FOR 100) FROM new_message),
    user_unread_count = CASE WHEN (SELECT sender_type FROM messages WHERE id = (SELECT MAX(id) FROM messages WHERE conversation_id = c.id)) = 'driver' 
                            THEN user_unread_count + 1 ELSE user_unread_count END,
    driver_unread_count = CASE WHEN (SELECT sender_type FROM messages WHERE id = (SELECT MAX(id) FROM messages WHERE conversation_id = c.id)) = 'user' 
                              THEN driver_unread_count + 1 ELSE driver_unread_count END
FROM new_message
WHERE c.id = (SELECT conversation_id FROM new_message);

-- get conversation list for a user
SELECT 
    c.id AS conversation_id,
    c.driver_id,
    d.first_name || ' ' || d.last_name AS driver_name,
    d.profile_image_url,
    c.last_message_at,
    c.last_message_preview,
    c.user_unread_count
FROM conversations c
JOIN drivers d ON d.id = c.driver_id
WHERE c.user_id = 123
ORDER BY c.last_message_at DESC NULLS LAST
LIMIT 50;

-- get conversation list for a driver
SELECT 
    c.id AS conversation_id,
    c.user_id,
    u.name AS user_name,
    c.last_message_at,
    c.last_message_preview,
    c.driver_unread_count
FROM conversations c
JOIN users u ON u.id = c.user_id
WHERE c.driver_id = 45
ORDER BY c.last_message_at DESC NULLS LAST;

-- load message in a conversation (with pagination)
SELECT 
    m.id,
    m.sender_type,
    m.sender_id,
    m.message_text,
   142    m.image_url,
    m.message_type,
    m.is_read,
    m.created_at
FROM messages m
WHERE m.conversation_id = 987
ORDER BY m.created_at DESC
LIMIT 30 OFFSET 0;  -- change OFFSET for pagination

-- mark messages as read when user opens chat

UPDATE messages 
SET is_read = TRUE
WHERE conversation_id = 987
  AND sender_type = 'driver'
  AND is_read = FALSE;

-- Then reset unread count
UPDATE conversations
SET user_unread_count = 0
WHERE id = 987 AND user_id = 123;

-- get unread count for  auser for app badge
SELECT COALESCE(SUM(user_unread_count), 0) AS total_unread
FROM conversations
WHERE user_id = 123;