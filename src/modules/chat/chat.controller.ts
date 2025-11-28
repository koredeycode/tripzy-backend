// src/modules/chat/chat.controller.ts
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware";
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

    const conversation = await chatService.createOrGetConversation(
      userId,
      driverId
    );
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
    const { conversationId, senderType, messageText, imageUrl } = req.body;

    // @ts-ignore
    const { userId, isDriver } = req.user;

    if (!conversationId || !senderType || !messageText) {
      throw new AppError("Missing required fields", 400);
    }

    const message = await chatService.sendMessage(
      conversationId,
      senderType,
      userId,
      messageText,
      imageUrl
    );
    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
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
    // @ts-ignore
    const { userId, isDriver } = req.user;

    if (isDriver) {
      const conversations = await chatService.getDriverConversations(userId);
      res.status(200).json({
        data: conversations,
        message: "Conversations retrieved successfully",
      });
    } else {
      const conversations = await chatService.getUserConversations(userId);
      console.log({ conversations });
      res.status(200).json({
        data: conversations,
        message: "Conversations retrieved successfully",
      });
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
    const messages = await chatService.getMessages(conversationId);
    res
      .status(200)
      .json({ data: messages, message: "Messages retrieved successfully" });
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
    const count = await chatService.getUserUnreadCount(userId);
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
