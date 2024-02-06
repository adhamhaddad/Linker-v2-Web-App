import { Expose, Type } from 'class-transformer';
import { ChatType } from '../interfaces/chat.interface';
import { GroupDetailsSerialization } from './group-details.serialization';
import { ConversationSerialization } from './conversation.serialization';
import { ChatParticipantSerialization } from './chat-participant.serialization';

export class GetChatSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'type' })
  type: ChatType;

  // @Type(() => GroupDetailsSerialization)
  // @Expose({ name: 'groupDetails' })
  // groupDetails: GroupDetailsSerialization;

  @Type(() => ChatParticipantSerialization)
  @Expose({ name: 'participants' })
  participant: ChatParticipantSerialization[];

  @Type(() => ConversationSerialization)
  @Expose({ name: 'conversation' })
  conversation: ConversationSerialization;

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
