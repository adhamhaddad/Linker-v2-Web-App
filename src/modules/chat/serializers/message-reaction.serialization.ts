import { Expose } from 'class-transformer';

export class MessageReactions {
  @Expose({ name: '_id' })
  id: number;

  @Expose({ name: 'reactIcon' })
  reactIcon: string;
}
