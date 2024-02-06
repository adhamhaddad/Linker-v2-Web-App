import { Types } from 'mongoose';
import { IForwardedFrom } from './message-forwarded-from.interface';
import { IReplyTo } from './message-reply-to.interface';
import { IMessageStatus } from './message-status.interface';
import { IParticipant } from './chat-participant.interface';

export interface IMessage {
  _id: string;
  chatId: string;
  conversationId: string;
  senderId: string;
  participants: IParticipant[];
  message: string;
  status: IMessageStatus;
  forwardedFrom: IForwardedFrom;
  replyTo: IReplyTo;
  attachments: {
    imageUrl: string[];
    videoUrl: string[];
    fileUrl: string[];
    audioUrl: string[];
  };
  reactions: Types.DocumentArray<{ _id: string; reactIcon: string }>;
  deletedFrom: Types.DocumentArray<{ _id: string }>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
