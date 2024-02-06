import { Expose, Transform, Type } from 'class-transformer';
import { AttachmentsSerialization } from './message-attachment.serialization';
import { MessageReactions } from './message-reaction.serialization';
import { MessageStatusSerialization } from './message-status.serialization';
import { MessageParticipantSerialization } from './message-participants.serialization';

export class ReplyToSerialization {
  @Expose({ name: 'chatId' })
  chatId: string;

  @Expose({ name: 'messageId' })
  messageId: string;

  @Expose({ name: 'userId' })
  userId: string;
}

export class ForwardedFromSerialization {
  @Expose({ name: 'messageId' })
  messageId: string;

  @Expose({ name: 'userId' })
  userId: string;
}

export class MessageSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'chatId' })
  chatId: string;

  @Expose({ name: 'conversationId' })
  conversationId: string;

  @Type(() => MessageParticipantSerialization)
  @Expose({ name: 'participants' })
  participants: MessageParticipantSerialization;

  @Expose({ name: 'senderId' })
  senderId: string;

  @Expose({ name: 'message' })
  message: string | null;

  @Type(() => MessageStatusSerialization)
  @Expose({ name: 'status' })
  feedback: MessageStatusSerialization;

  @Type(() => ForwardedFromSerialization)
  @Expose({ name: 'forwardedFrom' })
  forwardedFrom: ForwardedFromSerialization;

  @Type(() => ReplyToSerialization)
  @Expose({ name: 'replyTo' })
  replyTo: ReplyToSerialization;

  @Type(() => AttachmentsSerialization)
  @Expose({ name: 'attachments' })
  attachments: AttachmentsSerialization;

  @Type(() => MessageReactions)
  @Expose({ name: 'reactions' })
  reactions: MessageReactions[];

  @Expose({ name: 'createdAt' })
  time: Date;
}
