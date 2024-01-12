import { Document } from 'mongoose';

export interface IParticipant extends Document {
  _id: number;
  isArchived: boolean;
  isMuted: boolean;
  wallpaper?: string | null;
}
