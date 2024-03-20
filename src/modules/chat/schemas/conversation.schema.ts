import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Conversation extends Document {
  @Prop({ type: String })
  _id: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
