import { Expose, Type } from 'class-transformer';
import { ChatType } from '../interfaces/chat.interface';
import { ConversationSerialization } from './conversation.serialization';
import { ParticipantSerialization } from './participant.serialization';

export class ChatSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'type' })
  type: ChatType;

  // @Type(() => GroupDetailsSerialization)
  // @Expose({ name: 'groupDetails' })
  // groupDetails: GroupDetailsSerialization;

  @Type(() => ParticipantSerialization)
  @Expose({ name: 'participants' })
  participants: ParticipantSerialization[];

  @Type(() => ConversationSerialization)
  @Expose({ name: 'conversation' })
  conversation: ConversationSerialization;

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
