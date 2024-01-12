import { Types, Document } from 'mongoose';
import { IConversation } from './conversation.interface';
import { IParticipant } from './chat-participant.interface';
import { IGroupDetails } from './group-details.interface';

export enum ChatType {
  CHAT = 'chat',
  GROUP = 'group',
}

export interface IChat extends Document {
  _id: string;
  type: ChatType;
  groupDetails: IGroupDetails | null;
  participants: Types.DocumentArray<IParticipant>;
  conversation: IConversation;
  deletedFrom: Array<{ _id: number }>;
  createdAt: Date;
  updatedAt: Date;
}
