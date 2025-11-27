import { Router } from "express";
import * as chatController from "./chat.controller";

const router = Router();

router.post("/conversations", chatController.createConversation);
router.get("/conversations", chatController.getConversations);
router.post("/messages", chatController.sendMessage);
router.get("/messages/:conversationId", chatController.getMessages);
router.post("/read", chatController.markAsRead);
router.get("/unread/:userId", chatController.getUnreadCount);

export default router;
