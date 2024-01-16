import { Expose } from 'class-transformer';

export class DeletedFrom {
  @Expose({ name: '_id' })
  id: number;
}
