import { Types } from 'mongoose';
import { IForwardedFrom } from './message-forwarded-from.interface';
import { IReplyTo } from './message-reply-to.interface';

export interface IMessage {
  _id: string;
  conversationId: string;
  userId: number;
  message: string;
  isRead: boolean;
  forwardedFrom: IForwardedFrom;
  replyTo: IReplyTo;
  attachments: {
    imageUrl: string[];
    videoUrl: string[];
    fileUrl: string[];
    audioUrl: string[];
  };
  reactions: Types.DocumentArray<{ _id: number; reactIcon: string }>;
  deletedFrom: Types.DocumentArray<{ _id: number }>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
