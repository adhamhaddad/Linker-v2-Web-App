import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, ref: 'Chat', index: true })
  chat: string;

  @Prop({ type: [{ _id: { type: Number, required: true } }] })
  participants: [{ _id: number }];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
