import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Group } from './group.schema';
import { Participant } from './participant.schema';
import { Conversation } from './conversation.schema';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: String })
  _id: string;

  @Prop({
    enum: ['chat', 'group'],
    default: 'chat',
    required: true,
  })
  type: string;

  @Prop({ type: Group, default: null })
  groupDetails: Group;

  @Prop({ type: [Participant], index: true })
  participants: Participant[];

  @Prop({ type: Conversation })
  conversation: Conversation;

  @Prop({ type: [{ _id: { type: String, required: true } }] })
  deletedFrom: [{ _id: string }];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
