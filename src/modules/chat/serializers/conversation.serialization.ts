import { Expose, Type } from 'class-transformer';
import { MessageSerialization } from './message.serialization';

export class ConversationSerialization {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'unseenMsgs' })
  unseenMsgs: number;

  @Type(() => MessageSerialization)
  @Expose({ name: 'lastMessage' })
  lastMessage: MessageSerialization | null;

  @Type(() => MessageSerialization)
  @Expose({ name: 'messages' })
  messages: MessageSerialization[] | [];

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
