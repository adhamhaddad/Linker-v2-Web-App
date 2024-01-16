import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IReplyTo } from '../interfaces/message-reply-to.interface';
import { IForwardedFrom } from '../interfaces/message-forwarded-from.interface';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, ref: 'Conversation', required: true, index: 1 })
  conversationId: String;

  @Prop({ type: Number, required: true })
  userId: number;

  @Prop({ minlength: 1, maxlength: 3000, trim: true })
  message: string;

  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({
    type: {
      chatId: { type: String, required: true },
      messageId: { type: String, required: true },
      userId: { type: Number, required: true },
    },
    required: false,
    default: null,
  })
  forwardedFrom: IForwardedFrom;

  @Prop({
    type: {
      messageId: { type: String, required: true },
      userId: { type: Number, required: true },
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
        _id: { type: Number, required: true },
        reactIcon: { type: String, required: true },
      },
    ],
    required: false,
  })
  reactions: {
    _id: number;
    reactIcon: string;
  }[];

  @Prop({ type: [{ _id: { type: Number, required: true } }] })
  deletedFrom: [{ _id: number }];

  @Prop({ default: null })
  deletedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
