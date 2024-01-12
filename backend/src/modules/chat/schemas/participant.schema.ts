import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Participant extends Document {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({
    default: false,
    required: true,
  })
  isArchived: boolean;

  @Prop({
    default: false,
    required: true,
  })
  isMuted: boolean;

  @Prop({
    default: null,
    required: false,
  })
  wallpaper: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
