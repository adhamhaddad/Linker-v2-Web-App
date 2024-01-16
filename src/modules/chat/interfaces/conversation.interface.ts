import { Types, Document } from 'mongoose';
import { IChat } from './chat.interface';

export interface IConversation extends Document {
  _id: string;
  chat: IChat;
  participants: Types.DocumentArray<{ _id: number }>;
  createdAt: Date;
  updatedAt: Date;
}
