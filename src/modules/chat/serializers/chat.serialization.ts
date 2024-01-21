import { Expose, Type } from 'class-transformer';
import { ChatType } from '../interfaces/chat.interface';
import { GroupDetailsSerialization } from './group-details.serialization';
import { ParticipantSerialization } from './participant.serialization';
import { ConversationSerialization } from './conversation.serialization';
import { MessageSerialization } from './message.serialization';

export class ChatSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'type' })
  type: ChatType;

  @Type(() => GroupDetailsSerialization)
  @Expose({ name: 'groupDetails' })
  groupDetails: GroupDetailsSerialization;

  @Type(() => ParticipantSerialization)
  @Expose({ name: 'participants' })
  participants: ParticipantSerialization[];

  @Expose({ name: 'wallpaper' })
  wallpaper: string;

  @Type(() => ConversationSerialization)
  @Expose({ name: 'conversation' })
  conversation: ConversationSerialization;

  @Type(() => MessageSerialization)
  @Expose({ name: 'messages' })
  messages: MessageSerialization[];

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
