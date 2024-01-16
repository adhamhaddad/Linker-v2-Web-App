import { Expose } from 'class-transformer';

export class ParticipantSerialization {
  @Expose({ name: '_id' })
  id: number;

  @Expose({ name: 'isArchived' })
  isArchived: boolean;

  @Expose({ name: 'isMuted' })
  isMuted: boolean;

  @Expose({ name: 'wallpaper' })
  wallpaper: string;
}
