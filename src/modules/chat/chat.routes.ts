import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { validateResource } from "../../middleware/validateResource";
import * as chatController from "./chat.controller";
import { sendMessageSchema } from "./chat.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat and messaging management
 */

/**
 * @swagger
 * /chat/conversations:
 *   post:
 *     summary: Create or get a conversation
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - driverId
 *             properties:
 *               userId:
 *                 type: string
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation created or retrieved successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/conversations", authenticateToken, chatController.createConversation);

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get conversations for a user or driver
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *       400:
 *         description: userId or driverId query param required
 */
router.get("/conversations", authenticateToken, chatController.getConversations);

/**
 * @swagger
 * /chat/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - senderType
 *               - senderId
 *               - messageText
 *             properties:
 *               conversationId:
 *                 type: string
 *               senderType:
 *                 type: string
 *                 enum: [user, driver]
 *               senderId:
 *                 type: string
 *               messageText:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Missing required fields
 */
router.post(
  "/messages",
  authenticateToken,
  validateResource(sendMessageSchema),
  chatController.sendMessage
);

/**
 * @swagger
 * /chat/messages/{conversationId}:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get("/messages/:conversationId", authenticateToken, chatController.getMessages);

/**
 * @swagger
 * /chat/read:
 *   post:
 *     summary: Mark messages as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - readerType
 *             properties:
 *               conversationId:
 *                 type: string
 *               readerType:
 *                 type: string
 *                 enum: [user, driver]
 *     responses:
 *       200:
 *         description: Messages marked as read
 *       400:
 *         description: Missing required fields
 */
router.post("/read", authenticateToken, chatController.markAsRead);

/**
 * @swagger
 * /chat/unread/{userId}:
 *   get:
 *     summary: Get unread message count for a user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Unread message count
 */
router.get("/unread/:userId", authenticateToken, chatController.getUnreadCount);

export default router;
