import { Expose, Type } from 'class-transformer';
import { Attachments } from './message-attachment.serialization';
import { MessageReactions } from './message-reaction.serialization';

export class ReplyToSerialization {
  @Expose({ name: 'chatId' })
  chatId: string;

  @Expose({ name: 'messageId' })
  messageId: string;

  @Expose({ name: 'userId' })
  userId: number;
}

export class ForwardedFromSerialization {
  @Expose({ name: 'messageId' })
  messageId: string;

  @Expose({ name: 'userId' })
  userId: number;
}

export class MessageSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'userId' })
  userId: number;

  @Expose({ name: 'message' })
  message: string | null;

  @Expose({ name: 'isRead' })
  isRead: boolean;

  @Type(() => ForwardedFromSerialization)
  @Expose({ name: 'forwardedFrom' })
  forwardedFrom: ForwardedFromSerialization;

  @Type(() => ReplyToSerialization)
  @Expose({ name: 'replyTo' })
  replyTo: ReplyToSerialization;

  @Type(() => Attachments)
  @Expose({ name: 'attachments' })
  attachments: Attachments;

  @Type(() => MessageReactions)
  @Expose({ name: 'reactions' })
  reactions: MessageReactions[];

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
