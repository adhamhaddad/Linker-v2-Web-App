import { Expose, Type } from 'class-transformer';
import { ConversationParticipantSerialization } from './conversation-participants.serialization';

export class GetConversationSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Type(() => ConversationParticipantSerialization)
  @Expose({ name: 'participants' })
  participants: ConversationParticipantSerialization[];
}
