import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    senderType: z.enum(["user", "driver"]),
    // senderId: z.string().min(1, "Sender ID is required"),
    messageText: z.string().min(1, "Message text is required"),
    imageUrl: z.string().optional(),
  }),
});
