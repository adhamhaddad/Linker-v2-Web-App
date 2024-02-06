import { Document } from 'mongoose';

export interface IParticipant extends Document {
  _id: string;
  isArchived: boolean;
  isMuted: boolean;
}
