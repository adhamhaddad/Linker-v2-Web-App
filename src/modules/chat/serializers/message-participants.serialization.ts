import { Expose } from 'class-transformer';

export class MessageParticipantSerialization {
  @Expose({ name: '_id' })
  id: string;
}
