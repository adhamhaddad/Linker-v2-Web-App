import { Expose } from 'class-transformer';

export class ConversationParticipantSerialization {
  @Expose({ name: '_id' })
  id: string;
}
