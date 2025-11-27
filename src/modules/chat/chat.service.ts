import { neon } from "@neondatabase/serverless";
import { env } from "../../config/env";

const sql = neon(env.DATABASE_URL!);

export interface Conversation {
  id: number;
  user_id: number;
  driver_id: number;
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
  id: number;
  conversation_id: number;
  sender_type: "user" | "driver";
  sender_id: number;
  message_text: string;
  image_url?: string;
  message_type: "text" | "image";
  is_read: boolean;
  created_at: string;
}

export const createOrGetConversation = async (
  userId: number,
  driverId: number
): Promise<Conversation> => {
  const result = await sql`
    INSERT INTO conversations (user_id, driver_id)
    VALUES (${userId}, ${driverId})
    ON CONFLICT (user_id, driver_id) DO UPDATE 
       SET last_message_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  return result[0] as Conversation;
};

export const sendMessage = async (
  conversationId: number,
  senderType: "user" | "driver",
  senderId: number,
  messageText: string,
  imageUrl?: string
): Promise<Message> => {
  const messageType = imageUrl ? "image" : "text";

  // Using a transaction-like approach with CTE as in samplequeries.sql
  const result = await sql`
    WITH new_message AS (
        INSERT INTO messages (
            conversation_id,
            sender_type,
            sender_id,
            message_text,
            image_url,
            message_type
        ) VALUES (
            ${conversationId},
            ${senderType},
            ${senderId},
            ${messageText},
            ${imageUrl || null},
            ${messageType}
        )
        RETURNING *
    )
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
    RETURNING new_message.*;
  `;

  // The query returns the columns from new_message because of "RETURNING new_message.*"
  // However, the UPDATE ... RETURNING might return the updated conversation row joined with new_message.
  // Let's stick to the sample query logic but ensure we return the message.
  // The sample query in samplequeries.sql does:
  // ... RETURNING conversation_id, created_at, message_text
  // ) UPDATE ...
  // It doesn't return the message at the end.
  
  // Let's adjust to return the message.
  // We can select from new_message at the end if we wrap it differently or just trust the insert.
  // Actually, the sample query was just an UPDATE with a CTE.
  // I want to return the created message.
  
  // Let's do it in two steps if CTE is tricky with neon's return type inference, 
  // but CTE is better for atomicity.
  
  // Revised query to return the message:
  const rows = await sql`
    WITH new_message AS (
        INSERT INTO messages (
            conversation_id,
            sender_type,
            sender_id,
            message_text,
            image_url,
            message_type
        ) VALUES (
            ${conversationId},
            ${senderType},
            ${senderId},
            ${messageText},
            ${imageUrl || null},
            ${messageType}
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
    SELECT * FROM new_message;
  `;
  
  return rows[0] as Message;
};

export const getUserConversations = async (userId: number): Promise<Conversation[]> => {
  const result = await sql`
    SELECT 
        c.*,
        d.first_name,
        d.last_name,
        d.profile_image_url
    FROM conversations c
    JOIN drivers d ON d.id = c.driver_id
    WHERE c.user_id = ${userId}
    ORDER BY c.last_message_at DESC NULLS LAST
    LIMIT 50;
  `;
  
  // Map to match interface structure
  return result.map((row) => ({
    ...row,
    driver: {
        first_name: row.first_name,
        last_name: row.last_name,
        profile_image_url: row.profile_image_url
    }
  })) as Conversation[];
};

export const getDriverConversations = async (driverId: number): Promise<Conversation[]> => {
  const result = await sql`
    SELECT 
        c.*,
        u.name as user_name
    FROM conversations c
    JOIN users u ON u.id = c.user_id
    WHERE c.driver_id = ${driverId}
    ORDER BY c.last_message_at DESC NULLS LAST;
  `;

  return result.map((row) => ({
    ...row,
    user: {
        name: row.user_name
    }
  })) as Conversation[];
};

export const getMessages = async (conversationId: number): Promise<Message[]> => {
  const result = await sql`
    SELECT *
    FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC; 
  `;
  // Note: Sample query said DESC, but usually chat UI wants ASC (oldest first) or DESC with reverse.
  // Sample query: ORDER BY m.created_at DESC LIMIT 30.
  // I'll stick to ASC for full history or DESC if paginated. 
  // Let's do ASC for now as it's simpler for basic UI.
  return result as Message[];
};

export const markMessagesAsRead = async (
  conversationId: number,
  readerType: "user" | "driver"
): Promise<void> => {
  const senderTypeToMark = readerType === "user" ? "driver" : "user";
  
  await sql`
    UPDATE messages 
    SET is_read = TRUE
    WHERE conversation_id = ${conversationId}
      AND sender_type = ${senderTypeToMark}
      AND is_read = FALSE;
  `;

  if (readerType === "user") {
      await sql`
        UPDATE conversations
        SET user_unread_count = 0
        WHERE id = ${conversationId};
      `;
  } else {
      await sql`
        UPDATE conversations
        SET driver_unread_count = 0
        WHERE id = ${conversationId};
      `;
  }
};

export const getUserUnreadCount = async (userId: number): Promise<number> => {
    const result = await sql`
        SELECT COALESCE(SUM(user_unread_count), 0) AS total_unread
        FROM conversations
        WHERE user_id = ${userId};
    `;
    return parseInt(result[0].total_unread);
};
