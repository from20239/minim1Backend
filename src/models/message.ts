import { ObjectId, Schema, model } from 'mongoose';

export interface IMessage {
  _id: ObjectId;
  sender: ObjectId;      // 关联用户集合
  receiver: ObjectId;    // 关联用户集合
  content: string;       // 消息内容
  timestamp: Date;       // 发送时间
  isRead: boolean;       // 是否已读
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

export const MessageModel = model<IMessage>('Message', messageSchema);