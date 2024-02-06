import { Expose } from 'class-transformer';

export class MessageStatusSerialization {
  @Expose({ name: 'isSent' })
  isSent: boolean;

  @Expose({ name: 'isDelivered' })
  isDelivered: boolean;

  @Expose({ name: 'isSeen' })
  isSeen: boolean;
}
