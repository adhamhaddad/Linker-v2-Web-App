import { Expose } from 'class-transformer';

export class ConversationSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
