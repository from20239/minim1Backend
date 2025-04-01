import { MessageModel } from '../models/message';
import { IMessage } from '../models/message';

export class MessageService {
  async sendMessage(message: Partial<IMessage>): Promise<IMessage> {
    const newMessage = new MessageModel(message);
    return newMessage.save();
  }

  async getConversation(user1: string, user2: string, page: number = 1, limit: number = 25): Promise<IMessage[]> {
    const skip = (page - 1) * limit;
    return MessageModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'name email')
    .populate('receiver', 'name email');
  }

  async getUserConversations(userId: string): Promise<any[]> {
    // 获取用户所有对话列表（分组查询）
    return MessageModel.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $last: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$receiver", userId] },
                  { $eq: ["$isRead", false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]);
  }

  async markAsRead(messageId: string): Promise<IMessage | null> {
    return MessageModel.findByIdAndUpdate(
      messageId, 
      { isRead: true }, 
      { new: true }
    );
  }

  async deleteMessage(messageId: string): Promise<IMessage | null> {
    return MessageModel.findByIdAndDelete(messageId);
  }
}