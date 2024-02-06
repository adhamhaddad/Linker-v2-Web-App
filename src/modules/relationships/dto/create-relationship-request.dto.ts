import { Expose } from 'class-transformer';

export class CreateRelationshipRequestDto {
  @Expose({ name: 'recipient_id' })
  recipientId: string; // ID of the user receiving the request
}
