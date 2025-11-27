import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware";
import { getUserByClerkId } from "../user/user.service";
import * as chatService from "./chat.service";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, driverId } = req.body;
    if (!userId || !driverId) {
      throw new AppError("userId and driverId are required", 400);
    }

    // Resolve clerk_id (userId) to internal id
    const user = await getUserByClerkId(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const conversation = await chatService.createOrGetConversation(user.id, driverId);
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, senderType, senderId, messageText, imageUrl } = req.body;
    if (!conversationId || !senderType || !senderId || !messageText) {
      throw new AppError("Missing required fields", 400);
    }

    let internalSenderId = senderId;

    if (senderType === 'user') {
        const user = await getUserByClerkId(senderId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        internalSenderId = user.id;
    }

    const message = await chatService.sendMessage(
      conversationId,
      senderType,
      internalSenderId,
      messageText,
      imageUrl
    );
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, driverId } = req.query;
    
    if (userId) {
        const user = await getUserByClerkId(userId as string);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const conversations = await chatService.getUserConversations(user.id);
        res.status(200).json(conversations);
    } else if (driverId) {
        const conversations = await chatService.getDriverConversations(Number(driverId));
        res.status(200).json(conversations);
    } else {
        throw new AppError("userId or driverId query param required", 400);
    }
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const messages = await chatService.getMessages(Number(conversationId));
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, readerType } = req.body;
    if (!conversationId || !readerType) {
        throw new AppError("conversationId and readerType are required", 400);
    }
    await chatService.markMessagesAsRead(conversationId, readerType);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;
        const user = await getUserByClerkId(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const count = await chatService.getUserUnreadCount(user.id);
        res.status(200).json({ count });
    } catch (error) {
        next(error);
    }
};
