import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IReplyTo } from '../interfaces/message-reply-to.interface';
import { IForwardedFrom } from '../interfaces/message-forwarded-from.interface';
import { IMessageStatus } from '../interfaces/message-status.interface';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, ref: 'Conversation', required: true, index: 1 })
  conversationId: String;

  @Prop({ type: String, required: true })
  senderId: string;

  @Prop({ minlength: 1, maxlength: 3000, trim: true })
  message: string;

  @Prop({
    type: {
      isSent: { type: Boolean, default: true },
      isDelivered: { type: Boolean, default: false },
      isSeen: { type: Boolean, default: false },
    },
    required: false,
    default: { isSent: true, isDelivered: false, isSeen: false },
  })
  status: IMessageStatus;

  @Prop({
    type: {
      chatId: { type: String, required: true },
      messageId: { type: String, required: true },
      userId: { type: String, required: true },
    },
    required: false,
    default: null,
  })
  forwardedFrom: IForwardedFrom;

  @Prop({
    type: {
      messageId: { type: String, required: true },
      userId: { type: String, required: true },
    },
    required: false,
    default: null,
  })
  replyTo: IReplyTo;

  @Prop({
    type: {
      imageUrl: { type: [String], required: false },
      videoUrl: { type: [String], required: false },
      fileUrl: { type: [String], required: false },
      audioUrl: { type: [String], required: false },
    },
    required: false,
  })
  attachments: {
    imageUrl?: string[];
    videoUrl?: string[];
    fileUrl?: string[];
    audioUrl?: string[];
  };

  @Prop({
    type: [
      {
        _id: { type: String, required: true },
        reactIcon: { type: String, required: true },
      },
    ],
    required: false,
  })
  reactions: {
    _id: string;
    reactIcon: string;
  }[];

  @Prop({ type: [{ _id: { type: String, required: true } }] })
  deletedFrom: [{ _id: string }];

  @Prop({ default: null })
  deletedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
