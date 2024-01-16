import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: String })
  _id: string;

  @Prop({
    trim: true,
    required: false,
  })
  icon: string;

  @Prop({
    minlength: 1,
    maxlength: 100,
    trim: true,
    required: true,
  })
  name: string;

  @Prop({ required: true })
  creatorId: number;

  @Prop({
    enum: ['public', 'private'],
    default: 'private',
    required: true,
  })
  status: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
