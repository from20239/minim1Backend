import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { IMessage } from '../models/message';

const messageService = new MessageService();

export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const message = req.body as IMessage;
    const newMessage = await messageService.sendMessage(message);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: "Error sending message", error });
  }
}

export async function getConversation(req: Request, res: Response): Promise<void> {
  try {
    const { user1, user2 } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    // 检查必要参数
    if (!user1 || !user2) {
        res.status(400).json({ message: "Both user1 and user2 are required" });
        return;
      }
  
      const messages = await messageService.getConversation(user1, user2, page, limit);
  
      if (!messages || messages.length === 0) {
        res.status(204).send(); // 204 No Content，表示查询成功但无数据
        return;
      }
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error getting conversation", error });
    }
}

export async function getUserConversations(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.userId;
    const conversations = await messageService.getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ message: "Error getting conversations", error });
  }
}

export async function markMessageAsRead(req: Request, res: Response): Promise<void> {
  try {
    const messageId = req.params.id;
    const updatedMessage = await messageService.markAsRead(messageId);
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: "Error marking message as read", error });
  }
}

export async function deleteMessage(req: Request, res: Response): Promise<void> {
  try {
    const messageId = req.params.id;
    const deletedMessage = await messageService.deleteMessage(messageId);
    res.status(200).json(deletedMessage);
  } catch (error) {
    res.status(400).json({ message: "Error deleting message", error });
  }
}