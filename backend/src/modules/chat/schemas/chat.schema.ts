import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Group } from './group.schema';
import { Participant } from './participant.schema';

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

  @Prop({ type: String, ref: 'Conversation', default: null })
  conversation: string;

  @Prop({
    default: 'default.jpg',
    required: true,
  })
  wallpaper: string;

  @Prop({ type: [{ _id: { type: Number, required: true } }] })
  deletedFrom: [{ _id: number }];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
