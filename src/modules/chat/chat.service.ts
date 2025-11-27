// src/modules/chat/chat.service.ts
import { query } from "../../db";

export interface Conversation {
  id: string;
  user_id: string;
  driver_id: string;
  last_message_at: string;
  last_message_preview: string;
  user_unread_count: number;
  driver_unread_count: number;
  created_at: string;
  driver?: {
    first_name: string;
    last_name: string;
    profile_image_url: string;
  };
  user?: {
    name: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: "user" | "driver";
  sender_id: string;
  message_text: string;
  image_url?: string;
  message_type: "text" | "image";
  is_read: boolean;
  created_at: string;
}

export const createOrGetConversation = async (
  userId: string,
  driverId: string
): Promise<Conversation> => {
  const result = await query(
    `INSERT INTO conversations (user_id, driver_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, driver_id) DO UPDATE 
        SET last_message_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, driverId]
  );
  return result.rows[0] as Conversation;
};

export const sendMessage = async (
  conversationId: string,
  senderType: "user" | "driver",
  senderId: string,
  messageText: string,
  imageUrl?: string
): Promise<Message> => {
  const messageType = imageUrl ? "image" : "text";

  // Using a transaction-like approach with CTE
  const result = await query(
    `WITH new_message AS (
        INSERT INTO messages (
            conversation_id,
            sender_type,
            sender_id,
            message_text,
            image_url,
            message_type
        ) VALUES (
            $1, $2, $3, $4, $5, $6
        )
        RETURNING *
    ),
    updated_conversation AS (
        UPDATE conversations c
        SET 
            last_message_at = CURRENT_TIMESTAMP,
            last_message_preview = (SELECT SUBSTRING(message_text FROM 1 FOR 100) FROM new_message),
            user_unread_count = CASE WHEN (SELECT sender_type FROM new_message) = 'driver' 
                                    THEN user_unread_count + 1 ELSE user_unread_count END,
            driver_unread_count = CASE WHEN (SELECT sender_type FROM new_message) = 'user' 
                                      THEN driver_unread_count + 1 ELSE driver_unread_count END
        FROM new_message
        WHERE c.id = (SELECT conversation_id FROM new_message)
    )
    SELECT * FROM new_message`,
    [conversationId, senderType, senderId, messageText, imageUrl || null, messageType]
  );
  
  return result.rows[0] as Message;
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  const result = await query(
    `SELECT 
        c.*,
        d.first_name,
        d.last_name,
        d.profile_image_url
    FROM conversations c
    JOIN drivers d ON d.id = c.driver_id
    WHERE c.user_id = $1
    ORDER BY c.last_message_at DESC NULLS LAST
    LIMIT 50`,
    [userId]
  );
  
  // Map to match interface structure
  return result.rows.map((row) => ({
    ...row,
    driver: {
        first_name: row.first_name,
        last_name: row.last_name,
        profile_image_url: row.profile_image_url
    }
  })) as Conversation[];
};

export const getDriverConversations = async (driverId: string): Promise<Conversation[]> => {
  const result = await query(
    `SELECT 
        c.*,
        u.first_name || ' ' || u.last_name as user_name
    FROM conversations c
    JOIN users u ON u.id = c.user_id
    WHERE c.driver_id = $1
    ORDER BY c.last_message_at DESC NULLS LAST`,
    [driverId]
  );

  return result.rows.map((row) => ({
    ...row,
    user: {
        name: row.user_name
    }
  })) as Conversation[];
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const result = await query(
    `SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC`,
    [conversationId]
  );
  return result.rows as Message[];
};

export const markMessagesAsRead = async (
  conversationId: string,
  readerType: "user" | "driver"
): Promise<void> => {
  const senderTypeToMark = readerType === "user" ? "driver" : "user";
  
  await query(
    `UPDATE messages 
    SET is_read = TRUE
    WHERE conversation_id = $1
      AND sender_type = $2
      AND is_read = FALSE`,
    [conversationId, senderTypeToMark]
  );

  if (readerType === "user") {
      await query(
        `UPDATE conversations
        SET user_unread_count = 0
        WHERE id = $1`,
        [conversationId]
      );
  } else {
      await query(
        `UPDATE conversations
        SET driver_unread_count = 0
        WHERE id = $1`,
        [conversationId]
      );
  }
};

export const getUserUnreadCount = async (userId: string): Promise<number> => {
    const result = await query(
        `SELECT COALESCE(SUM(user_unread_count), 0) AS total_unread
        FROM conversations
        WHERE user_id = $1`,
        [userId]
    );
    return parseInt(result.rows[0].total_unread);
};
