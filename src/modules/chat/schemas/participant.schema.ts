import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Participant extends Document {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Boolean, default: false, required: true })
  isArchived: boolean;

  @Prop({ type: Boolean, default: false, required: true })
  isMuted: boolean;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
